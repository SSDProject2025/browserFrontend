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
    let selectedView: 'grid' | 'list' | 'featured' = 'grid';

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

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <!-- Header -->
    <header class="bg-black/30 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-10">
        <div class="container mx-auto px-4 py-6">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-4xl font-bold text-white mb-2">
                        🎮 <span class="bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">GameFeed</span>
                    </h1>
                    <p class="text-purple-300">Scopri i migliori videogiochi</p>
                </div>

                <!-- View Selector -->
                <div class="flex gap-2 bg-slate-800/50 rounded-lg p-1">
                    <button
                            on:click={() => selectedView = 'grid'}
                            class="px-4 py-2 rounded-md transition-all {selectedView === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}"
                    >
                        Grid
                    </button>
                    <button
                            on:click={() => selectedView = 'list'}
                            class="px-4 py-2 rounded-md transition-all {selectedView === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}"
                    >
                        Lista
                    </button>
                    <button
                            on:click={() => selectedView = 'featured'}
                            class="px-4 py-2 rounded-md transition-all {selectedView === 'featured' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}"
                    >
                        In evidenza
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
            <!-- Grid View -->
            {#if selectedView === 'grid'}
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {#each games as game}
                        <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer">
                            <div class="aspect-video overflow-hidden bg-slate-900">
                                <img
                                        src={game.background_image}
                                        alt={game.name}
                                        class="w-full h-full object-cover"
                                />
                            </div>
                            <div class="p-4">
                                <h3 class="text-white font-bold text-lg mb-2 line-clamp-1">{game.name}</h3>
                                <div class="flex items-center justify-between text-sm">
                                    <span class="text-purple-400">⭐ {formatRating(game.rating)}</span>
                                    <span class="text-gray-400">{new Date(game.released).getFullYear()}</span>
                                </div>
                                <div class="mt-3 flex flex-wrap gap-1">
                                    {#each game.genres?.slice(0, 2) || [] as genre}
                                        <span class="px-2 py-1 bg-purple-600/30 text-purple-300 rounded text-xs">{genre.name}</span>
                                    {/each}
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}

            <!-- List View -->
            {#if selectedView === 'list'}
                <div class="space-y-4">
                    {#each games as game}
                        <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer overflow-hidden">
                            <div class="flex">
                                <div class="w-48 h-32 flex-shrink-0 bg-slate-900">
                                    <img
                                            src={game.background_image}
                                            alt={game.name}
                                            class="w-full h-full object-cover"
                                    />
                                </div>
                                <div class="flex-1 p-4 flex flex-col justify-between">
                                    <div>
                                        <h3 class="text-white font-bold text-xl mb-2">{game.name}</h3>
                                        <div class="flex flex-wrap gap-2 mb-2">
                                            {#each game.genres || [] as genre}
                                                <span class="px-2 py-1 bg-purple-600/30 text-purple-300 rounded-full text-xs">{genre.name}</span>
                                            {/each}
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-4 text-sm">
                                        <span class="text-purple-400 font-semibold">⭐ {formatRating(game.rating)}</span>
                                        <span class="text-gray-400">📅 {game.released}</span>
                                        <span class="text-gray-400">🎯 {game.playtime}h gameplay</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}

            <!-- Featured View -->
            {#if selectedView === 'featured'}
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
        {/if}
    </main>
</div>

<style>
    :global(body) {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }

    .line-clamp-1 {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>