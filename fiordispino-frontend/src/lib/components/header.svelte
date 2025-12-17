<script lang="ts">
    import {authService} from "$lib/services/auth";
    import {onMount} from "svelte";
    import type {User} from "$lib/types/api.types";

    let user = $state<User | null>(null);
    let isLoggedIn = $derived(!!user);
    let showUserMenu = $state(false);

    function toggleUserMenu() {
        showUserMenu = !showUserMenu;
    }

    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest('.user-menu-container')) {
            showUserMenu = false;
        }
    }

    async function handleLogout() {
        await authService.logout();
        user = null;
        showUserMenu = false;
        window.location.reload();
    }

    onMount(() => {
        user = authService.getCurrentUser()

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    });
</script>

<header class="bg-black/30 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-10">
    <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-4xl font-bold text-white mb-2">
                    <span class="bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">GameFeed</span>
                </h1>
                <p class="text-purple-300">Discover the best video games</p>
            </div>

            <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:block">
                <a href="/" class="flex items-center gap-2 px-6 py-2 rounded-full bg-slate-800/40 border border-purple-500/20 text-gray-300 hover:text-white hover:bg-purple-600/20 hover:border-purple-500/50 transition-all duration-300 shadow-lg shadow-purple-500/10 group">
                    <span class="font-medium tracking-wide">Home</span>
                </a>
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
                            <span class="text-white font-medium hidden sm:block">{user?.username}</span>
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
                                        <div>
                                            <p class="text-white font-semibold">{user?.username}</p>
                                            <p class="text-gray-400 text-sm">{user?.email}</p>
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

                                    <a
                                            href="/favorites"
                                            class="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-purple-600/20 hover:text-white transition-colors"
                                    >
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                        <span>Favorites</span>
                                    </a>

                                    <a
                                            href="/settings"
                                            class="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-purple-600/20 hover:text-white transition-colors"
                                    >
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>Settings</span>
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