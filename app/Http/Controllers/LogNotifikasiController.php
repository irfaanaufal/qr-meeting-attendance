<?php

namespace App\Http\Controllers;

use App\Models\LogNotifikasi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LogNotifikasiController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notifications = LogNotifikasi::where('user_id', $request->user()->id)
            ->where('visible_in_bell', true)
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get();

        return response()->json($notifications);
    }

    public function markAllRead(Request $request): JsonResponse
    {
        $query = LogNotifikasi::query()
            ->where('user_id', $request->user()->id)
            ->where('visible_in_bell', true)
            ->whereNull('read_at');

        if ($request->filled('ids')) {
            $query->whereIn('id', (array) $request->input('ids'));
        }

        $query->update(['read_at' => now()]);

        return response()->json(['message' => 'Notifikasi telah ditandai dibaca.']);
    }
}
