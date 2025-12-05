<script lang="ts">
    import { onMount } from 'svelte';

    interface Genre {
        id: number;
        name: string;
    }

    interface Game {
        id: number;
        name: string;
        background_image: string;
        rating: number;
        released: string;
        genres: Genre[];
        playtime: number;
    }

    // Mock user state for testing - toggle this to test logged in/out states
    let isLoggedIn = false;
    let showUserMenu = false;

    // Mock user data
    const mockUser = {
        username: "GamerPro",
        email: "gamer@example.com",
        avatar: "https://ui-avatars.com/api/?name=Gamer+Pro&background=9333ea&color=fff&size=128"
    };

    function toggleLogin() {
        isLoggedIn = !isLoggedIn;
        showUserMenu = false;
    }

    function toggleUserMenu() {
        showUserMenu = !showUserMenu;
    }

    function handleLogout() {
        isLoggedIn = false;
        showUserMenu = false;
    }

    // Close dropdown when clicking outside
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

    // Dati mock per testing
    const mockGames: Game[] = [
        {
            id: 1,
            name: "The Witcher 3: Wild Hunt",
            background_image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=600&fit=crop",
            rating: 4.8,
            released: "2015-05-19",
            playtime: 120,
            genres: [
                { id: 1, name: "RPG" },
                { id: 2, name: "Action" }
            ]
        },
        {
            id: 2,
            name: "Cyberpunk 2077",
            background_image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop",
            rating: 4.3,
            released: "2020-12-10",
            playtime: 80,
            genres: [
                { id: 1, name: "RPG" },
                { id: 3, name: "Sci-Fi" }
            ]
        },
        {
            id: 3,
            name: "Elden Ring",
            background_image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&h=600&fit=crop",
            rating: 4.9,
            released: "2022-02-25",
            playtime: 100,
            genres: [
                { id: 2, name: "Action" },
                { id: 4, name: "Souls-like" }
            ]
        },
        {
            id: 4,
            name: "Red Dead Redemption 2",
            background_image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop",
            rating: 4.7,
            released: "2018-10-26",
            playtime: 95,
            genres: [
                { id: 2, name: "Action" },
                { id: 5, name: "Adventure" }
            ]
        },
        {
            id: 5,
            name: "God of War",
            background_image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&h=600&fit=crop",
            rating: 4.6,
            released: "2018-04-20",
            playtime: 40,
            genres: [
                { id: 2, name: "Action" },
                { id: 5, name: "Adventure" }
            ]
        },
        {
            id: 6,
            name: "Baldur's Gate 3",
            background_image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&h=600&fit=crop",
            rating: 4.8,
            released: "2023-08-03",
            playtime: 110,
            genres: [
                { id: 1, name: "RPG" },
                { id: 6, name: "Strategy" }
            ]
        },
        {
            id: 7,
            name: "Zelda: Tears of the Kingdom",
            background_image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop",
            rating: 4.9,
            released: "2023-05-12",
            playtime: 85,
            genres: [
                { id: 5, name: "Adventure" },
                { id: 2, name: "Action" }
            ]
        },
        {
            id: 8,
            name: "Starfield",
            background_image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&h=600&fit=crop",
            rating: 4.2,
            released: "2023-09-06",
            playtime: 70,
            genres: [
                { id: 1, name: "RPG" },
                { id: 3, name: "Sci-Fi" }
            ]
        },
        {
            id: 9,
            name: "Hogwarts Legacy",
            background_image: "https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=800&h=600&fit=crop",
            rating: 4.4,
            released: "2023-02-10",
            playtime: 60,
            genres: [
                { id: 1, name: "RPG" },
                { id: 5, name: "Adventure" }
            ]
        },
        {
            id: 10,
            name: "Spider-Man 2",
            background_image: "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=800&h=600&fit=crop",
            rating: 4.5,
            released: "2023-10-20",
            playtime: 35,
            genres: [
                { id: 2, name: "Action" },
                { id: 5, name: "Adventure" }
            ]
        },
        {
            id: 11,
            name: "Final Fantasy XVI",
            background_image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=600&fit=crop",
            rating: 4.3,
            released: "2023-06-22",
            playtime: 55,
            genres: [
                { id: 1, name: "RPG" },
                { id: 2, name: "Action" }
            ]
        },
        {
            id: 12,
            name: "Resident Evil 4 Remake",
            background_image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800&h=600&fit=crop",
            rating: 4.6,
            released: "2023-03-24",
            playtime: 25,
            genres: [
                { id: 7, name: "Horror" },
                { id: 2, name: "Action" }
            ]
        }
    ];

    let games: Game[] = [];
    let loading: boolean = true;
    let error: string | null = null;

    // Simula il caricamento dei giochi
    async function fetchGames() {
        try {
            loading = true;
            // Simula un delay come se stessimo chiamando un'API
            await new Promise(resolve => setTimeout(resolve, 800));
            games = mockGames;
            loading = false;
        } catch (err) {
            error = 'Errore nel caricamento dei giochi';
            loading = false;
        }
    }

    onMount(() => {
        fetchGames();
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
                    🎮 <span class="bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">GameFeed</span>
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
                                on:click={toggleUserMenu}
                                class="flex items-center gap-3 px-4 py-2 bg-slate-800/50 hover:bg-slate-800/70 border border-purple-500/30 hover:border-purple-500/50 rounded-lg transition-all"
                        >
                            <img
                                    src={mockUser.avatar}
                                    alt={mockUser.username}
                                    class="w-8 h-8 rounded-full ring-2 ring-purple-500/50"
                            />
                            <span class="text-white font-medium hidden sm:block">{mockUser.username}</span>
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
                                                src={mockUser.avatar}
                                                alt={mockUser.username}
                                                class="w-12 h-12 rounded-full ring-2 ring-purple-500/50"
                                        />
                                        <div>
                                            <p class="text-white font-semibold">{mockUser.username}</p>
                                            <p class="text-gray-400 text-sm">{mockUser.email}</p>
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
                                            on:click={handleLogout}
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

                <!-- Toggle Login State Button (for testing only) -->
                <button
                        on:click={toggleLogin}
                        class="px-4 py-2 bg-yellow-600/20 border border-yellow-500/50 hover:bg-yellow-600/30 text-yellow-400 rounded-lg text-sm transition-all"
                        title="Toggle login state (testing only)"
                >
                    🔄 Test: {isLoggedIn ? 'Logout' : 'Login'}
                </button>
            </div>
        </div>
    </div>
</header>

<main class="container mx-auto px-4 py-8">
    {#if loading}
        <div class="flex items-center justify-center h-64">
            <div class="text-center">
                <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
                <p class="text-purple-300 text-lg">Caricamento giochi...</p>
            </div>
        </div>
    {:else if error}
        <div class="bg-red-500/10 border border-red-500 rounded-lg p-6 text-center">
            <p class="text-red-400 text-lg">{error}</p>
            <button on:click={fetchGames} class="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition">
                Riprova
            </button>
        </div>
    {:else}
        <div class="space-y-8">
            <!-- Hero Game -->
            {#if games[0]}
                <div class="relative h-96 rounded-2xl overflow-hidden group cursor-pointer">
                    <img
                            src={games[0].background_image}
                            alt={games[0].name}
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
                        <div class="absolute bottom-0 left-0 right-0 p-8">
                            <span class="inline-block px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-semibold mb-3">IN EVIDENZA</span>
                            <h2 class="text-4xl font-bold text-white mb-3">{games[0].name}</h2>
                            <div class="flex items-center gap-6 text-white mb-4">
                                <span class="text-xl">⭐ {formatRating(games[0].rating)}</span>
                                <span>{games[0].released}</span>
                            </div>
                            <div class="flex flex-wrap gap-2">
                                {#each games[0].genres || [] as genre}
                                    <span class="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm">{genre.name}</span>
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>
            {/if}

            <!-- Other Featured Games -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                {#each games.slice(1, 5) as game}
                    <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all hover:scale-105 cursor-pointer">
                        <div class="aspect-video overflow-hidden bg-slate-900">
                            <img
                                    src={game.background_image}
                                    alt={game.name}
                                    class="w-full h-full object-cover"
                            />
                        </div>
                        <div class="p-5">
                            <h3 class="text-white font-bold text-xl mb-3">{game.name}</h3>
                            <div class="flex items-center justify-between mb-3">
                                <span class="text-purple-400 text-lg">⭐ {formatRating(game.rating)}</span>
                                <span class="text-gray-400">{game.released}</span>
                            </div>
                            <div class="flex flex-wrap gap-2">
                                {#each game.genres?.slice(0, 3) || [] as genre}
                                    <span class="px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-xs">{genre.name}</span>
                                {/each}
                            </div>
                        </div>
                    </div>
                {/each}
            </div>

            <!-- More Games Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                {#each games.slice(5) as game}
                    <div class="bg-slate-800/50 backdrop-blur-sm rounded-lg overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all hover:scale-105 cursor-pointer">
                        <div class="aspect-square overflow-hidden bg-slate-900">
                            <img
                                    src={game.background_image}
                                    alt={game.name}
                                    class="w-full h-full object-cover"
                            />
                        </div>
                        <div class="p-3">
                            <h4 class="text-white font-semibold text-sm line-clamp-1">{game.name}</h4>
                            <span class="text-purple-400 text-xs">⭐ {formatRating(game.rating)}</span>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</main>