<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Karyawan;
use App\Models\Application;
use App\Models\UserApplication;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:'.User::class.'|regex:/^[a-zA-Z0-9._-]+$/',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'fid' => 'nullable|string|exists:karyawans,fid|unique:users,fid',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $fid = $request->fid;
        if (!$fid) {
            $karyawan = Karyawan::where('nama_karyawan', 'like', trim($request->name))->first();
            if ($karyawan && !User::where('fid', $karyawan->fid)->exists()) {
                $fid = $karyawan->fid;
            }
        }

        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'fid' => $fid,
            'password' => Hash::make($request->password),
        ]);

        $user->email_verified_at = now();
        $user->remember_token = \Illuminate\Support\Str::random(10);
        $user->save();

        $app = Application::find(config('app.application_id'));

        if ($app) {
            UserApplication::updateOrCreate(
                ['user_id' => $user->id, 'application_id' => $app->id],
                ['is_active' => false]
            );

            $adminUsers = User::whereHas('userApplications', function ($q) use ($app) {
                $q->where('application_id', $app->id)->where('is_active', true);
            })->get();

            $adminUsers->each(function ($admin) use ($user, $app) {
                \App\Models\LogNotifikasi::create([
                    'user_id' => $admin->id,
                    'ticket_id' => null,
                    'actor_user_id' => $user->id,
                    'actor_name' => $user->name,
                    'recipient_type' => 'admin',
                    'action' => 'new_access_request',
                    'title' => 'Permintaan akses baru',
                    'message' => $user->name . ' mengajukan akses ke "' . $app->name . '".',
                    'status' => null,
                    'visible_in_bell' => true,
                ]);
            });
        }

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }

    /**
     * Check if karyawan exists and is not already linked.
     */
    public function checkKaryawan($fid): \Illuminate\Http\JsonResponse
    {
        $karyawan = Karyawan::where('fid', $fid)->first();

        if (!$karyawan) {
            return response()->json([
                'success' => false,
                'message' => 'FID Karyawan tidak ditemukan.'
            ], 404);
        }

        $linkedUserExists = User::where('fid', $fid)->exists();
        if ($linkedUserExists) {
            return response()->json([
                'success' => false,
                'message' => 'Karyawan dengan FID ini sudah memiliki akun.'
            ], 400);
        }

        return response()->json([
            'success' => true,
            'karyawan' => [
                'fid' => $karyawan->fid,
                'nama_karyawan' => $karyawan->nama_karyawan,
                'divisi' => $karyawan->divisi ?? 'Umum',
            ]
        ]);
    }
}
