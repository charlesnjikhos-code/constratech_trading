-- Constratech Trading CMS Database Schema
-- Created: December 2025
-- MySQL Database

-- Create database
CREATE DATABASE IF NOT EXISTS constratech_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE constratech_cms;

-- =============================================
-- 1. COMPANY INFORMATION TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS company_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    tagline VARCHAR(500),
    phone VARCHAR(100),
    email VARCHAR(255),
    address TEXT,
    logo_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default company info
INSERT INTO company_info (name, tagline, phone, email, address, logo_path) VALUES
('Constratech Trading', 
 'Building Excellence, Powering the Future',
 '+265 (0) 999 962 370 / +265 (0) 888 962 370',
 'info@constratechtrading.com',
 'P.O BOX 2936, Blantyre, Malawi',
 'img/logo.jpg');

-- =============================================
-- 2. HERO SECTION TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS hero_section (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(500) NOT NULL,
    subtitle VARCHAR(500),
    description TEXT,
    cta_text VARCHAR(100),
    cta_link VARCHAR(500),
    background_image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default hero section
INSERT INTO hero_section (title, subtitle, description, cta_text, cta_link, background_image) VALUES
('Building Excellence, Powering the Future',
 'Leading construction and solar solutions provider in Malawi',
 'Delivering innovative infrastructure projects and sustainable energy solutions across the nation',
 'Get Started',
 '#contact',
 'img/hero-bg.jpg');

-- =============================================
-- 3. ABOUT SECTION TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS about_section (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(500) NOT NULL,
    subtitle VARCHAR(500),
    description TEXT,
    image_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default about section
INSERT INTO about_section (title, subtitle, description, image_path) VALUES
('Building Malawi\'s Future',
 'Professional Construction & Solar Solutions',
 'Constratech Trading is a registered company operating mainly in the construction industry and also active in supply of goods. The company was established in 2015. It is registered with the Registrar of Companies, the National Construction Industry Council of Malawi (NCIC), the Malawi Revenue Authority, The National Water Resources Authority Ministry, PPDA and the Ministry of Trade.',
 'img/project1.2.jpg');

-- =============================================
-- 4. FEATURE BOXES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS features (
    id INT PRIMARY KEY AUTO_INCREMENT,
    icon VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default features
INSERT INTO features (icon, title, description, display_order) VALUES
('fas fa-certificate', 'Certified Excellence', 'MK 500M+ NCIC registered in civil & building categories', 1),
('fas fa-users', 'Expert Team', 'Professional staff delivering quality results', 2),
('fas fa-handshake', 'Trusted Partner', '100+ successful projects completed nationwide', 3);

-- =============================================
-- 5. SERVICES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS services_section (
    id INT PRIMARY KEY AUTO_INCREMENT,
    section_title VARCHAR(500),
    section_subtitle VARCHAR(500),
    section_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default services section header
INSERT INTO services_section (section_title, section_subtitle, section_description) VALUES
('Comprehensive Construction & Solar Solutions',
 'What We Do',
 'Constratech Trading delivers excellence across multiple domains. From large-scale construction projects to innovative solar installations, we provide cost-effective, efficient solutions for commercial businesses, homeowners, and international organizations.');

CREATE TABLE IF NOT EXISTS services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    icon VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default services
INSERT INTO services (icon, title, description, display_order) VALUES
('fa-solid fa-person-digging', 'General Contracting', 'Construction of buildings and concrete structures, pavements, and access roads with professional expertise.', 1),
('fa-solid fa-solar-panel', 'Solar Solutions', 'Complete solar installation packages - panels, batteries, inverters, and all accessories at competitive prices.', 2),
('fa-solid fa-house', 'Building Construction', 'Comprehensive building services from foundation to finish with modern construction techniques.', 3),
('fa-solid fa-road', 'Road Construction', 'Professional road construction and rehabilitation services for durable infrastructure.', 4),
('fa-solid fa-truck', 'Supply Services', 'Reliable supply of construction materials and equipment for projects of all sizes.', 5),
('fa-solid fa-hammer', 'Renovation & Maintenance', 'Expert renovation and maintenance services to keep your properties in top condition.', 6);

-- =============================================
-- 6. PORTFOLIO SECTION TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS portfolio_section (
    id INT PRIMARY KEY AUTO_INCREMENT,
    section_title VARCHAR(500),
    section_subtitle VARCHAR(500),
    section_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default portfolio section header
INSERT INTO portfolio_section (section_title, section_subtitle, section_description) VALUES
('Our Project Showcase',
 'Portfolio',
 'Delivering excellence across construction and solar installations throughout Malawi');

CREATE TABLE IF NOT EXISTS portfolio (
    id INT PRIMARY KEY AUTO_INCREMENT,
    image_path VARCHAR(500),
    category VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_featured TINYINT(1) DEFAULT 0,
    display_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default portfolio items
INSERT INTO portfolio (image_path, category, title, description, is_featured, display_order) VALUES
('img/project1.2.jpg', 'Construction', 'Major Infrastructure Project', 'Large-scale building construction with modern techniques', 1, 1),
('img/project2.2.jpg', 'Solar Energy', 'Solar Installation', 'Complete solar system for commercial facility', 0, 2),
('img/project3.2.jpg', 'Civil Works', 'Road Development', 'Highway construction and rehabilitation', 0, 3),
('img/project4.2.jpg', 'Building', 'Commercial Complex', 'Modern office building construction', 0, 4),
('img/project5.2.jpg', 'Infrastructure', 'Bridge Construction', 'Structural engineering excellence', 0, 5),
('img/project6.2.jpg', 'Residential', 'Housing Development', 'Quality homes for communities', 0, 6);

-- =============================================
-- 7. CONTACT SECTION TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS contact_section (
    id INT PRIMARY KEY AUTO_INCREMENT,
    section_title VARCHAR(500),
    section_subtitle VARCHAR(500),
    section_description TEXT,
    form_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default contact section
INSERT INTO contact_section (section_title, section_subtitle, section_description, form_email) VALUES
('Get In Touch',
 'Contact Us',
 'Have a project in mind? Let\'s discuss how we can help bring your vision to life.',
 'info@constratechtrading.com');

-- =============================================
-- 8. FOOTER TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS footer (
    id INT PRIMARY KEY AUTO_INCREMENT,
    description TEXT,
    copyright_text VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default footer
INSERT INTO footer (description, copyright_text) VALUES
('Leading construction and solar solutions provider in Malawi, delivering quality projects since 2015.',
 '© 2025 Constratech Trading. All rights reserved.');

-- =============================================
-- 9. SOCIAL MEDIA TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS social_media (
    id INT PRIMARY KEY AUTO_INCREMENT,
    platform VARCHAR(50) NOT NULL,
    url VARCHAR(500),
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default social media links
INSERT INTO social_media (platform, url) VALUES
('facebook', '#'),
('twitter', '#'),
('linkedin', '#'),
('instagram', '#');

-- =============================================
-- 10. ADMIN USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    full_name VARCHAR(255),
    is_active TINYINT(1) DEFAULT 1,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (password: constratech2025)
-- Password hash generated using PHP password_hash()
INSERT INTO admin_users (username, password_hash, email, full_name) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@constratechtrading.com', 'Administrator');

-- =============================================
-- 11. ADMIN SESSIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS admin_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    ip_address VARCHAR(50),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
);

-- =============================================
-- INDEXES FOR BETTER PERFORMANCE
-- =============================================
CREATE INDEX idx_services_active ON services(is_active, display_order);
CREATE INDEX idx_portfolio_active ON portfolio(is_active, display_order);
CREATE INDEX idx_portfolio_featured ON portfolio(is_featured);
CREATE INDEX idx_features_order ON features(display_order);
CREATE INDEX idx_social_active ON social_media(is_active);
CREATE INDEX idx_session_token ON admin_sessions(session_token);
CREATE INDEX idx_session_expires ON admin_sessions(expires_at);

-- =============================================
-- VIEWS FOR EASIER DATA RETRIEVAL
-- =============================================

-- View for active services
CREATE OR REPLACE VIEW active_services AS
SELECT * FROM services 
WHERE is_active = 1 
ORDER BY display_order;

-- View for active portfolio
CREATE OR REPLACE VIEW active_portfolio AS
SELECT * FROM portfolio 
WHERE is_active = 1 
ORDER BY is_featured DESC, display_order;

-- View for featured portfolio item
CREATE OR REPLACE VIEW featured_portfolio AS
SELECT * FROM portfolio 
WHERE is_featured = 1 AND is_active = 1 
LIMIT 1;

-- =============================================
-- STORED PROCEDURES
-- =============================================

DELIMITER //

-- Procedure to reorder services
CREATE PROCEDURE reorder_services()
BEGIN
    SET @row_num = 0;
    UPDATE services 
    SET display_order = (@row_num:=@row_num+1) 
    WHERE is_active = 1 
    ORDER BY display_order;
END //

-- Procedure to reorder portfolio
CREATE PROCEDURE reorder_portfolio()
BEGIN
    SET @row_num = 0;
    UPDATE portfolio 
    SET display_order = (@row_num:=@row_num+1) 
    WHERE is_active = 1 
    ORDER BY display_order;
END //

-- Procedure to clean expired sessions
CREATE PROCEDURE clean_expired_sessions()
BEGIN
    DELETE FROM admin_sessions 
    WHERE expires_at < NOW();
END //

DELIMITER ;

-- =============================================
-- 12. CONTACT SUBMISSIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS contact_submissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255) NOT NULL,
    service VARCHAR(100),
    message TEXT NOT NULL,
    ip_address VARCHAR(45),
    status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_submitted_at (submitted_at)
);

-- =============================================
-- INITIAL DATA VERIFICATION
-- =============================================
SELECT 'Database schema created successfully!' AS status;
SELECT COUNT(*) AS total_services FROM services;
SELECT COUNT(*) AS total_portfolio FROM portfolio;
SELECT COUNT(*) AS total_features FROM features;
