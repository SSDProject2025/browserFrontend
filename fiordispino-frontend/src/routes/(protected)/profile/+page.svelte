<script lang="ts">
    import { onMount } from 'svelte';
    import { authService } from '$lib/services/auth';
    import type {GamePlayed, User} from "$lib/types/api.types";
    import {gameService} from "$lib/services/games";
    import Header from "$lib/components/header.svelte";

    let user = $state<User | null>(null);
    let toPlayGames: GamePlayed[] = $state([])
    let playedGames: GamePlayed[] = $state([])
    let error = $state("")
    let loading = $state(true)
    let isRetrying = $state(false);

    const loadData = async () => {
        loading = true
        error = ""

        try {
            user = authService.getCurrentUser()
            playedGames = await gameService.getSelfGamesPlayed()
            toPlayGames = await gameService.getSelfGamesToPlay()
        } catch (e) {
            error = "Error on loading games"
        } finally {
            loading = false
        }
    };

    const collections = $derived([
        {
            id: 'to-play',
            name: 'To Play',
            description: 'Games in your backlog',
            games: toPlayGames,
            color: 'from-blue-600 to-cyan-600'
        },
        {
            id: 'played',
            name: 'Played',
            description: 'Games you have completed',
            games: playedGames,
            color: 'from-green-600 to-emerald-600'
        }
    ]);

    onMount(async () => {
        await loadData()
    });
</script>

<Header/>

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
                <div class="pt-20 flex items-start justify-between">
                    <div>
                        <h1 class="text-4xl font-bold text-white mb-2">{user?.username}</h1>
                        <p class="text-purple-300 mb-3">{user?.email}</p>
                        <div class="flex items-center gap-4 text-sm text-gray-400">
                            <span class="flex items-center gap-1">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
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
                            <!--<span>{(collection.games.reduce((sum, g) => sum + g.global_rating, 0) / collection.games.length).toFixed(1)} avg rating</span>-->
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
                                            src="data:image/jpg;base64,{game.game.box_art}"
                                            alt={game.game.title}
                                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div class="absolute bottom-2 left-2 right-2">
                                            <div class="flex items-center justify-between text-xs text-white">
                                                <span>⭐ {game.game.global_rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="p-3">
                                    <h3 class="text-white font-semibold text-sm line-clamp-1 mb-1">{game.game.title}</h3>
                                    <div class="flex flex-wrap gap-1">
                                        {#each game.game.genres.slice(0, 2) as genre}
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