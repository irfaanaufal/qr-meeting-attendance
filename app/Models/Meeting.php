<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Meeting extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'judul_rapat',
        'divisi_pemateri',
        'tanggal_jam',
        'ringkasan',
        'status',
        'berkas',
    ];

    protected $casts = [
        'tanggal_jam' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function absensi()
    {
        return $this->hasMany(AbsensiMeeting::class);
    }
}
