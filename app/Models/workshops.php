<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class workshops extends Model
{
    protected $fillable = [
        'title',
        'description',
        'description_detailed',
        'instructor_id',
        'category',
        'date',
        'time',
        'location',
        'capacity',
        'duration',
        'level',
        'price',
        'syllabus',
    ];
}
