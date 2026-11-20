// ==================MORE INFORMATION==================
const Info=document.querySelector("#exten-information");
const bninfo=document.querySelector("#more-information");

bninfo.addEventListener("click",()=>{
    Info.classList.toggle("activo");
    bninfo.classList.toggle("activo");
});

// ==================CAROUSEL-TRACK==================
const track = document.querySelector('#carousel-track');
const prevBtn = document.querySelector('#L');
const nextBtn = document.querySelector('#R');

function updateArrowVisibility() {
  const scrollLeft = track.scrollLeft;
  const maxScrollLeft = track.scrollWidth - track.clientWidth;

  // Si está al principio, oculta el botón izquierdo
  if (scrollLeft <= 2) {
    prevBtn.classList.add('hidden');
  } else {
    prevBtn.classList.remove('hidden');
  }

  // Si está al final, oculta el botón derecho
  if (scrollLeft >= maxScrollLeft - 2) {
    nextBtn.classList.add('hidden');
  } else {
    nextBtn.classList.remove('hidden');
  }
}

// Acciones de clic en las flechas
nextBtn.addEventListener('click', () => {
  track.scrollBy({ left: 1200, behavior: 'smooth' });
});

prevBtn.addEventListener('click', () => {
  track.scrollBy({ left: -1200, behavior: 'smooth' });
});
// Detectar cambios por scroll manual o tamaño de pantalla
track.addEventListener('scroll', updateArrowVisibility);
window.addEventListener('load', updateArrowVisibility);//cargar
window.addEventListener('resize', updateArrowVisibility);//cambiar el tamaño de la pagina

//  ==================DROP-DOWN TAB==================
document.addEventListener("DOMContentLoaded", () => {
  const categoryItems = document.querySelectorAll(".category-item");
  const subPanels = document.querySelectorAll(".sub-panel");

  categoryItems.forEach(item => {
    // Cambia al poner el mouse encima de cada elemento de la lista
    item.addEventListener("mouseenter", () => {
      const targetId = item.getAttribute("data-target");

      // Remover clases activas de la lista
      categoryItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");

      // Ocultar todos los paneles y mostrar el correspondiente
      subPanels.forEach(panel => {
        panel.classList.remove("active");
        if (panel.id === targetId) {
          panel.classList.add("active");
        }
      });
    });
  });
});
// ==================1. EVENTO INICIALIZADOR DEL FLUJO DEL CARRITO==================
document.addEventListener("DOMContentLoaded", () => {
    const botonesCarrito = document.querySelectorAll(".product .cart");

    botonesCarrito.forEach((botonCarrito) => {
        botonCarrito.style.cursor = "pointer";

        botonCarrito.addEventListener("click", async () => {
            const tarjeta = botonCarrito.closest(".product");
            const nombre = tarjeta.querySelector(".name p").textContent.trim();
            const textoPrecio = tarjeta.querySelector(".price h2").textContent;
            const precio = parseInt(textoPrecio.replace(/[^0-9]/g, ""), 10);
            const imagen = tarjeta.querySelector(".image img").getAttribute("src");
            const producto_id = nombre.toLowerCase().replace(/\s+/g, "-");

            try {
                const respuesta = await fetch("/api/carrito/agregar", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        producto_id: producto_id,
                        nombre: nombre,
                        precio: precio,
                        imagen: imagen,
                        cantidad: 1
                    })
                });

                const resultado = await respuesta.json();
                if (resultado.ok) {
                    alert(`"${nombre}" se agregó al carrito`);
                }
            } catch (error) {
                console.error("Error al agregar al carrito:", error);
            }
        });
    });
});