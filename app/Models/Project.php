<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'category',
        'stage',
        'status',
        'user_profile_id',
        'budget_needed',
        'current_budget',
        'progress_percentage',
        'start_date',
        'deadline',
        'documentation_url',
    ];

    public function profile()
    {
        return $this->belongsTo(Profile::class, 'user_profile_id');
    }

    public function requirements()
    {
        return $this->hasMany(Project_Requirement::class,'project_id');
    }
    public function teamMembers()
    {
        return $this->hasMany(TeamMember::class);
    }
    public function mentorships()
    {
        return $this->hasMany(Mentorship::class);
    }
}
