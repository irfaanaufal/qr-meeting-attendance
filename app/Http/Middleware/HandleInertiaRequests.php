<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $baseUrl = $request->getBaseUrl();
        if (env('STORAGE_URL')) {
            $storageUrl = env('STORAGE_URL');
        } elseif (str_ends_with($baseUrl, '/public')) {
            $storageUrl = $request->getSchemeAndHttpHost() . substr($baseUrl, 0, -7) . '/storage/app/public';
        } else {
            $storageUrl = asset('storage');
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
            'asset_url' => asset(''),
            'storage_url' => $storageUrl,
        ];
    }
}
