<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('signatures', function (Blueprint $table) {
            $table->id();
            $table->morphs('signable');
            $table->string('signature_path');
            $table->timestamps();
            $table->unique(['signable_type', 'signable_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('signatures');
    }
};
