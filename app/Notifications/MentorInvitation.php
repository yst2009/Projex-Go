<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MentorInvitation extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
   public function __construct($project)
{
    $this->project = $project; // مشروع الليدر
}
    public function via(object $notifiable): array
    {
        return ['database'];
    }
public function toDatabase($notifiable)
{
    return [
        'type'         => 'mentor_invite', // عشان الفرونت يعرف يعرض زرار قبول/رفض
        'title'        => 'دعوة للإرشاد',
        'body'         => 'الليدر ' . auth()->user()->name . ' يدعوك للإشراف على مشروعه: ' . $this->project->name,
        'project_name'   => $this->project->title,
    ];
}

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
