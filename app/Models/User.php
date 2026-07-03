<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'username', 'email', 'password', 'fid', 'role_id'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $appends = ['divisi', 'role', 'jabatan'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function meetings(): HasMany
    {
        return $this->hasMany(Meeting::class);
    }

    public function karyawan(): BelongsTo
    {
        return $this->belongsTo(Karyawan::class, 'fid', 'fid');
    }

    public function roleRelation(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    public function userApplications(): HasMany
    {
        return $this->hasMany(UserApplication::class);
    }

    public function applications(): BelongsToMany
    {
        return $this->belongsToMany(Application::class, 'user_applications');
    }

    public function logNotifikasi(): HasMany
    {
        return $this->hasMany(LogNotifikasi::class);
    }

    public function getDivisiAttribute(): string
    {
        return $this->karyawan?->divisi ?? 'Umum';
    }

    public function getRoleAttribute(): ?string
    {
        return $this->roleRelation?->name;
    }

    public function getJabatanAttribute(): string
    {
        return $this->karyawan?->jabatan ?? 'Staff';
    }

    public function hasPermission($permissionName): bool
    {
        return $this->roleRelation?->permissions()->where('name', $permissionName)->exists() ?? false;
    }

    public function isSuperAdmin(): bool
    {
        $appRole = $this->getApplicationRole();
        return $appRole ? $appRole === 'superadmin' : $this->roleRelation?->name === 'superadmin';
    }

    public function isAdmin(): bool
    {
        $appRole = $this->getApplicationRole();
        return $appRole ? in_array($appRole, ['superadmin', 'admin']) : in_array($this->roleRelation?->name, ['superadmin', 'admin']);
    }

    private function getApplicationRole(): ?string
    {
        $userApp = $this->userApplications()
            ->whereHas('application', fn($q) => $q->where('slug', 'absensi-meeting'))
            ->with('role')
            ->first();

        return $userApp?->role?->name;
    }
}
