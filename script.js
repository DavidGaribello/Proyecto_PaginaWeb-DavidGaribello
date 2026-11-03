const Info=document.querySelector("#exten-information");
const bninfo=document.querySelector("#more-information");

bninfo.addEventListener("click",()=>{
    Info.classList.toggle("activo");
    bninfo.classList.toggle("activo");
});
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
window.addEventListener('load', updateArrowVisibility);
window.addEventListener('resize', updateArrowVisibility);