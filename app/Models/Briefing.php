<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Briefing extends Model
{
    use HasFactory;

    protected $table = 'briefings';

    protected $fillable = [
        'user_id',
        'pemateri_fid',
        'judul_briefing',
        'divisi_pemateri',
        'tanggal_jam',
        'recording_file',
        'recording_original_name',
        'transcript',
        'status',
        'absensi_dibuka',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'tanggal_jam' => 'datetime',
        'absensi_dibuka' => 'boolean',
        'approved_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function pemateri()
    {
        return $this->belongsTo(Karyawan::class, 'pemateri_fid', 'fid');
    }

    public function absensi()
    {
        return $this->hasMany(AbsensiBriefing::class);
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function isDraft(): bool
    {
        return $this->status === 'Draft';
    }

    public function isSelesai(): bool
    {
        return $this->status === 'Selesai';
    }
}
