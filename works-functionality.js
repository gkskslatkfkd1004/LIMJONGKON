
// ============================
// Works Section - Netflix Style
// ============================
// Works Section - Netflix Style
// ============================

let slideshowInterval = null;


document.addEventListener('DOMContentLoaded', () => {
    // Render Works List
    const worksList = document.getElementById('works-list');

    if (worksList && typeof WORKS_DATA !== 'undefined') {
        renderWorksList();
    }

    // Modal functionality
    setupWorkModal();
});

// Render Works List from Data
function renderWorksList() {
    const worksList = document.getElementById('works-list');

    WORKS_DATA.forEach(work => {
        const card = createWorkCard(work);
        worksList.appendChild(card);
    });
}

// Create Work Card Element
function createWorkCard(work) {
    const card = document.createElement('div');
    card.className = 'work-card';
    card.setAttribute('data-slug', work.slug);

    // Build tags HTML
    const tagsHTML = work.tags && work.tags.length > 0
        ? `<div class="work-card-tags">
            ${work.tags.slice(0, 3).map(tag => `<span class="work-tag">${tag}</span>`).join('')}
           </div>`
        : '';

    // Check if work has Director credit
    const hasDirectorCredit = work.credits && work.credits.some(credit => credit.role === "Director" && /Jongkon|Lim/i.test(credit.name));
    const metaLine = `${work.year}${work.runtime ? ' · ' + work.runtime : ''} · ${work.format}${work.genre ? ' · ' + work.genre : ''} · ${work.role}${hasDirectorCredit ? ' · Director' : ''}`;

    card.innerHTML = `
        <div class="work-card-image">
            <img 
                src="${work.hero_still_url}" 
                alt="${work.title}" 
                loading="lazy"
                decoding="async"
            >
        </div>
        <div class="work-card-info">
            <h3 class="work-card-title">${work.title}</h3>
            <p class="work-card-meta">${metaLine}</p>
            <p class="work-card-logline">${work.logline}</p>
            ${tagsHTML}
            <div class="work-card-cta">
                <button class="work-cta-button" data-slug="${work.slug}">View Details</button>
            </div>
        </div>
    `;

    return card;
}

// Setup Work Modal
function setupWorkModal() {
    const modal = document.getElementById('work-modal');
    if (!modal) return;

    const backdrop = modal.querySelector('.modal-backdrop');
    const closeBtn = modal.querySelector('.modal-close');
    const panel = modal.querySelector('.modal-panel');

    // Open modal when CTA button clicked
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('work-cta-button')) {
            const slug = e.target.getAttribute('data-slug');
            openWorkModal(slug);
        }
    });

    // Close modal handlers
    closeBtn.addEventListener('click', closeWorkModal);
    backdrop.addEventListener('click', closeWorkModal);

    // ESC key handler
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display !== 'none') {
            closeWorkModal();
        }
    });

    // Focus trap
    modal.addEventListener('keydown', trapFocus);
}

// Open Work Modal
function openWorkModal(slug) {
    const work = WORKS_DATA.find(w => w.slug === slug);
    if (!work) return;

    const modal = document.getElementById('work-modal');
    const panel = modal.querySelector('.modal-panel');

    // Populate modal content
    populateModalContent(work);

    // Show modal
    modal.style.display = 'flex';
    panel.classList.remove('modal-exit');

    // Lock body scroll
    document.body.style.overflow = 'hidden';

    // Set focus to close button
    setTimeout(() => {
        modal.querySelector('.modal-close').focus();
    }, 100);
}

// Close Work Modal
function closeWorkModal() {
    const modal = document.getElementById('work-modal');
    const panel = modal.querySelector('.modal-panel');

    // Add exit animation
    panel.classList.add('modal-exit');

    // Hide modal after animation
    setTimeout(() => {
        modal.style.display = 'none';
        panel.classList.remove('modal-exit');
        stopSlideshow(); // Ensure slideshow stops

        // Unlock body scroll
        document.body.style.overflow = '';
    }, 260);
}

// Populate Modal Content
function populateModalContent(work) {
    // Hero: Video or Still
    const heroContainer = document.getElementById('modal-hero');
    heroContainer.innerHTML = '';

    if (work.trailer_url && work.trailer_url.trim() !== '') {
        // Has trailer - create video element
        const video = document.createElement('video');
        video.controls = true;
        video.preload = 'metadata';
        video.playsInline = true;
        video.src = work.trailer_url;

        // Fallback to still if video fails to load
        video.addEventListener('error', () => {
            heroContainer.innerHTML = `<img src="${work.hero_still_url}" alt="${work.title}">`;
        });

        heroContainer.appendChild(video);
    } else {
        // No trailer - use hero still
        heroContainer.innerHTML = `<img src="${work.hero_still_url}" alt="${work.title}">`;
    }

    // Title & Meta
    document.getElementById('modal-title').textContent = work.title;

    // Check if work has Director credit
    const hasDirectorCredit = work.credits && work.credits.some(credit => credit.role === "Director" && /Jongkon|Lim/i.test(credit.name));
    const metaLine = `${work.year}${work.runtime ? ' · ' + work.runtime : ''} · ${work.format}${work.genre ? ' · ' + work.genre : ''} · ${work.role}${hasDirectorCredit ? ' · Director' : ''}`;

    document.querySelector('.modal-meta').textContent = metaLine;

    // Synopsis
    document.getElementById('modal-synopsis').textContent = work.synopsis;

    // Contribution
    const contributionList = document.getElementById('modal-contribution');
    contributionList.innerHTML = work.contribution_bullets
        .map(bullet => `<li>${bullet}</li>`)
        .join('');

    // Credits
    const creditsSection = document.getElementById('modal-credits-section');
    const creditsContainer = document.getElementById('modal-credits');

    if (work.credits && work.credits.length > 0) {
        creditsSection.style.display = 'block';
        creditsContainer.innerHTML = work.credits
            .map(credit => `
                <div class="modal-credit-item">
                    <div class="modal-credit-role">${credit.role}</div>
                    <div class="modal-credit-name">${credit.name}</div>
                </div>
            `)
            .join('');
    } else {
        creditsSection.style.display = 'none';
    }

    // Stills Gallery
    const stillsSection = document.getElementById('modal-stills-section');
    const stillsGrid = document.getElementById('modal-stills');

    if (work.stills && work.stills.length > 0) {
        stillsSection.style.display = 'block';

        // Enable Slideshow Mode
        stillsGrid.classList.add('slideshow-active');

        stillsGrid.innerHTML = work.stills
            .map((still, index) => `
                <div class="modal-still-item ${index === 0 ? 'active' : ''}">
                    <img src="${still}" alt="${work.title} still" loading="lazy" decoding="async">
                </div>
            `)
            .join('');

        // Start Slideshow Loop if multiple images
        if (work.stills.length > 1) {
            startSlideshow();
        }
    } else {
        stillsSection.style.display = 'none';
        stillsGrid.classList.remove('slideshow-active');
        stopSlideshow();
    }
}

// Focus Trap for Modal
function trapFocus(e) {
    const modal = document.getElementById('work-modal');
    if (modal.style.display === 'none') return;

    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
}

// Slideshow Management
function startSlideshow() {
    stopSlideshow(); // Clear any existing interval

    slideshowInterval = setInterval(() => {
        const grid = document.getElementById('modal-stills');
        if (!grid) return;

        const items = grid.querySelectorAll('.modal-still-item');
        if (items.length < 2) return;

        // Find current active index
        let activeIndex = -1;
        items.forEach((item, index) => {
            if (item.classList.contains('active')) {
                activeIndex = index;
            }
        });

        // Determine next index
        const nextIndex = (activeIndex + 1) % items.length;

        // Transition: Remove active from current, Add to next
        if (activeIndex !== -1) items[activeIndex].classList.remove('active');
        items[nextIndex].classList.add('active');

    }, 4000); // 4 seconds per slide
}

function stopSlideshow() {
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
    }
}
