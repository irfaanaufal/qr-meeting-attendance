<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Karyawan extends Model
{
    use HasFactory;

    protected $table = 'karyawans';

    protected $primaryKey = 'fid';
    
    public $incrementing = false;
    
    protected $keyType = 'string';

    protected $fillable = [
        'fid',
        'nama_karyawan',
        'divisi',
        'jabatan',
    ];

    public function absensi()
    {
        return $this->hasMany(AbsensiMeeting::class, 'karyawan_fid', 'fid');
    }
}
