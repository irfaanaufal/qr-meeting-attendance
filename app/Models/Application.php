<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $fillable = ['name', 'slug', 'description'];

    public function userApplications()
    {
        return $this->hasMany(UserApplication::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_applications');
    }
}
