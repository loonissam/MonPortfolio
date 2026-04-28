document.addEventListener("DOMContentLoaded", () => {
    // --- Cache des éléments du DOM pour de meilleures performances ---
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const navLinksAnchors = document.querySelectorAll(".nav-links a");
    const heroTitle = document.querySelector("#hero h1");
    const projectCards = document.querySelectorAll(".project-card");
    const backToTopButton = document.querySelector(".back-to-top");
    const sections = document.querySelectorAll("section[id]");

    // --- 0. FONCTION UTILITAIRE : THROTTLE ---
    // Limite la fréquence d'exécution d'une fonction pour améliorer les performances,
    // notamment pour les événements de scroll.
    const throttle = (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    };

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
                entry.target.style.transform = "perspective(1000px) translateY(0) rotateX(0deg) rotateY(0deg)";
                
                // On réduit le temps de transition après l'apparition (600ms)
                // pour que l'effet 3D de la souris (tilt) soit plus réactif par la suite.
                setTimeout(() => {
                    entry.target.style.transition = "opacity 0.6s ease-out, transform 0.1s ease, box-shadow 0.3s, background-color 0.3s";
                }, 600);
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
        const handleScrollButton = () => {
            if (window.scrollY > 400) { // Apparaît après avoir scrollé de 400px
                backToTopButton.classList.add("show");
            } else {
                backToTopButton.classList.remove("show");
            }
        };
        // On utilise throttle pour ne pas surcharger le navigateur lors du scroll
        window.addEventListener("scroll", throttle(handleScrollButton, 200));

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

    // --- 5. EFFET DE FRAPPE POUR LE TITRE DE LA SECTION HERO ---
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        const typingSpeed = 120; // Vitesse en ms entre chaque caractère
        let charIndex = 0;
        heroTitle.textContent = ''; // On vide le titre pour commencer l'animation

        function typeWriter() {
            if (charIndex < originalText.length) {
                heroTitle.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, typingSpeed);
            }
        }
        setTimeout(typeWriter, 500); // Petit délai avant de commencer pour un effet plus doux
    }

    // --- 6. GESTION DU THÈME SOMBRE (DARK MODE) ---
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
        // Vérifie la préférence sauvegardée par l'utilisateur
        if (localStorage.getItem("theme") === "dark") {
            document.body.classList.add("dark-mode");
            themeToggle.textContent = "☀️";
        }

        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            if (document.body.classList.contains("dark-mode")) {
                localStorage.setItem("theme", "dark");
                themeToggle.textContent = "☀️";
            } else {
                localStorage.setItem("theme", "light");
                themeToggle.textContent = "🌙";
            }
        });
    }

    // --- 7. CURSEUR SOURIS PERSONNALISÉ ---
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");
    if (cursorDot && cursorOutline) {
        window.addEventListener("mousemove", (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            // Animation fluide pour le cercle extérieur avec la JS Web Animations API
            cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 500, fill: "forwards" });
        });
    }

    // --- 8. EFFET DE TILT 3D SUR LES CARTES PROJETS ---
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // Position X de la souris dans la carte
            const y = e.clientY - rect.top;  // Position Y de la souris dans la carte
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10; // Max +-10 degrés
            const rotateY = ((x - centerX) / centerX) * 10;
            card.style.transform = `perspective(1000px) translateY(0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', () => card.style.transform = `perspective(1000px) translateY(0) rotateX(0deg) rotateY(0deg)`);
    });
});