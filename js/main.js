document.addEventListener('DOMContentLoaded', () => {
    loadContent();
    setupHeroCarousel();
    setupTestimonials();
    setupSmoothScroll();
    handlePageLoader();
});

function handlePageLoader() {
    const loader = document.getElementById('page-loader');
    if (loader) {
        // Hide loader after a short delay to ensure initial render is done
        // or immediately if we consider JS loadContent sufficient.
        // A small delay makes the transition feel deliberate.
        setTimeout(() => {
            loader.classList.add('loader-hidden');
            // Remove from DOM after transition
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500); // match css transition duration
        }, 500);
    }
}

function setupSmoothScroll() {
    // Attach listeners to nav links injected by loadContent
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            const currentPath = window.location.pathname;

            // Determine if current page is Home (matches /, /index.html, or empty path)
            // Using includes('about.html') to rule out About page is simpler, or explicit check:
            const isHomePage = !currentPath.includes('about.html');

            // Logic for Home Page
            if (isHomePage) {
                // 1. Home Link (Scroll to Top)
                if (href === 'index.html' || href === '#' || href === '/') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }

                // 2. Section Links (Scroll to ID)
                // Extract ID if link contains '#' (e.g. "index.html#contato" or "#contato")
                if (href.includes('#')) {
                    const parts = href.split('#');
                    // Check if the path part matches home (empty or index.html) or if it's just a hash
                    const pathPart = parts[0];
                    const targetId = parts[1];

                    if (pathPart === 'index.html' || pathPart === '' || pathPart === '/') {
                        const targetElement = document.getElementById(targetId);
                        if (targetElement) {
                            e.preventDefault();

                            // Calculate scroll position compensating for fixed header
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
            // If not home page, allow default navigation (which will reload/go to index.html#section)
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

    // Services Section
    document.getElementById('services-title').innerText = home.services.title;
    renderCards('services-grid', home.services.items);

    // Segments Section
    renderCards('segments-grid', home.segments.items);

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

    container.innerHTML = items.map(item => `
        <div class="card">
            <details>
                <summary>
                    <div class="card-image-container">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                    <div class="card-overlay">
                        <span class="card-title-preview">${item.title}</span>
                    </div>
                </summary>
                <div class="modal-overlay" onclick="closeDetails(this)">
                    <div class="card-content" onclick="event.stopPropagation()">
                        <button onclick="closeDetails(this.parentElement.parentElement)" style="float: right; border: none; background: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
                        <h3>${item.title}</h3>
                        ${item.description ? `<p>${item.description}</p>` : ''}
                        ${item.list && item.list.length > 0 ? `<ul>${item.list.map(li => `<li>${li}</li>`).join('')}</ul>` : ''}
                        ${item.footer ? `<p style="margin-top: 1rem; font-weight: 500;">${item.footer}</p>` : ''}
                    </div>
                </div>
            </details>
        </div>
    `).join('');
}

function closeDetails(element) {
    // Navigate up to find the details element
    const details = element.closest('details');
    if (details) {
        details.removeAttribute('open');
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
    // Mobile images logic could be added here if needed, utilizing <picture> in JS generation if desired.
    // For simplicity and cleaner refactor, we stick to standard img for now or we can map them.
    // Original used <picture> for mobile. Let's replicate that for best results.

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
        index = (index - 1 + total) % total;
        update();
    });

    document.getElementById('hero-next').addEventListener('click', () => {
        index = (index + 1) % total;
        update();
    });

    setInterval(() => {
        index = (index + 1) % total;
        update();
    }, 5000);
}

function setupTestimonials() {
    const track = document.getElementById('testimonials-track');
    if (!track) return;

    // Generate 14 identical cards
    const text = siteContent.home.testimonials.text;
    let cardsHTML = '';
    for (let i = 0; i < 14; i++) {
        cardsHTML += `
            <div class="testimonial-card">
                <div class="stars">★★★★★</div>
                <p class="testimonial-text">"${text}"</p>
                <div class="testimonial-avatar"></div>
            </div>
        `;
    }
    track.innerHTML = cardsHTML;

    // Carousel Logic
    const cardWidth = 320; // 300px width + 20px gap approx
    let scrollAmount = 0;
    const maxScroll = track.scrollWidth - track.clientWidth;

    document.getElementById('testi-next').addEventListener('click', () => {
        const containerWidth = document.querySelector('.testimonials-viewport').clientWidth;
        scrollAmount += cardWidth;
        // Limit scroll
        if (scrollAmount > track.scrollWidth - containerWidth) {
            scrollAmount = 0; // Loop back to start
        }
        track.style.transform = `translateX(-${scrollAmount}px)`;
    });

    document.getElementById('testi-prev').addEventListener('click', () => {
        scrollAmount -= cardWidth;
        if (scrollAmount < 0) {
            scrollAmount = 0;
        }
        track.style.transform = `translateX(-${scrollAmount}px)`;
    });
}
