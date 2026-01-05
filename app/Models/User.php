<?php

namespace App\Models;

// استدعاء الكلاسات والـ Traits اللازمة
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable; // ده الكلاس الأب
use Illuminate\Notifications\Notifiable; // ده الـ Trait بتاع الإشعارات
use Laravel\Sanctum\HasApiTokens; // لو بتستخدم Sanctum للـ API

// الوراثة هنا لازم تكون من Authenticatable (اللي هو كلاس، مش Trait)
class User extends Authenticatable
{
    // هنا بنستخدم الـ Traits
    use HasApiTokens, HasFactory, Notifiable;
    protected $fillable = [
        'name',
        'email',
        'password',
        'user_type'
    ];

    public function profile()
    {
        return $this->belongsTo(Profile::class,'user_id');
    }
   
    public function messages()
    {
        return $this->hasMany(messages::class,'receiver_id');
    }
    public function messages_sender()
    {
        return $this->hasMany(messages::class,'sender_id');
    }
    
    public function projects()
    {
        return $this->hasMany(projects::class,'user_id');
    }
    public function mentorships()
    {
        return $this->hasMany(mentorships::class,'user_id');
    }
    public function consultations()
    {
        return $this->hasMany(consultations::class,'user_id');
    }
    public function investments()
    {
        return $this->hasMany(investments::class,'user_id');
    }
}
