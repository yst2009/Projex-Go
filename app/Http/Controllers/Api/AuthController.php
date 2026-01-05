<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
class AuthController extends Controller
{
    public function Register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'user_type' => $request->user_type
        ]);

        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json(['token' => $token], 201);
    }
    public function Login(Request $request)
    {
        if(!Auth::attempt($request->only('email', 'password'))){
            return response()->json(['error','unauthorized'],401);
        }
        $token = Auth::user()->createToken('authToken')->plainTextToken;

        return response()->json(['token' => $token], 200);
    }
    public function Logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete;
        return response()->json(['message' => 'Successfully logged out'], 200);
    }
    public function delete(Request $request)
    {
        $request->user()->delete();
        return response()->json(['message' => 'Successfully deleted'], 200);
    }
}
