// EDITAR ACÁ: fecha y hora exacta del casamiento
const FECHA_BODA = new Date(2026, 10, 21, 17, 30, 0);

// cuánto dura la animación de apertura (sello rompiéndose + luz + crossfade
// a la imagen del sobre abierto + el collage saliendo) antes de mostrar la
// invitación completa. Si alargás o acortás esas animaciones en
// estilos.css, ajustá este número para que combinen.
const DURACION_APERTURA = 2800;

const sobre      = document.getElementById('sobre');
const invitacion = document.getElementById('invitacion');
const btnCerrar  = document.getElementById('btnCerrar');

let abierto = false;

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

sobre.addEventListener('click', abrirSobre);
sobre.addEventListener('keydown', (e) => {
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