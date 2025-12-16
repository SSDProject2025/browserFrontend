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

    type ViewMode = 'grid' | 'list';
    type SortOption = 'name' | 'rating' | 'date' | 'playtime';

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
        },
        {
            id: 6,
            name: "Persona 5 Royal",
            background_image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop",
            rating: 4.7,
            released: "2022-10-21",
            playtime: 95,
            genres: [{ id: 1, name: "RPG" }, { id: 8, name: "JRPG" }]
        }
    ];

    const playedGames: Game[] = [
        {
            id: 7,
            name: "The Witcher 3: Wild Hunt",
            background_image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=600&fit=crop",
            rating: 4.8,
            released: "2015-05-19",
            playtime: 120,
            genres: [{ id: 1, name: "RPG" }, { id: 2, name: "Action" }]
        },
        {
            id: 8,
            name: "Elden Ring",
            background_image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&h=600&fit=crop",
            rating: 4.9,
            released: "2022-02-25",
            playtime: 100,
            genres: [{ id: 2, name: "Action" }, { id: 4, name: "Souls-like" }]
        },
        {
            id: 9,
            name: "Red Dead Redemption 2",
            background_image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop",
            rating: 4.7,
            released: "2018-10-26",
            playtime: 95,
            genres: [{ id: 2, name: "Action" }, { id: 5, name: "Adventure" }]
        },
        {
            id: 10,
            name: "God of War",
            background_image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&h=600&fit=crop",
            rating: 4.6,
            released: "2018-04-20",
            playtime: 40,
            genres: [{ id: 2, name: "Action" }, { id: 5, name: "Adventure" }]
        },
        {
            id: 11,
            name: "Spider-Man 2",
            background_image: "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=800&h=600&fit=crop",
            rating: 4.5,
            released: "2023-10-20",
            playtime: 35,
            genres: [{ id: 2, name: "Action" }, { id: 5, name: "Adventure" }]
        },
        {
            id: 12,
            name: "Zelda: Tears of the Kingdom",
            background_image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop",
            rating: 4.9,
            released: "2023-05-12",
            playtime: 85,
            genres: [{ id: 5, name: "Adventure" }, { id: 2, name: "Action" }]
        },
        {
            id: 13,
            name: "Resident Evil 4 Remake",
            background_image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800&h=600&fit=crop",
            rating: 4.6,
            released: "2023-03-24",
            playtime: 25,
            genres: [{ id: 7, name: "Horror" }, { id: 2, name: "Action" }]
        },
        {
            id: 14,
            name: "Hades",
            background_image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=600&fit=crop",
            rating: 4.7,
            released: "2020-09-17",
            playtime: 45,
            genres: [{ id: 2, name: "Action" }, { id: 9, name: "Roguelike" }]
        }
    ];

    let loading = true;
    let selectedCollection: 'to-play' | 'played' = 'to-play';
    let viewMode: ViewMode = 'grid';
    let sortBy: SortOption = 'name';
    let searchQuery = '';

    onMount(() => {
        setTimeout(() => {
            loading = false;
        }, 800);
    });

    function formatRating(rating: number | undefined): string {
        return rating ? rating.toFixed(1) : 'N/A';
    }

    function getTotalPlaytime(games: Game[]): number {
        return games.reduce((total, game) => total + game.playtime, 0);
    }

    function sortGames(games: Game[], sortOption: SortOption): Game[] {
        const sorted = [...games];

        switch (sortOption) {
            case 'name':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'rating':
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'date':
                return sorted.sort((a, b) => new Date(b.released).getTime() - new Date(a.released).getTime());
            case 'playtime':
                return sorted.sort((a, b) => b.playtime - a.playtime);
            default:
                return sorted;
        }
    }

    function filterGames(games: Game[], query: string): Game[] {
        if (!query.trim()) return games;

        const lowerQuery = query.toLowerCase();
        return games.filter(game =>
            game.name.toLowerCase().includes(lowerQuery) ||
            game.genres.some(genre => genre.name.toLowerCase().includes(lowerQuery))
        );
    }

    $: currentGames = selectedCollection === 'to-play' ? toPlayGames : playedGames;
    $: filteredGames = filterGames(currentGames, searchQuery);
    $: sortedGames = sortGames(filteredGames, sortBy);
    $: collectionColor = selectedCollection === 'to-play' ? 'from-blue-600 to-cyan-600' : 'from-green-600 to-emerald-600';
    $: collectionIcon = selectedCollection === 'to-play' ? '📚' : '✅';
    $: collectionName = selectedCollection === 'to-play' ? 'To Play' : 'Played';
</script>

<main class="container mx-auto px-4 py-8">
    {#if loading}
        <div class="flex items-center justify-center h-64">
            <div class="text-center">
                <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
                <p class="text-purple-300 text-lg">Loading library...</p>
            </div>
        </div>
    {:else}
        <!-- Page Header -->
        <div class="mb-8">
            <h1 class="text-4xl font-bold text-white mb-2">My Library</h1>
            <p class="text-gray-400">Manage and organize your game collections</p>
        </div>

        <!-- Collection Tabs -->
        <div class="flex flex-col lg:flex-row gap-6 mb-8">
            <!-- To Play Collection -->
            <button
                    on:click={() => selectedCollection = 'to-play'}
                    class="flex-1 p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl border-2 transition-all {selectedCollection === 'to-play'
        ? 'border-blue-500 shadow-lg shadow-blue-500/20'
        : 'border-purple-500/20 hover:border-purple-500/50'}"
            >
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <span class="text-4xl">📚</span>
                        <div class="text-left">
                            <h2 class="text-2xl font-bold text-white">To Play</h2>
                            <p class="text-gray-400 text-sm">Games in your backlog</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text">
                            {toPlayGames.length}
                        </div>
                        <div class="text-sm text-gray-400">games</div>
                    </div>
                </div>
                <div class="flex gap-4 text-sm text-gray-400">
                    <span>⏱️ {getTotalPlaytime(toPlayGames)}h total</span>
                    <span>⭐ {(toPlayGames.reduce((sum, g) => sum + g.rating, 0) / toPlayGames.length).toFixed(1)} avg</span>
                </div>
            </button>

            <!-- Played Collection -->
            <button
                    on:click={() => selectedCollection = 'played'}
                    class="flex-1 p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl border-2 transition-all {selectedCollection === 'played'
        ? 'border-green-500 shadow-lg shadow-green-500/20'
        : 'border-purple-500/20 hover:border-purple-500/50'}"
            >
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <span class="text-4xl">✅</span>
                        <div class="text-left">
                            <h2 class="text-2xl font-bold text-white">Played</h2>
                            <p class="text-gray-400 text-sm">Completed games</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 text-transparent bg-clip-text">
                            {playedGames.length}
                        </div>
                        <div class="text-sm text-gray-400">games</div>
                    </div>
                </div>
                <div class="flex gap-4 text-sm text-gray-400">
                    <span>⏱️ {getTotalPlaytime(playedGames)}h played</span>
                    <span>⭐ {(playedGames.reduce((sum, g) => sum + g.rating, 0) / playedGames.length).toFixed(1)} avg</span>
                </div>
            </button>
        </div>

        <!-- Collection Controls -->
        <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-4 mb-6">
            <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                <!-- Search -->
                <div class="flex-1 max-w-md">
                    <div class="relative">
                        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                                type="text"
                                bind:value={searchQuery}
                                placeholder="Search in {collectionName}..."
                                class="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        />
                    </div>
                </div>

                <div class="flex items-center gap-3">
                    <!-- Sort Dropdown -->
                    <select
                            bind:value={sortBy}
                            class="px-4 py-2.5 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all cursor-pointer"
                    >
                        <option value="name">Sort: Name</option>
                        <option value="rating">Sort: Rating</option>
                        <option value="date">Sort: Release Date</option>
                        <option value="playtime">Sort: Playtime</option>
                    </select>

                    <!-- View Mode Toggle -->
                    <div class="flex gap-1 bg-slate-900/50 rounded-lg p-1 border border-purple-500/30">
                        <button
                                on:click={() => viewMode = 'grid'}
                                class="p-2 rounded transition-all {viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}"
                                title="Grid view"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </button>
                        <button
                                on:click={() => viewMode = 'list'}
                                class="p-2 rounded transition-all {viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}"
                                title="List view"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Current Collection Header -->
        <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
                <span class="text-3xl">{collectionIcon}</span>
                <div>
                    <h2 class="text-2xl font-bold text-white">{collectionName}</h2>
                    <p class="text-gray-400 text-sm">
                        {filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'}
                        {searchQuery ? `found for "${searchQuery}"` : ''}
                    </p>
                </div>
            </div>
        </div>

        <!-- Games Display -->
        {#if sortedGames.length === 0}
            <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-12 text-center">
                <div class="text-6xl mb-4">{searchQuery ? '🔍' : '🎮'}</div>
                <h3 class="text-xl font-bold text-white mb-2">
                    {searchQuery ? 'No games found' : 'No games yet'}
                </h3>
                <p class="text-gray-400 mb-6">
                    {searchQuery
                        ? `No games match "${searchQuery}" in this collection`
                        : 'Start adding games to build your collection!'}
                </p>
                {#if searchQuery}
                    <button
                            on:click={() => searchQuery = ''}
                            class="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all"
                    >
                        Clear Search
                    </button>
                {/if}
            </div>
        {:else if viewMode === 'grid'}
            <!-- Grid View -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {#each sortedGames as game}
                    <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer group">
                        <div class="aspect-video overflow-hidden relative bg-slate-900">
                            <img
                                    src={game.background_image}
                                    alt={game.name}
                                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <div class="absolute bottom-3 left-3 right-3">
                                    <div class="flex items-center justify-between text-sm text-white">
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                      {formatRating(game.rating)}
                  </span>
                                        <span>{game.playtime}h</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="p-4">
                            <h3 class="text-white font-bold text-lg mb-2 line-clamp-1">{game.name}</h3>
                            <div class="flex items-center justify-between text-sm mb-3">
                                <span class="text-gray-400">{new Date(game.released).getFullYear()}</span>
                            </div>
                            <div class="flex flex-wrap gap-1">
                                {#each game.genres.slice(0, 2) as genre}
                                    <span class="px-2 py-1 bg-purple-600/30 text-purple-300 rounded text-xs">{genre.name}</span>
                                {/each}
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {:else}
            <!-- List View -->
            <div class="space-y-4">
                {#each sortedGames as game}
                    <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer overflow-hidden group">
                        <div class="flex">
                            <div class="w-64 h-36 flex-shrink-0 bg-slate-900 overflow-hidden">
                                <img
                                        src={game.background_image}
                                        alt={game.name}
                                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <div class="flex-1 p-5 flex flex-col justify-between">
                                <div>
                                    <h3 class="text-white font-bold text-xl mb-2">{game.name}</h3>
                                    <div class="flex flex-wrap gap-2 mb-3">
                                        {#each game.genres as genre}
                                            <span class="px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-xs">{genre.name}</span>
                                        {/each}
                                    </div>
                                </div>
                                <div class="flex items-center gap-6 text-sm">
                <span class="text-purple-400 font-semibold flex items-center gap-1">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                    {formatRating(game.rating)}
                </span>
                                    <span class="text-gray-400 flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                                        {game.released}
                </span>
                                    <span class="text-gray-400 flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                                        {game.playtime}h
                </span>
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    {/if}
</main>

<style>
    select {
        appearance: none;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
        background-position: right 0.5rem center;
        background-repeat: no-repeat;
        background-size: 1.5em 1.5em;
        padding-right: 2.5rem;
    }
</style>