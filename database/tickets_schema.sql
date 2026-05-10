-- Zonse Point — Event Tickets Schema
-- Run this against the constratech_cms database after schema.sql

USE constratech_cms;

-- =============================================
-- EVENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id VARCHAR(100) UNIQUE NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    event_date DATETIME NOT NULL,
    venue VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_event_id (event_id),
    INDEX idx_event_date (event_date)
);

-- =============================================
-- TICKETS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS tickets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ticket_id VARCHAR(255) UNIQUE NOT NULL,
    event_id VARCHAR(100) NOT NULL,
    holder_name VARCHAR(255),
    holder_email VARCHAR(255),
    ticket_type VARCHAR(100) DEFAULT 'general',
    status ENUM('valid', 'used', 'cancelled', 'invalid') DEFAULT 'valid',
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP NULL,
    scanned_by VARCHAR(100),
    INDEX idx_ticket_id (ticket_id),
    INDEX idx_event_id (event_id),
    INDEX idx_status (status),
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
);

-- =============================================
-- SAMPLE DATA FOR TESTING
-- =============================================
INSERT IGNORE INTO events (event_id, event_name, event_date, venue) VALUES
('EVT001', 'Zonse Point Launch Party', '2026-06-01 18:00:00', 'Blantyre Conference Center'),
('EVT002', 'Summer Music Festival', '2026-07-15 14:00:00', 'Lilongwe City Park');

INSERT IGNORE INTO tickets (ticket_id, event_id, holder_name, holder_email, ticket_type) VALUES
('TKT-EVT001-ALPHA', 'EVT001', 'John Banda', 'john@example.com', 'VIP'),
('TKT-EVT001-BETA',  'EVT001', 'Mary Phiri', 'mary@example.com', 'general'),
('TKT-EVT001-GAMMA', 'EVT001', 'Peter Mwale', 'peter@example.com', 'general'),
('TKT-EVT001-DELTA', 'EVT001', 'Grace Chirwa', 'grace@example.com', 'general'),
('TKT-EVT002-ALPHA', 'EVT002', 'Grace Chirwa', 'grace@example.com', 'VIP'),
('TKT-EVT002-BETA',  'EVT002', 'James Nyirenda', 'james@example.com', 'general');

SELECT 'Tickets schema created successfully!' AS status;
SELECT COUNT(*) AS total_events FROM events;
SELECT COUNT(*) AS total_tickets FROM tickets;
