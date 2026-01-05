<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class messages extends Model
{
    protected $table = 'messages';
    protected $fillable = [
        'sender_id',
        'receiver_id',
        'subject',
        'content',
        'conversation_id',
        'read',
        'attachments',
    ];

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    
}
