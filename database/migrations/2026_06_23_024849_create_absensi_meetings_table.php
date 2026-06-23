<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('absensi_meetings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meeting_id')->constrained()->cascadeOnDelete();
            $table->string('karyawan_fid');
            $table->timestamp('jam_absen')->useCurrent();
            $table->timestamps();

            $table->unique(['meeting_id', 'karyawan_fid']);
            $table->foreign('karyawan_fid')->references('fid')->on('karyawans')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('absensi_meetings');
    }
};
