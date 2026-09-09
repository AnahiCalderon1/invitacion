// EDITAR ACÁ: fecha y hora exacta del casamiento
const FECHA_BODA = new Date(2026, 10, 21, 17, 30, 0);

// cuánto dura la animación de apertura (sello rompiéndose + luz + crossfade
// a la imagen del sobre abierto + el collage saliendo) antes de mostrar la
// invitación completa. Si alargás o acortás esas animaciones en
// estilos.css, ajustá este número para que combinen.
const DURACION_APERTURA = 900;

const sobre      = document.getElementById('sobre');
const sello = document.getElementById('sello');
const invitacion = document.getElementById('invitacion');
const btnCerrar  = document.getElementById('btnCerrar');
const eventos = document.querySelectorAll('.evento');
const lineaProgreso = document.getElementById('lineaProgreso');
let maxVisible = -1;
const revealEls = document.querySelectorAll('.reveal');
const obsReveal = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.2 });
revealEls.forEach(el => obsReveal.observe(el));
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.3 });
eventos.forEach(ev => obs.observe(ev));
let abierto = false;
const obsPrograma = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('visible');
      const idx = Array.from(eventos).indexOf(entry.target);
      if (idx > maxVisible){
        maxVisible = idx;
        lineaProgreso.style.height = ((maxVisible + 1) / eventos.length * 100) + '%';
      }
    }
  });
}, { threshold: 0.4 });

eventos.forEach(ev => obsPrograma.observe(ev));
function abrirSobre(){
  if (abierto) return;
  abierto = true;
  sobre.classList.add('abierto');

  setTimeout(() => {
    invitacion.classList.add('visible');
    document.body.style.overflow = 'auto';
  }, DURACION_APERTURA);
}

function cerrarInvitacion(){
  invitacion.classList.remove('visible');
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    sobre.classList.remove('abierto');
    abierto = false;
  }, 500);
}

sello.addEventListener('click', abrirSobre);
sello.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' '){
    e.preventDefault();
    abrirSobre();
  }
});
btnCerrar.addEventListener('click', cerrarInvitacion);

function actualizarCuentaRegresiva(){
  const ahora = new Date();
  let diff = FECHA_BODA - ahora;
  if (diff < 0) diff = 0;

  const dias  = Math.floor(diff / (1000*60*60*24));
  const horas = Math.floor((diff / (1000*60*60)) % 24);
  const min   = Math.floor((diff / (1000*60)) % 60);
  const seg   = Math.floor((diff / 1000) % 60);

  document.getElementById('crDias').textContent  = String(dias).padStart(2,'0');
  document.getElementById('crHoras').textContent = String(horas).padStart(2,'0');
  document.getElementById('crMin').textContent   = String(min).padStart(2,'0');
  document.getElementById('crSeg').textContent   = String(seg).padStart(2,'0');
}
actualizarCuentaRegresiva();
setInterval(actualizarCuentaRegresiva, 1000);
// --- REPRODUCTOR DE MÚSICA EN VINILO ---
const audioBoda = document.getElementById('musicaBoda');
const viniloImg = document.getElementById('viniloImg');
const btnMusica = document.getElementById('btnMusica');

if (btnMusica && audioBoda) {
  btnMusica.addEventListener('click', () => {
    if (audioBoda.paused) {
      audioBoda.play();
      viniloImg.classList.add('girando');
    } else {
      audioBoda.pause();
      viniloImg.classList.remove('girando');
    }
  });
}
// --- CARRUSEL DE FOTOS/VIDEO ---
const slides = document.querySelectorAll('.slide');
const btnAnterior = document.getElementById('anterior');
const btnSiguiente = document.getElementById('siguiente');
const indicador = document.getElementById('indicadorSlide');
let slideActual = 0;

function mostrarSlide(index){
  slides.forEach((slide, i) => {
    const video = slide.querySelector('video');
    const esActivo = i === index;

    slide.classList.toggle('active', esActivo);

    if (video){
      if (esActivo){
        video.currentTime = 0;
        video.play();
      } else {
        video.pause();
      }
    }
  });

  indicador.textContent = `${index + 1} / ${slides.length}`;
}

if (btnAnterior && btnSiguiente && slides.length){
  btnAnterior.addEventListener('click', () => {
    slideActual = (slideActual - 1 + slides.length) % slides.length;
    mostrarSlide(slideActual);
  });

  btnSiguiente.addEventListener('click', () => {
    slideActual = (slideActual + 1) % slides.length;
    mostrarSlide(slideActual);
  });

  mostrarSlide(slideActual); // estado inicial
}