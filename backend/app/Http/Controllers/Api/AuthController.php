<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Mail\PasswordResetMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Services\UnifiedEmailService;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Handle user login and return a token.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', strtolower($request->email))->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis sont incorrects.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    /**
     * Handle user registration.
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => strtolower($request->email),
            'password' => Hash::make($request->password),
            'role' => 'USER',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ], 201);
    }

    /**
     * Get the authenticated user.
     */
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'currentPassword' => 'nullable|string',
            'newPassword' => 'nullable|string|min:8',
        ]);

        if (! empty($validated['newPassword'])) {
            if (empty($validated['currentPassword'])) {
                return response()->json(['message' => 'Mot de passe actuel requis'], 400);
            }

            if (! Hash::check($validated['currentPassword'], $user->password)) {
                return response()->json(['message' => 'Mot de passe actuel incorrect'], 400);
            }

            $user->password = Hash::make($validated['newPassword']);
        }

        $user->name = $validated['name'];
        $user->email = strtolower($validated['email']);
        $user->save();

        return response()->json($user);
    }

    /**
     * Handle user logout.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnecté avec succès',
        ]);
    }

    /**
     * Send password reset link via email.
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', strtolower($request->email))->first();

        if (!$user) {
            return response()->json([
                'message' => 'Si cet email existe dans notre base, un lien de réinitialisation a été envoyé.'
            ], 200);
        }

        // Generate password reset token
        $token = Password::createToken($user);

        // Build reset URL (Frontend URL)
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
        $resetUrl = $frontendUrl . '/admin/reset-password?token=' . $token . '&email=' . urlencode($user->email);

        // Send styled email
        UnifiedEmailService::sendPasswordReset($user->name, $resetUrl, 60);

        return response()->json([
            'message' => 'Si cet email existe dans notre base, un lien de réinitialisation a été envoyé.'
        ], 200);
    }

    /**
     * Reset password using token.
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Reset password using Laravel's built-in password reset
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->password = Hash::make($password);
                $user->save();
            }
        );

        if ($status === Password::INVALID_USER) {
            throw ValidationException::withMessages([
                'email' => ['Nous ne trouvons pas cet utilisateur.'],
            ]);
        }

        if ($status === Password::INVALID_TOKEN) {
            throw ValidationException::withMessages([
                'token' => ['Ce lien de réinitialisation est invalide ou a expiré.'],
            ]);
        }

        return response()->json([
            'message' => 'Votre mot de passe a été réinitialisé avec succès.',
        ], 200);
    }
}
