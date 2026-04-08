const animalCards = document.querySelectorAll('.animal-card');
const donationForm = document.getElementById('donationForm');
const donationResult = document.getElementById('donationResult');
const menuToggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');

animalCards.forEach((card) => {
  const button = card.querySelector('.animal-toggle');

  button.addEventListener('click', () => {
    const isActive = card.classList.contains('active');

    animalCards.forEach((item) => {
      item.classList.remove('active');
      item.querySelector('.animal-toggle').setAttribute('aria-expanded', 'false');
    });

    if (!isActive) {
      card.classList.add('active');
      button.setAttribute('aria-expanded', 'true');
    }
  });
});

const donationMessages = {
  'Tigre de Bengala': {
    low: 'Tu ayuda aportará alimento y cuidados básicos para el Tigre de Bengala.',
    mid: 'Tu donación ayudará con revisiones veterinarias y protección frente a la caza furtiva.',
    high: 'Tu apoyo financiará acciones más amplias de conservación y vigilancia del hábitat del Tigre de Bengala.'
  },
  'Elefante africano': {
    low: 'Tu ayuda servirá para agua, suplementos y atención inicial del Elefante africano.',
    mid: 'Tu donación apoyará tratamientos, seguimiento y cuidados del Elefante africano.',
    high: 'Tu apoyo contribuirá a corredores seguros, monitoreo y conservación del Elefante africano.'
  },
  'Panda gigante': {
    low: 'Tu ayuda apoyará alimento especializado y cuidados diarios del Panda gigante.',
    mid: 'Tu donación servirá para conservación del bambú y atención veterinaria del Panda gigante.',
    high: 'Tu apoyo reforzará programas de reforestación y seguimiento científico del Panda gigante.'
  },
  'Ciervo rojo': {
    low: 'Tu ayuda aportará alimento complementario y cuidado preventivo para el Ciervo rojo.',
    mid: 'Tu donación apoyará restauración de refugios y seguimiento sanitario del Ciervo rojo.',
    high: 'Tu apoyo contribuirá a proyectos de conservación forestal y vigilancia del ecosistema del Ciervo rojo.'
  }
};

donationForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const animal = document.getElementById('animalSelect').value;
  const amount = Number(document.getElementById('amount').value);

  if (!amount || amount <= 0) {
    donationResult.textContent = 'Por favor, introduce una cantidad válida para continuar.';
    return;
  }

  let level = 'low';

  if (amount >= 25 && amount < 80) {
    level = 'mid';
  } else if (amount >= 80) {
    level = 'high';
  }

  donationResult.innerHTML = `
    <strong>Gracias por querer ayudar a ${animal}.</strong><br>
    ${donationMessages[animal][level]}<br><br>
    <span>Importe seleccionado: <strong>${amount}€</strong></span>
  `;
});

menuToggle.addEventListener('click', () => {
  menu.classList.toggle('open');
});

document.querySelectorAll('.menu a').forEach((link) => {
  link.addEventListener('click', () => {
    menu.classList.remove('open');
  });
});

function changeLanguage(page) {
    window.location.href = page;
  }
