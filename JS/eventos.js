const eventos = [
  {
    titulo: "Feria del Libro de Medellín",
    fecha: "2025-08-10",
    descripcion: "El evento literario más grande de la ciudad. Encuentra autores nacionales e internacionales, talleres de escritura, zona de libros usados y mucho más.",
    lugar: "Plaza Mayor, Medellín",
    ciudad: "Medellín",
    categoria: "Feria del Libro",
    imagen: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    detalles: [
      "Charlas con escritores reconocidos",
      "Zona de niños y actividades familiares",
      "Firmas de libros y lanzamientos exclusivos",
      "Entrada gratuita"
    ],
    hoy: true
  },
  {
    titulo: "Lectura al Parque en Provenza",
    fecha: "2025-08-23",
    descripcion: "Una jornada de lectura al aire libre. Trae tu libro favorito o toma uno prestado, disfruta música en vivo, picnic y actividades para toda la familia.",
    lugar: "Parque Provenza, Medellín",
    ciudad: "Medellín",
    categoria: "Infantil",
    imagen: "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=800&q=80",
    detalles: [
      "Talleres de lectura creativa",
      "Zona picnic y foodtrucks",
      "Concierto acústico al atardecer",
      "Premios para los lectores más jóvenes"
    ],
    hoy: true
  },
  {
    titulo: "Noche de Poesía y Café",
    fecha: "2025-09-06",
    descripcion: "Una velada mágica con poesía en vivo, micrófono abierto, degustación de cafés y exposición de arte local.",
    lugar: "Café El Poeta, Provenza",
    ciudad: "Medellín",
    categoria: "Poesía",
    imagen: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
    detalles: [
      "Poesía en vivo y micrófono abierto",
      "Exposición de ilustradores locales",
      "Degustación de cafés especiales",
      "Premio a la mejor declamación"
    ],
    hoy: false
  },
  {
    titulo: "Feria de Fanzines y Cómic Local",
    fecha: "2025-09-20",
    descripcion: "Descubre el talento local en la feria de fanzines. Talleres de ilustración, venta de cómics independientes, y concursos para nuevos autores.",
    lugar: "Centro Cultural Moravia, Medellín",
    ciudad: "Medellín",
    categoria: "Cómic",
    imagen: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80",
    detalles: [
      "Venta y trueque de fanzines",
      "Concurso de ilustración rápida",
      "Charlas sobre autopublicación",
      "Zona de dibujo libre"
    ],
    hoy: false
  }
];

document.addEventListener('DOMContentLoaded', function() {
  renderEventCards(eventos);

  // Buscador en tiempo real
  ['searchText', 'searchCity', 'searchDate', 'searchCategory'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', filtrarCartas);
      el.addEventListener('change', filtrarCartas);
    }
  });

  // Buscador al dar submit
  const form = document.getElementById('event-search-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      filtrarCartas();
    });
  }
});

// Renderiza las cartas (puedes pasar un array filtrado)
function renderEventCards(filtered = eventos) {
  const cardsContainer = document.getElementById('event-cards');
  const noEvents = document.getElementById('no-events');
  cardsContainer.innerHTML = '';
  if (filtered.length === 0) {
    if (noEvents) noEvents.style.display = '';
    return;
  } else {
    if (noEvents) noEvents.style.display = 'none';
  }
  filtered.forEach((evento, idx) => {
    const col = document.createElement('div');
    col.className = "col-12 col-md-6 col-lg-3 event-card-col";
    col.innerHTML = `
      <div class="event-card h-100 shadow-sm" onclick="showEventModal(${idx})">
        <img src="${evento.imagen}" alt="${evento.titulo}" class="event-card-img-small">
        ${evento.hoy ? '<span class="ribbon">HOY</span>' : ''}
        <div class="event-card-body">
          <div class="event-card-title">${evento.titulo}</div>
          <div class="event-card-date"><i class="bi bi-calendar-event"></i> ${evento.fecha}</div>
          <div class="event-card-location"><i class="bi bi-geo-alt"></i> ${evento.ciudad}</div>
          <div class="event-card-category d-none">${evento.categoria || ''}</div>
          <div class="event-card-desc">${evento.descripcion}</div>
          <button class="event-card-btn mt-2" onclick="event.stopPropagation(); showEventModal(${idx})">Ver más</button>
        </div>
      </div>
    `;
    cardsContainer.appendChild(col);
  });
}

// Filtra eventos y vuelve a renderizar las cartas
function filtrarCartas() {
  const text = (document.getElementById('searchText')?.value || '').trim().toLowerCase();
  const city = (document.getElementById('searchCity')?.value || '').toLowerCase();
  const date = (document.getElementById('searchDate')?.value || ''); // yyyy-mm-dd
  const category = (document.getElementById('searchCategory')?.value || '').toLowerCase();

  const filtrados = eventos.filter((ev) => {
    const title = ev.titulo.toLowerCase();
    const desc = ev.descripcion.toLowerCase();
    const loc = ev.ciudad.toLowerCase();
    // Filtra por fecha exacta si hay
    const evDate = ev.fecha.length >= 10 ? ev.fecha.slice(0, 10) : '';
    const cat = ev.categoria ? ev.categoria.toLowerCase() : '';

    let show = true;
    if(text && !(title.includes(text) || desc.includes(text) || loc.includes(text))) show = false;
    if(city && !loc.includes(city)) show = false;
    if(date && date !== evDate) show = false;
    if(category && !cat.includes(category)) show = false;
    return show;
  });
  renderEventCards(filtrados);
}

// Modal con información del evento
window.showEventModal = function(idx) {
  const evento = eventos[idx];
  if (!evento) return;
  document.getElementById('eventModalLabel').innerText = evento.titulo;
  document.getElementById('eventModalImg').src = evento.imagen;
  document.getElementById('eventModalDesc').innerText = evento.descripcion;
  const detailsUl = document.getElementById('eventModalDetails');
  detailsUl.innerHTML = '';
  evento.detalles.forEach(det => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.innerHTML = `<span>• ${det}</span>`;
    detailsUl.appendChild(li);
  });
  const modal = new bootstrap.Modal(document.getElementById('eventModal'));
  modal.show();
};

function toggleCart() { alert("Funcionalidad de carrito no implementada en esta página de eventos."); }