const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;

  formMessage.textContent = `Thank you, ${name}! Your message has been sent successfully.`;
  formMessage.style.marginTop = "10px";
  formMessage.style.color = "#ff6600";

  contactForm.reset();
});