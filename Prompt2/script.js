document.addEventListener("DOMContentLoaded", () => {
    // --- Cache des éléments du DOM pour de meilleures performances ---
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const navLinksAnchors = document.querySelectorAll(".nav-links a");
    const projectCards = document.querySelectorAll(".project-card");
    const backToTopButton = document.querySelector(".back-to-top");
    const sections = document.querySelectorAll("section[id]");

    // --- 1. GESTION DU MENU BURGER ---
    if (hamburger && navLinks) {
        // Ouvre/ferme le menu au clic sur le burger
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            hamburger.classList.toggle("active");
        });

        // Ferme le menu quand on clique sur un lien (pour mobile)
        navLinksAnchors.forEach(link => {
            link.addEventListener("click", () => {
                if (navLinks.classList.contains("active")) {
                    navLinks.classList.remove("active");
                    hamburger.classList.remove("active");
                }
            });
        });
    }

    // --- 2. ANIMATION D'APPARITION AU DÉFILEMENT (PROJETS) ---
    const projectObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target); // Arrête d'observer une fois l'animation faite pour la performance
            }
        });
    }, { threshold: 0.1 });

    projectCards.forEach(card => {
        projectObserver.observe(card);
    });

    // --- 3. BOUTON "RETOUR EN HAUT" ---
    if (backToTopButton) {
        // Affiche/cache le bouton en fonction du scroll
        window.addEventListener("scroll", () => {
            if (window.scrollY > 400) { // Apparaît après avoir scrollé de 400px
                backToTopButton.classList.add("show");
            } else {
                backToTopButton.classList.remove("show");
            }
        });

        // Scroll doux vers le haut au clic
        backToTopButton.addEventListener("click", (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- 4. MISE EN ÉVIDENCE DU LIEN ACTIF DANS LA NAVIGATION AU SCROLL ---
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinksAnchors.forEach(link => link.classList.remove('active-link'));
                const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
                if (activeLink) activeLink.classList.add('active-link');
            }
        });
    }, { rootMargin: "-50% 0px -50% 0px" }); // Se déclenche quand la section est au milieu de l'écran

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});