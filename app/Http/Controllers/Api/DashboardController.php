<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Models\Project;
use App\Models\TeamMember;
use App\Models\investments;
use App\Models\consultations;
use App\Models\messages;
use App\Models\Project_Requirement;
use App\Models\User;
use App\Models\challenges;

use App\Models\workshops;
class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        // 1. جلب البروفايل (تأكد من وجوده لتجنب الأخطاء)
        $profile = Profile::where('user_id', $user->id)->first();
        
        if (!$profile) {
            return response()->json(['message' => 'User profile not found'], 404);
        }

        // 2. جلب أرقام المشاريع (IDs) الخاصة بالمستخدم للبحث بها لاحقاً
        // ملاحظة: استخدامك السابق لـ $total_projects داخل الـ where كان خطأ منطقي (لأنه مجرد رقم عددي)
        $projectIds = Project::where('user_profile_id', $profile->id)->first();
        
        // 3. بناء مصفوفة الإحصائيات (استخدام Key => Value الصحيح)
        $stats = [
            'total_projects' => $projectIds->count(),
            
            'mentorships' => TeamMember::where('project_id', $projectIds->id) // استخدام whereIn بدلاً من where
                                    ->where('role', 'Mentorship')
                                    ->count(),
                                    
            'team_members' => TeamMember::where('project_id', $projectIds->id)
                                        ->where('role', '!=', 'Mentorship')
                                        ->count(),

            'total_investments' => investments::where('project_id', $projectIds->id) // اسم الموديل Investment (كبير)
                                            ->where('status', 'accepted')
                                            ->count(),

            'total_consultations' => consultations::where('project_id', $projectIds->id) // اسم الموديل Consultation (كبير)
                                                ->where('status', 'approved')
                                                ->count(),

            'total_messages_sent' => messages::where('sender_id', $user->id) // اسم الموديل Message (كبير)
                                            ->count(),

            'total_messages_received' => messages::where('receiver_id', $user->id)
                                                ->count(),

            'total_notifications' => $user->notifications()->count(), // هذه صحيحة وتستخدم العلاقة في موديل User
        ];

        return response()->json([
            'dashboard' => 'dashboard',
            'Data' => $stats,
        ], 200);
    }
 public function analytics($id)
 {
    $user = auth()->user();

    // 1. التأكد أن المستخدم يملك بروفايل
    $profile = Profile::where('user_id', $user->id)->first();
    if (!$profile) {
        return response()->json(['message' => 'Profile not found'], 404);
    }

    // 2. جلب المشروع والتحقق من ملكيته (Authorization)
    // نتحقق أن المشروع موجود وأن user_profile_id يطابق بروفايل المستخدم الحالي
    $project = Project::where('id', $id)
                      ->where('user_profile_id', $profile->id)
                      ->first();

    if (!$project) {
        return response()->json(['message' => 'Project not found or unauthorized'], 404);
    }

    // 3. تجميع الإحصائيات لهذا المشروع فقط
    $analytics = [
        'project_info' => [
            'id' => $project->id,
            'title' => $project->title,
        ],
        
        // أعضاء الفريق
        'team_stats' => [
            'total_members' => TeamMember::where('project_id', $id)->count(),
            'mentors' => TeamMember::where('project_id', $id)->where('role', 'Mentorship')->count(),
            'regular_members' => TeamMember::where('project_id', $id)->where('role', '!=', 'Mentorship')->count(),
        ],

        // الاستثمارات (من موديل investments)
        'investments_stats' => [
            'total' => investments::where('project_id', $id)->count(),
            'accepted' => investments::where('project_id', $id)->where('status', 'accepted')->count(),
            'pending' => investments::where('project_id', $id)->where('status', 'pending')->count(),
        ],

        // الاستشارات (من موديل consultations)
        'consultations_stats' => [
            'total' => consultations::where('project_id', $id)->count(),
            'approved' => consultations::where('project_id', $id)->where('status', 'approved')->count(),
        ],

        // متطلبات المشروع (من موديل Project_Requirement)
        'requirements_count' => Project_Requirement::where('project_id', $id)->count(),
    ];

    return response()->json([
        'status' => 'success',
        'data' => $analytics
    ], 200);
 }
 public function stats()
 {
        $stats = [
            // إحصائيات المستخدمين
            'users' => [
                'total_users' => User::count(),
                'new_this_week' => User::where('created_at', '>=', now()->subWeek())->count(),
            ],

            // إحصائيات المشاريع
            'projects' => [
                'total_projects' => Project::count(),
                'active_projects' => Project::where('status', 'active')->count(), // افترضت وجود status
                'completed_projects' => Project::where('status', 'completed')->count(),
            ],

            // إحصائيات مالية واستثمارية (من موديل investments)
            'investments' => [
                'total_count' => investments::count(),
                'accepted_count' => investments::where('status', 'accepted')->count(),
                // لو عندك عمود للمبلغ (amount) يمكن جمعه
                'total_amount' => investments::where('status', 'accepted')->sum('amount'), 
            ],

            // إحصائيات الاستشارات (من موديل consultations)
            'consultations' => [
                'total_count' => consultations::count(),
                'pending_count' => consultations::where('status', 'pending')->count(),
            ],
            
            // إحصائيات الفرق
            'teams' => [
                'total_members' => TeamMember::count(),
                'mentors_count' => TeamMember::where('role', 'Mentorships')->count(),
            ],
            'challenges' => [
                'total_challenges' => challenges::count(),
            ],
            'workshops' => [
                'total_workshops' => workshops::count(),
            ],
        ];

        return response()->json([
            'status' => 'success',
            'data' => $stats
        ], 200);
    }
}

