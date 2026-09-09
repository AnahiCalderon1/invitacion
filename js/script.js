// EDITAR ACÁ: fecha y hora exacta del casamiento
const FECHA_BODA = new Date(2026, 10, 21, 17, 30, 0);
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
      if (esActivo){ video.currentTime = 0; video.play(); }
      else { video.pause(); }
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
  mostrarSlide(slideActual);
}
// --- COPIAR ALIAS AL PORTAPAPELES ---
const btnCopiarAlias = document.getElementById('btnCopiarAlias');
const aliasValor = document.getElementById('aliasValor');
const textoCopiar = document.getElementById('textoCopiar');

if (btnCopiarAlias){
  btnCopiarAlias.addEventListener('click', () => {
    navigator.clipboard.writeText(aliasValor.textContent.trim()).then(() => {
      textoCopiar.textContent = '¡Copiado!';
      setTimeout(() => { textoCopiar.textContent = 'Tocar para copiar'; }, 1800);
    });
  });
}
// --- RSVP: envío a Google Sheets vía Apps Script ---
const URL_APPS_SCRIPT = 'https://script.google.com/macros/s/AKfycbyfx-NvTmF1ojwJcZ7g51jk5EyC8JrFY8ba0JmGn4hzwuAvVT3sJ0K4pn6FKP4E1xaXlg/exec'; 

const formRSVP = document.getElementById('formRSVP');
const inputComprobante = document.getElementById('rsvpComprobante');
const nombreArchivoSpan = document.getElementById('rsvpArchivoNombre');
const btnEnviarRSVP = document.getElementById('btnEnviarRSVP');
const mensajeRSVP = document.getElementById('rsvpMensaje');

if (inputComprobante){
  inputComprobante.addEventListener('change', () => {
    nombreArchivoSpan.textContent = inputComprobante.files[0]
      ? inputComprobante.files[0].name
      : '';
  });
}

function archivoABase64(file){
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = () => resolve(lector.result);
    lector.onerror = reject;
    lector.readAsDataURL(file);
  });
}

if (formRSVP){
  formRSVP.addEventListener('submit', async (e) => {
    e.preventDefault();
    btnEnviarRSVP.disabled = true;
    btnEnviarRSVP.textContent = 'Enviando...';
    mensajeRSVP.textContent = '';

    const nombre = document.getElementById('rsvpNombre').value.trim();
    const acompanante = document.getElementById('rsvpAcompanante').value.trim();
    const asistencia = formRSVP.querySelector('input[name="asistencia"]:checked')?.value || '';
    const archivo = inputComprobante.files[0];
    const datos = { nombre, acompanante, asistencia, comprobante: null };

    try {
      if (archivo){
        const base64 = await archivoABase64(archivo);
        datos.comprobante = { base64, tipo: archivo.type, nombreArchivo: archivo.name };
      }

      await fetch(URL_APPS_SCRIPT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(datos)
      });

      mensajeRSVP.textContent = '¡Gracias! Tu confirmación fue enviada 💛';
      formRSVP.reset();
      nombreArchivoSpan.textContent = '';

    } catch (error) {
      mensajeRSVP.textContent = 'Hubo un problema al enviar. Probá de nuevo.';
      console.error(error);
    } finally {
      btnEnviarRSVP.disabled = false;
      btnEnviarRSVP.textContent = 'Confirmar asistencia';
    }
  });
}