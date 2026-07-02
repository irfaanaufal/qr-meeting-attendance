<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class TranscriptionService
{
    protected string $apiKey;
    protected string $uploadEndpoint = 'https://api.assemblyai.com/v2/upload';
    protected string $transcriptEndpoint = 'https://api.assemblyai.com/v2/transcript';

    public function __construct()
    {
        $this->apiKey = config('services.assemblyai.api_key');

        if (empty($this->apiKey)) {
            throw new \RuntimeException(
                'AssemblyAI API key belum diatur. Isi ASSEMBLYAI_API_KEY di file .env'
            );
        }
    }

    public function transcribe(string $storagePath): string
    {
        $fullPath = Storage::disk('public')->path($storagePath);

        if (!file_exists($fullPath)) {
            throw new \RuntimeException("File tidak ditemukan di: {$fullPath}");
        }

        $audioContent = file_get_contents($fullPath);

        if ($audioContent === false) {
            throw new \RuntimeException('Gagal membaca file audio.');
        }

        $uploadUrl = $this->upload($audioContent);

        $transcriptId = $this->submitTranscription($uploadUrl);

        $result = $this->pollResult($transcriptId);

        if (empty($result)) {
            Log::warning('AssemblyAI returned empty transcript', [
                'file' => $storagePath,
            ]);
            return '[Tidak terdeteksi adanya suara]';
        }

        return $result;
    }

    protected function upload(string $audioContent): string
    {
        $response = Http::withOptions(['timeout' => 120])
            ->withHeaders([
                'Authorization' => $this->apiKey,
                'Transfer-Encoding' => 'chunked',
            ])
            ->withBody($audioContent, 'application/octet-stream')
            ->post($this->uploadEndpoint);

        if ($response->failed()) {
            $errorMsg = $response->json()['error'] ?? $response->body();
            Log::error('AssemblyAI upload failed', [
                'status' => $response->status(),
                'error' => $errorMsg,
            ]);
            throw new \RuntimeException('Upload audio gagal: ' . $errorMsg);
        }

        return $response->json()['upload_url'];
    }

    protected function submitTranscription(string $audioUrl): string
    {
        $response = Http::withOptions(['timeout' => 30])
            ->withHeaders([
                'Authorization' => $this->apiKey,
                'Content-Type' => 'application/json',
            ])
            ->post($this->transcriptEndpoint, [
                'audio_url' => $audioUrl,
                'language_code' => 'id',
            ]);

        if ($response->failed()) {
            $errorMsg = $response->json()['error'] ?? $response->body();
            Log::error('AssemblyAI transcription submit failed', [
                'status' => $response->status(),
                'error' => $errorMsg,
            ]);
            throw new \RuntimeException('Transkripsi gagal: ' . $errorMsg);
        }

        return $response->json()['id'];
    }

    protected function pollResult(string $transcriptId): string
    {
        $maxAttempts = 60;
        $attempt = 0;

        while ($attempt < $maxAttempts) {
            $response = Http::withOptions(['timeout' => 15])
                ->withHeaders(['Authorization' => $this->apiKey])
                ->get($this->transcriptEndpoint . '/' . $transcriptId);

            if ($response->failed()) {
                $errorMsg = $response->json()['error'] ?? $response->body();
                Log::error('AssemblyAI poll failed', [
                    'status' => $response->status(),
                    'error' => $errorMsg,
                ]);
                throw new \RuntimeException('Gagal mengambil hasil transkripsi: ' . $errorMsg);
            }

            $data = $response->json();
            $status = $data['status'] ?? 'unknown';

            if ($status === 'completed') {
                return $data['text'] ?? '';
            }

            if ($status === 'error') {
                $errMsg = $data['error'] ?? 'Unknown error';
                Log::error('AssemblyAI transcription error', [
                    'transcript_id' => $transcriptId,
                    'error' => $errMsg,
                ]);
                throw new \RuntimeException('Transkripsi gagal: ' . $errMsg);
            }

            $attempt++;
            sleep(1);
        }

        throw new \RuntimeException('Transkripsi melebihi batas waktu. Coba lagi.');
    }
}
