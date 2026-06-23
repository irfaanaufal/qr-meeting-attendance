<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AbsensiMeeting extends Model
{
    use HasFactory;

    protected $table = 'absensi_meetings';

    protected $fillable = [
        'meeting_id',
        'karyawan_fid',
        'jam_absen',
    ];

    protected $casts = [
        'jam_absen' => 'datetime',
    ];

    public function meeting()
    {
        return $this->belongsTo(Meeting::class);
    }

    public function karyawan()
    {
        return $this->belongsTo(Karyawan::class, 'karyawan_fid', 'fid');
    }
}
