
let currentLang = 'pt';
// We will access 'translations' which is defined in data.js (loaded before main.js)

document.addEventListener('DOMContentLoaded', () => {
    loadContent(currentLang);
    setupHeroCarousel();
    setupSmoothScroll();
    handlePageLoader();
    setupModal();
    setupLanguageToggle();
});

function setupLanguageToggle() {
    const toggleBtn = document.getElementById('lang-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            currentLang = currentLang === 'pt' ? 'en' : 'pt';
            toggleBtn.innerText = currentLang === 'pt' ? 'EN' : 'PT'; // Show option to switch TO
            loadContent(currentLang);
        });
    }
}

// Expose switchLanguage for potential inline usage if needed
window.switchLanguage = function(lang) {
    if (translations[lang]) {
        currentLang = lang;
        loadContent(lang);
    }
};

function handlePageLoader() {
    const loader = document.getElementById('page-loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('loader-hidden');
            document.body.classList.add('loaded');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 500);
    }
}

function setupSmoothScroll() {
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            setTimeout(() => {
                const header = document.querySelector('header');
                const headerOffset = header ? header.offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }, 300);
        }
    }

}

function loadContent(lang) {
    const content = translations[lang];

    // --- Header ---
    const logoImg = document.getElementById('header-logo');
    if (logoImg) logoImg.src = content.header.logo;

    const navMenu = document.getElementById('nav-menu');
    if (navMenu) {
        navMenu.innerHTML = content.header.links.map(link =>
            `<a href="${link.href}" class="nav-link">${link.text}</a>`
        ).join('');
        
        // Re-attach smooth scroll listeners to new links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                const currentPath = window.location.pathname;
                const isHomePage = !currentPath.includes('about.html');

                if (isHomePage) {
                    if (href === 'index.html' || href === '#' || href === '/') {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        return;
                    }
                    if (href.includes('#')) {
                        const parts = href.split('#');
                        const pathPart = parts[0];
                        const targetId = parts[1];
                        if (pathPart === 'index.html' || pathPart === '' || pathPart === '/') {
                            const targetElement = document.getElementById(targetId);
                            if (targetElement) {
                                e.preventDefault();
                                const header = document.querySelector('header');
                                const headerOffset = header ? header.offsetHeight : 0;
                                const elementPosition = targetElement.getBoundingClientRect().top;
                                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                            }
                        }
                    }
                }
            });
        });
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
    const aboutTitle = document.getElementById('about-title');
    if (aboutTitle) aboutTitle.innerText = home.about.title;
    
    const aboutText = document.getElementById('about-text');
    if (aboutText) aboutText.innerHTML = home.about.paragraphs.join('');
    
    const aboutBtn = document.getElementById('about-btn');
    if (aboutBtn) aboutBtn.innerText = home.about.buttonText;

    // Services Section
    const servicesTitle = document.getElementById('services-title');
    if (servicesTitle) servicesTitle.innerText = home.services.title;
    
    const allServices = [...home.services.items, ...home.segments.items];
    renderCards('services-grid', allServices);

    // Expertise Section
    const expertiseTitle = document.getElementById('expertise-title');
    if (expertiseTitle) expertiseTitle.innerText = home.expertises.title;
    
    const expertiseIntro = document.getElementById('expertise-intro');
    if (expertiseIntro) expertiseIntro.innerHTML = home.expertises.paragraphs.map(p => p.trim().startsWith('<') ? p : `<p>${p}</p>`).join('');
    
    renderCards('expertise-grid', home.expertises.items);

    // Testimonials Title
    const testiTitle = document.getElementById('testimonials-title');
    if (testiTitle) testiTitle.innerText = home.testimonials.title;

    // Re-setup testimonials carousel with new data
    setupTestimonials(home.testimonials.items);

    // Contact
    const contactTitle = document.getElementById('contact-title');
    if (contactTitle) contactTitle.innerText = content.contact.title;
    
    const contactContainer = document.getElementById('contact-container');
    if (contactContainer) {
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
}

function loadAboutPageContent(content) {
    const about = content.about;

    const histTitle = document.getElementById('history-title');
    if (histTitle) histTitle.innerText = about.history.title;
    
    const histContent = document.getElementById('history-content');
    if (histContent) histContent.innerHTML = about.history.content.join('');

    const alexTitle = document.getElementById('alexandre-title');
    if (alexTitle) alexTitle.innerText = about.alexandre.title;
    
    const alexContent = document.getElementById('alexandre-content');
    if (alexContent) alexContent.innerHTML = `<p>${about.alexandre.content}</p>`;

    const mvvContainer = document.getElementById('mission-vision-values');
    if (mvvContainer) {
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
}

function renderCards(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ''; 

    items.forEach(item => {
        const textToTruncate = item.shortDescription || item.description || "";
        const excerpt = textToTruncate.length > 100 ? textToTruncate.substring(0, 100) + "..." : textToTruncate;

        const card = document.createElement('div');
        card.className = 'card';
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

        card.addEventListener('click', () => {
            openModal(item);
        });

        container.appendChild(card);
    });
}

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
        let content = '';

        if (item.text && item.author) {
            // Testimonial
            const stars = renderStars(item.stars || 5);
            // Image handling for testimonial modal
            const imgHtml = item.image ? `<img src="${item.image}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin: 0 auto 1.5rem; display: block;">` : `<div class="testimonial-avatar" style="margin: 0 auto 1.5rem; width: 80px; height: 80px;"></div>`;
            
            content = `
                <div class="modal-testimonial">
                    ${imgHtml}
                    <div class="stars" style="font-size: 1.5rem; text-align: center; margin-bottom: 1rem;">${stars}</div>
                    <p class="modal-text" style="font-size: 1.1rem; line-height: 1.6; font-style: italic; text-align: center; margin-bottom: 1.5rem;">"${item.text}"</p>
                    <div class="modal-author" style="text-align: center;">${item.author}</div>
                </div>
            `;
        } else {
            // Service
            content = `
                <h3>${item.title}</h3>
                ${item.description ? `<p>${item.description}</p>` : ''}
                ${item.list && item.list.length > 0 ? `<ul>${item.list.map(li => `<li>${li}</li>`).join('')}</ul>` : ''}
                ${item.footer ? `<p style="margin-top: 1rem; font-weight: 500;">${item.footer}</p>` : ''}
            `;
        }

        modalBody.innerHTML = content;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function renderStars(rating) {
    const fullStar = '★';
    const emptyStar = '☆';
    const maxStars = 5;
    const filled = Math.min(Math.max(rating, 0), maxStars);
    const empty = maxStars - filled;
    return `<span style="color: gold;">${fullStar.repeat(filled)}</span><span style="color: #ccc;">${emptyStar.repeat(empty)}</span>`;
}

function closeModal() {
    const modalOverlay = document.getElementById('global-modal-overlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function setupHeroCarousel() {
    const track = document.getElementById('hero-slides');
    if (!track) return;

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
    
    const prevBtn = document.getElementById('hero-prev');
    const nextBtn = document.getElementById('hero-next');

    prevBtn.onclick = () => {
        index = (index + 1) % total;
        update();
    };

    nextBtn.onclick = () => {
        index = (index - 1 + total) % total;
        update();
    };

    // Clear existing interval if restarting?
    if (window.heroInterval) clearInterval(window.heroInterval);
    window.heroInterval = setInterval(() => {
        index = (index - 1 + total) % total;
        update();
    }, 5000);
}

// Store interval globally to clear it on language switch re-render
let testimonialInterval;

function setupTestimonials(itemsData) {
    const track = document.getElementById('testimonials-track');
    if (!track) return;

    // Reset content
    track.innerHTML = '';
    track.style.transition = 'none';
    track.style.transform = 'translateX(0)';
    if (testimonialInterval) clearInterval(testimonialInterval);

    // 1. Generate Cards
    const items = [];

    itemsData.forEach(data => {
        const card = document.createElement('div');
        card.className = 'testimonial-card';

        const maxChars = 140;
        let displayText = data.text;
        let isTruncated = false;

        if (displayText.length > maxChars) {
            displayText = displayText.substring(0, maxChars) + '...';
            isTruncated = true;
        }

        const starsHTML = renderStars(data.stars || 5);
        
        // Image handling
        const imgHtml = data.image ? `<img src="${data.image}" class="testimonial-avatar-img">` : `<div class="testimonial-avatar"></div>`;

        card.innerHTML = `
            <div class="testimonial-img-wrapper">${imgHtml}</div>
            <div class="stars">${starsHTML}</div>
            <p class="testimonial-text">"${displayText}"</p>
            ${isTruncated ? '<span class="read-more">Saiba mais...</span>' : ''}
            <div class="testimonial-author">${data.author}</div>
        `;

        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            openModal(data);
        });

        items.push(card);
    });

    if (items.length === 0) return;

    // 2. Clone items for infinite loop
    const itemsToClone = 3; // Ensure itemsData has at least 3 items for this logic to work smoothly

    items.forEach(item => track.appendChild(item));

    const firstClones = items.slice(0, itemsToClone).map(item => {
        const clone = item.cloneNode(true);
        clone.classList.add('clone-first');
        return clone;
    });

    const lastClones = items.slice(-itemsToClone).map(item => {
        const clone = item.cloneNode(true);
        clone.classList.add('clone-last');
        return clone;
    });

    firstClones.forEach(clone => track.appendChild(clone));
    lastClones.reverse().forEach(clone => track.insertBefore(clone, track.firstChild));

    // 3. Carousel State
    let currentIndex = itemsToClone;
    let itemWidth = 0;
    let gap = 32; 
    let isTransitioning = false;

    // 4. Update Dimensions
    function updateDimensions() {
        const card = track.querySelector('.testimonial-card');
        if (card) {
            itemWidth = card.getBoundingClientRect().width;
        }
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

    // 5. Navigation
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

    track.addEventListener('transitionend', () => {
        isTransitioning = false;
        if (currentIndex >= items.length + itemsToClone) {
            track.style.transition = 'none';
            currentIndex = itemsToClone;
            updateTrackPosition(false);
        }
        if (currentIndex < itemsToClone) {
            track.style.transition = 'none';
            currentIndex = items.length + itemsToClone - 1;
            updateTrackPosition(false);
        }
    });

    // Replace listeners
    const nextBtn = document.getElementById('testi-next');
    const prevBtn = document.getElementById('testi-prev');
    
    // Clone buttons to remove old listeners
    const newNext = nextBtn.cloneNode(true);
    const newPrev = prevBtn.cloneNode(true);
    nextBtn.parentNode.replaceChild(newNext, nextBtn);
    prevBtn.parentNode.replaceChild(newPrev, prevBtn);

    newNext.addEventListener('click', () => {
        moveNext();
        resetAutoPlay();
    });

    newPrev.addEventListener('click', () => {
        movePrev();
        resetAutoPlay();
    });

    window.addEventListener('resize', () => {
        updateDimensions();
    });

    function startAutoPlay() {
        testimonialInterval = setInterval(movePrev, 5000);
    }

    function resetAutoPlay() {
        clearInterval(testimonialInterval);
        startAutoPlay();
    }

    setTimeout(() => {
        updateDimensions();
        startAutoPlay();
    }, 100);
}