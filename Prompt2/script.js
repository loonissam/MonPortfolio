document.addEventListener("DOMContentLoaded", () => {
    // 1. Gestion du menu burger pour mobile
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            hamburger.classList.toggle("active");
        });
    }

    // 2. Animation d'apparition des projets au défilement (Scroll Reveal)
    const projectCards = document.querySelectorAll(".project-card");
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 }); // Se déclenche quand 10% de la carte est visible

    projectCards.forEach(card => {
        observer.observe(card);
    });
});