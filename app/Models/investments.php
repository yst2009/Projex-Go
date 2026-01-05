<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class investments extends Model
{
    protected $table = 'investments';
    protected $fillable = [
        'investor_id',
        'project_id',
        'amount',
        'equity_offered',
        'status',
        'agreement_link',
        'documents',
    ];
}
