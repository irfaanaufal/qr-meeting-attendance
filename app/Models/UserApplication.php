<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserApplication extends Model
{
    protected $table = 'user_applications';

    protected $fillable = [
        'user_id',
        'application_id',
        'is_active',
        'approved_by',
        'approved_at',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'approved_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function application()
    {
        return $this->belongsTo(Application::class);
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
