<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('briefings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('judul_briefing');
            $table->string('divisi_pemateri');
            $table->dateTime('tanggal_jam');
            $table->string('recording_file')->nullable();
            $table->string('recording_original_name')->nullable();
            $table->longText('transcript')->nullable();
            $table->text('ringkasan')->nullable();
            $table->enum('status', ['Draft', 'Selesai'])->default('Draft');
            $table->boolean('absensi_dibuka')->default(true);
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('briefings');
    }
};
