<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class professerjoinnmeeting extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct($project,$user)
    {
        $this->project = $project;
        $this->user = $user;
    }
    public function toDatabase($notifiable) {
    return [
        'type' => 'professer-join-meeting',
        'title' => 'طلب استشاره جديد',
        'body' => $this->user->name . ' يريد استشاره في مشروع ' . $this->project->title,
        'student_name' => $this->user->name,
        'project_title' => $this->project->title,
    ];
}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
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
