<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        'user_id',
        'skills',
        'portfolio_link',
        'cv_link',
        'verified',
        'bio_detailed',
        'linkedin_url',
    ];
    public function user()
    {
        return $this->belongsTo(User::class,'user_id');
    }
    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
