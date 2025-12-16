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

    interface Collection {
        id: string;
        name: string;
        description: string;
        icon: string;
        games: Game[];
        color: string;
    }

    // Mock user data
    const user = {
        username: "GamerPro",
        email: "gamer@example.com",
        avatar: "https://ui-avatars.com/api/?name=Gamer+Pro&background=9333ea&color=fff&size=256",
        joinDate: "January 2024",
        bio: "Passionate gamer who loves RPGs and action-adventure games"
    };

    // Mock collections with games
    const toPlayGames: Game[] = [
        {
            id: 1,
            name: "Cyberpunk 2077",
            background_image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop",
            rating: 4.3,
            released: "2020-12-10",
            playtime: 80,
            genres: [{ id: 1, name: "RPG" }, { id: 3, name: "Sci-Fi" }]
        },
        {
            id: 2,
            name: "Baldur's Gate 3",
            background_image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&h=600&fit=crop",
            rating: 4.8,
            released: "2023-08-03",
            playtime: 110,
            genres: [{ id: 1, name: "RPG" }, { id: 6, name: "Strategy" }]
        },
        {
            id: 3,
            name: "Starfield",
            background_image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&h=600&fit=crop",
            rating: 4.2,
            released: "2023-09-06",
            playtime: 70,
            genres: [{ id: 1, name: "RPG" }, { id: 3, name: "Sci-Fi" }]
        },
        {
            id: 4,
            name: "Hogwarts Legacy",
            background_image: "https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=800&h=600&fit=crop",
            rating: 4.4,
            released: "2023-02-10",
            playtime: 60,
            genres: [{ id: 1, name: "RPG" }, { id: 5, name: "Adventure" }]
        },
        {
            id: 5,
            name: "Final Fantasy XVI",
            background_image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=600&fit=crop",
            rating: 4.3,
            released: "2023-06-22",
            playtime: 55,
            genres: [{ id: 1, name: "RPG" }, { id: 2, name: "Action" }]
        }
    ];

    const playedGames: Game[] = [
        {
            id: 6,
            name: "The Witcher 3: Wild Hunt",
            background_image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=600&fit=crop",
            rating: 4.8,
            released: "2015-05-19",
            playtime: 120,
            genres: [{ id: 1, name: "RPG" }, { id: 2, name: "Action" }]
        },
        {
            id: 7,
            name: "Elden Ring",
            background_image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&h=600&fit=crop",
            rating: 4.9,
            released: "2022-02-25",
            playtime: 100,
            genres: [{ id: 2, name: "Action" }, { id: 4, name: "Souls-like" }]
        },
        {
            id: 8,
            name: "Red Dead Redemption 2",
            background_image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop",
            rating: 4.7,
            released: "2018-10-26",
            playtime: 95,
            genres: [{ id: 2, name: "Action" }, { id: 5, name: "Adventure" }]
        },
        {
            id: 9,
            name: "God of War",
            background_image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&h=600&fit=crop",
            rating: 4.6,
            released: "2018-04-20",
            playtime: 40,
            genres: [{ id: 2, name: "Action" }, { id: 5, name: "Adventure" }]
        },
        {
            id: 10,
            name: "Spider-Man 2",
            background_image: "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=800&h=600&fit=crop",
            rating: 4.5,
            released: "2023-10-20",
            playtime: 35,
            genres: [{ id: 2, name: "Action" }, { id: 5, name: "Adventure" }]
        },
        {
            id: 11,
            name: "Zelda: Tears of the Kingdom",
            background_image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop",
            rating: 4.9,
            released: "2023-05-12",
            playtime: 85,
            genres: [{ id: 5, name: "Adventure" }, { id: 2, name: "Action" }]
        },
        {
            id: 12,
            name: "Resident Evil 4 Remake",
            background_image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800&h=600&fit=crop",
            rating: 4.6,
            released: "2023-03-24",
            playtime: 25,
            genres: [{ id: 7, name: "Horror" }, { id: 2, name: "Action" }]
        }
    ];

    const collections: Collection[] = [
        {
            id: 'to-play',
            name: 'To Play',
            description: 'Games in your backlog',
            icon: '📚',
            games: toPlayGames,
            color: 'from-blue-600 to-cyan-600'
        },
        {
            id: 'played',
            name: 'Played',
            description: 'Games you have completed',
            icon: '✅',
            games: playedGames,
            color: 'from-green-600 to-emerald-600'
        }
    ];

    let loading = true;

    onMount(() => {
        // Simulate loading
        setTimeout(() => {
            loading = false;
        }, 800);
    });

    function formatRating(rating: number | undefined): string {
        return rating ? rating.toFixed(1) : 'N/A';
    }
</script>


<main class="container mx-auto px-4 py-8">
    {#if loading}
        <div class="flex items-center justify-center h-64">
            <div class="text-center">
                <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
                <p class="text-purple-300 text-lg">Loading profile...</p>
            </div>
        </div>
    {:else}
        <!-- Profile Header -->
        <div class="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-purple-500/20 overflow-hidden mb-8">
            <!-- Cover Image -->
            <div class="h-48 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 relative">
                <div class="absolute inset-0 bg-black/20"></div>
            </div>

            <!-- Profile Info -->
            <div class="relative px-8 pb-8">
                <!-- Avatar -->
                <div class="absolute -top-16 left-8">
                    <img
                            src={user.avatar}
                            alt={user.username}
                            class="w-32 h-32 rounded-full border-4 border-slate-900 ring-4 ring-purple-500/50 bg-slate-900"
                    />
                </div>

                <div class="pt-20 flex items-start justify-between">
                    <div>
                        <h1 class="text-4xl font-bold text-white mb-2">{user.username}</h1>
                        <p class="text-purple-300 mb-3">{user.email}</p>
                        <p class="text-gray-400 text-sm mb-4">{user.bio}</p>
                        <div class="flex items-center gap-4 text-sm text-gray-400">
                            <span class="flex items-center gap-1">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Joined {user.joinDate}
                            </span>
                        </div>
                    </div>

                    <!-- Stats -->
                    <div class="flex gap-6">
                        <div class="text-center">
                            <div class="text-3xl font-bold text-white">{toPlayGames.length + playedGames.length}</div>
                            <div class="text-sm text-gray-400">Total Games</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Collections -->
        <div class="space-y-8">
            {#each collections as collection}
                <div class="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-purple-500/20 overflow-hidden">
                    <!-- Collection Header -->
                    <div class="p-6 border-b border-purple-500/20 bg-black/20">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center gap-3">
                                <span class="text-4xl">{collection.icon}</span>
                                <div>
                                    <h2 class="text-2xl font-bold text-white">{collection.name}</h2>
                                    <p class="text-gray-400 text-sm">{collection.description}</p>
                                </div>
                        </div>

                        <!-- Collection Stats -->
                        <div class="text-right">
                            <div class="text-3xl font-bold bg-gradient-to-r {collection.color} text-transparent bg-clip-text">
                                {collection.games.length}
                            </div>
                            <div class="text-sm text-gray-400">
                                {collection.games.length === 1 ? 'game' : 'games'}
                            </div>
                        </div>
                    </div>

                    <!-- Additional Stats -->
                    <div class="flex gap-6 mt-4">
                        <div class="flex items-center gap-2 text-sm text-gray-400">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            <span>{(collection.games.reduce((sum, g) => sum + g.rating, 0) / collection.games.length).toFixed(1)} avg rating</span>
                        </div>
                    </div>
                </div>

                <!-- Games Preview (First 4) -->
                <div class="p-6">
                    {#if collection.games.length === 0}
                        <div class="text-center py-12">
                            <p class="text-gray-400 text-lg mb-2">No games in this collection yet</p>
                            <p class="text-gray-500 text-sm">Start adding games to build your collection!</p>
                        </div>
                    {:else}
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {#each collection.games.slice(0, 4) as game}
                            <div class="bg-slate-900/50 rounded-xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all hover:scale-105 cursor-pointer group">
                                <div class="aspect-video overflow-hidden relative">
                                    <img
                                            src={game.background_image}
                                            alt={game.name}
                                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div class="absolute bottom-2 left-2 right-2">
                                            <div class="flex items-center justify-between text-xs text-white">
                                                <span>⭐ {formatRating(game.rating)}</span>
                                                <span>{game.playtime}h</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="p-3">
                                    <h3 class="text-white font-semibold text-sm line-clamp-1 mb-1">{game.name}</h3>
                                    <div class="flex flex-wrap gap-1">
                                        {#each game.genres.slice(0, 2) as genre}
                                            <span class="px-2 py-0.5 bg-purple-600/30 text-purple-300 rounded text-xs">{genre.name}</span>
                                        {/each}
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>

                        <!-- View All Button -->
                        {#if collection.games.length > 4}
                            <div class="text-center">
                                <a href="/profile/my-library">
                                <button class="px-6 py-3 bg-gradient-to-r {collection.color} hover:opacity-90 text-white font-semibold rounded-lg transition-all transform hover:scale-105 flex items-center gap-2 mx-auto">
                                    <span>View all {collection.games.length} games</span>
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                                </a>
                            </div>
                        {/if}
                    {/if}
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</main>