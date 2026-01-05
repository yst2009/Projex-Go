<?php 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ProjectsController;
use App\Http\Controllers\Api\MentorshipsController;
use App\Http\Controllers\Api\consultationsController;
use App\Http\Controllers\Api\InvestmentsController;
use App\Http\Controllers\Api\MessagesController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\WorkshopsController;
use App\Http\Controllers\Api\ChallengesController;
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post('/register', [AuthController::class, 'Register']);
Route::post('/login', [AuthController::class, 'Login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'Logout']);
Route::middleware('auth:sanctum')->post('/delete', [AuthController::class, 'delete']);
Route::middleware('auth:sanctum')->get('/profile', [ProfileController::class, 'index']);
Route::middleware('auth:sanctum')->get('/profile/search', [ProfileController::class, 'SearchUsers']);
Route::middleware('auth:sanctum')->post('/profile/update', [ProfileController::class, 'update']);
Route::middleware('auth:sanctum')->post('/profile/create', [ProfileController::class, 'create']);
Route::middleware('auth:sanctum')->get('/profile/{id}', [ProfileController::class, 'show']);
Route::middleware('auth:sanctum')->delete('/profile/{id}', [ProfileController::class, 'destroy']);
Route::middleware('auth:sanctum')->post('/user/update', [ProfileController::class, 'update_user']);
Route::middleware('auth:sanctum')->get('/projects', [ProjectsController::class, 'index']);
Route::middleware('auth:sanctum')->post('/projects/create', [ProjectsController::class, 'create']);
Route::middleware('auth:sanctum')->post('/projects/update', [ProjectsController::class, 'update']);
Route::middleware('auth:sanctum')->post('/projects/destroy', [ProjectsController::class, 'destroy']);
Route::middleware('auth:sanctum')->get('/projects/team', [ProjectsController::class, 'ShowAllTeam']);
Route::middleware('auth:sanctum')->post('/projects/invite', [ProjectsController::class, 'inviteMember']);
Route::middleware('auth:sanctum')->post('/projects/accept', [ProjectsController::class, 'accept']);
Route::middleware('auth:sanctum')->post('/projects/reject', [ProjectsController::class, 'reject']);
Route::middleware('auth:sanctum')->post('/projects/DeleteMemeber', [ProjectsController::class, 'DeleteMemeber']);
Route::middleware('auth:sanctum')->post('/projects/RequirmentofTheProject', [ProjectsController::class, 'CreateRequirmentofTheProject']);
Route::middleware('auth:sanctum')->get('/projects/edit', [ProjectsController::class, 'edit']);
Route::middleware('auth:sanctum')->get('/projects/{id}', [ProjectsController::class, 'show']);
Route::middleware('auth:sanctum')->get('/mentorships', [MentorshipsController::class, 'index']);
Route::middleware('auth:sanctum')->post('/mentorships/searchmentorbyskills', [MentorshipsController::class, 'searchmentorbyskills']);
Route::middleware('auth:sanctum')->post('/mentorships/store', [MentorshipsController::class, 'store']);
Route::middleware('auth:sanctum')->post('/mentorships/invitemember', [MentorshipsController::class, 'invitemember']);
Route::middleware('auth:sanctum')->post('/mentorships/accept', [MentorshipsController::class, 'accept']);
Route::middleware('auth:sanctum')->post('/mentorships/reject', [MentorshipsController::class, 'reject']);
Route::middleware('auth:sanctum')->post('/mentorships/progress', [MentorshipsController::class, 'Progress']);
Route::middleware('auth:sanctum')->post('/mentorships/ShowProgress', [MentorshipsController::class, 'ShowProgress']);
Route::middleware('auth:sanctum')->post('/consultations/store', [consultationsController::class, 'store']);
Route::middleware('auth:sanctum')->post('/consultations/index', [consultationsController::class, 'index']);
Route::middleware('auth:sanctum')->post('/consultations/accept/{id}', [consultationsController::class, 'accept']);
Route::middleware('auth:sanctum')->post('/consultations/reject/{id}', [consultationsController::class, 'reject']);
Route::middleware('auth:sanctum')->post('/consultations/complete/{id}', [consultationsController::class, 'complete_consultation']);
Route::middleware('auth:sanctum')->post('/consultations/show/{id}', [consultationsController::class, 'show']);
Route::middleware('auth:sanctum')->post('/consultations/updatestatus/{id}', [consultationsController::class, 'updatestatus']);
Route::middleware('auth:sanctum')->post('/consultations/schedule/{id}', [consultationsController::class, 'schedule']);
Route::middleware('auth:sanctum')->post('/investors', [InvestmentsController::class, 'index']);
Route::middleware('auth:sanctum')->post('/investments/propose', [InvestmentsController::class, 'propose']);
Route::middleware('auth:sanctum')->post('/investments/accept/{id}', [InvestmentsController::class, 'accept']);
Route::middleware('auth:sanctum')->post('/investments/show/{id}', [InvestmentsController::class, 'show']);
Route::middleware('auth:sanctum')->post('/investments/reject/{id}', [InvestmentsController::class, 'reject']);
Route::middleware('auth:sanctum')->post('/investments/complete/{id}', [InvestmentsController::class, 'complete']);
Route::middleware('auth:sanctum')->post('/messages/store', [MessagesController::class, 'store']);
Route::middleware('auth:sanctum')->post('/messages/getmessages_sender', [MessagesController::class, 'getmessages_sender']);
Route::middleware('auth:sanctum')->post('/messages/getmessages_receiver', [MessagesController::class, 'getmessages_receiver']);
Route::middleware('auth:sanctum')->post('/messages/showallnotifications', [MessagesController::class, 'showallnotifications']);
Route::middleware('auth:sanctum')->post('/messages/makeread/{id}', [MessagesController::class, 'Make_Read']);
Route::middleware('auth:sanctum')->post('/dashboard/user', [DashboardController::class, 'index']);
Route::middleware('auth:sanctum')->post('/dashboard/project/{id}', [DashboardController::class, 'analytics']);
Route::middleware('auth:sanctum')->post('/dashboard/stats', [DashboardController::class, 'stats']);
Route::middleware('auth:sanctum')->post('/workshops', [WorkshopsController::class, 'index']);
Route::middleware('auth:sanctum')->post('/workshops/show/{id}', [WorkshopsController::class, 'show']);
Route::middleware('auth:sanctum')->post('/workshops/store', [WorkshopsController::class, 'store']);
Route::middleware('auth:sanctum')->post('/workshops/search', [WorkshopsController::class, 'search']);
Route::middleware('auth:sanctum')->post('/workshops/entroll/{id}', [WorkshopsController::class, 'Entroll']);
Route::middleware('auth:sanctum')->post('/workshops/progress', [WorkshopsController::class, 'Progress']);
Route::middleware('auth:sanctum')->post('/challenges', [ChallengesController::class, 'index']);
Route::middleware('auth:sanctum')->post('/challenges/store', [ChallengesController::class, 'store']);
Route::middleware('auth:sanctum')->post('/challenges/submit/{id}', [ChallengesController::class, 'submit']);
Route::middleware('auth:sanctum')->post('/challenges/accept/{id}', [ChallengesController::class, 'accept']);
Route::middleware('auth:sanctum')->post('/challenges/reject/{id}', [ChallengesController::class, 'reject']);
Route::middleware('auth:sanctum')->post('/challenges/Review/{id}', [ChallengesController::class, 'Review']);













