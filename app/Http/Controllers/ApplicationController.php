<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\LogNotifikasi;
use App\Models\User;
use App\Models\UserApplication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ApplicationController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();
        $applications = Application::with(['userApplications' => fn($q) => $q->where('user_id', $user->id)])->get();

        $applications->each(function ($app) use ($user) {
            $userApp = $app->userApplications->first();
            $app->setRelation('userApplications', collect());
            $app->user_application = $userApp;
        });

        return Inertia::render('Apps/AksesSaya', [
            'applications' => $applications,
        ]);
    }

    public function requestAccess(Request $request): RedirectResponse
    {
        $request->validate(['application_id' => 'required|exists:applications,id']);

        $user = $request->user();
        $app = Application::findOrFail($request->application_id);

        UserApplication::updateOrCreate(
            ['user_id' => $user->id, 'application_id' => $app->id],
            ['is_active' => false]
        );

        $adminUsers = User::whereHas('roleRelation', fn($q) => $q->whereIn('name', ['superadmin', 'admin']))->get();
        $adminUsers->each(function ($admin) use ($user, $app) {
            LogNotifikasi::create([
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

        return back()->with('success', 'Permintaan akses berhasil dikirim. Silakan tunggu persetujuan admin.');
    }

    public function requests(): Response
    {
        $requests = UserApplication::with(['user', 'application'])
            ->where('is_active', false)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Apps/KelolaPermintaan', [
            'requests' => $requests,
        ]);
    }

    public function toggleAccess(Request $request): RedirectResponse
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'application_id' => 'required|exists:applications,id',
        ]);

        $userApp = UserApplication::where('user_id', $request->user_id)
            ->where('application_id', $request->application_id)
            ->firstOrFail();

        $userApp->update([
            'is_active' => !$userApp->is_active,
            'approved_by' => $userApp->is_active ? null : $request->user()->id,
            'approved_at' => $userApp->is_active ? null : now(),
        ]);

        $status = $userApp->is_active ? 'diaktifkan' : 'dinonaktifkan';
        return back()->with('success', "Akses pengguna berhasil {$status}.");
    }

    public function manage(): Response
    {
        $applications = Application::withCount('userApplications')->get();
        return Inertia::render('Apps/KelolaAplikasi', [
            'applications' => $applications,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:applications,slug',
            'description' => 'nullable|string',
        ]);

        Application::create($request->only(['name', 'slug', 'description']));

        return back()->with('success', 'Aplikasi berhasil ditambahkan.');
    }
}
