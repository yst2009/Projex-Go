<?php

namespace App\Http\Controllers\Api;

use App\Models\Profile;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
class ProfileController extends Controller
{
    public function update_user(Request $request){

        $user = User::where('id', auth()->user()->id)->first();
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        $user->name=$request->name;
        $user->email=$request->email;
        $user->password=$request->password;
        $user->save();
        return response()->json(['message' => 'User updated', 'user' => $user], 200);
    
    }
    public function create(Request $request){

        $profile = new Profile();
        $profile->user_id = auth()->user()->id;
        $profile->skills=$request->skills;
        $profile->portfolio_link=$request->portfolio_link;
        $profile->cv_link=$request->cv_link;
        $profile->bio_detailed=$request->bio_detailed;
        $profile->linkedin_url=$request->linkedin_url;
        $profile->save();
        return response()->json(['message' => "Profile created successfully"], 200);
    }
    public function index()
    {
        $profile = Profile::where('user_id', auth()->user()->id)->first();
        return response()->json(['profile' => $profile], 200);
    }

    public function update(Request $request)
    {
        $profile = Profile::where('user_id', auth()->user()->id)->first();
        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }
        $user = User::where('id', auth()->user()->id)->first();
        $user->name=$request->name;
        $user->email=$request->email;
        $user->password=$request->password;
        $user->save();
        $profile->skills=$request->skills;
        $profile->portfolio_link=$request->portfolio_link;
        $profile->cv_link=$request->cv_link;
        $profile->bio_detailed=$request->bio_detailed;
        $profile->linkedin_url=$request->linkedin_url;
        $profile->save();
        return response()->json(['message' => 'User updated','user' => $user, 'profile' => $profile], 200);
    }
    public function show($id){

        $profile =Profile::findOrFail($id);
        return response()->json(['profile' => $profile], 200);

    }
    public function destroy($id){

        $profile =Profile::findOrFail($id);
        $profile->delete();
        return response()->json(['message' => 'Profile deleted successfully'], 200);

    }
    public function SearchUsers(Request $request)
    {

        $skills = $request->input('skills');
        $profiles = Profile::where('skills', 'like', '%' . $skills . '%')->get();
        if($profiles->isEmpty()){
            return response()->json(['message' => 'No profiles found'], 404);
        }
        return response()->json(['profiles' => $profiles], 200);
    }
}
