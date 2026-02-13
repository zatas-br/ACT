
let currentLang = 'pt';
// We will access 'translations' which is defined in data.js (loaded before main.js)

document.addEventListener('DOMContentLoaded', () => {
    loadContent(currentLang);
    setupHeroCarousel();
    setupSmoothScroll();
    handlePageLoader();
    setupModal();
    setupScrollAnimation();
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    window.addEventListener('resize', adjustMissionCardsHeight);
});

function adjustMissionCardsHeight() {
    const referenceCard = document.querySelector('.mission-content-wrapper.reference-card');
    const expandables = document.querySelectorAll('.mission-content-wrapper.expandable-card');
    const continueReadingBtn = document.querySelector('.continue-reading');
    
    if (referenceCard && expandables.length > 0) {
        // We use scrollHeight to get the full height of the content
        let height = referenceCard.scrollHeight;
        
        // Subtract the button height to make the total card height match the reference
        if (continueReadingBtn) {
            const btnStyles = window.getComputedStyle(continueReadingBtn);
            const btnHeight = continueReadingBtn.offsetHeight + parseFloat(btnStyles.marginTop) + parseFloat(btnStyles.marginBottom);
            height -= btnHeight;
        }

        expandables.forEach(card => {
            // Apply the height limit
            card.style.maxHeight = `${height}px`;
        });
    }
}

function updateHeaderHeight() {
    const header = document.querySelector('header');
    if (header) {
        const height = header.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${height}px`);
    }
}

function setupScrollAnimation() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, observerOptions);

    // Function to observe new elements
    window.observeScrollElements = () => {
        const elements = document.querySelectorAll('.fade-up:not(.visible)');
        elements.forEach(el => observer.observe(el));
    };

    // Initial observation
    window.observeScrollElements();
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
    const footerLogo = document.getElementById('footer-logo');
    if (footerLogo) footerLogo.style.display = 'none';

    const footerText = document.getElementById('footer-text');
    if (footerText) footerText.innerHTML = content.footer.text;

    // --- Contact (Shared) ---
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
            } else if (item.type === 'copy') {
                return `
                    <div class="contact-item contact-item-copy" data-value="${item.value}" style="cursor: pointer;">
                        <img src="${item.icon}" alt="${item.text}" class="contact-icon">
                        <span>${item.text}</span>
                    </div>
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

        // Attach event listeners for copy buttons
        const copyItems = contactContainer.querySelectorAll('.contact-item-copy');
        copyItems.forEach(btn => {
            btn.addEventListener('click', () => {
                const value = btn.getAttribute('data-value');
                if (value) {
                    navigator.clipboard.writeText(value).then(() => {
                        showToast('Email copiado com sucesso!');
                    }).catch(err => {
                        console.error('Failed to copy text: ', err);
                    });
                }
            });
        });
    }

    // --- Home Specific ---
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
        loadHomeContent(content);
        // Trigger scroll observer update after content load
        if (window.observeScrollElements) window.observeScrollElements();
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
    if (expertiseIntro) {
        let visibleContent = '';
        let hiddenContent = '';
        let splitFound = false;
        const triggerSubstring = "Ao longo dessa jornada";

        home.expertises.paragraphs.forEach(p => {
            const isRawHtml = p.trim().startsWith('<');
            const formattedP = isRawHtml ? p : `<p>${p}</p>`;
            
            if (p.includes(triggerSubstring)) {
                if (isRawHtml) {
                    visibleContent += p + `<span id="expertise-show-more-trigger" style="cursor: pointer; color: var(--secondary-color); font-weight: bold; margin-left: 0.5rem;">Saiba mais...</span>`;
                } else {
                    // Inject span inside the paragraph for inline effect
                    visibleContent += `<p>${p} <span id="expertise-show-more-trigger" style="cursor: pointer; color: var(--secondary-color); font-weight: bold; margin-left: 0.5rem;">Saiba mais...</span></p>`;
                }
                splitFound = true;
            } else if (splitFound) {
                hiddenContent += formattedP;
            } else {
                visibleContent += formattedP;
            }
        });

        if (splitFound) {
            expertiseIntro.innerHTML = `
                ${visibleContent}
                <div id="expertise-hidden-content">
                    ${hiddenContent}
                    <p id="expertise-show-less-trigger" style="cursor: pointer; color: var(--secondary-color); font-weight: bold; margin-top: 1rem;">Mostrar menos</p>
                </div>
            `;
            
            // Add Event Listeners
            const showMoreBtn = document.getElementById('expertise-show-more-trigger');
            const showLessBtn = document.getElementById('expertise-show-less-trigger');
            const hiddenDiv = document.getElementById('expertise-hidden-content');

            if (showMoreBtn && hiddenDiv) {
                showMoreBtn.addEventListener('click', () => {
                    hiddenDiv.classList.add('expanded');
                    showMoreBtn.style.display = 'none';
                });
            }

            if (showLessBtn && hiddenDiv && showMoreBtn) {
                showLessBtn.addEventListener('click', () => {
                    hiddenDiv.classList.remove('expanded');
                    showMoreBtn.style.display = 'inline-block';
                    showMoreBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                });
            }

        } else {
            // Fallback if text not found (e.g. English version or data changed)
            expertiseIntro.innerHTML = home.expertises.paragraphs.map(p => p.trim().startsWith('<') ? p : `<p>${p}</p>`).join('');
        }
    }
    
    renderCards('expertise-grid', home.expertises.items);

    // Testimonials Title
    const testiTitle = document.getElementById('testimonials-title');
    if (testiTitle) testiTitle.innerText = home.testimonials.title;

    // Re-setup testimonials carousel with new data
    setupTestimonials(home.testimonials.items);
}

function loadAboutPageContent(content) {
    const about = content.about;

    const histTitle = document.getElementById('history-title');
    if (histTitle) histTitle.innerText = about.history.title;
    
    const histContent = document.getElementById('history-content');
    if (histContent) {
        let historyHtml = about.history.content.join('');
        
        if (about.history.cardsIntro) {
            historyHtml += `<p class="transition-text" style="font-size: 1.1em; margin: 2.5rem 0 1.5rem;">${about.history.cardsIntro}</p>`;
        }

        if (about.history.cardsTitle) {
            // Updated style to match "PILARES" (color: secondary, margin-top: 1.5rem) exactly
            historyHtml += `<h3 style="margin-top: 1.5rem; color: var(--secondary-color);">${about.history.cardsTitle}</h3>`;
        }

        if (about.history.cards && about.history.cards.length > 0) {
            const cardsHtml = about.history.cards.map(card => `
                <div class="alexandre-card">
                    ${card.icon}
                    <p>${card.text}</p>
                </div>
            `).join('');
            historyHtml += `<div class="alexandre-grid">${cardsHtml}</div>`;
        }

        histContent.innerHTML = historyHtml;
    }

    const alexTitle = document.getElementById('alexandre-title');
    if (alexTitle) alexTitle.innerText = about.alexandre.title;
    
    const alexContent = document.getElementById('alexandre-content');
    if (alexContent) {
        alexContent.innerHTML = `<p>${about.alexandre.content}</p>`;
    }

    const mvvContainer = document.getElementById('mission-vision-values');
    if (mvvContainer) {
        mvvContainer.innerHTML = `
            <div class="mission-grid">
                <div class="mission-card">
                    <img src="img/png/1.png" alt="ACT Logo" class="mission-logo">
                    <h3 class="mission-title">${about.mission.missionTitle}</h3>
                    <div class="mission-content-wrapper">
                        <p class="mission-text">${about.mission.missionText}</p>
                    </div>
                </div>

                <div class="mission-card">
                    <img src="img/png/1.png" alt="ACT Logo" class="mission-logo">
                    <h3 class="mission-title">${about.mission.visionTitle}</h3>
                    <div class="mission-content-wrapper">
                        <p class="mission-text">${about.mission.visionText}</p>
                    </div>
                </div>

                <div class="mission-card">
                    <img src="img/png/1.png" alt="ACT Logo" class="mission-logo">
                    <h3 class="mission-title">${about.mission.valuesTitle}</h3>
                    <div class="mission-content-wrapper">
                        ${about.mission.valuesText ? 
                            `<div class="mission-text">${about.mission.valuesText}</div>` : 
                            `<ul class="mission-list">${about.mission.valuesList.map(v => `<li>${v}</li>`).join('')}</ul>`
                        }
                    </div>
                </div>
            </div>
        `;
        
        // Adjust height after render to ensure styles are applied
        setTimeout(() => {
            adjustMissionCardsHeight();
            setupMobileMissionToggle();
        }, 100);
    }
}

function setupMobileMissionToggle() {
    console.log("Setting up mobile mission toggle");
    const expandables = document.querySelectorAll('.mission-card');
    
    expandables.forEach(card => {
        // Only target cards with the continue-reading button
        const btn = card.querySelector('.continue-reading');
        if (btn) {
            btn.addEventListener('click', (e) => {
                console.log("Continue reading clicked. Width: " + window.innerWidth);
                // Prevent interference if desktop hover is active (though click works)
                if (window.innerWidth <= 1024) { // Target mobile/tablet
                    e.stopPropagation();
                    const isExpanded = card.classList.contains('mobile-expanded');
                    
                    // Close others
                    document.querySelectorAll('.mission-card.mobile-expanded').forEach(other => {
                        if (other !== card) other.classList.remove('mobile-expanded');
                    });

                    if (isExpanded) {
                        card.classList.remove('mobile-expanded');
                        btn.innerText = 'Continue lendo';
                    } else {
                        card.classList.add('mobile-expanded');
                        btn.innerText = 'Fechar';
                    }
                }
            });
            
            // Allow clicking the content to close if expanded
            const content = card.querySelector('.mission-content-wrapper');
            if (content) {
                content.addEventListener('click', () => {
                     if (window.innerWidth <= 1024 && card.classList.contains('mobile-expanded')) {
                         card.classList.remove('mobile-expanded');
                         if (btn) btn.innerText = 'Continue lendo';
                     }
                });
            }
        }
    });
}

function renderCards(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ''; 

    items.forEach(item => {
        const textToTruncate = item.shortDescription || item.description || "";
        const excerpt = textToTruncate.length > 100 ? textToTruncate.substring(0, 100) + "..." : textToTruncate;

        const card = document.createElement('div');
        card.className = 'card fade-up';
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

function showToast(message) {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        toast.className = 'toast-notification';
        
        // Optional icon
        const icon = `<svg class="toast-icon" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
        
        document.body.appendChild(toast);
    }
    
    // Reset content with icon
    toast.innerHTML = `<svg class="toast-icon" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> <span>${message}</span>`;
    
    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function closeModal() {
    const modalOverlay = document.getElementById('global-modal-overlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        // Wait for transition to finish before restoring overflow
        setTimeout(() => {
            if (!modalOverlay.classList.contains('active')) {
                document.body.style.overflow = '';
            }
        }, 300);
    }
}

function setupHeroCarousel() {
    const track = document.getElementById('hero-slides');
    if (!track) return;

    const images = [
        "img/Capas/1.png", "img/Capas/2.png", "img/Capas/3.png", "img/Capas/4.png",
        "img/Capas/5.png", "img/Capas/6.png", "img/Capas/7.png"
    ];

    // 1. Generate Slides (Basic)
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

    // 2. Clone first and last slides for infinite loop
    const originalSlides = Array.from(track.children);
    const firstClone = originalSlides[0].cloneNode(true);
    const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);

    track.appendChild(firstClone);
    track.insertBefore(lastClone, track.firstChild);

    // 3. State
    let currentIndex = 1; // Start at first real slide (index 1 because of prepended clone)
    const totalRealSlides = images.length;
    let isTransitioning = false;

    // 4. Initial Position
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    function updateTrack(enableTransition = true) {
        if (enableTransition) {
            track.style.transition = 'transform 0.5s ease-in-out';
        } else {
            track.style.transition = 'none';
        }
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    const slideNext = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex++;
        updateTrack(true);
    };

    const slidePrev = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex--;
        updateTrack(true);
    };

    // 5. Handle Transition End (Infinite Loop Jump)
    track.addEventListener('transitionend', () => {
        isTransitioning = false;
        if (currentIndex === 0) {
            // Jump to real last slide
            currentIndex = totalRealSlides;
            updateTrack(false);
        } else if (currentIndex === totalRealSlides + 1) {
            // Jump to real first slide
            currentIndex = 1;
            updateTrack(false);
        }
    });

    // 6. Controls
    const prevBtn = document.getElementById('hero-prev');
    const nextBtn = document.getElementById('hero-next');

    // Remove old listeners if any by cloning (simple reset)
    const newPrev = prevBtn.cloneNode(true);
    const newNext = nextBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrev, prevBtn);
    nextBtn.parentNode.replaceChild(newNext, nextBtn);

    newPrev.addEventListener('click', () => {
        slidePrev();
        resetAutoPlay();
    });

    newNext.addEventListener('click', () => {
        slideNext();
        resetAutoPlay();
    });

    // 7. Auto Play (Always move next for LTR effect if desired, or Prev for RTL)
    // User asked for "same as testimonials", which moves left (slides go left),
    // effectively showing the NEXT item on the right.
    function startAutoPlay() {
        if (window.heroInterval) clearInterval(window.heroInterval);
        window.heroInterval = setInterval(slideNext, 5000);
    }

    function resetAutoPlay() {
        clearInterval(window.heroInterval);
        startAutoPlay();
    }

    startAutoPlay();
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
        // Assign index for event delegation
        card.setAttribute('data-index', items.length);

        items.push(card);
    });

    if (items.length === 0) return;

    // Event Delegation for clicks (handles clones too)
    track.addEventListener('click', (e) => {
        const card = e.target.closest('.testimonial-card');
        if (card) {
            const index = card.getAttribute('data-index');
            if (index !== null && itemsData[index]) {
                openModal(itemsData[index]);
            }
        }
    });

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
        testimonialInterval = setInterval(moveNext, 5000);
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