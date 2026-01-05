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
        Schema::create('mentor_progress_', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mentorship_id')->constrained()->cascadeOnDelete();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete(); // ضروري جداً زي ما قلت
            $table->decimal('progress_percentage', 5, 2)->default(0);  // 48.50
            $table->integer('days_elapsed')->default(0);
            $table->integer('days_total')->default(0);
            $table->integer('sessions_completed')->default(0);
            $table->integer('sessions_total')->default(0);
            $table->enum('status', [
                'not_started', 'active', 'on_track', 
                'almost_done', 'paused', 'completed'
            ])->default('not_started');
            $table->string('current_stage')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mentor_progress_');
    }
};
