<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class workshop_participants extends Model
{
    protected $table = 'workshop_participants';
    protected $fillable = [
        'workshop_id',
        'user_id',
        'attendance_status',
        'progress',
        'certificate_issued',
        'joined_at',
        'completed_at',
    ];
    public function workshop()
    {
        return $this->belongsTo(workshops::class, 'workshop_id');
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
