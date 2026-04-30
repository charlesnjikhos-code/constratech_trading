// CMS Content Loader - localStorage/content.json version
// Reads from localStorage when ?preview=1 (CMS preview), otherwise fetches content.json

const CMS_STORAGE_KEY = 'constratech_content';
const isPreview = new URLSearchParams(window.location.search).get('preview') === '1';

async function getCMSContent() {
    if (isPreview) {
        const stored = localStorage.getItem(CMS_STORAGE_KEY);
        if (stored) {
            try { return JSON.parse(stored); } catch (e) {}
        }
    }
    try {
        const response = await fetch('content.json?v=' + Date.now());
        if (response.ok) return await response.json();
    } catch (e) {
        // content.json not available — page shows hardcoded HTML as fallback
    }
    return null;
}

async function loadPageContent() {
    const content = await getCMSContent();
    if (!content) return;

    // Company info
    if (content.company) {
        const c = content.company;

        document.querySelectorAll('.img-logo').forEach(el => {
            if (c.logo_path) { el.src = c.logo_path; el.alt = c.name; }
        });

        document.querySelectorAll('a[href^="tel"]').forEach(el => {
            if (c.phone) {
                el.href = 'tel:' + c.phone.replace(/\s/g, '');
                const txt = el.querySelector('span') || el.childNodes[el.childNodes.length - 1];
                if (txt) txt.textContent = c.phone;
            }
        });

        document.querySelectorAll('a[href^="mailto"]').forEach(el => {
            if (c.email) {
                el.href = 'mailto:' + c.email;
                const txt = el.querySelector('span') || el.childNodes[el.childNodes.length - 1];
                if (txt) txt.textContent = c.email;
            }
        });

        document.querySelectorAll('.footer-contact li').forEach(li => {
            const icon = li.querySelector('i');
            if (!icon) return;
            const span = li.querySelector('span');
            if (!span) return;
            if (icon.classList.contains('fa-phone') && c.phone) span.textContent = c.phone;
            if (icon.classList.contains('fa-envelope') && c.email) span.textContent = c.email;
            if (icon.classList.contains('fa-map-marker') && c.address) span.textContent = c.address;
        });
    }

    // Hero section
    if (content.hero) {
        const h = content.hero;
        const title = document.querySelector('.hero-title');
        const subtitle = document.querySelector('.hero-subtitle');
        const desc = document.querySelector('.hero-description');
        const ctaBtn = document.querySelector('.btn-hero-primary');

        if (title && h.title) title.textContent = h.title;
        if (subtitle && h.subtitle) subtitle.textContent = h.subtitle;
        if (desc && h.description) desc.textContent = h.description;
        if (ctaBtn) {
            if (h.cta_text) ctaBtn.innerHTML = '<i class="fas fa-play-circle"></i> ' + h.cta_text;
            if (h.cta_link) ctaBtn.href = h.cta_link;
        }
    }

    // About section
    if (content.about) {
        const a = content.about;
        const title = document.querySelector('.intro-text .section-title');
        const tag = document.querySelector('.intro-text .section-tag');
        const desc = document.querySelector('.intro-text .intro-description');
        const img = document.querySelector('.intro-image img');

        if (title && a.title) title.textContent = a.title;
        if (tag && a.subtitle) tag.textContent = a.subtitle;
        if (desc && a.description) {
            desc.innerHTML = a.description;
        }
        if (img && a.image_path) img.src = a.image_path;
    }

    // Feature boxes
    if (content.features && content.features.length > 0) {
        const boxes = document.querySelectorAll('.feature-box');
        boxes.forEach((box, i) => {
            if (!content.features[i]) return;
            const f = content.features[i];
            const icon = box.querySelector('.feature-icon i');
            const title = box.querySelector('h3');
            const desc = box.querySelector('p');
            if (icon && f.icon) icon.className = f.icon;
            if (title && f.title) title.textContent = f.title;
            if (desc && f.description) desc.textContent = f.description;
        });
    }

    // Services section header
    if (content.services_section) {
        const ss = content.services_section;
        const title = document.querySelector('.services-header .section-title');
        const tag = document.querySelector('.services-header .section-tag');
        const desc = document.querySelector('.services-header .section-description');
        if (title && ss.section_title) title.textContent = ss.section_title;
        if (tag && ss.section_subtitle) tag.textContent = ss.section_subtitle;
        if (desc && ss.section_description) desc.textContent = ss.section_description;
    }

    // Service cards
    if (content.services && content.services.length > 0) {
        const cards = document.querySelectorAll('.service');
        cards.forEach((card, i) => {
            if (!content.services[i]) return;
            const s = content.services[i];
            const icon = card.querySelector('.icon-wrapper i');
            const title = card.querySelector('.service-name');
            const desc = card.querySelector('p');
            if (icon && s.icon) icon.className = s.icon;
            if (title && s.title) title.textContent = s.title;
            if (desc && s.description) desc.textContent = s.description;
        });
    }

    // Portfolio section header
    if (content.portfolio_section) {
        const ps = content.portfolio_section;
        const title = document.querySelector('.portfolio-header .section-title');
        const tag = document.querySelector('.portfolio-header .section-tag');
        const desc = document.querySelector('.portfolio-header .section-description');
        if (title && ps.section_title) title.textContent = ps.section_title;
        if (tag && ps.section_subtitle) tag.textContent = ps.section_subtitle;
        if (desc && ps.section_description) desc.textContent = ps.section_description;
    }

    // Portfolio cards
    if (content.portfolio && content.portfolio.length > 0) {
        const featured = content.portfolio.find(p => p.is_featured == 1);
        const rest = content.portfolio.filter(p => p.is_featured != 1);

        const featuredCard = document.querySelector('.portfolio-card.featured');
        if (featuredCard && featured) {
            const img = featuredCard.querySelector('img');
            const cat = featuredCard.querySelector('.project-category');
            const title = featuredCard.querySelector('h3');
            const desc = featuredCard.querySelector('p');
            if (img && featured.image_path) { img.src = featured.image_path; img.alt = featured.title; }
            if (cat && featured.category) cat.textContent = featured.category;
            if (title && featured.title) title.textContent = featured.title;
            if (desc && featured.description) desc.textContent = featured.description;
        }

        const regularCards = document.querySelectorAll('.portfolio-card:not(.featured)');
        regularCards.forEach((card, i) => {
            if (!rest[i]) return;
            const p = rest[i];
            const img = card.querySelector('img');
            const cat = card.querySelector('.project-category');
            const title = card.querySelector('h3');
            const desc = card.querySelector('p');
            if (img && p.image_path) { img.src = p.image_path; img.alt = p.title; }
            if (cat && p.category) cat.textContent = p.category;
            if (title && p.title) title.textContent = p.title;
            if (desc && p.description) desc.textContent = p.description;
        });
    }

    // Footer
    if (content.footer) {
        const desc = document.querySelector('.footer-description');
        const copy = document.querySelector('.footer-bottom p');
        if (desc && content.footer.description) desc.textContent = content.footer.description;
        if (copy && content.footer.copyright_text) copy.textContent = content.footer.copyright_text;
    }

    // Social links
    if (content.social) {
        const links = document.querySelectorAll('.social-links a');
        links.forEach(link => {
            const label = (link.getAttribute('aria-label') || '').toLowerCase();
            if (label && content.social[label]) link.href = content.social[label];
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPageContent);
} else {
    loadPageContent();
}
