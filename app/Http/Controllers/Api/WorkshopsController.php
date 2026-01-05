<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\workshops;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\challenge_submissions;
use App\Models\workshop_participants;
use App\Models\workshops_progress;
class WorkshopsController extends Controller
{
    public function index()
    {
        $workshops = workshops::all();
        return response()->json([
            'workshops' => $workshops,
        ], 200);
    }
    public function show($id)
    {
        $workshop = workshops::find($id);
        return response()->json([
            'workshop' => $workshop,
        ], 200);
    }
    public function store(Request $request)
    {
        $instructor_id=auth()->user()->id;
        $workshop = workshops::create([
            'title' => $request->title,
            'description' => $request->description??null,
            'description_detailed' => $request->description_detailed??null,
            'instructor_id' => $instructor_id,
            'category' => $request->category,
            'date' => $request->date??null,
            'time' => $request->time??null,
            'location' => $request->location??null,
            'capacity' => $request->capacity??null,
            'duration' => $request->duration,
            'level' => $request->level,
            'price' => $request->price,
            'syllabus' => $request->syllabus??null,
        ]);
        return response()->json([
            'workshop' => $workshop,
        ], 201);
    }
    public function search(Request $request)
{
    $query = $request->get('q', '');    
    $workshops = workshops::with('instructor:id,name,role')
        ->where('title', 'LIKE', "%{$query}%")
        ->orWhere('description', 'LIKE', "%{$query}%")
        ->orWhere('unique_feature', 'LIKE', "%{$query}%")
        ->orWhereHas('instructor', function($q) use ($query) {
            $q->where('name', 'LIKE', "%{$query}%");
        })
        ->paginate(10);

    return response()->json(['workshops' => $workshops], 200);
}
public function Entroll($id,Request $request)
{
    $user_id=auth()->user()->id;
    $workshop=workshops::find($id);
    $workshop_participant=workshop_participants::create([
        'workshop_id' => $workshop->id,
        'user_id' => $user_id,
        'attendance_status' => $request->attendance_status,
        'progress' => $request->progress,
        'joined_at' => now(),
        'completed_at' => $request->completed_at??null,
    ]);
    return response()->json([
        'workshop_participant' => $workshop_participant,
    ], 200);
}
    private function determineStatus(int $percentage)
    {
        $percentage = $percentage;
        $status="not_started";
        switch (true) {
            case $percentage >= 100:
                $status = 'completed';
                break;
                  
            case $percentage >= 80:
                $status = 'almost_done';
                break;
                
            case $percentage >= 60:
                $status = 'on_track';
                break;
                
            case $percentage >= 30:
                $status = 'active';
                break;
                
            default:
                $status = 'not_started';
        }
        
        return $status;
    }

    public function Progress(Request $request)
    {
        $user_id = auth()->user()->id;

        $workshop = workshop_participants::where('user_id', $user_id)
                            ->first();

        if (!$workshop) {
            return response()->json([
                'message' => 'Unauthorized or Workshop Not Found',
            ], 403);
        }

        $start = \Carbon\Carbon::parse($request->start_date);
        $end   = \Carbon\Carbon::parse($request->end_date);
        $now   = \Carbon\Carbon::now();

        $totalDuration = $start->diffInDays($end) ?: 1;
        $progress = 0;
        $elapsed = 0;

        if ($now->gt($end)) {
            $progress = 100;
            $elapsed  = $totalDuration;
        } elseif ($now->lt($start)) {
            $progress = 0;
            $elapsed  = 0;
        } else {
            $elapsed  = $start->diffInDays($now);
            $progress = round(($elapsed / $totalDuration) * 100);
        }

        $workshopProgress = workshops_progress::updateOrCreate(
            [
                'workshop_participant_id' => $workshop->id,
            ],
            [
                'start_date'          => $start,
                'end_date'            => $end,
                'progress_percentage' => $progress,
                'days_elapsed'        => $elapsed,
                'days_total'          => $totalDuration,
                'status'              => $this->determineStatus($progress)
            ]
        );

        return response()->json([
            "message" => "Progress updated successfully",
            "details" => [
                "workshop_name" => $workshop->workshop->title,
                "progress"      => $progress . '%',
                "status"        => $workshopProgress->status,
                "start"         => $start->format('Y-m-d'),
                "end"           => $end->format('Y-m-d')
            ]
        ], 200);
    }

}
