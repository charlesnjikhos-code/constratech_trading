// CMS Content Management System for Constratech Trading
// PHP/MySQL Backend Version - Fetches content from database via API

class ContentManager {
    constructor() {
        this.apiBase = 'api/content.php';
        this.contentCache = null;
    }

    // Fetch content from API
    async fetchContent(section = 'all') {
        try {
            const response = await fetch(`${this.apiBase}?section=${section}`);
            const result = await response.json();
            
            if (result.success) {
                if (section === 'all') {
                    this.contentCache = result.data;
                }
                return result.data;
            } else {
                console.error('API Error:', result.message);
                return null;
            }
        } catch (error) {
            console.error('Fetch error:', error);
            return null;
        }
    }

    // Get all content
    async getContent() {
        if (!this.contentCache) {
            this.contentCache = await this.fetchContent('all');
        }
        return this.contentCache;
    }

    // Get specific section
    async getSection(section) {
        return await this.fetchContent(section);
    }
}

// Initialize CMS
const cms = new ContentManager();

// Load content into page
async function loadPageContent() {
    try {
        const content = await cms.getContent();
        if (!content) {
            console.error('Failed to load content');
            return;
        }

        // Load Company Info
        if (content.company) {
            // Update logo
            const logos = document.querySelectorAll('.img-logo');
            logos.forEach(logo => {
                if (content.company.logo_path) {
                    logo.src = content.company.logo_path;
                    logo.alt = content.company.name;
                }
            });

            // Update phone numbers
            const phoneLinks = document.querySelectorAll('a[href^="tel"]');
            phoneLinks.forEach(link => {
                const firstPhone = content.company.phone.split('/')[0].trim();
                link.href = `tel:${firstPhone}`;
                const textNode = link.childNodes[link.childNodes.length - 1];
                if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                    textNode.textContent = content.company.phone;
                }
            });

            // Update email
            const emailLinks = document.querySelectorAll('a[href^="mailto"]');
            emailLinks.forEach(link => {
                link.href = `mailto:${content.company.email}`;
                const textNode = link.childNodes[link.childNodes.length - 1];
                if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                    textNode.textContent = content.company.email;
                }
            });
        }

        // Load Hero Section
        if (content.hero) {
            const heroTitle = document.querySelector('.hero-content h1');
            const heroSubtitle = document.querySelector('.hero-content .hero-subtitle');
            const heroDescription = document.querySelector('.hero-content p:not(.hero-subtitle)');
            const heroBtn = document.querySelector('.hero-btn');

            if (heroTitle) heroTitle.textContent = content.hero.title;
            if (heroSubtitle) heroSubtitle.textContent = content.hero.subtitle;
            if (heroDescription) heroDescription.textContent = content.hero.description;
            if (heroBtn) {
                heroBtn.textContent = content.hero.cta_text;
                heroBtn.href = content.hero.cta_link;
            }
        }

        // Load About Section
        if (content.about) {
            const aboutTitle = document.querySelector('.about-content h2');
            const aboutSubtitle = document.querySelector('.about-content .section-subtitle');
            const aboutDescription = document.querySelector('.about-content .about-description');
            const aboutImage = document.querySelector('.about-image img');

            if (aboutTitle) aboutTitle.textContent = content.about.title;
            if (aboutSubtitle) aboutSubtitle.textContent = content.about.subtitle;
            if (aboutDescription) aboutDescription.textContent = content.about.description;
            if (aboutImage) aboutImage.src = content.about.image_path;
        }

        // Load Feature Boxes
        if (content.features && content.features.length > 0) {
            const featureBoxes = document.querySelectorAll('.feature-box');
            featureBoxes.forEach((box, index) => {
                if (content.features[index]) {
                    const feature = content.features[index];
                    const icon = box.querySelector('.feature-icon i');
                    const title = box.querySelector('h3');
                    const desc = box.querySelector('p');

                    if (icon) icon.className = feature.icon;
                    if (title) title.textContent = feature.title;
                    if (desc) desc.textContent = feature.description;
                }
            });
        }

        // Load Services Section
        if (content.services_section) {
            const servicesTitle = document.querySelector('.services-header .section-title');
            const servicesTag = document.querySelector('.services-header .section-tag');
            const servicesDesc = document.querySelector('.services-header .section-description');

            if (servicesTitle) servicesTitle.textContent = content.services_section.section_title;
            if (servicesTag) servicesTag.textContent = content.services_section.section_subtitle;
            if (servicesDesc) servicesDesc.textContent = content.services_section.section_description;
        }

        // Load Service Items
        if (content.services && content.services.length > 0) {
            const serviceCards = document.querySelectorAll('.service');
            serviceCards.forEach((card, index) => {
                if (content.services[index]) {
                    const service = content.services[index];
                    const icon = card.querySelector('.icon-wrapper i');
                    const title = card.querySelector('.service-name');
                    const desc = card.querySelector('p');

                    if (icon) icon.className = service.icon;
                    if (title) title.textContent = service.title;
                    if (desc) desc.textContent = service.description;
                }
            });
        }

        // Load Portfolio Section
        if (content.portfolio_section) {
            const portfolioTitle = document.querySelector('.portfolio-header .section-title');
            const portfolioTag = document.querySelector('.portfolio-header .section-tag');
            const portfolioDesc = document.querySelector('.portfolio-header .section-description');

            if (portfolioTitle) portfolioTitle.textContent = content.portfolio_section.section_title;
            if (portfolioTag) portfolioTag.textContent = content.portfolio_section.section_subtitle;
            if (portfolioDesc) portfolioDesc.textContent = content.portfolio_section.section_description;
        }

        // Load Portfolio Items
        if (content.portfolio && content.portfolio.length > 0) {
            // Featured project
            const featuredCard = document.querySelector('.portfolio-card.featured');
            const featured = content.portfolio.find(p => p.is_featured == 1) || content.portfolio[0];
            
            if (featuredCard && featured) {
                const img = featuredCard.querySelector('img');
                const category = featuredCard.querySelector('.project-category');
                const title = featuredCard.querySelector('h3');
                const desc = featuredCard.querySelector('p');

                if (img) img.src = featured.image_path;
                if (category) category.textContent = featured.category;
                if (title) title.textContent = featured.title;
                if (desc) desc.textContent = featured.description;
            }

            // Regular portfolio cards
            const regularCards = document.querySelectorAll('.portfolio-card:not(.featured)');
            const regularProjects = content.portfolio.filter(p => p.is_featured != 1);
            
            regularCards.forEach((card, index) => {
                if (regularProjects[index]) {
                    const project = regularProjects[index];
                    const img = card.querySelector('img');
                    const category = card.querySelector('.project-category');
                    const title = card.querySelector('h3');
                    const desc = card.querySelector('p');

                    if (img) img.src = project.image_path;
                    if (category) category.textContent = project.category;
                    if (title) title.textContent = project.title;
                    if (desc) desc.textContent = project.description;
                }
            });
        }

        // Load Contact Section
        if (content.contact) {
            const contactTitle = document.querySelector('.contact-header h2');
            const contactSubtitle = document.querySelector('.contact-header .section-tag');
            const contactDesc = document.querySelector('.contact-header p');

            if (contactTitle) contactTitle.textContent = content.contact.section_title;
            if (contactSubtitle) contactSubtitle.textContent = content.contact.section_subtitle;
            if (contactDesc) contactDesc.textContent = content.contact.section_description;
        }

        // Load Footer
        if (content.footer) {
            const footerDesc = document.querySelector('.footer-about p');
            const copyright = document.querySelector('.footer-bottom p, .copyright p');

            if (footerDesc) footerDesc.textContent = content.footer.description;
            if (copyright) copyright.textContent = content.footer.copyright_text;
        }

        // Load Social Media
        if (content.social) {
            const socialLinks = document.querySelectorAll('.social-links a');
            socialLinks.forEach(link => {
                const platform = link.classList[0]; // Assumes first class is platform name
                if (content.social[platform]) {
                    link.href = content.social[platform];
                }
            });
        }

    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// Auto-load content when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPageContent);
} else {
    loadPageContent();
}
