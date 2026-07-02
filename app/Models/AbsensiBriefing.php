<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AbsensiBriefing extends Model
{
    use HasFactory;

    protected $table = 'absensi_briefings';

    protected $fillable = [
        'briefing_id',
        'karyawan_fid',
        'jam_absen',
    ];

    protected $casts = [
        'jam_absen' => 'datetime',
    ];

    public function briefing()
    {
        return $this->belongsTo(Briefing::class);
    }

    public function karyawan()
    {
        return $this->belongsTo(Karyawan::class, 'karyawan_fid', 'fid');
    }
}
