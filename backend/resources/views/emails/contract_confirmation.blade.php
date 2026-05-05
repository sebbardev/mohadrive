<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Confirmation de Contrat</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #1a2a4a;">Confirmation de votre location</h2>
        <p>Bonjour {{ $contract->driver_first_name }} {{ $contract->driver_last_name }},</p>
        <p>Nous avons le plaisir de vous confirmer la création de votre contrat de location pour le véhicule <strong>{{ $contract->car->brand }} {{ $contract->car->model }}</strong>.</p>
        
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Détails de la location :</strong></p>
            <ul>
                <li><strong>Départ :</strong> {{ $contract->start_date->format('d/m/Y H:i') }}</li>
                <li><strong>Retour :</strong> {{ $contract->end_date->format('d/m/Y H:i') }}</li>
                <li><strong>Lieu de départ :</strong> {{ $contract->pickup_location }}</li>
                <li><strong>Lieu de retour :</strong> {{ $contract->return_location }}</li>
                <li><strong>Montant total :</strong> {{ number_format($contract->total_price, 2) }} MAD</li>
            </ul>
        </div>

        <p>Vous trouverez ci-joint votre contrat de location au format PDF.</p>
        
        <p>Merci de votre confiance.</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #777;">
            <strong>ORIENT DRIVE</strong><br>
            Casablanca, Maroc<br>
            Tél: +212 5XX XX XX XX
        </p>
    </div>
</body>
</html>