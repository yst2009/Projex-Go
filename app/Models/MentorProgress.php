<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MentorProgress extends Model
{
    protected $table = 'mentor_progress_';
    protected $fillable = [
        'mentorship_id',
        'project_id',
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
    public function mentorship()
    {
        return $this->belongsTo(Mentorship::class);
    }
}
