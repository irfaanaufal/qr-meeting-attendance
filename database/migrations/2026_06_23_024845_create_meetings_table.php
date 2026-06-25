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
        Schema::create('meetings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('judul_rapat');
            $table->string('divisi_pemateri');
            $table->dateTime('tanggal_jam');
            $table->text('ringkasan')->nullable();
            $table->string('berkas')->nullable();
            $table->enum('status', ['On-Progress', 'Closed', 'Ended'])->default('On-Progress');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meetings');
    }
};
