<script lang="ts">
    import type {Game, GameDetails, GenreInfo, User} from "$lib/types/api.types";
    import { page } from '$app/state';
    import {gameService} from "$lib/services/game";
    import {onMount} from "svelte";
    import Header from "$lib/components/header.svelte";

    const gameID = $derived(page.params.id)
    let game = $state<GameDetails>();
    let genres = $state<GenreInfo[]>([]);
    let genreMap = $state<Record<number, string>>({});
    let error = $state("")
    let isRetrying = $state(false);
    let loading = $state(true);

    const loadData = async () => {
        try {
            game = await gameService.getById(Number(gameID));
        } catch (err) {
            error = "Error on loading game"
        }

        try {
            genres = await gameService.getGenres().catch(() => []);
            genreMap = {};
            for (const g of genres) {
                genreMap[g.id] = g.name;
            }
        } catch (err) {
            error = "Error on loading genres"
        } finally {
            loading = false;
        }
    }

    async function handleRetry() {
        isRetrying = true;
        loading = true;
        error = "";
        await loadData()
        isRetrying = false;
    }

    onMount(async () => {
        await loadData();
    });
</script>

<Header/>

<main class="container mx-auto px-4 py-8 text-white">
    {#if loading}
        <div class="flex flex-col items-center justify-center min-h-[50vh]">
            <div class="relative w-16 h-16">
                <div class="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                <div class="absolute inset-0 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
            <p class="mt-4 text-purple-300 text-lg font-medium animate-pulse">Loading game...</p>
        </div>

    {:else}
        {#if error}
            <div class="bg-red-500/10 border border-red-500 rounded-lg p-6 text-center">
                <p class="text-red-400 text-lg">{error}</p>
                <button onclick={handleRetry} disabled={isRetrying} class="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition">
                    {isRetrying ? 'Retrying...' : 'Retry'}
                </button>
            </div>

        {:else if game}
            <div class="relative w-full h-[60vh] rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/30 mb-8">
                <img
                        src="data:image/jpg;base64,{game.box_art}"
                        alt={game.title}
                        class="w-full h-full object-cover"
                />

                <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent">
                    <div class="absolute bottom-0 left-0 right-0 p-8 md:p-12 flex justify-between items-end gap-4">
                        <div>
                            <h1 class="text-5xl md:text-7xl font-bold text-white leading-tight drop-shadow-lg">
                                {game.title}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 space-y-6">
                    <div class="relative bg-slate-900/40 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-xl overflow-hidden group">
                        <div class="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full pointer-events-none"></div>

                        <h3 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            About the game
                        </h3>

                        <div class="text-gray-300 text-lg leading-loose font-light">
                            <p>
                                {game.description || "No description available for this game."}
                            </p>
                        </div>

                        {#if game.genres && game.genres.length > 0}
                            <div class="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-2">
                                {#each game.genres as genreId}
                                    {#if genreMap[genreId]}
                                        <span class="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-gray-300 border border-white/10 transition-all duration-300 hover:text-white hover:border-purple-500/50 hover:shadow-[0_0_10px_rgba(168,85,247,0.2)] cursor-default select-none">
                                            {genreMap[genreId]}
                                        </span>
                                    {/if}
                                {/each}
                            </div>
                        {/if}
                    </div>
                </div>

                <div class="space-y-6">
                    <div class="bg-slate-800/50 p-6 rounded-2xl border border-white/5">
                        <h3 class="text-xl font-bold text-white mb-6 border-b border-white/10 pb-2">Game Info</h3>

                        <div class="grid grid-cols-2 gap-y-8 gap-x-4">
                            <div>
                                <span class="block text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">
                                    Release Date
                                </span>
                                <span class="text-white text-lg font-medium">
                                    {game.release_date}
                                </span>
                            </div>

                            <div>
                                <span class="block text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">
                                    PEGI
                                </span>
                                <span class="text-white text-lg font-medium">
                                    {game.pegi}
                                </span>
                            </div>

                            <div>
                                <span class="block text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">
                                    Global rating
                                </span>
                                <span class="text-white text-lg font-medium">
                                    {game.global_rating}
                                </span>
                            </div>

                            <div>
                                <span class="block text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">
                                    Rating count
                                </span>
                                <span class="text-white text-lg font-medium">
                                    {game.rating_count}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        {/if}
    {/if}
</main>