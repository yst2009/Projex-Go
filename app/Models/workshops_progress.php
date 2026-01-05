<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class workshops_progress extends Model
{
    protected $table = 'workshops_progresses';
    protected $fillable = [
        'workshop_participant_id',
        'progress_percentage',
        'days_elapsed',
        'days_total',
        'sessions_completed',
        'sessions_total',
        'status',
        'current_stage',
        'start_date',
        'end_date',
        'notes',
    ];
}
