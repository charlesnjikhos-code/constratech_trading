<?php
/**
 * Content API
 * Handles all CMS content operations
 */

require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

$method = $_SERVER['REQUEST_METHOD'];
$section = $_GET['section'] ?? '';

try {
    $db = getDB();
    
    // Public read access, auth required for write operations
    if ($method !== 'GET') {
        validateSession();
    }
    
    switch ($section) {
        case 'company':
            handleCompanyInfo($db, $method);
            break;
            
        case 'hero':
            handleHeroSection($db, $method);
            break;
            
        case 'about':
            handleAboutSection($db, $method);
            break;
            
        case 'features':
            handleFeatures($db, $method);
            break;
            
        case 'services':
            handleServices($db, $method);
            break;
            
        case 'services-section':
            handleServicesSection($db, $method);
            break;
            
        case 'portfolio':
            handlePortfolio($db, $method);
            break;
            
        case 'portfolio-section':
            handlePortfolioSection($db, $method);
            break;
            
        case 'contact':
            handleContactSection($db, $method);
            break;
            
        case 'footer':
            handleFooter($db, $method);
            break;
            
        case 'social':
            handleSocialMedia($db, $method);
            break;
            
        case 'all':
            getAllContent($db);
            break;
            
        default:
            sendResponse(false, null, 'Invalid section');
    }
    
} catch (Exception $e) {
    sendResponse(false, null, 'Server error: ' . $e->getMessage());
}

// ===== COMPANY INFO =====
function handleCompanyInfo($db, $method) {
    if ($method === 'GET') {
        $stmt = $db->query("SELECT * FROM company_info ORDER BY id DESC LIMIT 1");
        $data = $stmt->fetch();
        sendResponse(true, $data);
    } elseif ($method === 'PUT' || $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $stmt = $db->prepare("
            UPDATE company_info SET 
            name = ?, tagline = ?, phone = ?, email = ?, address = ?, logo_path = ?
            WHERE id = 1
        ");
        $stmt->execute([
            sanitizeInput($input['name']),
            sanitizeInput($input['tagline']),
            sanitizeInput($input['phone']),
            sanitizeInput($input['email']),
            sanitizeInput($input['address']),
            sanitizeInput($input['logo_path'])
        ]);
        sendResponse(true, null, 'Company info updated');
    }
}

// ===== HERO SECTION =====
function handleHeroSection($db, $method) {
    if ($method === 'GET') {
        $stmt = $db->query("SELECT * FROM hero_section ORDER BY id DESC LIMIT 1");
        $data = $stmt->fetch();
        sendResponse(true, $data);
    } elseif ($method === 'PUT' || $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $stmt = $db->prepare("
            UPDATE hero_section SET 
            title = ?, subtitle = ?, description = ?, cta_text = ?, cta_link = ?, background_image = ?
            WHERE id = 1
        ");
        $stmt->execute([
            sanitizeInput($input['title']),
            sanitizeInput($input['subtitle']),
            sanitizeInput($input['description']),
            sanitizeInput($input['cta_text']),
            sanitizeInput($input['cta_link']),
            sanitizeInput($input['background_image'])
        ]);
        sendResponse(true, null, 'Hero section updated');
    }
}

// ===== ABOUT SECTION =====
function handleAboutSection($db, $method) {
    if ($method === 'GET') {
        $stmt = $db->query("SELECT * FROM about_section ORDER BY id DESC LIMIT 1");
        $data = $stmt->fetch();
        sendResponse(true, $data);
    } elseif ($method === 'PUT' || $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $stmt = $db->prepare("
            UPDATE about_section SET 
            title = ?, subtitle = ?, description = ?, image_path = ?
            WHERE id = 1
        ");
        $stmt->execute([
            sanitizeInput($input['title']),
            sanitizeInput($input['subtitle']),
            sanitizeInput($input['description']),
            sanitizeInput($input['image_path'])
        ]);
        sendResponse(true, null, 'About section updated');
    }
}

// ===== FEATURES =====
function handleFeatures($db, $method) {
    if ($method === 'GET') {
        $stmt = $db->query("SELECT * FROM features ORDER BY display_order");
        $data = $stmt->fetchAll();
        sendResponse(true, $data);
    } elseif ($method === 'PUT' || $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Delete existing features
        $db->exec("DELETE FROM features");
        
        // Insert new features
        $stmt = $db->prepare("
            INSERT INTO features (icon, title, description, display_order) 
            VALUES (?, ?, ?, ?)
        ");
        
        foreach ($input as $index => $feature) {
            $stmt->execute([
                sanitizeInput($feature['icon']),
                sanitizeInput($feature['title']),
                sanitizeInput($feature['description']),
                $index + 1
            ]);
        }
        sendResponse(true, null, 'Features updated');
    }
}

// ===== SERVICES SECTION =====
function handleServicesSection($db, $method) {
    if ($method === 'GET') {
        $stmt = $db->query("SELECT * FROM services_section ORDER BY id DESC LIMIT 1");
        $data = $stmt->fetch();
        sendResponse(true, $data);
    } elseif ($method === 'PUT' || $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $stmt = $db->prepare("
            UPDATE services_section SET 
            section_title = ?, section_subtitle = ?, section_description = ?
            WHERE id = 1
        ");
        $stmt->execute([
            sanitizeInput($input['section_title']),
            sanitizeInput($input['section_subtitle']),
            sanitizeInput($input['section_description'])
        ]);
        sendResponse(true, null, 'Services section updated');
    }
}

// ===== SERVICES =====
function handleServices($db, $method) {
    if ($method === 'GET') {
        $stmt = $db->query("SELECT * FROM services WHERE is_active = 1 ORDER BY display_order");
        $data = $stmt->fetchAll();
        sendResponse(true, $data);
    } elseif ($method === 'PUT' || $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Mark all as inactive first
        $db->exec("UPDATE services SET is_active = 0");
        
        // Update or insert services
        $stmt = $db->prepare("
            INSERT INTO services (id, icon, title, description, display_order, is_active) 
            VALUES (?, ?, ?, ?, ?, 1)
            ON DUPLICATE KEY UPDATE 
            icon = VALUES(icon), 
            title = VALUES(title), 
            description = VALUES(description), 
            display_order = VALUES(display_order),
            is_active = 1
        ");
        
        foreach ($input as $index => $service) {
            $stmt->execute([
                $service['id'] ?? null,
                sanitizeInput($service['icon']),
                sanitizeInput($service['title']),
                sanitizeInput($service['description']),
                $index + 1
            ]);
        }
        sendResponse(true, null, 'Services updated');
    } elseif ($method === 'DELETE') {
        $id = $_GET['id'] ?? 0;
        $stmt = $db->prepare("UPDATE services SET is_active = 0 WHERE id = ?");
        $stmt->execute([$id]);
        sendResponse(true, null, 'Service deleted');
    }
}

// ===== PORTFOLIO SECTION =====
function handlePortfolioSection($db, $method) {
    if ($method === 'GET') {
        $stmt = $db->query("SELECT * FROM portfolio_section ORDER BY id DESC LIMIT 1");
        $data = $stmt->fetch();
        sendResponse(true, $data);
    } elseif ($method === 'PUT' || $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $stmt = $db->prepare("
            UPDATE portfolio_section SET 
            section_title = ?, section_subtitle = ?, section_description = ?
            WHERE id = 1
        ");
        $stmt->execute([
            sanitizeInput($input['section_title']),
            sanitizeInput($input['section_subtitle']),
            sanitizeInput($input['section_description'])
        ]);
        sendResponse(true, null, 'Portfolio section updated');
    }
}

// ===== PORTFOLIO =====
function handlePortfolio($db, $method) {
    if ($method === 'GET') {
        $stmt = $db->query("SELECT * FROM portfolio WHERE is_active = 1 ORDER BY is_featured DESC, display_order");
        $data = $stmt->fetchAll();
        sendResponse(true, $data);
    } elseif ($method === 'PUT' || $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Mark all as inactive first
        $db->exec("UPDATE portfolio SET is_active = 0");
        
        // Update or insert portfolio items
        $stmt = $db->prepare("
            INSERT INTO portfolio (id, image_path, category, title, description, is_featured, display_order, is_active) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 1)
            ON DUPLICATE KEY UPDATE 
            image_path = VALUES(image_path), 
            category = VALUES(category), 
            title = VALUES(title), 
            description = VALUES(description),
            is_featured = VALUES(is_featured),
            display_order = VALUES(display_order),
            is_active = 1
        ");
        
        foreach ($input as $index => $item) {
            $stmt->execute([
                $item['id'] ?? null,
                sanitizeInput($item['image_path']),
                sanitizeInput($item['category']),
                sanitizeInput($item['title']),
                sanitizeInput($item['description']),
                $item['is_featured'] ?? 0,
                $index + 1
            ]);
        }
        sendResponse(true, null, 'Portfolio updated');
    } elseif ($method === 'DELETE') {
        $id = $_GET['id'] ?? 0;
        $stmt = $db->prepare("UPDATE portfolio SET is_active = 0 WHERE id = ?");
        $stmt->execute([$id]);
        sendResponse(true, null, 'Portfolio item deleted');
    }
}

// ===== CONTACT SECTION =====
function handleContactSection($db, $method) {
    if ($method === 'GET') {
        $stmt = $db->query("SELECT * FROM contact_section ORDER BY id DESC LIMIT 1");
        $data = $stmt->fetch();
        sendResponse(true, $data);
    } elseif ($method === 'PUT' || $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $stmt = $db->prepare("
            UPDATE contact_section SET 
            section_title = ?, section_subtitle = ?, section_description = ?, form_email = ?
            WHERE id = 1
        ");
        $stmt->execute([
            sanitizeInput($input['section_title']),
            sanitizeInput($input['section_subtitle']),
            sanitizeInput($input['section_description']),
            sanitizeInput($input['form_email'])
        ]);
        sendResponse(true, null, 'Contact section updated');
    }
}

// ===== FOOTER =====
function handleFooter($db, $method) {
    if ($method === 'GET') {
        $stmt = $db->query("SELECT * FROM footer ORDER BY id DESC LIMIT 1");
        $data = $stmt->fetch();
        sendResponse(true, $data);
    } elseif ($method === 'PUT' || $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $stmt = $db->prepare("
            UPDATE footer SET 
            description = ?, copyright_text = ?
            WHERE id = 1
        ");
        $stmt->execute([
            sanitizeInput($input['description']),
            sanitizeInput($input['copyright_text'])
        ]);
        sendResponse(true, null, 'Footer updated');
    }
}

// ===== SOCIAL MEDIA =====
function handleSocialMedia($db, $method) {
    if ($method === 'GET') {
        $stmt = $db->query("SELECT * FROM social_media WHERE is_active = 1 ORDER BY platform");
        $data = $stmt->fetchAll();
        $social = [];
        foreach ($data as $item) {
            $social[$item['platform']] = $item['url'];
        }
        sendResponse(true, $social);
    } elseif ($method === 'PUT' || $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $stmt = $db->prepare("
            UPDATE social_media SET url = ? WHERE platform = ?
        ");
        
        foreach ($input as $platform => $url) {
            $stmt->execute([sanitizeInput($url), $platform]);
        }
        sendResponse(true, null, 'Social media updated');
    }
}

// ===== GET ALL CONTENT =====
function getAllContent($db) {
    $content = [];
    
    // Company info
    $stmt = $db->query("SELECT * FROM company_info LIMIT 1");
    $content['company'] = $stmt->fetch();
    
    // Hero
    $stmt = $db->query("SELECT * FROM hero_section LIMIT 1");
    $content['hero'] = $stmt->fetch();
    
    // About
    $stmt = $db->query("SELECT * FROM about_section LIMIT 1");
    $content['about'] = $stmt->fetch();
    
    // Features
    $stmt = $db->query("SELECT * FROM features ORDER BY display_order");
    $content['features'] = $stmt->fetchAll();
    
    // Services section
    $stmt = $db->query("SELECT * FROM services_section LIMIT 1");
    $content['services_section'] = $stmt->fetch();
    
    // Services
    $stmt = $db->query("SELECT * FROM services WHERE is_active = 1 ORDER BY display_order");
    $content['services'] = $stmt->fetchAll();
    
    // Portfolio section
    $stmt = $db->query("SELECT * FROM portfolio_section LIMIT 1");
    $content['portfolio_section'] = $stmt->fetch();
    
    // Portfolio
    $stmt = $db->query("SELECT * FROM portfolio WHERE is_active = 1 ORDER BY is_featured DESC, display_order");
    $content['portfolio'] = $stmt->fetchAll();
    
    // Contact
    $stmt = $db->query("SELECT * FROM contact_section LIMIT 1");
    $content['contact'] = $stmt->fetch();
    
    // Footer
    $stmt = $db->query("SELECT * FROM footer LIMIT 1");
    $content['footer'] = $stmt->fetch();
    
    // Social media
    $stmt = $db->query("SELECT * FROM social_media WHERE is_active = 1");
    $social = [];
    foreach ($stmt->fetchAll() as $item) {
        $social[$item['platform']] = $item['url'];
    }
    $content['social'] = $social;
    
    sendResponse(true, $content);
}
