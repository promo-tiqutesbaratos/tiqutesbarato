const carousel = document.getElementById('carousel-2');
const nextBtn = document.getElementById('nextBtn-2');
const prevBtn = document.getElementById('prevBtn-2');

const slides = [
  { src: 'img/DESCUBRE-VUELOS-EN-OFERTA-C1.avif', text: '¡Vuela a reservar!', alt: 'Oferta 1' },
  // ... los demás
];

// Renderiza las tarjetas
slides.forEach(slide => {
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `
    <img src="${slide.src}" alt="${slide.alt}" title="${slide.text}" />
    <div class="card-text">${slide.text}</div>
  `;
  carousel.appendChild(card);
});

function updateButtons() {
  const scrollLeft = Math.round(carousel.scrollLeft);
  const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;

  prevBtn.style.display = scrollLeft <= 0 ? 'none' : 'flex';
  nextBtn.style.display = scrollLeft >= maxScrollLeft - 5 ? 'none' : 'flex';
}

function scrollByCard(direction = 1) {
  const cardWidth = 300 + 10;
  const scrollAmount = cardWidth * 3;

  const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
  let newScrollLeft = carousel.scrollLeft + direction * scrollAmount;

  newScrollLeft = Math.max(0, Math.min(newScrollLeft, maxScrollLeft));

  carousel.scrollTo({ left: newScrollLeft, behavior: 'smooth' });

  setTimeout(updateButtons, 400);
}

nextBtn.addEventListener('click', () => scrollByCard(1));
prevBtn.addEventListener('click', () => scrollByCard(-1));
carousel.addEventListener('scroll', () => {
  clearTimeout(carousel._scrollTimer);
  carousel._scrollTimer = setTimeout(updateButtons, 100);
});

window.addEventListener('load', updateButtons);
