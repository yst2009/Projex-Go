<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    protected $fillable = [
        'project_id',
        'user_profile_id',
        'role',
        'status',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function profile()
    {
        return $this->belongsTo(Profile::class, 'user_profile_id');
    }
}
