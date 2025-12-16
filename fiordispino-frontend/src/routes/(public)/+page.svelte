<script lang="ts">
    import {authService} from "$lib/services/auth";
    import { invalidateAll } from '$app/navigation';
    import { onMount } from "svelte";
    import type {Game, GenreInfo, User} from "$lib/types/api.types";
    import {libraryService} from "$lib/services/library";
    import {gameService} from "$lib/services/game";

    let { data } = $props();
    let games = $derived(data.games);
    let error = $derived(data.error);

    const user = {
        username: "GamerPro",
        email: "gamer@example.com",
        avatar: "https://ui-avatars.com/api/?name=Gamer+Pro&background=9333ea&color=fff&size=128"
    };

    let isLoggedIn = $state(false);
    let loading = true;
    let userObject: User;

    onMount(async () => {
        try {
            userObject = await authService.getUser();
            user.username = userObject.username;
            user.email = userObject.email;
            user.avatar = "https://ui-avatars.com/api/?name=" + userObject.username + "&background=9333ea&color=fff&size=256";
            isLoggedIn = true
        } catch (err) {
            isLoggedIn = false
        } finally {
            loading = false;
        }
    });


    let showUserMenu = $state(false);
    let isRetrying = $state(false);

    async function handleRetry() {
        isRetrying = true;
        await invalidateAll(); // Riesegue la load() in +page.ts
        isRetrying = false;
    }

    function toggleUserMenu() {
        showUserMenu = !showUserMenu;
    }

    async function handleLogout() {
        await authService.logout();
        showUserMenu = false;
        isLoggedIn = false;
        user.username = "";
        user.email = "";
        user.avatar = "";
    }

    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest('.user-menu-container')) {
            showUserMenu = false;
        }
    }

    onMount(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    });

    function formatRating(rating: number | undefined): string {
        return rating ? rating.toFixed(1) : 'N/A';
    }
</script>

<!-- Header -->
<header class="bg-black/30 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-10">
    <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-4xl font-bold text-white mb-2">
                    <span class="bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">GameFeed</span>
                </h1>
                <p class="text-purple-300">Discover the best video games</p>
            </div>

            <div class="flex items-center gap-4">
                <!-- Auth Buttons / User Menu -->
                {#if !isLoggedIn}
                    <!-- Login/Signup Button -->
                    <a
                            href="/auth"
                            class="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30"
                    >
                        Sign In
                    </a>
                {:else}
                    <!-- User Menu -->
                    <div class="relative user-menu-container">
                        <button
                                onclick={toggleUserMenu}
                                class="flex items-center gap-3 px-4 py-2 bg-slate-800/50 hover:bg-slate-800/70 border border-purple-500/30 hover:border-purple-500/50 rounded-lg transition-all"
                        >
                            <img
                                    src={user.avatar}
                                    alt={user.username}
                                    class="w-8 h-8 rounded-full ring-2 ring-purple-500/50"
                            />
                            <span class="text-white font-medium hidden sm:block">{user.username}</span>
                            <svg
                                    class="w-4 h-4 text-gray-400 transition-transform {showUserMenu ? 'rotate-180' : ''}"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <!-- Dropdown Menu -->
                        {#if showUserMenu}
                            <div class="absolute right-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-2xl shadow-purple-500/20 overflow-hidden animate-slideDown">
                                <!-- User Info -->
                                <div class="p-4 border-b border-purple-500/20 bg-black/20">
                                    <div class="flex items-center gap-3 mb-2">
                                        <img
                                                src={user.avatar}
                                                alt={user.username}
                                                class="w-12 h-12 rounded-full ring-2 ring-purple-500/50"
                                        />
                                        <div>
                                            <p class="text-white font-semibold">{user.username}</p>
                                            <p class="text-gray-400 text-sm">{user.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Menu Items -->
                                <div class="py-2">
                                    <a
                                            href="/profile"
                                            class="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-purple-600/20 hover:text-white transition-colors"
                                    >
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span>My Profile</span>
                                    </a>

                                    <a
                                            href="/profile/my-library"
                                            class="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-purple-600/20 hover:text-white transition-colors"
                                    >
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                        <span>My Library</span>
                                    </a>
                                </div>

                                <!-- Logout -->
                                <div class="border-t border-purple-500/20 py-2">
                                    <button
                                            onclick={handleLogout}
                                            class="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-600/20 hover:text-red-300 transition-colors"
                                    >
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        {/if}
                    </div>
                {/if}
            </div>
        </div>
    </div>
</header>

<main class="container mx-auto px-4 py-8">
    {#if error}
        <div class="bg-red-500/10 border border-red-500 rounded-lg p-6 text-center">
            <p class="text-red-400 text-lg">{error}</p>
            <button
                    onclick={handleRetry}
                    disabled={isRetrying}
                    class="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg transition"
            >
                {isRetrying ? 'Retrying...' : 'Retry'}
            </button>
        </div>
    {:else if games.length > 0}
        <div class="space-y-8">
            {#if games[0]}
                <div class="relative h-96 rounded-2xl overflow-hidden group cursor-pointer">
                    <!-- todo placeholder -->
                    <img src="data:image/jpg;base64,{games[0].box_art}" alt={games[0].title} class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
                        <div class="absolute bottom-0 left-0 right-0 p-8">
                            <h2 class="text-4xl font-bold text-white mb-3">{games[0].title}</h2>
                        </div>
                    </div>
                </div>
            {/if}

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                {#each games.slice(1, 5) as game}
                    <div class="bg-slate-800/50 p-5 rounded">
                        <h3 class="text-white">{game.title}</h3>
                    </div>
                {/each}
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                {#each games.slice(5) as game}
                    <div class="bg-slate-800/50 p-3 rounded">
                        <h4 class="text-white">{game.title}</h4>
                    </div>
                {/each}
            </div>
        </div>
    {:else}
        <div class="text-center text-white py-10">
            <p class="text-xl">No game found!</p>
        </div>
    {/if}
</main>