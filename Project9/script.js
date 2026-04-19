const revealElements = document.querySelectorAll(".reveal");
const parallaxSection = document.querySelector(".parallax");
const navLinks = document.querySelectorAll(".nav a");
const contactForm = document.getElementById("contactForm");

function revealOnScroll() {
  const triggerBottom = window.innerHeight * 0.85;

  revealElements.forEach((element) => {
    const rect = element.getBoundingClientRect();

    if (rect.top < triggerBottom) {
      element.classList.add("active");
    }
  });
}

function parallaxEffect() {
  if (!parallaxSection) return;

  const scrollY = window.scrollY;
  parallaxSection.style.backgroundPosition = `center calc(50% + ${scrollY * 0.25}px)`;
}

navLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");

    if (!targetId || !targetId.startsWith("#")) return;

    const targetSection = document.querySelector(targetId);
    if (!targetSection) return;

    e.preventDefault();

    const headerOffset = 90;
    const targetPosition =
      targetSection.getBoundingClientRect().top + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });

    targetSection.classList.remove("section-transition");

    setTimeout(() => {
      targetSection.classList.add("section-transition");
    }, 200);
  });
});

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const button = this.querySelector("button");
    const originalText = button.textContent;

    button.textContent = "Message Sent!";
    button.style.opacity = "0.85";

    setTimeout(() => {
      button.textContent = originalText;
      button.style.opacity = "1";
      this.reset();
    }, 1800);
  });
}

window.addEventListener("scroll", () => {
  revealOnScroll();
  parallaxEffect();
});

window.addEventListener("load", () => {
  revealOnScroll();
  parallaxEffect();
});