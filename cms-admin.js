// CMS Admin Panel Controller - PHP/MySQL Version
// Makes AJAX calls to PHP API endpoints

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkAuthentication();
    
    // Initialize
    loadAllSections();
    setupNavigation();
    setupEventListeners();
    setupScrollBehavior();

    // Navigation Setup
    function setupNavigation() {
        const navLinks = document.querySelectorAll('.cms-nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const section = this.dataset.section;
                switchSection(section);
            });
        });
    }

    function switchSection(section) {
        // Update nav active state
        document.querySelectorAll('.cms-nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Update content sections
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.getElementById(`${section}-section`).classList.add('active');

        // Update title
        const titles = {
            dashboard: 'Dashboard',
            company: 'Company Information',
            hero: 'Hero Section',
            about: 'About Section',
            services: 'Services',
            portfolio: 'Portfolio',
            contact: 'Contact Information',
            footer: 'Footer Settings',
            users: 'User Management',
            help: 'Help & User Guide'
        };
        document.getElementById('sectionTitle').textContent = titles[section];

        // Load help content if help section
        if (section === 'help') {
            loadHelpContent();
        }

        // Load users if users section
        if (section === 'users') {
            console.log('Loading users section...');
            loadUsers();
        }
    }

    // Check authentication
    async function checkAuthentication() {
        try {
            const response = await fetch('api/auth.php?action=check');
            const result = await response.json();
            
            if (!result.success) {
                window.location.href = 'cms-login.html';
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            window.location.href = 'cms-login.html';
        }
    }

    // Load all sections
    async function loadAllSections() {
        try {
            const response = await fetch('api/content.php?section=all');
            const result = await response.json();
            
            if (result.success) {
                const content = result.data;
                loadCompanySection(content.company);
                loadHeroSection(content.hero);
                loadAboutSection(content.about, content.features);
                loadServicesSection(content.services_section, content.services);
                loadPortfolioSection(content.portfolio_section, content.portfolio);
                loadContactSection(content.contact);
                loadFooterSection(content.footer, content.social);
            } else {
                showError('Failed to load content: ' + result.message);
            }
        } catch (error) {
            showError('Error loading content: ' + error.message);
        }
    }

    // Load Company Section
    function loadCompanySection(data) {
        if (!data) return;
        document.getElementById('companyName').value = data.name || '';
        document.getElementById('companyTagline').value = data.tagline || '';
        document.getElementById('companyPhone').value = data.phone || '';
        document.getElementById('companyEmail').value = data.email || '';
        document.getElementById('companyAddress').value = data.address || '';
        document.getElementById('companyLogo').value = data.logo_path || '';
    }

    // Load Hero Section
    function loadHeroSection(data) {
        if (!data) return;
        document.getElementById('heroTitle').value = data.title || '';
        document.getElementById('heroSubtitle').value = data.subtitle || '';
        document.getElementById('heroDescription').value = data.description || '';
        document.getElementById('heroCtaText').value = data.cta_text || '';
        document.getElementById('heroCtaLink').value = data.cta_link || '';
        document.getElementById('heroBackgroundImage').value = data.background_image || '';
    }

    // Load About Section
    function loadAboutSection(about, features) {
        if (!about) return;
        document.getElementById('aboutTitle').value = about.title || '';
        document.getElementById('aboutSubtitle').value = about.subtitle || '';
        document.getElementById('aboutDescription').value = about.description || '';
        document.getElementById('aboutImage').value = about.image_path || '';

        // Load features
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
                    </div>
                `;
            });
        }
    }

    // Load Services Section
    function loadServicesSection(section, services) {
        if (section) {
            document.getElementById('servicesTitle').value = section.section_title || '';
            document.getElementById('servicesSubtitle').value = section.section_subtitle || '';
            document.getElementById('servicesDescription').value = section.section_description || '';
        }

        // Load service items
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
            <div class="service-item" data-id="${service.id || ''}" data-index="${index}">
                <div class="item-header">
                    <h4>Service ${index + 1}</h4>
                    <button class="btn-delete" onclick="deleteService(${service.id || 0})">
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
            </div>
        `;
    }

    // Load Portfolio Section
    function loadPortfolioSection(section, portfolio) {
        if (section) {
            document.getElementById('portfolioTitle').value = section.section_title || '';
            document.getElementById('portfolioSubtitle').value = section.section_subtitle || '';
            document.getElementById('portfolioDescription').value = section.section_description || '';
        }

        // Featured project
        const featured = portfolio ? portfolio.find(p => p.is_featured == 1) : null;
        if (featured) {
            document.getElementById('featuredImage').value = featured.image_path || '';
            document.getElementById('featuredCategory').value = featured.category || '';
            document.getElementById('featuredTitle').value = featured.title || '';
            document.getElementById('featuredDescription').value = featured.description || '';
        }

        // Load projects
        const container = document.getElementById('projectsContainer');
        container.innerHTML = '';
        if (portfolio && portfolio.length > 0) {
            portfolio.filter(p => p.is_featured != 1).forEach((project, index) => {
                container.innerHTML += createProjectItem(project, index);
            });
        }
    }

    function createProjectItem(project, index) {
        const previewId = `projectImagePreview${index}`;
        const uploadId = `projectImageUpload${index}`;
        
        return `
            <div class="project-item" data-id="${project.id || ''}" data-index="${index}">
                <div class="item-header">
                    <h4>Project ${index + 1}</h4>
                    <button class="btn-delete" onclick="deleteProject(${project.id || 0})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="form-grid">
                    <div class="form-group full-width">
                        <label>Image</label>
                        <div class="image-upload-group">
                            <input type="text" class="form-control project-image" value="${project.image_path || ''}" placeholder="Image path" readonly>
                            <input type="file" id="${uploadId}" class="project-image-upload" data-preview-id="${previewId}" accept="image/*" style="display: none;">
                            <button type="button" class="btn-secondary upload-btn" onclick="document.getElementById('${uploadId}').click()">
                                <i class="fas fa-upload"></i> Upload Image
                            </button>
                            <div class="image-preview ${project.image_path ? '' : 'empty'}" id="${previewId}">
                                ${project.image_path ? `<img src="${project.image_path}" alt="Project image">` : ''}
                            </div>
                        </div>
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
            </div>
        `;
    }

    // Load Contact Section
    function loadContactSection(data) {
        if (!data) return;
        document.getElementById('contactTitle').value = data.section_title || '';
        document.getElementById('contactSubtitle').value = data.section_subtitle || '';
        document.getElementById('contactDescription').value = data.section_description || '';
        document.getElementById('contactFormEmail').value = data.form_email || '';
    }

    // Load Footer Section
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

    // Save functions
    async function saveCompanySection() {
        const data = {
            name: document.getElementById('companyName').value,
            tagline: document.getElementById('companyTagline').value,
            phone: document.getElementById('companyPhone').value,
            email: document.getElementById('companyEmail').value,
            address: document.getElementById('companyAddress').value,
            logo_path: document.getElementById('companyLogo').value
        };
        
        await saveToAPI('company', data);
    }

    async function saveHeroSection() {
        const data = {
            title: document.getElementById('heroTitle').value,
            subtitle: document.getElementById('heroSubtitle').value,
            description: document.getElementById('heroDescription').value,
            cta_text: document.getElementById('heroCtaText').value,
            cta_link: document.getElementById('heroCtaLink').value,
            background_image: document.getElementById('heroBackgroundImage').value
        };
        
        await saveToAPI('hero', data);
    }

    async function saveAboutSection() {
        const features = [];
        document.querySelectorAll('.feature-item').forEach(item => {
            features.push({
                icon: item.querySelector('.feature-icon').value,
                title: item.querySelector('.feature-title').value,
                description: item.querySelector('.feature-description').value
            });
        });

        const aboutData = {
            title: document.getElementById('aboutTitle').value,
            subtitle: document.getElementById('aboutSubtitle').value,
            description: document.getElementById('aboutDescription').value,
            image_path: document.getElementById('aboutImage').value
        };
        
        await saveToAPI('about', aboutData);
        await saveToAPI('features', features);
    }

    async function saveServicesSection() {
        const sectionData = {
            section_title: document.getElementById('servicesTitle').value,
            section_subtitle: document.getElementById('servicesSubtitle').value,
            section_description: document.getElementById('servicesDescription').value
        };
        
        const services = [];
        document.querySelectorAll('.service-item').forEach(item => {
            services.push({
                id: item.dataset.id || null,
                icon: item.querySelector('.service-icon').value,
                title: item.querySelector('.service-title').value,
                description: item.querySelector('.service-description').value
            });
        });

        await saveToAPI('services-section', sectionData);
        await saveToAPI('services', services);
    }

    async function savePortfolioSection() {
        const sectionData = {
            section_title: document.getElementById('portfolioTitle').value,
            section_subtitle: document.getElementById('portfolioSubtitle').value,
            section_description: document.getElementById('portfolioDescription').value
        };
        
        const portfolio = [];
        
        // Add featured project
        portfolio.push({
            image_path: document.getElementById('featuredImage').value,
            category: document.getElementById('featuredCategory').value,
            title: document.getElementById('featuredTitle').value,
            description: document.getElementById('featuredDescription').value,
            is_featured: 1
        });
        
        // Add regular projects
        document.querySelectorAll('.project-item').forEach(item => {
            portfolio.push({
                id: item.dataset.id || null,
                image_path: item.querySelector('.project-image').value,
                category: item.querySelector('.project-category').value,
                title: item.querySelector('.project-title').value,
                description: item.querySelector('.project-description').value,
                is_featured: 0
            });
        });

        await saveToAPI('portfolio-section', sectionData);
        await saveToAPI('portfolio', portfolio);
    }

    async function saveContactSection() {
        const data = {
            section_title: document.getElementById('contactTitle').value,
            section_subtitle: document.getElementById('contactSubtitle').value,
            section_description: document.getElementById('contactDescription').value,
            form_email: document.getElementById('contactFormEmail').value
        };
        
        await saveToAPI('contact', data);
    }

    async function saveFooterSection() {
        const footerData = {
            description: document.getElementById('footerDescription').value,
            copyright_text: document.getElementById('footerCopyright').value
        };
        
        const socialData = {
            facebook: document.getElementById('socialFacebook').value,
            twitter: document.getElementById('socialTwitter').value,
            linkedin: document.getElementById('socialLinkedin').value,
            instagram: document.getElementById('socialInstagram').value
        };
        
        await saveToAPI('footer', footerData);
        await saveToAPI('social', socialData);
    }

    // Generic save to API
    async function saveToAPI(section, data) {
        try {
            const response = await fetch(`api/content.php?section=${section}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showSuccessToast(result.message || 'Saved successfully!');
            } else {
                showError(result.message || 'Failed to save');
            }
        } catch (error) {
            showError('Error saving: ' + error.message);
        }
    }

    // Event Listeners
    function setupEventListeners() {
        // Save buttons
        document.querySelectorAll('.save-section').forEach(btn => {
            btn.addEventListener('click', function() {
                const section = this.dataset.section;
                const saveFunctions = {
                    company: saveCompanySection,
                    hero: saveHeroSection,
                    about: saveAboutSection,
                    services: saveServicesSection,
                    portfolio: savePortfolioSection,
                    contact: saveContactSection,
                    footer: saveFooterSection
                };
                if (saveFunctions[section]) {
                    saveFunctions[section]();
                }
            });
        });

        // Save all button
        document.getElementById('saveAllBtn').addEventListener('click', async function() {
            await saveCompanySection();
            await saveHeroSection();
            await saveAboutSection();
            await saveServicesSection();
            await savePortfolioSection();
            await saveContactSection();
            await saveFooterSection();
            showSuccessToast('All changes saved successfully!');
        });

        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', async function() {
            try {
                await fetch('api/auth.php?action=logout');
                window.location.href = 'cms-login.html';
            } catch (error) {
                console.error('Logout error:', error);
                window.location.href = 'cms-login.html';
            }
        });

        // Add service button
        document.getElementById('addServiceBtn').addEventListener('click', function() {
            const container = document.getElementById('servicesContainer');
            const index = container.children.length;
            const newService = {
                id: null,
                icon: 'fas fa-cog',
                title: 'New Service',
                description: 'Service description'
            };
            container.innerHTML += createServiceItem(newService, index);
        });

        // Add project button
        document.getElementById('addProjectBtn').addEventListener('click', function() {
            const container = document.getElementById('projectsContainer');
            const index = container.children.length;
            const newProject = {
                id: null,
                image_path: 'img/project.jpg',
                category: 'Category',
                title: 'New Project',
                description: 'Project description'
            };
            container.innerHTML += createProjectItem(newProject, index);
        });
    }

    // Global delete functions
    window.deleteService = async function(id) {
        if (confirm('Delete this service?')) {
            try {
                const response = await fetch(`api/content.php?section=services&id=${id}`, {
                    method: 'DELETE'
                });
                const result = await response.json();
                if (result.success) {
                    loadAllSections();
                    showSuccessToast('Service deleted!');
                }
            } catch (error) {
                showError('Error deleting service');
            }
        }
    };

    window.deleteProject = async function(id) {
        if (confirm('Delete this project?')) {
            try {
                const response = await fetch(`api/content.php?section=portfolio&id=${id}`, {
                    method: 'DELETE'
                });
                const result = await response.json();
                if (result.success) {
                    loadAllSections();
                    showSuccessToast('Project deleted!');
                }
            } catch (error) {
                showError('Error deleting project');
            }
        }
    };

    // Success toast
    function showSuccessToast(message = 'Changes saved successfully!') {
        const toast = document.getElementById('successToast');
        toast.querySelector('span').textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Error message
    function showError(message) {
        alert('Error: ' + message);
        console.error(message);
    }

    // ========================================
    // IMAGE UPLOAD FUNCTIONALITY
    // ========================================

    /**
     * Setup image upload handlers
     */
    function setupImageUpload() {
        // Featured image upload
        const featuredImageUpload = document.getElementById('featuredImageUpload');
        if (featuredImageUpload) {
            featuredImageUpload.addEventListener('change', function() {
                handleImageUpload(this, 'featuredImage', 'featuredImagePreview');
            });
        }

        // Listen for dynamically added project image uploads
        document.addEventListener('change', function(e) {
            if (e.target.classList.contains('project-image-upload')) {
                const projectItem = e.target.closest('.project-item');
                const pathInput = projectItem.querySelector('.project-image');
                const previewId = e.target.getAttribute('data-preview-id');
                handleImageUpload(e.target, null, previewId, pathInput);
            }
        });
    }

    /**
     * Handle image file upload
     */
    async function handleImageUpload(fileInput, pathInputId, previewId, customPathInput) {
        const file = fileInput.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            showError('Please select an image file');
            fileInput.value = '';
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            showError('Image file size must be less than 5MB');
            fileInput.value = '';
            return;
        }

        try {
            // Show uploading state
            const pathInput = customPathInput || document.getElementById(pathInputId);
            if (pathInput) {
                pathInput.value = 'Uploading...';
                pathInput.disabled = true;
            }

            // Create form data
            const formData = new FormData();
            formData.append('image', file);

            // Upload to server
            const response = await fetch('api/upload.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                // Update path input
                if (pathInput) {
                    pathInput.value = result.data.path;
                    pathInput.disabled = false;
                }

                // Show preview
                showImagePreview(result.data.path, previewId);
                
                showSuccessToast('Image uploaded successfully!');
            } else {
                throw new Error(result.message || 'Upload failed');
            }
        } catch (error) {
            showError('Error uploading image: ' + error.message);
            const pathInput = customPathInput || document.getElementById(pathInputId);
            if (pathInput) {
                pathInput.value = '';
                pathInput.disabled = false;
            }
        }

        // Reset file input
        fileInput.value = '';
    }

    /**
     * Show image preview
     */
    function showImagePreview(imagePath, previewId) {
        const preview = document.getElementById(previewId);
        if (preview) {
            preview.innerHTML = `<img src="${imagePath}" alt="Preview">`;
            preview.classList.remove('empty');
        }
    }



    // Initialize image upload when page loads
    setupImageUpload();

    // ========================================
    // RESPONSIVE SCROLL BEHAVIOR
    // ========================================

    function setupScrollBehavior() {
        let lastScrollTop = 0;
        let scrollTimeout;
        const sidebar = document.querySelector('.cms-sidebar');
        const header = document.querySelector('.cms-header');
        
        if (!sidebar) return;

        window.addEventListener('scroll', function() {
            // Clear previous timeout
            clearTimeout(scrollTimeout);
            
            // Set timeout to add scrolling class
            scrollTimeout = setTimeout(function() {
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                
                // Only apply on mobile (check if sidebar has mobile styles)
                if (window.innerWidth <= 480) {
                    if (currentScroll > lastScrollTop && currentScroll > 60) {
                        // Scrolling down
                        sidebar.classList.add('nav-hidden');
                        if (header) header.style.marginTop = '0';
                    } else {
                        // Scrolling up
                        sidebar.classList.remove('nav-hidden');
                    }
                } else {
                    // Remove class on desktop
                    sidebar.classList.remove('nav-hidden');
                }
                
                lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
            }, 100);
        }, { passive: true });

        // Also handle on resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 480) {
                sidebar.classList.remove('nav-hidden');
                if (header) header.style.marginTop = '';
            }
        });
    }

    // ========================================
    // HELP & FAQ SYSTEM
    // ========================================

    const faqData = [
        {
            category: 'getting-started',
            question: 'What is the CMS?',
            answer: '<p>The CMS (Content Management System) is a web-based admin panel that lets you edit all your website content without touching any code. You can update text, images, services, portfolio items, and more.</p>'
        },
        {
            category: 'getting-started',
            question: 'What do I need to use the CMS?',
            answer: '<p>You need:</p><ul><li>XAMPP running (Apache and MySQL services)</li><li>A web browser (Chrome, Firefox, Edge)</li><li>Your login credentials</li><li>Internet connection (for icons and fonts)</li></ul>'
        },
        {
            category: 'login',
            question: 'What are the default login credentials?',
            answer: '<p><strong>Username:</strong> <code>admin</code><br><strong>Password:</strong> <code>constratech2025</code></p><div class="alert alert-warning">⚠️ <strong>IMPORTANT:</strong> Change these credentials after first login for security!</div>'
        },
        {
            category: 'login',
            question: 'I forgot my password, what do I do?',
            answer: '<p>Run this command in MySQL to reset to default:</p><pre>UPDATE admin_users \nSET password_hash = \'$2y$10$PbONpiQu0PJTn0Hfe1zbJuZwRvLQF2XvnxjhEgs198brJvQ/2/KxK\' \nWHERE username = \'admin\';</pre><p>Then login with password: <code>constratech2025</code></p>'
        },
        {
            category: 'login',
            question: 'Why can\'t I login?',
            answer: '<p>Check these:</p><ul><li>Is XAMPP running? (Both Apache and MySQL must be green)</li><li>Are you using the correct credentials?</li><li>Clear your browser cache and try again</li><li>Check browser console (F12) for error messages</li></ul>'
        },
        {
            category: 'content',
            question: 'How do I save my changes?',
            answer: '<p>Click the blue <strong>"Save"</strong> button at the bottom of each section. Changes are saved to the database and appear on the website immediately.</p>'
        },
        {
            category: 'content',
            question: 'Do changes appear immediately on the website?',
            answer: '<p>Yes! Once you click Save, refresh your website to see the changes. Use <strong>Ctrl+F5</strong> for a hard refresh if needed.</p>'
        },
        {
            category: 'content',
            question: 'What sections can I edit?',
            answer: '<p>You can edit:</p><ul><li><strong>Company Info:</strong> Name, tagline, contact details, logo</li><li><strong>Hero Section:</strong> Main banner text, images, buttons</li><li><strong>About Section:</strong> Company story, features, images</li><li><strong>Services:</strong> All service offerings</li><li><strong>Portfolio:</strong> Projects and gallery images</li><li><strong>Contact Info:</strong> Phone, email, address, map</li><li><strong>Footer:</strong> Social media links, copyright text</li></ul>'
        },
        {
            category: 'images',
            question: 'How do I upload images?',
            answer: '<p>Follow these steps:</p><ol><li>Navigate to the section (e.g., Portfolio)</li><li>Click the <strong>"Upload Image"</strong> button</li><li>Select your image file (JPG, PNG, GIF, or WebP)</li><li>Wait for upload confirmation</li><li>Image path will auto-fill</li><li>Click "Save" to apply changes</li></ol>'
        },
        {
            category: 'images',
            question: 'What image formats are supported?',
            answer: '<p>Supported formats:</p><ul><li>JPEG/JPG</li><li>PNG</li><li>GIF</li><li>WebP</li></ul><p><strong>Maximum file size:</strong> 5MB per image</p>'
        },
        {
            category: 'images',
            question: 'Why is my uploaded image not showing?',
            answer: '<p>Check these:</p><ul><li>Did you click "Save" after uploading?</li><li>Refresh your website page (Ctrl+F5)</li><li>Check browser console for errors (F12)</li><li>Verify the image uploaded (check uploads/ folder)</li><li>Make sure XAMPP Apache is running</li></ul>'
        },
        {
            category: 'images',
            question: 'Where are uploaded images stored?',
            answer: '<p>All uploaded images are saved in the <code>uploads/</code> folder with unique filenames to prevent conflicts.</p><p>Full path: <code>c:\\xampp\\htdocs\\constratech_trading\\uploads\\</code></p>'
        },
        {
            category: 'portfolio',
            question: 'How do I add a new portfolio project?',
            answer: '<p>Follow these steps:</p><ol><li>Login to CMS</li><li>Click <strong>"Portfolio"</strong> in sidebar</li><li>Click <strong>"Add Project"</strong> button</li><li>Click <strong>"Upload Image"</strong> and select your image</li><li>Fill in Category, Title, Description</li><li>Click <strong>"Save Portfolio"</strong></li></ol>'
        },
        {
            category: 'portfolio',
            question: 'What\'s a Featured Project?',
            answer: '<p>The Featured Project is displayed prominently on your homepage. It\'s larger than other projects. You should use your best/most important project here.</p>'
        },
        {
            category: 'portfolio',
            question: 'How many portfolio items can I have?',
            answer: '<p>Unlimited! But the homepage shows only the first 6 items. All items appear on the gallery page.</p>'
        },
        {
            category: 'portfolio',
            question: 'Can I organize projects by category?',
            answer: '<p>Yes! Enter categories like:</p><ul><li>Construction</li><li>Solar Installation</li><li>Drilling</li><li>Excavation</li><li>Infrastructure</li></ul><p>Categories appear as tags on the website.</p>'
        },
        {
            category: 'troubleshooting',
            question: 'The CMS is loading but nothing happens when I click buttons',
            answer: '<p>Try these solutions:</p><ul><li>Check browser console (F12) for JavaScript errors</li><li>Clear browser cache (Ctrl+Shift+Delete)</li><li>Make sure JavaScript is enabled</li><li>Try a different browser</li></ul>'
        },
        {
            category: 'troubleshooting',
            question: 'I get "Failed to save" error',
            answer: '<p>Check these:</p><ul><li>Is MySQL running in XAMPP?</li><li>Verify database connection in api/config.php</li><li>Check browser console for specific error</li><li>Ensure api/ folder has proper permissions</li></ul>'
        },
        {
            category: 'troubleshooting',
            question: 'Images show in CMS but not on website',
            answer: '<p>Try these fixes:</p><ul><li>Hard refresh website (Ctrl+F5)</li><li>Check image paths don\'t have typos</li><li>Verify images exist in uploads/ folder</li><li>Check browser console for 404 errors</li><li>Ensure Apache is running</li></ul>'
        },
        {
            category: 'troubleshooting',
            question: 'Changes aren\'t saving',
            answer: '<p>Verify:</p><ul><li>Click the correct "Save" button for that section</li><li>Wait for success message</li><li>Check MySQL is running</li><li>Look for error messages in browser console</li></ul>'
        }
    ];

    function loadHelpContent(category = 'all', searchTerm = '') {
        const helpContent = document.getElementById('helpContent');
        if (!helpContent) return;

        let filteredFAQs = faqData;

        // Filter by category
        if (category !== 'all') {
            filteredFAQs = filteredFAQs.filter(faq => faq.category === category);
        }

        // Filter by search term
        if (searchTerm) {
            filteredFAQs = filteredFAQs.filter(faq => 
                faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filteredFAQs.length === 0) {
            helpContent.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>No results found. Try a different search or category.</p>
                </div>
            `;
            return;
        }

        helpContent.innerHTML = filteredFAQs.map((faq, index) => `
            <div class="faq-item" data-faq-id="${index}">
                <div class="faq-question">
                    <span>${faq.question}</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        ${faq.answer}
                    </div>
                </div>
            </div>
        `).join('');

        // Add click handlers
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', function() {
                const faqItem = this.closest('.faq-item');
                faqItem.classList.toggle('open');
            });
        });
    }

    // Help section event listeners
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('help-cat-btn')) {
            document.querySelectorAll('.help-cat-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            const category = e.target.dataset.category;
            const searchTerm = document.getElementById('helpSearch')?.value || '';
            loadHelpContent(category, searchTerm);
        }
    });

    const helpSearch = document.getElementById('helpSearch');
    if (helpSearch) {
        helpSearch.addEventListener('input', function() {
            const category = document.querySelector('.help-cat-btn.active')?.dataset.category || 'all';
            loadHelpContent(category, this.value);
        });
    }

    // ========================================
    // USER MANAGEMENT
    // ========================================

    async function loadUsers() {
        console.log('loadUsers function called');
        try {
            const response = await fetch('api/auth.php?action=get-users', {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Response status:', response.status);
            const result = await response.json();
            console.log('API Result:', result);

            if (result.success && result.data) {
                console.log('Users data:', result.data);
                displayUsers(result.data);
            } else {
                console.log('No users or error:', result.message);
                document.getElementById('usersContainer').innerHTML = `<p>${result.message || 'No users found or unable to load users.'}</p>`;
            }
        } catch (error) {
            console.error('Error loading users:', error);
            document.getElementById('usersContainer').innerHTML = '<p>Error loading users. Check console for details.</p>';
        }
    }

    function displayUsers(users) {
        const container = document.getElementById('usersContainer');
        
        if (!users || users.length === 0) {
            container.innerHTML = '<p>No users found.</p>';
            return;
        }

        container.innerHTML = users.map(user => `
            <div class="user-card">
                <div class="user-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="user-info">
                    <h3>${user.full_name || user.username}</h3>
                    <p class="user-email">${user.email || 'No email'}</p>
                    <p class="user-username"><i class="fas fa-user"></i> ${user.username}</p>
                    <p class="user-date"><i class="fas fa-calendar"></i> Joined: ${formatDate(user.created_at)}</p>
                    ${user.last_login ? `<p class="user-last-login"><i class="fas fa-clock"></i> Last login: ${formatDate(user.last_login)}</p>` : ''}
                </div>
                <div class="user-status">
                    <span class="status-badge ${user.is_active ? 'active' : 'inactive'}">
                        ${user.is_active ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>
        `).join('');
    }

    function formatDate(dateString) {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }

    // Refresh users button
    const refreshUsersBtn = document.getElementById('refreshUsersBtn');
    if (refreshUsersBtn) {
        refreshUsersBtn.addEventListener('click', loadUsers);
    }
});
