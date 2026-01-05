<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class consultations extends Model
{
    protected $table = 'consultations';
    protected $fillable = [
        'id',
        'professor_id',
        'project_id',
        'field',
        'hours_allocated',
        'status',
        'scheduled_at',
        'meeting_link',
        'professor_notes',
    ];
}
