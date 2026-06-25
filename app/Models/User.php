<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'username', 'email', 'password', 'fid', 'role_id'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['divisi', 'role', 'jabatan'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function meetings()
    {
        return $this->hasMany(Meeting::class);
    }

    /**
     * Get the karyawan associated with the user.
     */
    public function karyawan()
    {
        return $this->belongsTo(Karyawan::class, 'fid', 'fid');
    }

    /**
     * Get the role associated with the user.
     */
    public function roleRelation()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    /**
     * Accessor for division (divisi).
     */
    public function getDivisiAttribute()
    {
        return $this->karyawan?->divisi ?? 'Umum';
    }

    /**
     * Accessor for role name.
     */
    public function getRoleAttribute()
    {
        return $this->roleRelation?->name;
    }

    /**
     * Accessor for job position (jabatan).
     */
    public function getJabatanAttribute()
    {
        return $this->karyawan?->jabatan ?? 'Staff';
    }

    /**
     * Check if the user has a specific permission.
     */
    public function hasPermission($permissionName): bool
    {
        return $this->roleRelation?->permissions()->where('name', $permissionName)->exists() ?? false;
    }
}
