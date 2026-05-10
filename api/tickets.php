<?php
/**
 * Zonse Point — Ticket Scanner API
 * Endpoints: download, validate, sync, events
 */

require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

try {
    $db = getDB();

    switch ($action) {
        case 'download':
            if ($method !== 'GET') sendResponse(false, null, 'Method not allowed');
            downloadTickets($db);
            break;

        case 'validate':
            if ($method !== 'POST') sendResponse(false, null, 'Method not allowed');
            validateTicket($db);
            break;

        case 'sync':
            if ($method !== 'POST') sendResponse(false, null, 'Method not allowed');
            syncTickets($db);
            break;

        case 'events':
            if ($method !== 'GET') sendResponse(false, null, 'Method not allowed');
            listEvents($db);
            break;

        default:
            sendResponse(false, null, 'Invalid action. Valid actions: download, validate, sync, events');
    }

} catch (Exception $e) {
    sendResponse(false, null, 'Server error: ' . $e->getMessage());
}

/**
 * GET /api/tickets.php?action=download&event_id=EVT001
 * Returns all ticket IDs for an event so the scanner can work offline.
 */
function downloadTickets($db) {
    $eventId = sanitizeInput($_GET['event_id'] ?? '');
    if (empty($eventId)) {
        sendResponse(false, null, 'event_id is required');
    }

    $stmt = $db->prepare("SELECT event_id, event_name, event_date, venue FROM events WHERE event_id = ?");
    $stmt->execute([$eventId]);
    $event = $stmt->fetch();

    if (!$event) {
        sendResponse(false, null, 'Event not found');
    }

    // Include both valid and used so the offline cache is complete.
    $stmt = $db->prepare("
        SELECT ticket_id, holder_name, ticket_type, status
        FROM tickets
        WHERE event_id = ? AND status NOT IN ('cancelled', 'invalid')
        ORDER BY ticket_id
    ");
    $stmt->execute([$eventId]);
    $tickets = $stmt->fetchAll();

    sendResponse(true, [
        'event'         => $event,
        'tickets'       => $tickets,
        'downloaded_at' => date('Y-m-d H:i:s'),
        'count'         => count($tickets)
    ], 'Tickets downloaded successfully');
}

/**
 * POST /api/tickets.php?action=validate
 * Body: { "ticket_id": "TKT-...", "event_id": "EVT001" }
 * Marks the ticket as used if valid and returns the result.
 */
function validateTicket($db) {
    $input    = json_decode(file_get_contents('php://input'), true);
    $ticketId = sanitizeInput($input['ticket_id'] ?? '');
    $eventId  = sanitizeInput($input['event_id']  ?? '');

    if (empty($ticketId)) {
        sendResponse(false, null, 'ticket_id is required');
    }

    $sql    = "SELECT t.ticket_id, t.status, t.holder_name, t.holder_email,
                      t.ticket_type, t.used_at, e.event_name
               FROM tickets t
               JOIN events e ON t.event_id = e.event_id
               WHERE t.ticket_id = ?";
    $params = [$ticketId];

    if (!empty($eventId)) {
        $sql    .= " AND t.event_id = ?";
        $params[] = $eventId;
    }

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $ticket = $stmt->fetch();

    if (!$ticket) {
        sendResponse(true, [
            'valid'   => false,
            'reason'  => 'not_found',
            'message' => 'Ticket not found'
        ], 'Validation complete');
    }

    if ($ticket['status'] === 'used') {
        sendResponse(true, [
            'valid'       => false,
            'reason'      => 'already_used',
            'message'     => 'Ticket already scanned',
            'used_at'     => $ticket['used_at'],
            'holder_name' => $ticket['holder_name']
        ], 'Validation complete');
    }

    if (in_array($ticket['status'], ['cancelled', 'invalid'])) {
        sendResponse(true, [
            'valid'   => false,
            'reason'  => $ticket['status'],
            'message' => 'Ticket is ' . $ticket['status']
        ], 'Validation complete');
    }

    // Mark as used.
    $stmt = $db->prepare("UPDATE tickets SET status = 'used', used_at = NOW() WHERE ticket_id = ?");
    $stmt->execute([$ticketId]);

    sendResponse(true, [
        'valid'       => true,
        'ticket_id'   => $ticket['ticket_id'],
        'holder_name' => $ticket['holder_name'],
        'ticket_type' => $ticket['ticket_type'],
        'event_name'  => $ticket['event_name'],
        'message'     => 'Entry granted'
    ], 'Validation complete');
}

/**
 * POST /api/tickets.php?action=sync
 * Body: { "scanned_tickets": [ { "ticket_id": "...", "scanned_at": "..." }, ... ] }
 * Pushes offline-scanned tickets back to the database.
 */
function syncTickets($db) {
    $input          = json_decode(file_get_contents('php://input'), true);
    $scannedTickets = $input['scanned_tickets'] ?? [];

    if (empty($scannedTickets) || !is_array($scannedTickets)) {
        sendResponse(false, null, 'scanned_tickets array is required');
    }

    $synced  = 0;
    $skipped = 0;
    $errors  = [];

    foreach ($scannedTickets as $item) {
        $ticketId  = sanitizeInput($item['ticket_id']  ?? '');
        $scannedAt = $item['scanned_at'] ?? date('Y-m-d H:i:s');

        if (empty($ticketId)) {
            $skipped++;
            continue;
        }

        // Validate scanned_at is a plausible datetime; fall back to now.
        if (!strtotime($scannedAt)) {
            $scannedAt = date('Y-m-d H:i:s');
        }

        try {
            $stmt = $db->prepare("SELECT status FROM tickets WHERE ticket_id = ?");
            $stmt->execute([$ticketId]);
            $ticket = $stmt->fetch();

            if (!$ticket) {
                $errors[] = $ticketId . ': not found';
                $skipped++;
                continue;
            }

            if ($ticket['status'] === 'valid') {
                $stmt = $db->prepare(
                    "UPDATE tickets SET status = 'used', used_at = ? WHERE ticket_id = ? AND status = 'valid'"
                );
                $stmt->execute([$scannedAt, $ticketId]);
                $synced++;
            } else {
                // Already used/cancelled — skip silently.
                $skipped++;
            }
        } catch (Exception $e) {
            $errors[] = $ticketId . ': ' . $e->getMessage();
        }
    }

    sendResponse(true, [
        'synced'  => $synced,
        'skipped' => $skipped,
        'errors'  => $errors
    ], "Sync complete: {$synced} synced, {$skipped} skipped");
}

/**
 * GET /api/tickets.php?action=events
 * Returns list of all events (for the event selector in the portal).
 */
function listEvents($db) {
    $stmt = $db->prepare(
        "SELECT event_id, event_name, event_date, venue FROM events ORDER BY event_date DESC"
    );
    $stmt->execute();
    $events = $stmt->fetchAll();
    sendResponse(true, $events, 'Events retrieved');
}
