<?php
// contact.php – verbeterde versie voor Café8
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Ongeldige methode']);
    exit;
}

$voornaam = trim($_POST['voornaam'] ?? '');
$achternaam = trim($_POST['achternaam'] ?? '');
$email = trim($_POST['email'] ?? '');
$telefoon = trim($_POST['telefoon'] ?? '');
$bericht = trim($_POST['bericht'] ?? '');

$naam = trim("$voornaam $achternaam");

if (!$naam || !$email || !$bericht || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Ongeldige invoer']);
    exit;
}

$ontvanger = 'info@cafe8.nl';
$onderwerp = "Nieuw bericht via Café8 website";
$inhoud = "Naam: $naam\nE-mail: $email\nTelefoon: $telefoon\n\nBericht:\n$bericht\n";
$headers = "From: no-reply@" . $_SERVER['SERVER_NAME'] . "\r\n" .
           "Reply-To: $email\r\n" .
           "Content-Type: text/plain; charset=UTF-8\r\n";

if (mail($ontvanger, $onderwerp, $inhoud, $headers)) {
    echo json_encode(['success' => 'Bericht succesvol verzonden!']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Er ging iets mis bij het verzenden.']);
}
?>