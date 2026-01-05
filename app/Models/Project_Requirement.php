<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project_Requirement extends Model
{
    protected $table = 'project__requirements';

    protected $fillable = [
        'project_id',
        'requirement_type',
        'skill_required',
        'count_needed',
        'filled_count',
        'status',
        'priority',
        'description',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
