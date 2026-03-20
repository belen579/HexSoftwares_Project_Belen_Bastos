document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const typingElement = document.querySelector('.typing-effect');
    const animateElements = document.querySelectorAll('.animate');
    const languageSelect = document.getElementById('languageSelect');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const currentLang = document.documentElement.lang;

            const name = currentLang === 'es'
                ? document.getElementById('name').value
                : document.getElementById('name-en').value;

            const email = currentLang === 'es'
                ? document.getElementById('email').value
                : document.getElementById('email-en').value;

            const subject = currentLang === 'es'
                ? document.getElementById('subject').value
                : document.getElementById('subject-en').value;

            const message = currentLang === 'es'
                ? document.getElementById('message').value
                : document.getElementById('message-en').value;

            console.log('Enviando mensaje:', { name, email, subject, message });

            successMessage.style.display = 'block';

            successMessage.scrollIntoView({
                behavior: 'smooth'
            });

            form.reset();

            setTimeout(function () {
                successMessage.style.display = 'none';
            }, 5000);
        });
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    if (typingElement) {
        const text = typingElement.textContent;
        typingElement.textContent = '';

        let i = 0;

        function typeWriter() {
            if (i < text.length) {
                typingElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }

        window.addEventListener('load', () => {
            typeWriter();
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70,
                    behavior: 'smooth'
                });

                navLinks.classList.remove('active');
            }
        });
    });

    const savedLanguage = localStorage.getItem('preferredLanguage') || 'es';
    document.documentElement.lang = savedLanguage;

    if (languageSelect) {
        languageSelect.value = savedLanguage;
    }

    function checkIfInView() {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
    });

    window.addEventListener('load', checkIfInView);
    window.addEventListener('scroll', checkIfInView);
});

function changeLanguage(lang) {
    document.documentElement.lang = lang;
    localStorage.setItem('preferredLanguage', lang);
}