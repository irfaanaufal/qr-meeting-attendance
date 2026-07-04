<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('briefings', function (Blueprint $table) {
            $table->string('pemateri_fid')->nullable()->after('user_id');
            $table->string('judul_briefing')->nullable()->change();
            $table->string('divisi_pemateri')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('briefings', function (Blueprint $table) {
            $table->dropColumn('pemateri_fid');
            $table->string('judul_briefing')->nullable(false)->change();
            $table->string('divisi_pemateri')->nullable(false)->change();
        });
    }
};
