<script lang="ts">
    import type {User} from "$lib/types/api.types";
    import {onMount} from "svelte";
    import {authService} from "$lib/services/auth";

    let isLoggedIn = $state(false);
    let userObject: User;
    let showUserMenu = $state(false);

    let user = $state({
        username: "GamerPro",
        email: "gamer@example.com",
        avatar: "https://ui-avatars.com/api/?name=Gamer+Pro&background=9333ea&color=fff&size=128"
    });

    onMount(async () => {
        try {
            userObject = await authService.getUser();
            user.username = userObject.username;
            user.email = userObject.email;
            user.avatar = "https://ui-avatars.com/api/?name=" + userObject.username + "&background=9333ea&color=fff&size=256";
            isLoggedIn = true
        } catch (err) {
            isLoggedIn = false
        }
    });

    onMount(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    });

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
</script>

<!-- Header -->
<header class="bg-black/30 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-10">
    <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
            <div>
                <a href="/" class="inline-block cursor-pointer hover:opacity-80 transition-opacity">
                    <h1 class="text-4xl font-bold text-white mb-2">
                        <span class="bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">Fiordispino</span>
                    </h1>
                    <p class="text-purple-300">Discover the best video games</p>
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