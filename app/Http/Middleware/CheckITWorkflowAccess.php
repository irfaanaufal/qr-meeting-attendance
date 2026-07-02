<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckITWorkflowAccess
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (!$user) return $next($request);
        if ($user->isAdmin()) return $next($request);

        $hasAccess = $user->userApplications()
            ->whereHas('application', fn($q) => $q->where('slug', 'absensi-meeting'))
            ->where('is_active', true)
            ->exists();

        if (!$hasAccess) {
            return redirect()->route('applications.index')
                ->withErrors(['message' => 'Akun Anda belum memiliki akses ke aplikasi ini. Silakan ajukan akses terlebih dahulu.']);
        }

        return $next($request);
    }
}
