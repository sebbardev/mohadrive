<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px;
        }
        .info-row {
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e0e0e0;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: bold;
            color: #1e3a8a;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }
        .value {
            font-size: 16px;
            color: #333;
        }
        .message-box {
            background: #f8f9fa;
            padding: 20px;
            border-left: 4px solid #1e3a8a;
            border-radius: 4px;
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background: #1e3a8a;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin-top: 20px;
        }
        .button:hover {
            background: #0f172a;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 Nouveau Message de Contact</h1>
        </div>
        
        <div class="content">
            <p>Un nouveau message a été envoyé via le formulaire de contact :</p>
            
            <div class="info-row">
                <div class="label">Expéditeur</div>
                <div class="value">{{ $contactMessage->name }}</div>
            </div>
            
            <div class="info-row">
                <div class="label">Email</div>
                <div class="value">
                    <a href="mailto:{{ $contactMessage->email }}">{{ $contactMessage->email }}</a>
                </div>
            </div>
            
            @if($contactMessage->phone)
            <div class="info-row">
                <div class="label">Téléphone</div>
                <div class="value">
                    <a href="tel:{{ $contactMessage->phone }}">{{ $contactMessage->phone }}</a>
                </div>
            </div>
            @endif
            
            <div class="info-row">
                <div class="label">Sujet</div>
                <div class="value">{{ $contactMessage->subject }}</div>
            </div>
            
            <div class="info-row">
                <div class="label">Date d'envoi</div>
                <div class="value">{{ $contactMessage->created_at->format('d/m/Y à H:i') }}</div>
            </div>
            
            <div class="label">Message</div>
            <div class="message-box">
                {{ $contactMessage->message }}
            </div>
            
            @if($contactMessage->customer_id)
            <div class="info-row">
                <div class="label">Client enregistré</div>
                <div class="value">Oui (ID: {{ $contactMessage->customer_id }})</div>
            </div>
            @endif
            
            <a href="{{ config('app.url') }}/admin/messages" class="button">
                Voir le message dans l'administration
            </a>
        </div>
        
        <div class="footer">
            <p>Cet email a été envoyé automatiquement par le système de gestion Premium Car Rental.</p>
            <p>© {{ date('Y') }} Premium Car Rental. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>
