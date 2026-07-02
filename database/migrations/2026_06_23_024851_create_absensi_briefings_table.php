<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('absensi_briefings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('briefing_id')->constrained()->cascadeOnDelete();
            $table->string('karyawan_fid');
            $table->foreign('karyawan_fid')->references('fid')->on('karyawans')->cascadeOnDelete();
            $table->timestamp('jam_absen')->useCurrent();
            $table->unique(['briefing_id', 'karyawan_fid']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('absensi_briefings');
    }
};
