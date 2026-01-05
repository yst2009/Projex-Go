<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mentorships extends Model
{
    use HasFactory;

    protected $fillable = [
        'mentor_id',
        'project_id',
        'status',
        'start_date',
        'end_date',
        'goals',
        'sessions_count',
        'notes',
        'rating',
    ];

    protected $casts = [
        'goals' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function mentor()
    {
        return $this->belongsTo(User::class, 'mentor_id');
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
