const Info = document.querySelector("#exten-information");
const bninfo = document.querySelector("#more-information");

bninfo.addEventListener("click", () => {
    Info.classList.toggle("activo");
    bninfo.classList.toggle("activo");
});

// ARREGLO VACÍO (Se llenará desde database.db mediante Flask)
let cartItems = [];


const productsContainer = document.getElementById("products-container");
const totalItemsBadge = document.getElementById("total-items-badge");
const selectedCountBadge = document.getElementById("selected-count-badge");
const radioSelectAll = document.getElementById("radio-select-all");
const btnSelectAll = document.getElementById("btn-select-all");

// Formateador de moneda con separador de miles (ej: 2.333.252)
const formatNumber = (num) => new Intl.NumberFormat("es-CO").format(num);

// Carga inicial de productos desde la base de datos
async function cargarCarrito() {
    try {
        const respuesta = await fetch("/api/carrito");
        cartItems = await respuesta.json();
        renderCart();
    } catch (error) {
        console.error("Error al cargar el carrito:", error);
    }
}

// Sincroniza cambios de cantidad o selección con SQLite
async function sincronizarItem(item) {
    await fetch(`/api/carrito/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            qty: item.qty,
            selected: item.selected
        })
    });
}

// FUNCIÓN DE RENDERIZADO PRINCIPAL
function renderCart() {
    productsContainer.innerHTML = "";

    cartItems.forEach(item => {
        const card = document.createElement("article");
        card.className = `product-card ${item.selected ? "selected" : ""}`;

        card.innerHTML = `
            <span class="custom-radio ${item.selected ? "checked" : ""}" 
                  onclick="toggleSelect(${item.id})"></span>

            <div class="product-thumb">
                <img src="${item.image}" alt="${item.name}" class="product-img">
            </div>

            <div class="product-details">
                <div class="title-row">
                    <span class="product-name-pill" title="${item.name}">${item.name}</span>
                    <button class="delete-btn" onclick="deleteItem(${item.id})" title="Eliminar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                         <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                        </svg>
                    </button>
                </div>

                <div class="qty-controls">
                    <button class="qty-step-btn" onclick="decrementQty(${item.id})" title="Restar unidad">-</button>
                    <span class="qty-value">${item.qty}</span>
                    <button class="qty-step-btn" onclick="incrementQty(${item.id})" title="Agregar unidad">+</button>
                </div>
            </div>

            <div class="product-price-pill">
                <span>${formatNumber(item.price * item.qty)}</span>
                <span>$</span>
            </div>
        `;

        productsContainer.appendChild(card);
    });

    updateHeaderCounters();
    updateSummary();
}

// 3. INTERACCIONES DEL USUARIO (Sincronizadas con SQLite)
async function toggleSelect(id) {
    const item = cartItems.find(p => p.id === id);
    if (item) {
        item.selected = !item.selected;
        renderCart();
        await sincronizarItem(item);
    }
}

async function incrementQty(id) {
    const item = cartItems.find(p => p.id === id);
    if (item) {
        item.qty += 1;
        renderCart();
        await sincronizarItem(item);
    }
}

async function decrementQty(id) {
    const item = cartItems.find(p => p.id === id);
    if (item && item.qty > 1) {
        item.qty -= 1;
        renderCart();
        await sincronizarItem(item);
    }
}

async function deleteItem(id) {
    cartItems = cartItems.filter(p => p.id !== id);
    renderCart();
    await fetch(`/api/carrito/${id}`, { method: "DELETE" });
}

// Botón "Seleccionar Todo"
btnSelectAll.addEventListener("click", async () => {
    const allSelected = cartItems.length > 0 && cartItems.every(item => item.selected);
    const newState = !allSelected;

    cartItems.forEach(item => item.selected = newState);
    radioSelectAll.classList.toggle("checked", newState);
    renderCart();

    await Promise.all(cartItems.map(item => sincronizarItem(item)));
});

// ACTUALIZACIÓN DE CONTADORES Y TOTALES
function updateHeaderCounters() {
    const totalTypes = cartItems.length;
    const selectedTypes = cartItems.filter(item => item.selected).length;

    totalItemsBadge.textContent = totalTypes;
    selectedCountBadge.textContent = selectedTypes;

    if (totalTypes > 0 && selectedTypes === totalTypes) {
        radioSelectAll.classList.add("checked");
    } else {
        radioSelectAll.classList.remove("checked");
    }
}

function updateSummary() {
    const selectedItems = cartItems.filter(item => item.selected);

    // Suma total de unidades seleccionadas (ej: 3 + 2 + 1 = 6)
    const totalUnits = selectedItems.reduce((acc, item) => acc + item.qty, 0);

    // Subtotal en dinero
    const subtotal = selectedItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

    const porcentaje = 0.10;
    const discount = Math.round(subtotal * porcentaje);
    const shipping = subtotal > 0 ? 6000 : 0;
    const total = Math.max(0, subtotal - discount + shipping);

    document.getElementById("summary-qty").textContent = totalUnits;
    document.getElementById("summary-subtotal").textContent = formatNumber(subtotal);
    document.getElementById("summary-discount").textContent = formatNumber(discount);
    document.getElementById("summary-shipping").textContent = formatNumber(shipping);
    document.getElementById("summary-total").textContent = `$ ${formatNumber(total)}`;
}

// Inicializar vista pidiendo los datos a database.db
cargarCarrito();