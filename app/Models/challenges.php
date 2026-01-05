<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class challenges extends Model
{
    protected $fillable = [
        'company_id',
        'title',
        'description',
        'deadline',
        'budget',
        'requirements',
        'status',
        'winner_project_id',
        'submissions_count',
        'video_url',
    ];
}
