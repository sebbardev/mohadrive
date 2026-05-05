<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingCreatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $booking;

    /**
     * Create a new notification instance.
     */
    public function __construct(Booking $booking)
    {
        $this->booking = $booking;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('Nouvelle réservation - Premium Car Rental')
                    ->greeting('Bonjour ' . $this->booking->first_name . '!')
                    ->line('Votre réservation pour le véhicule ' . $this->booking->car->brand . ' ' . $this->booking->car->model . ' a été enregistrée avec succès.')
                    ->line('Détails :')
                    ->line('- Dates : du ' . $this->booking->start_date->format('d/m/Y') . ' au ' . $this->booking->end_date->format('d/m/Y'))
                    ->line('- Lieu : ' . $this->booking->location)
                    ->line('- Prix Total : ' . $this->booking->total_price . ' MAD')
                    ->action('Consulter ma réservation', url('/reservations/' . $this->booking->id))
                    ->line('Nous reviendrons vers vous très prochainement pour confirmer votre demande.')
                    ->salutation('Cordialement, l\'équipe Premium Car Rental.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'booking_id' => $this->booking->id,
            'car' => $this->booking->car->brand . ' ' . $this->booking->car->model,
            'total_price' => $this->booking->total_price,
            'message' => 'Nouvelle réservation effectuée',
        ];
    }
}
