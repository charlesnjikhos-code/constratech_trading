// CMS Admin Panel - localStorage version (no PHP/MySQL required)

const CMS_STORAGE_KEY = 'constratech_content';
const CMS_AUTH_KEY = 'cms_logged_in';
const CMS_PASSWORD_KEY = 'cms_password';
const DEFAULT_PASSWORD = 'constratech2025';

document.addEventListener('DOMContentLoaded', function () {

    // Auth check
    if (!sessionStorage.getItem(CMS_AUTH_KEY)) {
        window.location.href = 'cms-login.html';
        return;
    }

    loadAllSections();
    setupNavigation();
    setupEventListeners();
    setupScrollBehavior();

    // ========================================
    // DEFAULT CONTENT (mirrors content.json)
    // ========================================

    function getDefaultContent() {
        return {
            company: {
                name: 'Constratech Trading',
                tagline: 'Building Excellence, Powering Progress',
                phone: '+265 99 587 7024',
                email: 'info@constratechtrading.com',
                address: 'House NP/337, Old Naperi, Blantyre',
                logo_path: 'img/logo.jpg'
            },
            hero: {
                title: 'Building Excellence Powering Progress',
                subtitle: 'Leading Construction & Solar Solutions in Malawi',
                description: 'Professional construction services and innovative solar power solutions. Delivering quality projects from concept to completion with over 8 years of industry expertise.',
                cta_text: 'Explore Services',
                cta_link: '#services',
                background_image: ''
            },
            about: {
                title: "Building Malawi's Future, One Project at a Time",
                subtitle: 'About Us',
                description: 'Established in 2015, Constratech Trading has become a trusted name in Malawi\'s construction industry. We are fully registered with all major regulatory bodies including NCIC, Malawi Revenue Authority, PPDA, and the Ministry of Trade.',
                image_path: 'img/About_Us.jpg'
            },
            features: [
                { icon: 'fas fa-hard-hat', title: 'MK 500M Capacity', description: 'Qualified for major civil and building projects across Malawi' },
                { icon: 'fas fa-certificate', title: 'Fully Certified', description: 'NCIC registered in Civil & Building categories' },
                { icon: 'fas fa-users', title: 'Expert Team', description: 'Professional staff delivering quality results' },
                { icon: 'fas fa-handshake', title: 'Trusted Partner', description: '100+ successful projects completed nationwide' }
            ],
            services_section: {
                section_title: 'Comprehensive Construction & Solar Solutions',
                section_subtitle: 'What We Do',
                section_description: 'Constratech Trading delivers excellence across multiple domains. From large-scale construction projects to innovative solar installations, we provide cost-effective, efficient solutions for commercial businesses, homeowners, and international organizations.'
            },
            services: [
                { id: 1, icon: 'fa-solid fa-person-digging', title: 'General Contracting', description: 'Construction of buildings and concrete structures, pavements, and access roads with professional expertise.' },
                { id: 2, icon: 'fa-solid fa-compass-drafting', title: 'Concept & Design', description: 'Complete project management from inception to completion, including licensing, permits, and detailed specifications.' },
                { id: 3, icon: 'fa-solid fa-solar-panel', title: 'Solar Power Solutions', description: 'Design and installation of solar-powered domestic and irrigation water reticulation systems.' },
                { id: 4, icon: 'fa-solid fa-hard-hat', title: 'Construction Consulting', description: 'Tailored consulting solutions and professional engineering design services.' }
            ],
            portfolio_section: {
                section_title: 'Our Project Showcase',
                section_subtitle: 'Portfolio',
                section_description: 'Delivering excellence across construction and solar installations throughout Malawi'
            },
            portfolio: [
                { id: 1, image_path: 'img/project1.2.jpg', category: 'Construction', title: 'Major Infrastructure Project', description: 'Large-scale building construction with modern techniques', is_featured: 1 },
                { id: 2, image_path: 'img/Drill1.jpg', category: 'Drilling', title: 'Water Borehole Drilling', description: 'Professional drilling services', is_featured: 0 },
                { id: 3, image_path: 'img/panel (3).JPG', category: 'Solar Power', title: 'Solar Panel Installation', description: 'Renewable energy solutions', is_featured: 0 },
                { id: 4, image_path: 'img/Excav1.JPEG', category: 'Earthworks', title: 'Excavation Services', description: 'Heavy machinery operations', is_featured: 0 },
                { id: 5, image_path: 'img/Framework1.JPEG', category: 'Construction', title: 'Structural Framework', description: 'Building foundation work', is_featured: 0 },
                { id: 6, image_path: 'img/tank.jpg', category: 'Installation', title: 'Water Tank System', description: 'Water storage solutions', is_featured: 0 }
            ],
            contact: {
                section_title: 'Get In Touch',
                section_subtitle: 'Contact Us',
                section_description: 'Ready to start your project? Contact us today for a free consultation.',
                form_email: 'info@constratechtrading.com'
            },
            footer: {
                description: 'Leading construction and solar power solutions provider in Malawi since 2015.',
                copyright_text: '© 2025 Constratech Trading. All rights reserved.'
            },
            social: { facebook: '#', twitter: '#', linkedin: '#', instagram: '#' }
        };
    }

    // ========================================
    // STORAGE HELPERS
    // ========================================

    function loadContent() {
        const stored = localStorage.getItem(CMS_STORAGE_KEY);
        if (stored) {
            try { return JSON.parse(stored); } catch (e) {}
        }
        return getDefaultContent();
    }

    function saveContent(content) {
        localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(content));
    }

    function getCurrentContent() {
        return loadContent();
    }

    // ========================================
    // NAVIGATION
    // ========================================

    function setupNavigation() {
        document.querySelectorAll('.cms-nav-link').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                switchSection(this.dataset.section);
            });
        });
    }

    function switchSection(section) {
        document.querySelectorAll('.cms-nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
        document.getElementById(`${section}-section`).classList.add('active');

        const titles = {
            dashboard: 'Dashboard', company: 'Company Information', hero: 'Hero Section',
            about: 'About Section', services: 'Services', portfolio: 'Portfolio',
            contact: 'Contact Information', footer: 'Footer Settings', help: 'Help & User Guide'
        };
        document.getElementById('sectionTitle').textContent = titles[section] || section;

        if (section === 'help') loadHelpContent();
    }

    // ========================================
    // LOAD ALL SECTIONS FROM STORAGE
    // ========================================

    function loadAllSections() {
        const content = loadContent();
        loadCompanySection(content.company);
        loadHeroSection(content.hero);
        loadAboutSection(content.about, content.features);
        loadServicesSection(content.services_section, content.services);
        loadPortfolioSection(content.portfolio_section, content.portfolio);
        loadContactSection(content.contact);
        loadFooterSection(content.footer, content.social);
    }

    function loadCompanySection(data) {
        if (!data) return;
        document.getElementById('companyName').value = data.name || '';
        document.getElementById('companyTagline').value = data.tagline || '';
        document.getElementById('companyPhone').value = data.phone || '';
        document.getElementById('companyEmail').value = data.email || '';
        document.getElementById('companyAddress').value = data.address || '';
        document.getElementById('companyLogo').value = data.logo_path || '';
    }

    function loadHeroSection(data) {
        if (!data) return;
        document.getElementById('heroTitle').value = data.title || '';
        document.getElementById('heroSubtitle').value = data.subtitle || '';
        document.getElementById('heroDescription').value = data.description || '';
        document.getElementById('heroCtaText').value = data.cta_text || '';
        document.getElementById('heroCtaLink').value = data.cta_link || '';
        document.getElementById('heroBackgroundImage').value = data.background_image || '';
    }

    function loadAboutSection(about, features) {
        if (!about) return;
        document.getElementById('aboutTitle').value = about.title || '';
        document.getElementById('aboutSubtitle').value = about.subtitle || '';
        document.getElementById('aboutDescription').value = about.description || '';
        document.getElementById('aboutImage').value = about.image_path || '';

        const container = document.getElementById('featuresContainer');
        container.innerHTML = '';
        if (features && features.length > 0) {
            features.forEach((feature, index) => {
                container.innerHTML += `
                    <div class="feature-item">
                        <h4>Feature ${index + 1}</h4>
                        <div class="form-grid">
                            <div class="form-group">
                                <label>Icon Class (e.g., fas fa-certificate)</label>
                                <input type="text" class="form-control feature-icon" value="${feature.icon || ''}">
                            </div>
                            <div class="form-group">
                                <label>Title</label>
                                <input type="text" class="form-control feature-title" value="${feature.title || ''}">
                            </div>
                            <div class="form-group full-width">
                                <label>Description</label>
                                <textarea class="form-control feature-description" rows="2">${feature.description || ''}</textarea>
                            </div>
                        </div>
                    </div>`;
            });
        }
    }

    function loadServicesSection(section, services) {
        if (section) {
            document.getElementById('servicesTitle').value = section.section_title || '';
            document.getElementById('servicesSubtitle').value = section.section_subtitle || '';
            document.getElementById('servicesDescription').value = section.section_description || '';
        }
        const container = document.getElementById('servicesContainer');
        container.innerHTML = '';
        if (services && services.length > 0) {
            services.forEach((service, index) => {
                container.innerHTML += createServiceItem(service, index);
            });
        }
    }

    function createServiceItem(service, index) {
        return `
            <div class="service-item" data-index="${index}">
                <div class="item-header">
                    <h4>Service ${index + 1}</h4>
                    <button class="btn-delete" onclick="deleteServiceItem(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Icon Class</label>
                        <input type="text" class="form-control service-icon" value="${service.icon || ''}">
                    </div>
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" class="form-control service-title" value="${service.title || ''}">
                    </div>
                    <div class="form-group full-width">
                        <label>Description</label>
                        <textarea class="form-control service-description" rows="2">${service.description || ''}</textarea>
                    </div>
                </div>
            </div>`;
    }

    function loadPortfolioSection(section, portfolio) {
        if (section) {
            document.getElementById('portfolioTitle').value = section.section_title || '';
            document.getElementById('portfolioSubtitle').value = section.section_subtitle || '';
            document.getElementById('portfolioDescription').value = section.section_description || '';
        }
        const featured = portfolio ? portfolio.find(p => p.is_featured == 1) : null;
        if (featured) {
            document.getElementById('featuredImage').value = featured.image_path || '';
            document.getElementById('featuredCategory').value = featured.category || '';
            document.getElementById('featuredTitle').value = featured.title || '';
            document.getElementById('featuredDescription').value = featured.description || '';
        }
        const container = document.getElementById('projectsContainer');
        container.innerHTML = '';
        if (portfolio && portfolio.length > 0) {
            portfolio.filter(p => p.is_featured != 1).forEach((project, index) => {
                container.innerHTML += createProjectItem(project, index);
            });
        }
    }

    function createProjectItem(project, index) {
        return `
            <div class="project-item" data-index="${index}">
                <div class="item-header">
                    <h4>Project ${index + 1}</h4>
                    <button class="btn-delete" onclick="deleteProjectItem(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="form-grid">
                    <div class="form-group full-width">
                        <label>Image Path <small style="color:#64748b">(add the image file to your img/ folder, then type the path here)</small></label>
                        <input type="text" class="form-control project-image" value="${project.image_path || ''}" placeholder="e.g. img/myproject.jpg">
                    </div>
                    <div class="form-group">
                        <label>Category</label>
                        <input type="text" class="form-control project-category" value="${project.category || ''}">
                    </div>
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" class="form-control project-title" value="${project.title || ''}">
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <input type="text" class="form-control project-description" value="${project.description || ''}">
                    </div>
                </div>
            </div>`;
    }

    function loadContactSection(data) {
        if (!data) return;
        document.getElementById('contactTitle').value = data.section_title || '';
        document.getElementById('contactSubtitle').value = data.section_subtitle || '';
        document.getElementById('contactDescription').value = data.section_description || '';
        document.getElementById('contactFormEmail').value = data.form_email || '';
    }

    function loadFooterSection(footer, social) {
        if (footer) {
            document.getElementById('footerDescription').value = footer.description || '';
            document.getElementById('footerCopyright').value = footer.copyright_text || '';
        }
        if (social) {
            document.getElementById('socialFacebook').value = social.facebook || '';
            document.getElementById('socialTwitter').value = social.twitter || '';
            document.getElementById('socialLinkedin').value = social.linkedin || '';
            document.getElementById('socialInstagram').value = social.instagram || '';
        }
    }

    // ========================================
    // COLLECT SECTION DATA FROM FORM
    // ========================================

    function collectCompany() {
        return {
            name: document.getElementById('companyName').value,
            tagline: document.getElementById('companyTagline').value,
            phone: document.getElementById('companyPhone').value,
            email: document.getElementById('companyEmail').value,
            address: document.getElementById('companyAddress').value,
            logo_path: document.getElementById('companyLogo').value
        };
    }

    function collectHero() {
        return {
            title: document.getElementById('heroTitle').value,
            subtitle: document.getElementById('heroSubtitle').value,
            description: document.getElementById('heroDescription').value,
            cta_text: document.getElementById('heroCtaText').value,
            cta_link: document.getElementById('heroCtaLink').value,
            background_image: document.getElementById('heroBackgroundImage').value
        };
    }

    function collectAbout() {
        const features = [];
        document.querySelectorAll('.feature-item').forEach(item => {
            features.push({
                icon: item.querySelector('.feature-icon').value,
                title: item.querySelector('.feature-title').value,
                description: item.querySelector('.feature-description').value
            });
        });
        return {
            about: {
                title: document.getElementById('aboutTitle').value,
                subtitle: document.getElementById('aboutSubtitle').value,
                description: document.getElementById('aboutDescription').value,
                image_path: document.getElementById('aboutImage').value
            },
            features
        };
    }

    function collectServices() {
        const services = [];
        document.querySelectorAll('.service-item').forEach((item, i) => {
            services.push({
                id: i + 1,
                icon: item.querySelector('.service-icon').value,
                title: item.querySelector('.service-title').value,
                description: item.querySelector('.service-description').value
            });
        });
        return {
            services_section: {
                section_title: document.getElementById('servicesTitle').value,
                section_subtitle: document.getElementById('servicesSubtitle').value,
                section_description: document.getElementById('servicesDescription').value
            },
            services
        };
    }

    function collectPortfolio() {
        const portfolio = [{
            id: 1,
            image_path: document.getElementById('featuredImage').value,
            category: document.getElementById('featuredCategory').value,
            title: document.getElementById('featuredTitle').value,
            description: document.getElementById('featuredDescription').value,
            is_featured: 1
        }];
        document.querySelectorAll('.project-item').forEach((item, i) => {
            portfolio.push({
                id: i + 2,
                image_path: item.querySelector('.project-image').value,
                category: item.querySelector('.project-category').value,
                title: item.querySelector('.project-title').value,
                description: item.querySelector('.project-description').value,
                is_featured: 0
            });
        });
        return {
            portfolio_section: {
                section_title: document.getElementById('portfolioTitle').value,
                section_subtitle: document.getElementById('portfolioSubtitle').value,
                section_description: document.getElementById('portfolioDescription').value
            },
            portfolio
        };
    }

    function collectContact() {
        return {
            section_title: document.getElementById('contactTitle').value,
            section_subtitle: document.getElementById('contactSubtitle').value,
            section_description: document.getElementById('contactDescription').value,
            form_email: document.getElementById('contactFormEmail').value
        };
    }

    function collectFooter() {
        return {
            footer: {
                description: document.getElementById('footerDescription').value,
                copyright_text: document.getElementById('footerCopyright').value
            },
            social: {
                facebook: document.getElementById('socialFacebook').value,
                twitter: document.getElementById('socialTwitter').value,
                linkedin: document.getElementById('socialLinkedin').value,
                instagram: document.getElementById('socialInstagram').value
            }
        };
    }

    // ========================================
    // SAVE SECTION TO LOCALSTORAGE
    // ========================================

    function saveSection(section) {
        const content = getCurrentContent();

        if (section === 'company') {
            content.company = collectCompany();
        } else if (section === 'hero') {
            content.hero = collectHero();
        } else if (section === 'about') {
            const { about, features } = collectAbout();
            content.about = about;
            content.features = features;
        } else if (section === 'services') {
            const { services_section, services } = collectServices();
            content.services_section = services_section;
            content.services = services;
        } else if (section === 'portfolio') {
            const { portfolio_section, portfolio } = collectPortfolio();
            content.portfolio_section = portfolio_section;
            content.portfolio = portfolio;
        } else if (section === 'contact') {
            content.contact = collectContact();
        } else if (section === 'footer') {
            const { footer, social } = collectFooter();
            content.footer = footer;
            content.social = social;
        }

        saveContent(content);
        showSuccessToast('Saved! Click "Preview Site" to see changes.');
    }

    function saveAllSections() {
        const content = getCurrentContent();
        content.company = collectCompany();
        content.hero = collectHero();
        const { about, features } = collectAbout();
        content.about = about;
        content.features = features;
        const { services_section, services } = collectServices();
        content.services_section = services_section;
        content.services = services;
        const { portfolio_section, portfolio } = collectPortfolio();
        content.portfolio_section = portfolio_section;
        content.portfolio = portfolio;
        content.contact = collectContact();
        const { footer, social } = collectFooter();
        content.footer = footer;
        content.social = social;
        saveContent(content);
        showSuccessToast('All changes saved!');
    }

    // ========================================
    // PUBLISH — write content.json directly to project folder
    // ========================================

    const DIR_HANDLE_KEY = 'constratech_project_dir';

    async function getStoredDirHandle() {
        try {
            const db = await openDirDB();
            return await dbGet(db, DIR_HANDLE_KEY);
        } catch (e) {
            return null;
        }
    }

    async function storeDirHandle(handle) {
        try {
            const db = await openDirDB();
            await dbPut(db, DIR_HANDLE_KEY, handle);
        } catch (e) {}
    }

    function openDirDB() {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open('constratech_cms_db', 1);
            req.onupgradeneeded = e => e.target.result.createObjectStore('handles');
            req.onsuccess = e => resolve(e.target.result);
            req.onerror = () => reject(req.error);
        });
    }

    function dbGet(db, key) {
        return new Promise((resolve, reject) => {
            const tx = db.transaction('handles', 'readonly');
            const req = tx.objectStore('handles').get(key);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    function dbPut(db, key, value) {
        return new Promise((resolve, reject) => {
            const tx = db.transaction('handles', 'readwrite');
            const req = tx.objectStore('handles').put(value, key);
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    }

    async function publishContent() {
        const content = getCurrentContent();
        const json = JSON.stringify(content, null, 2);

        // Use File System Access API if available (Chrome/Edge)
        if (window.showDirectoryPicker) {
            try {
                let dirHandle = await getStoredDirHandle();

                // Check if stored handle still has permission
                if (dirHandle) {
                    const perm = await dirHandle.queryPermission({ mode: 'readwrite' });
                    if (perm !== 'granted') {
                        const req = await dirHandle.requestPermission({ mode: 'readwrite' });
                        if (req !== 'granted') dirHandle = null;
                    }
                }

                // No stored handle — ask user to pick the project folder
                if (!dirHandle) {
                    showSuccessToast('Select your project folder (constratech_trading)…');
                    dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
                    await storeDirHandle(dirHandle);
                }

                // Write content.json directly into the folder
                const fileHandle = await dirHandle.getFileHandle('content.json', { create: true });
                const writable = await fileHandle.createWritable();
                await writable.write(json);
                await writable.close();

                showSuccessToast('content.json saved to your project folder! Now git push to go live.');
                return;
            } catch (e) {
                if (e.name === 'AbortError') return; // user cancelled picker
                console.warn('File System Access API failed, falling back to download', e);
            }
        }

        // Fallback for Safari / unsupported browsers
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'content.json';
        a.click();
        URL.revokeObjectURL(url);
        showSuccessToast('content.json downloaded — move it to your project folder, then git push.');
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================

    function setupEventListeners() {
        // Section save buttons
        document.querySelectorAll('.save-section').forEach(btn => {
            btn.addEventListener('click', function () {
                saveSection(this.dataset.section);
            });
        });

        // Save all
        document.getElementById('saveAllBtn').addEventListener('click', saveAllSections);

        // Preview site
        document.getElementById('refreshPreviewBtn').addEventListener('click', function () {
            window.open('index.html?preview=1', '_blank');
        });

        // Publish button
        document.getElementById('publishBtn').addEventListener('click', publishContent);

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', function () {
            sessionStorage.removeItem(CMS_AUTH_KEY);
            window.location.href = 'cms-login.html';
        });

        // Export data
        document.getElementById('exportBtn').addEventListener('click', publishContent);

        // Import data
        document.getElementById('importBtn').addEventListener('click', function () {
            document.getElementById('importFile').click();
        });
        document.getElementById('importFile').addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function (ev) {
                try {
                    const data = JSON.parse(ev.target.result);
                    saveContent(data);
                    loadAllSections();
                    showSuccessToast('Content imported successfully!');
                } catch (err) {
                    alert('Invalid JSON file. Please import a valid content.json file.');
                }
            };
            reader.readAsText(file);
            this.value = '';
        });

        // Reset to default
        document.getElementById('resetBtn').addEventListener('click', function () {
            if (confirm('Reset all content to defaults? This cannot be undone.')) {
                saveContent(getDefaultContent());
                loadAllSections();
                showSuccessToast('Content reset to defaults.');
            }
        });

        // Add service
        document.getElementById('addServiceBtn').addEventListener('click', function () {
            const container = document.getElementById('servicesContainer');
            const index = container.children.length;
            container.innerHTML += createServiceItem({ icon: 'fas fa-cog', title: 'New Service', description: 'Service description' }, index);
        });

        // Add project
        document.getElementById('addProjectBtn').addEventListener('click', function () {
            const container = document.getElementById('projectsContainer');
            const index = container.children.length;
            container.innerHTML += createProjectItem({ image_path: 'img/project.jpg', category: 'Category', title: 'New Project', description: 'Project description' }, index);
        });
    }

    // ========================================
    // DELETE HELPERS (global for inline onclick)
    // ========================================

    window.deleteServiceItem = function (index) {
        if (confirm('Delete this service?')) {
            const content = getCurrentContent();
            content.services.splice(index, 1);
            saveContent(content);
            loadServicesSection(content.services_section, content.services);
            showSuccessToast('Service deleted.');
        }
    };

    window.deleteProjectItem = function (index) {
        if (confirm('Delete this project?')) {
            const content = getCurrentContent();
            const nonFeatured = content.portfolio.filter(p => p.is_featured != 1);
            nonFeatured.splice(index, 1);
            const featured = content.portfolio.filter(p => p.is_featured == 1);
            content.portfolio = [...featured, ...nonFeatured];
            saveContent(content);
            loadPortfolioSection(content.portfolio_section, content.portfolio);
            showSuccessToast('Project deleted.');
        }
    };

    // ========================================
    // TOAST & SCROLL
    // ========================================

    function showSuccessToast(message) {
        const toast = document.getElementById('successToast');
        toast.querySelector('span').textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
    }

    function setupScrollBehavior() {
        let lastScrollTop = 0;
        let scrollTimeout;
        const sidebar = document.querySelector('.cms-sidebar');
        if (!sidebar) return;

        window.addEventListener('scroll', function () {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function () {
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                if (window.innerWidth <= 480) {
                    if (currentScroll > lastScrollTop && currentScroll > 60) {
                        sidebar.classList.add('nav-hidden');
                    } else {
                        sidebar.classList.remove('nav-hidden');
                    }
                } else {
                    sidebar.classList.remove('nav-hidden');
                }
                lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
            }, 100);
        }, { passive: true });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 480) sidebar.classList.remove('nav-hidden');
        });
    }

    // ========================================
    // HELP & FAQ
    // ========================================

    const faqData = [
        { category: 'getting-started', question: 'How does this CMS work?', answer: '<p>The CMS saves your changes to your browser\'s local storage. When you\'re happy with your changes, click <strong>Publish to Website</strong> to download a <code>content.json</code> file. Commit and push that file to GitHub — the live site updates in about 1 minute.</p>' },
        { category: 'getting-started', question: 'What sections can I edit?', answer: '<p>Company Info, Hero, About, Services, Portfolio, Contact, and Footer.</p>' },
        { category: 'getting-started', question: 'Will my changes break the website?', answer: '<p>No. Your changes are saved locally in your browser. The live website only updates when you push a new <code>content.json</code> to GitHub.</p>' },
        { category: 'content', question: 'How do I save my changes?', answer: '<p>Click the <strong>Save</strong> button at the bottom of each section. Then use <strong>Preview Site</strong> to check, and <strong>Publish to Website</strong> when ready to go live.</p>' },
        { category: 'content', question: 'How do I preview my changes?', answer: '<p>Click <strong>Preview Site</strong> in the top bar. This opens your website in a new tab with your unsaved/saved changes visible.</p>' },
        { category: 'content', question: 'How do I publish to the live website?', answer: '<ol><li>Click <strong>Publish to Website</strong> — this downloads <code>content.json</code></li><li>Move the downloaded file into your project folder (replacing the old one)</li><li>Run: <code>git add content.json && git commit -m "update content" && git push</code></li><li>Wait ~1 minute — done!</li></ol>' },
        { category: 'images', question: 'How do I change images?', answer: '<p>Add your image file to the <code>img/</code> folder in the project, then type the path (e.g. <code>img/myimage.jpg</code>) into the image path field and save.</p>' },
        { category: 'troubleshooting', question: 'My changes disappeared', answer: '<p>Changes are saved in your browser\'s localStorage. They can be lost if you clear your browser data. Use <strong>Publish to Website</strong> regularly to keep a backup in <code>content.json</code>.</p>' },
        { category: 'troubleshooting', question: 'The preview shows old content', answer: '<p>Make sure you clicked <strong>Save</strong> first, then re-open or hard-refresh the preview tab (Ctrl+Shift+R).</p>' },
        { category: 'login', question: 'How do I change my password?', answer: '<p>Currently the password is set in <code>cms-login.html</code>. Open that file, find the line <code>const STORED_PASSWORD</code> and change it. Then push to GitHub.</p>' }
    ];

    function loadHelpContent(category = 'all', searchTerm = '') {
        const helpContent = document.getElementById('helpContent');
        if (!helpContent) return;

        let filtered = faqData;
        if (category !== 'all') filtered = filtered.filter(f => f.category === category);
        if (searchTerm) filtered = filtered.filter(f =>
            f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.answer.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filtered.length === 0) {
            helpContent.innerHTML = '<div class="no-results"><i class="fas fa-search"></i><p>No results found.</p></div>';
            return;
        }

        helpContent.innerHTML = filtered.map((faq, i) => `
            <div class="faq-item" data-faq-id="${i}">
                <div class="faq-question"><span>${faq.question}</span><i class="fas fa-chevron-down"></i></div>
                <div class="faq-answer"><div class="faq-answer-content">${faq.answer}</div></div>
            </div>`).join('');

        document.querySelectorAll('.faq-question').forEach(q => {
            q.addEventListener('click', function () {
                this.closest('.faq-item').classList.toggle('open');
            });
        });
    }

    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('help-cat-btn') || e.target.closest('.help-cat-btn')) {
            const btn = e.target.closest('.help-cat-btn');
            document.querySelectorAll('.help-cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadHelpContent(btn.dataset.category, document.getElementById('helpSearch')?.value || '');
        }
    });

    const helpSearch = document.getElementById('helpSearch');
    if (helpSearch) {
        helpSearch.addEventListener('input', function () {
            const cat = document.querySelector('.help-cat-btn.active')?.dataset.category || 'all';
            loadHelpContent(cat, this.value);
        });
    }
});
