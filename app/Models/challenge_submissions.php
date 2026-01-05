<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class challenge_submissions extends Model
{
    protected $fillable = [
        'challenge_id',
        'project_id',
        'submission_url',
        'description',
        'status',
        'rating',
        'feedback',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];

    public function challenge()
    {
        return $this->belongsTo(challenges::class, 'challenge_id');
    }

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }
}
