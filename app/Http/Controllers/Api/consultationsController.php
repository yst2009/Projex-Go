<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Profile;
use App\Models\Project;
use App\Models\consultations;
use App\Http\Controllers\Controller;
use App\Notifications\professerjoinnmeeting;
class consultationsController extends Controller
{
public function index()
{
    $professors = User::where('user_type', 'professor')->get();
    return response()->json(['professors' => $professors], 200);
}



public function store(Request $request)
{
    // 1. هات البروجكت الخاص بالليدر الحالي
    $user_id = auth()->id(); // اختصار
    
    // ممكن هنا نختصر اللفة دي لو عامل علاقات في الموديل
    // $project = auth()->user()->profile->project; 
    
    // الطريقة الحالية (تمام):
    $profile = Profile::where('user_id', $user_id)->first();
    
    if (!$profile) {
        return response()->json(['message' => 'Profile not found'], 404);
    }

    $project = Project::where('user_profile_id', $profile->id)->first();

    // فحص: هل هو ليدر وعنده مشروع؟
    if (!$project) {
        return response()->json(['message' => 'You are not a Leader or have no project assigned'], 403);
    }

    // 2. هات البروفيسور وتأكد منه
    $professor = User::where('id', $request->professor_id)
                     ->where('user_type', 'professor')
                     ->first();

    // فحص: هل اليوزر المختار بروفيسور فعلاً؟
    if (!$professor) {
        return response()->json(['message' => 'The selected user is not a Professor'], 404);
    }

    // 3. الحفظ (Create Method أسرع وأنضف)
    $consultation = consultations::create([
        'professor_id'    => $professor->id,
        'project_id'      => $project->id,
        'field'           => $request->field,
        'hours_allocated' => $request->hours_allocated ?? 1, // قيمة افتراضية لو مبعتهاش
        'status'          => $request->status ?? 'pending',  // الحالة الافتراضية
        'scheduled_at'    => $request->scheduled_at,
        // باقي الحقول ممكن تكون null في البداية زي notes و link
        'meeting_link'    => $request->meeting_link,
        'professor_notes' => $request->professor_notes,
    ]);
    $notification = new professerjoinnmeeting($project, $professor);
    $professor->notify($notification);
    return response()->json([
        'message' => 'Consultation request created successfully',
        'data' => $consultation
    ], 201);
}




public function accept($id)
{
    $user_id = auth()->id();
    $consultation = consultations::where('id', $id)->where('professor_id', $user_id)->where('status', 'pending')->first();
    if (!$consultation) {
        return response()->json(['message' => 'Consultation not found'], 404);
    }
    $consultation->status = 'approved';
    $consultation->professor_notes = $request->professor_notes??"";
    $consultation->save();
    return response()->json([
        'message' => 'Consultation accepted successfully',
    ], 200);
}






public function reject(Request $request,$id)
{
    $user_id = auth()->id();
    $consultation = consultations::where('id', $id)->where('professor_id', $user_id)->where('status', 'pending')->first();
    if (!$consultation) {
        return response()->json(['message' => 'Consultation not found'], 404);
    }
    $consultation->status = 'rejected';
    $consultation->professor_notes = $request->professor_notes??"";
    $consultation->save();
    return response()->json([
        'message' => 'Consultation rejected successfully',
    ], 200);
}




public function complete_consultation($id)
{
    $user_id = auth()->id();
    $consultation = consultations::where('id', $id)->where('professor_id', $user_id)->where('status', 'approved')->first();
    if (!$consultation) {
        return response()->json(['message' => 'Consultation not found'], 404);
    }
    $consultation->status = 'completed';
    $consultation->professor_notes = $request->professor_notes??"";
    $consultation->save();
    return response()->json([
        'message' => 'Consultation completed successfully',
    ], 200);
}



public function show($id)
{
    $consultation = consultations::where('id', $id)->where('professor_id', auth()->id())->first();
    if (!$consultation) {
        return response()->json(['message' => 'Consultation not found'], 404);
    }
    return response()->json([
        'message' => 'Consultation found successfully',
        'data' => $consultation
    ], 200);
}
public function updatestatus(Request $request,$id)
{
    $user_id = auth()->id();
    $consultation = consultations::where('id', $id)->where('professor_id', $user_id)->first();
    if (!$consultation) {
        return response()->json(['message' => 'Consultation not found'], 404);
    }
    $consultation->status = $request->status;
    $consultation->professor_notes = $request->professor_notes??"";
    $consultation->save();
    return response()->json([
        'message' => 'Consultation status updated successfully',
    ], 200);

}


} 