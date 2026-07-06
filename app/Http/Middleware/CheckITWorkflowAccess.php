<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckITWorkflowAccess
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (!$user) return $next($request);

        $hasAccess = $user->userApplications()
            ->whereHas('application', fn($q) => $q->where('slug', 'absensi-meeting'))
            ->where('is_active', true)
            ->exists();

        if (!$hasAccess) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')->withErrors([
                'activation_needed' => 'Akun Anda belum memiliki akses ke aplikasi ini. Silakan hubungi tim IT.',
            ]);
        }

        return $next($request);
    }
}
