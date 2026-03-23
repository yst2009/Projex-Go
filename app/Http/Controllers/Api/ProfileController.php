<?php

namespace App\Http\Controllers\Api;

use App\Models\Profile;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;

class ProfileController extends Controller
{
    public function index()
    {
        $profile = Profile::with('user')->where('user_id', auth()->id())->first();

        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        return response()
        ->json(['profile' => $profile], 200);
    }
    public function update(Request $request)
    {
        $user = auth()->user();
        $profile = Profile::where('user_id', $user->id)->first();

        if ($request->filled('name')) {
            $user->name = $request->name;
            $user->save();
        }

        $imagePath = $profile->image; 
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('profiles', 'public');
            $imagePath = '/storage/' . $path;
        }

    $profile = Profile::updateOrCreate(
        ['user_id' => $request->user()->id],
        [
            'skills'         => $request->skills,
            'portfolio_link' => $request->portfolio_link,
            'cv_link'        => $request->cv_link,
            'bio_detailed'   => $request->bio_detailed,
            'linkedin_url'   => $request->linkedin_url,
        ]
    );
        $profile->load('user'); 
        
        return response()->json([
            'message' => 'Profile updated successfully',
            'profile' => $profile
        ], 200);
    }


    public function show($id)
    {
        $profile = Profile::with('user')->findOrFail($id);
        return response()->json(['profile' => $profile], 200);
    }

    public function SearchUsers(Request $request)
    {
        $skills = $request->input('skills');
        
        if (!$skills) {
             return response()->json(['profiles' => []], 200);
        }

        $profiles = Profile::with('user')
            ->where('skills', 'like', '%' . $skills . '%')
            ->get();

        return response()->json(['profiles' => $profiles], 200);
    }
}
