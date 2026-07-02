<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogNotifikasi extends Model
{
    protected $table = 'log_notifikasi';

    protected $fillable = [
        'user_id',
        'ticket_id',
        'actor_user_id',
        'actor_name',
        'recipient_type',
        'action',
        'title',
        'message',
        'status',
        'visible_in_bell',
        'read_at',
    ];

    protected function casts(): array
    {
        return [
            'visible_in_bell' => 'boolean',
            'read_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
