document.addEventListener('DOMContentLoaded', () => {
    loadContent();
    setupHeroCarousel();
    setupTestimonials();
    setupSmoothScroll();
    handlePageLoader();
    setupModal();
});

function handlePageLoader() {
    const loader = document.getElementById('page-loader');
    if (loader) {
        // Hide loader after a short delay to ensure initial render is done
        // or immediately if we consider JS loadContent sufficient.
        // A small delay makes the transition feel deliberate.
        setTimeout(() => {
            loader.classList.add('loader-hidden');
            document.body.classList.add('loaded'); // Trigger content animation

            // Remove from DOM after transition
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500); // match css transition duration
        }, 500);
    }
}

function setupSmoothScroll() {
    // 1. Handle Hash on Page Load (e.g. from About -> Home#Contact)
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            // Wait a bit for layout to settle (especially with dynamic content)
            setTimeout(() => {
                const header = document.querySelector('header');
                const headerOffset = header ? header.offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }, 300); // Small delay to allow content loading
        }
    }

    // 2. Attach listeners to nav links injected by loadContent
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            const currentPath = window.location.pathname;

            // Determine if current page is Home (matches /, /index.html, or empty path)
            const isHomePage = !currentPath.includes('about.html');

            // Logic for Home Page
            if (isHomePage) {
                // Home Link (Scroll to Top)
                if (href === 'index.html' || href === '#' || href === '/') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }

                // Section Links (Scroll to ID)
                if (href.includes('#')) {
                    const parts = href.split('#');
                    const pathPart = parts[0];
                    const targetId = parts[1];

                    // If linking to current page (home)
                    if (pathPart === 'index.html' || pathPart === '' || pathPart === '/') {
                        const targetElement = document.getElementById(targetId);
                        if (targetElement) {
                            e.preventDefault();

                            const header = document.querySelector('header');
                            const headerOffset = header ? header.offsetHeight : 0;
                            const elementPosition = targetElement.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                            window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                            });
                        }
                    }
                }
            }
            // If not home page, default navigation works.
            // If navigating FROM About TO Home#Contact, the page load logic above handles the scroll.
        });
    });
}

function loadContent() {
    const content = siteContent;

    // --- Header ---
    const logoImg = document.getElementById('header-logo');
    if (logoImg) logoImg.src = content.header.logo;

    const navMenu = document.getElementById('nav-menu');
    if (navMenu) {
        navMenu.innerHTML = content.header.links.map(link =>
            `<a href="${link.href}" class="nav-link">${link.text}</a>`
        ).join('');
    }

    // --- Footer ---
    const footerText = document.getElementById('footer-text');
    if (footerText) footerText.innerText = content.footer.text;

    const footerLogo = document.getElementById('footer-logo');
    if (footerLogo) footerLogo.src = content.footer.logo;

    // --- Home Specific ---
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
        loadHomeContent(content);
    }

    // --- About Specific ---
    if (window.location.pathname.endsWith('about.html')) {
        loadAboutPageContent(content);
    }
}

function loadHomeContent(content) {
    const home = content.home;

    // About Section
    document.getElementById('about-title').innerText = home.about.title;
    document.getElementById('about-text').innerHTML = home.about.paragraphs.map(p => `<p>${p}</p>`).join('');
    document.getElementById('about-btn').innerText = home.about.buttonText;

    // Services Section (Includes Segments now)
    document.getElementById('services-title').innerText = home.services.title;
    const allServices = [...home.services.items, ...home.segments.items];
    renderCards('services-grid', allServices);

    // Expertise Section
    document.getElementById('expertise-title').innerText = home.expertises.title;
    document.getElementById('expertise-intro').innerHTML = home.expertises.paragraphs.map(p => `<p>${p}</p>`).join('');
    renderCards('expertise-grid', home.expertises.items);

    // Testimonials Title
    document.getElementById('testimonials-title').innerText = home.testimonials.title;

    // Contact
    document.getElementById('contact-title').innerText = content.contact.title;
    const contactContainer = document.getElementById('contact-container');
    contactContainer.innerHTML = content.contact.items.map(item => {
        if (item.type === 'link') {
            return `
                <a href="${item.href}" class="contact-item" target="_blank">
                    <img src="${item.icon}" alt="${item.text}" class="contact-icon">
                    <span>${item.text}</span>
                </a>
            `;
        } else {
            return `
                <div class="contact-item">
                    <img src="${item.icon}" alt="${item.text}" class="contact-icon">
                    <span>${item.text}</span>
                </div>
            `;
        }
    }).join('');
}

function loadAboutPageContent(content) {
    const about = content.about;

    // History
    document.getElementById('history-title').innerText = about.history.title;
    document.getElementById('history-content').innerHTML = about.history.content.map(p => `<p>${p}</p>`).join('');

    // Alexandre
    document.getElementById('alexandre-title').innerText = about.alexandre.title;
    document.getElementById('alexandre-content').innerHTML = `<p>${about.alexandre.content}</p>`;

    // Mission Vision Values
    const mvvContainer = document.getElementById('mission-vision-values');
    mvvContainer.innerHTML = `
        <div class="about-content" style="text-align: center;">
            <h3 style="color: var(--secondary-color); margin-top: 1rem;">${about.mission.missionTitle}</h3>
            <p>${about.mission.missionText}</p>

            <h3 style="color: var(--secondary-color); margin-top: 2rem;">${about.mission.visionTitle}</h3>
            <p>${about.mission.visionText}</p>

            <h3 style="color: var(--secondary-color); margin-top: 2rem;">${about.mission.valuesTitle}</h3>
            <ul style="text-align: left; display: inline-block; margin-top: 1rem;">
                ${about.mission.valuesList.map(v => `<li style="margin-bottom: 0.5rem;">• ${v}</li>`).join('')}
            </ul>
        </div>
    `;
}

function renderCards(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ''; // Clear existing

    items.forEach(item => {
        // Create excerpt
        const description = item.description || "";
        const excerpt = description.length > 100 ? description.substring(0, 100) + "..." : description;

        const card = document.createElement('div');
        card.className = 'card';
        // Removed details/summary. Using span for 'Saiba mais' to act as a visual cue.
        // Whole card is clickable.
        card.innerHTML = `
            <div class="card-image-container">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
            </div>
            <div class="card-body">
                <h3 class="card-title">${item.title}</h3>
                <p class="card-excerpt">${excerpt}</p>
                <span class="card-cta">Saiba mais</span>
            </div>
        `;

        // Add click listener to the whole card
        card.addEventListener('click', () => {
            openModal(item);
        });

        container.appendChild(card);
    });
}

// --- Global Modal Logic ---

function setupModal() {
    const modalOverlay = document.getElementById('global-modal-overlay');
    const closeBtn = document.getElementById('global-modal-close');

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function openModal(item) {
    const modalOverlay = document.getElementById('global-modal-overlay');
    const modalBody = document.getElementById('global-modal-body');

    if (modalOverlay && modalBody) {
        // Populate content
        modalBody.innerHTML = `
            <h3>${item.title}</h3>
            ${item.description ? `<p>${item.description}</p>` : ''}
            ${item.list && item.list.length > 0 ? `<ul>${item.list.map(li => `<li>${li}</li>`).join('')}</ul>` : ''}
            ${item.footer ? `<p style="margin-top: 1rem; font-weight: 500;">${item.footer}</p>` : ''}
        `;

        // Show modal
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeModal() {
    const modalOverlay = document.getElementById('global-modal-overlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}


// --- Carousel Logic ---

function setupHeroCarousel() {
    const track = document.getElementById('hero-slides');
    if (!track) return;

    // Images based on the original HTML
    const images = [
        "img/Capas/2.png", "img/Capas/3.png", "img/Capas/4.png",
        "img/Capas/5.png", "img/Capas/6.png", "img/Capas/7.png"
    ];

    const slidesHTML = images.map((img, index) => {
        const mobileImg = img.replace('Capas', 'Mobile');
        return `
        <div class="hero-slide">
            <picture>
                <source media="(max-width: 600px)" srcset="${mobileImg}">
                <img src="${img}" alt="Slide ${index + 1}">
            </picture>
        </div>`;
    }).join('');

    track.innerHTML = slidesHTML;

    let index = 0;
    const slides = document.querySelectorAll('.hero-slide');
    const total = slides.length;

    function update() {
        track.style.transform = `translateX(-${index * 100}%)`;
    }

    document.getElementById('hero-prev').addEventListener('click', () => {
        index = (index + 1) % total;
        update();
    });

    document.getElementById('hero-next').addEventListener('click', () => {
        index = (index - 1 + total) % total;
        update();
    });

    setInterval(() => {
        // Left to Right movement means index decreases
        index = (index - 1 + total) % total;
        update();
    }, 5000);
}

function setupTestimonials() {
    const track = document.getElementById('testimonials-track');
    if (!track) return;

    // 1. Generate Cards
    const testimonialData = siteContent.home.testimonials.items || [];
    const items = [];

    testimonialData.forEach(data => {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        // Ensure valid HTML in author field (it already contains strong tags/br)
        card.innerHTML = `
            <div class="testimonial-avatar"></div>
            <div class="stars">★★★★★</div>
            <p class="testimonial-text">"${data.text}"</p>
            <div class="testimonial-author">${data.author}</div>
        `;
        items.push(card);
    });

    // 2. Clone items for infinite loop
    const itemsToClone = 3;

    // Append original items first to track to have base content
    items.forEach(item => track.appendChild(item));

    // Create clones
    const firstClones = items.slice(0, itemsToClone).map(item => {
        const clone = item.cloneNode(true);
        clone.classList.add('clone-first'); // Debug class
        return clone;
    });

    const lastClones = items.slice(-itemsToClone).map(item => {
        const clone = item.cloneNode(true);
        clone.classList.add('clone-last');
        return clone;
    });

    // Append/Prepend clones
    firstClones.forEach(clone => track.appendChild(clone));
    lastClones.reverse().forEach(clone => track.insertBefore(clone, track.firstChild));

    // 3. Carousel State
    let currentIndex = itemsToClone; // Start at first real item (index 3) because of 3 prepend clones
    let itemWidth = 0;
    let gap = 32; // 2rem = 32px
    let isTransitioning = false;
    let autoPlayInterval;

    // 4. Update Dimensions
    function updateDimensions() {
        const card = track.querySelector('.testimonial-card');
        if (card) {
            // Get exact width including potential sub-pixel rendering
            itemWidth = card.getBoundingClientRect().width;
        }
        // Initial position: - (currentIndex * (itemWidth + gap))
        updateTrackPosition(false);
    }

    function updateTrackPosition(enableTransition = true) {
        if (enableTransition) {
            track.style.transition = 'transform 0.5s ease-in-out';
        } else {
            track.style.transition = 'none';
        }
        const position = -(currentIndex * (itemWidth + gap));
        track.style.transform = `translateX(${position}px)`;
    }

    // 5. Navigation Logic
    function moveNext() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex++;
        updateTrackPosition(true);
    }

    function movePrev() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex--;
        updateTrackPosition(true);
    }

    // Handle Transition End (Infinite Loop Jump)
    track.addEventListener('transitionend', () => {
        isTransitioning = false;

        // If we moved past the last real item (to first clone)
        if (currentIndex >= items.length + itemsToClone) {
            track.style.transition = 'none';
            currentIndex = itemsToClone; // Jump to first real item
            updateTrackPosition(false);
        }

        // If we moved before the first real item (to last clone)
        if (currentIndex < itemsToClone) {
            track.style.transition = 'none';
            currentIndex = items.length + itemsToClone - 1; // Jump to last real item
            updateTrackPosition(false);
        }
    });

    // 6. Event Listeners
    document.getElementById('testi-next').addEventListener('click', () => {
        moveNext();
        resetAutoPlay();
    });

    document.getElementById('testi-prev').addEventListener('click', () => {
        movePrev();
        resetAutoPlay();
    });

    window.addEventListener('resize', () => {
        updateDimensions();
    });

    // 7. Auto Play
    function startAutoPlay() {
        // User requested "come from left to right" which implies items entering from left
        // Standard carousel moves right-to-left (next). We switch to prev for this effect.
        autoPlayInterval = setInterval(movePrev, 5000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    // Init
    // Wait for a tick to ensure rendering for width calc
    setTimeout(() => {
        updateDimensions();
        startAutoPlay();
    }, 100);
}
