<script lang="ts">
    import { onMount } from 'svelte';
    import { authService } from "$lib/services/auth";
    import type {LoginUserRequest, RegisterUserRequest} from "$lib/types/api.types";
    import {goto} from "$app/navigation";

    let isLogin = true; // true = login, false = registrazione
    let loading = false;
    let errorMessage = '';
    let successMessage = '';

    // Form data
    let email = '';
    let password = '';
    let confirmPassword = '';
    let username = '';

    // Validazione
    let errors = {
        email: '',
        password: '',
        confirmPassword: '',
        username: ''
    };

    function toggleMode(mode: boolean) {
        isLogin = mode;
        clearForm();
        errorMessage = '';
        successMessage = '';
    }

    function clearForm() {
        email = '';
        password = '';
        confirmPassword = '';
        username = '';
        errors = {
            email: '',
            password: '',
            confirmPassword: '',
            username: ''
        };
    }

    function validateEmail(email: string): boolean {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validateForm(): boolean {
        let isValid = true;
        errors = {
            email: '',
            password: '',
            confirmPassword: '',
            username: ''
        };

        // Email validation
        if (!email) {
            errors.email = 'Email is required';
            isValid = false;
        } else if (!validateEmail(email)) {
            errors.email = 'Invalid email address';
            isValid = false;
        }

        // Password validation
        if (!password) {
            errors.password = 'Password is required';
            isValid = false;
        } else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        // Registration validation
        if (!isLogin) {
            if (!username) {
                errors.username = 'Username is required';
                isValid = false;
            } else if (username.length < 3) {
                errors.username = 'Username must be at least 3 characters';
                isValid = false;
            }

            if (!confirmPassword) {
                errors.confirmPassword = 'Please confirm your password';
                isValid = false;
            } else if (password !== confirmPassword) {
                errors.confirmPassword = 'Passwords do not match';
                isValid = false;
            }
        }

        return isValid;
    }

    async function handleSubmit(e: Event) {
        e.preventDefault();
        errorMessage = '';
        successMessage = '';

        if (!validateForm()) {
            return;
        }

        loading = true;

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (isLogin) {
            // Simulate login
            successMessage = 'Login successful! Redirecting...';
            setTimeout(() => {
                // Here you would redirect to dashboard
                console.log('Redirect to dashboard');
            }, 1500);
        } else {
            // Simulate registration
            successMessage = 'Registration complete! You can now sign in.';
            setTimeout(() => {
                isLogin = true;
                clearForm();
                successMessage = '';
            }, 2000);
        }

        loading = false;
    }

    // Animazione particelle
    let particles: Array<{x: number, y: number, size: number, delay: number}> = [];

    onMount(() => {
        // Generate random particles for background
        for (let i = 0; i < 20; i++) {
            particles.push({
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 4 + 2,
                delay: Math.random() * 5
            });
        }
        particles = particles;
    });

    function submit() {
        loading = true;

        if(isLogin) {
            const loginUserRequest: LoginUserRequest = {
                email: email,
                password: password,
            };

            authService.login(loginUserRequest).then(() => {
                errorMessage = ""
                successMessage = 'Login successful!';
                setTimeout(() => {
                    loading = false;
                    goto('/');
                }, 2000);
            }).catch((error: any) => {
                password = ""
                loading = false;
                errorMessage = error.message;
            });
        } else {
            const registerUserRequest: RegisterUserRequest = {
                username: username,
                email: email,
                password: password,
                password2: confirmPassword,
            }

            authService.register(registerUserRequest).then(() => {
                errorMessage = ""
                successMessage = 'Registration successful!';
                setTimeout(() => {
                    loading = false;
                    goto('/');
                }, 2000);
            }).catch((error: any) => {
                loading = false;
                console.log(error.message);
                errorMessage = error.message;
            });
        }
    }
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Animated background particles -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
        {#each particles as particle}
            <div
                    class="absolute rounded-full bg-purple-500/20 animate-float"
                    style="left: {particle.x}%; top: {particle.y}%; width: {particle.size}px; height: {particle.size}px; animation-delay: {particle.delay}s;"
            ></div>
        {/each}
    </div>

    <!-- Fixed Logo/Header at top -->
    <div class="absolute top-8 left-8 z-10">
        <a href="/" class="flex items-center gap-2 text-white hover:text-purple-400 transition-colors">
            <span class="text-3xl">🎮</span>
            <span class="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
        Fiordispino
      </span>
        </a>
    </div>

    <!-- Main card -->
    <div class="w-full max-w-md relative z-10">
        <div class="bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-500/20 overflow-hidden">
            <!-- Header with tabs -->
            <div class="bg-black/30 p-6 border-b border-purple-500/20">
                <div class="flex gap-4 mb-4">
                    <button
                            on:click={() => toggleMode(true)}
                            class="flex-1 py-3 px-4 rounded-lg font-semibold transition-all {isLogin
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
              : 'bg-transparent text-gray-400 hover:text-white'}"
                            disabled={loading}
                    >
                        Login
                    </button>
                    <button
                            on:click={() => toggleMode(false)}
                            class="flex-1 py-3 px-4 rounded-lg font-semibold transition-all {!isLogin
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
              : 'bg-transparent text-gray-400 hover:text-white'}"
                            disabled={loading}
                    >
                        Sign Up
                    </button>
                </div>

                <div class="text-center">
                    <h2 class="text-2xl font-bold text-white mb-2">
                        {isLogin ? 'Welcome Back!' : 'Create Your Account'}
                    </h2>
                    <p class="text-purple-300 text-sm">
                        {isLogin ? 'Sign in to continue your adventure' : 'Join the gaming community'}
                    </p>
                </div>
            </div>

            <!-- Form -->
            <form on:submit={handleSubmit} class="p-6 space-y-5">
                <!-- Messages -->
                {#if errorMessage}
                    <div class="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-400 text-sm animate-shake">
                        {errorMessage}
                    </div>
                {/if}

                {#if successMessage}
                    <div class="bg-green-500/10 border border-green-500 rounded-lg p-4 text-green-400 text-sm animate-pulse">
                        ✓ {successMessage}
                    </div>
                {/if}

                <!-- Username (registration only) -->
                {#if !isLogin}
                    <div>
                        <label for="username" class="block text-purple-300 text-sm font-medium mb-2">
                            Username
                        </label>
                        <input
                                type="text"
                                id="username"
                                bind:value={username}
                                disabled={loading}
                                class="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Your username"
                        />
                        {#if errors.username}
                            <p class="mt-2 text-red-400 text-xs">{errors.username}</p>
                        {/if}
                    </div>
                {/if}

                <!-- Email -->
                <div>
                    <label for="email" class="block text-purple-300 text-sm font-medium mb-2">
                        Email
                    </label>
                    <input
                            type="email"
                            id="email"
                            bind:value={email}
                            disabled={loading}
                            class="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="name@example.com"
                    />
                    {#if errors.email}
                        <p class="mt-2 text-red-400 text-xs">{errors.email}</p>
                    {/if}
                </div>

                <!-- Password -->
                <div>
                    <label for="password" class="block text-purple-300 text-sm font-medium mb-2">
                        Password
                    </label>
                    <input
                            type="password"
                            id="password"
                            bind:value={password}
                            disabled={loading}
                            class="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="••••••••"
                    />
                    {#if errors.password}
                        <p class="mt-2 text-red-400 text-xs">{errors.password}</p>
                    {/if}
                </div>

                <!-- Confirm Password (registration only) -->
                {#if !isLogin}
                    <div>
                        <label for="confirmPassword" class="block text-purple-300 text-sm font-medium mb-2">
                            Confirm Password
                        </label>
                        <input
                                type="password"
                                id="confirmPassword"
                                bind:value={confirmPassword}
                                disabled={loading}
                                class="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="••••••••"
                        />
                        {#if errors.confirmPassword}
                            <p class="mt-2 text-red-400 text-xs">{errors.confirmPassword}</p>
                        {/if}
                    </div>
                {/if}

                <!-- Forgot password (login only) -->
                {#if isLogin}
                    <div class="text-right">
                        <a href="/forgot-password" class="text-purple-400 hover:text-purple-300 text-sm transition-colors">
                            Forgot password?
                        </a>
                    </div>
                {/if}

                <!-- Submit Button -->
                <button
                        on:click={submit}
                        type="submit"
                        disabled={loading}
                        class="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
                >
                    {#if loading}
                        <div class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        <span>Loading...</span>
                    {:else}
                        <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                        <span>→</span>
                    {/if}
                </button>

                <!-- Divider -->
                <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-purple-500/20"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-4 bg-slate-800/70 text-gray-400">or</span>
                    </div>
                </div>

                <!-- Social Login -->
                <div class="grid grid-cols-2 gap-3">
                    <button
                            type="button"
                            disabled={loading}
                            class="py-3 px-4 bg-slate-900/50 border border-purple-500/30 hover:border-purple-500/50 rounded-lg text-white transition-all hover:bg-slate-900/70 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                        </svg>
                        <span class="text-sm">Google</span>
                    </button>

                    <button
                            type="button"
                            disabled={loading}
                            class="py-3 px-4 bg-slate-900/50 border border-purple-500/30 hover:border-purple-500/50 rounded-lg text-white transition-all hover:bg-slate-900/70 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span class="text-sm">GitHub</span>
                    </button>
                </div>
            </form>

            <!-- Footer -->
            <div class="bg-black/30 px-6 py-4 border-t border-purple-500/20 text-center">
                <p class="text-gray-400 text-sm">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                    <button
                            on:click={() => toggleMode(!isLogin)}
                            disabled={loading}
                            class="text-purple-400 hover:text-purple-300 font-semibold ml-1 transition-colors disabled:opacity-50"
                    >
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </div>
        </div>

        <!-- Additional info -->
        <div class="mt-6 text-center text-gray-400 text-xs">
            <p>By continuing, you agree to our <a href="/terms" class="text-purple-400 hover:text-purple-300">Terms of Service</a></p>
            <p>and <a href="/privacy" class="text-purple-400 hover:text-purple-300">Privacy Policy</a></p>
        </div>
    </div>
</div>

<style>
    :global(body) {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }

    @keyframes float {
        0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
        }
        50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.6;
        }
    }

    .animate-float {
        animation: float 6s ease-in-out infinite;
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }

    .animate-shake {
        animation: shake 0.3s ease-in-out;
    }
</style>