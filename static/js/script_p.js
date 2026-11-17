const Info=document.querySelector("#exten-information");
const bninfo=document.querySelector("#more-information");

bninfo.addEventListener("click",()=>{
    Info.classList.toggle("activo");
    bninfo.classList.toggle("activo");
});
// 1. ESTADO INICIAL DEL CARRITO
let cartItems = [
    { id: 1, name: "Nombre del Producto 1", price: 500000, qty: 3, selected: true },
    { id: 2, name: "Nombre del Producto 2", price: 416626, qty: 2, selected: true },
    { id: 3, name: "Nombre del Producto 3", price: 100000, qty: 1, selected: true },
    { id: 4, name: "Nombre del Producto 4", price: 250000, qty: 1, selected: false }
];

// Referencias al DOM
const productsContainer = document.getElementById("products-container");
const totalItemsBadge = document.getElementById("total-items-badge");
const selectedCountBadge = document.getElementById("selected-count-badge");
const radioSelectAll = document.getElementById("radio-select-all");
const btnSelectAll = document.getElementById("btn-select-all");

// Formateador de moneda con separador de miles (ej: 2.333.252)
const formatNumber = (num) => new Intl.NumberFormat("es-CO").format(num);

// 2. FUNCIÓN DE RENDERIZADO PRINCIPAL
function renderCart() {
    productsContainer.innerHTML = "";

    cartItems.forEach(item => {
        const card = document.createElement("article");
        card.className = `product-card ${item.selected ? "selected" : ""}`;

        card.innerHTML = `
            <span class="custom-radio ${item.selected ? "checked" : ""}" 
                  onclick="toggleSelect(${item.id})"></span>

            <div class="product-thumb">
                <!-- Placeholder SVG idéntico a la imagen -->
                <svg width="70" height="56" viewBox="0 0 80 64">
                    <circle cx="24" cy="20" r="7" fill="#ffffff"/>
                    <path d="M8 56 L30 32 L46 46 L58 34 L72 56 Z" fill="#ffffff"/>
                </svg>
            </div>

            <div class="product-details">
                <div class="title-row">
                    <span class="product-name-pill" title="${item.name}">${item.name}</span>
                    <button class="delete-btn" onclick="deleteItem(${item.id})" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>

                <div class="qty-controls">
                    <span class="qty-badge">${item.qty}</span>
                    <button class="qty-plus-btn" onclick="incrementQty(${item.id})" title="Agregar unidad">+</button>
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

// 3. INTERACCIONES DEL USUARIO
function toggleSelect(id) {
    const item = cartItems.find(p => p.id === id);
    if (item) {
        item.selected = !item.selected;
        renderCart();
    }
}

function incrementQty(id) {
    const item = cartItems.find(p => p.id === id);
    if (item) {
        item.qty += 1;
        renderCart();
    }
}

function deleteItem(id) {
    cartItems = cartItems.filter(p => p.id !== id);
    renderCart();
}

// Botón "Seleccionar Todo"
btnSelectAll.addEventListener("click", () => {
    const allSelected = cartItems.length > 0 && cartItems.every(item => item.selected);
    cartItems.forEach(item => item.selected = !allSelected);
    renderCart();
});

// 4. ACTUALIZACIÓN DE CONTADORES Y TOTALES
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

    // Lógica de ejemplo para descuentos y envío
    const discount = subtotal > 0 ? 115000 : 0;
    const shipping = subtotal > 0 ? 15000 : 0;
    const total = Math.max(0, subtotal - discount + shipping);

    document.getElementById("summary-qty").textContent = totalUnits;
    document.getElementById("summary-subtotal").textContent = formatNumber(subtotal);
    document.getElementById("summary-discount").textContent = formatNumber(discount);
    document.getElementById("summary-shipping").textContent = formatNumber(shipping);
    document.getElementById("summary-total").textContent = `$ ${formatNumber(total)}`;
}

// Inicializar vista al cargar
renderCart();