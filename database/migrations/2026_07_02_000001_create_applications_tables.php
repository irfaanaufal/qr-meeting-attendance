<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('applications')) {
            Schema::create('applications', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->text('description')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('user_applications')) {
            Schema::create('user_applications', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->foreignId('application_id')->constrained()->cascadeOnDelete();
                $table->boolean('is_active')->default(false);
                $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamp('approved_at')->nullable();
                $table->timestamps();

                $table->unique(['user_id', 'application_id']);
            });
        }

        if (!Schema::hasTable('log_notifikasi')) {
            Schema::create('log_notifikasi', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->unsignedBigInteger('ticket_id')->nullable();
                $table->foreignId('actor_user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('actor_name')->nullable();
                $table->string('recipient_type', 20);
                $table->string('action', 40);
                $table->string('title');
                $table->text('message');
                $table->string('status')->nullable();
                $table->boolean('visible_in_bell')->default(true);
                $table->timestamp('read_at')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('log_notifikasi');
        Schema::dropIfExists('user_applications');
        Schema::dropIfExists('applications');
    }
};
