<script lang="ts">
    import {onMount} from "svelte";
    import type {GameDetails} from "$lib/types/api.types";
    import {gameService} from "$lib/services/game";
    import Header from "$lib/components/header.svelte";

    let games = $state<GameDetails[]>([]);
    let error = $state(false);
    let loading = $state(true);
    let isRetrying = $state(false);

    const load = async () => {
        loading = true;
        error = false;
        try {
            games = await gameService.getAll();
        } catch (err) {
            console.error(err);
            error = true;
        } finally {
            loading = false;
            isRetrying = false;
        }
    };

    async function handleRetry() {
        isRetrying = true;
        await load();
    }

    function formatRating(ratingStr: string | undefined): string {
        const r = parseFloat(ratingStr || "0");
        return r > 0 ? r.toFixed(1) : "N/A";
    }

    onMount(() => {
        load();
    });
</script>

<Header/>

<main class="container mx-auto px-4 py-8">
    {#if loading}
        <div class="flex items-center justify-center h-64">
            <div class="text-center">
                <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
                <p class="text-purple-300 text-lg">Loading library...</p>
            </div>
        </div>
    {:else }
        {#if error}
            <div class="bg-red-500/10 border border-red-500 rounded-lg p-6 text-center">
                <p class="text-red-400 text-lg">Error loading games</p>
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
                <!-- Featured Game (Hero) -->
                {#if games[0]}
                    <a href="/{games[0].id}" class="relative block h-96 rounded-2xl overflow-hidden group cursor-pointer">
                        <img
                                src="data:image/jpg;base64,{games[0].box_art}"
                                alt={games[0].title}
                                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
                            <div class="absolute bottom-0 left-0 right-0 p-8">
                                <div class="flex items-end justify-between gap-4">
                                    <div class="flex-1">
                                        <h2 class="text-4xl font-bold text-white mb-3 leading-tight">
                                            {games[0].title}
                                        </h2>
                                        <p class="text-gray-300 text-sm line-clamp-2 mb-3 max-w-3xl">
                                            {games[0].description}
                                        </p>
                                        <div class="flex flex-wrap items-center gap-3">
                                            <!-- Rating -->
                                            {#if games[0].global_rating && parseFloat(games[0].global_rating) > 0}
                                                <div class="flex items-center gap-1 bg-yellow-500/20 px-3 py-1 rounded-full">
                                                    <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    <span class="text-yellow-400 font-semibold">{formatRating(games[0].global_rating)}</span>
                                                    <span class="text-gray-400 text-xs">({games[0].rating_count})</span>
                                                </div>
                                            {/if}

                                            <!-- Genres -->
                                            <div class="flex gap-2">
                                                {#each games[0].genres.slice(0, 3) as genre}
                                                    <span class="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-medium">
                                                        {genre.name}
                                                    </span>
                                                {/each}
                                            </div>

                                            <!-- PEGI -->
                                            <span class="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-xs font-bold">
                                                PEGI {games[0].pegi}
                                            </span>

                                            <!-- Release Date -->
                                            <span class="text-gray-400 text-sm">
                                                {new Date(games[0].release_date).getFullYear()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>
                {/if}

                <!-- Medium Cards Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {#each games.slice(1, 5) as game}
                        <a href="/{game.id}" class="relative block h-96 rounded-2xl overflow-hidden group cursor-pointer">
                            <img
                                    src="data:image/jpg;base64,{game.box_art}"
                                    alt={game.title}
                                    loading="lazy"
                                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
                                <div class="absolute bottom-0 left-0 right-0 p-6">
                                    <h3 class="text-2xl font-bold text-white mb-2 leading-tight">
                                        {game.title}
                                    </h3>
                                    <p class="text-gray-300 text-sm line-clamp-2 mb-3">
                                        {game.description}
                                    </p>
                                    <div class="flex flex-wrap items-center gap-2">
                                        <!-- Rating -->
                                        {#if game.global_rating && parseFloat(game.global_rating) > 0}
                                            <div class="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-full">
                                                <svg class="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <span class="text-yellow-400 font-semibold text-sm">{formatRating(game.global_rating)}</span>
                                            </div>
                                        {/if}

                                        <!-- Genres -->
                                        {#each game.genres.slice(0, 2) as genre}
                                            <span class="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-xs">
                                                {genre.name}
                                            </span>
                                        {/each}

                                        <!-- PEGI -->
                                        <span class="bg-red-500/20 text-red-300 px-2 py-1 rounded-full text-xs font-bold">
                                            {game.pegi}+
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    {/each}
                </div>

                <!-- Small Cards Grid -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {#each games.slice(5) as game}
                        <a href="/{game.id}" class="relative block h-80 rounded-xl overflow-hidden group cursor-pointer">
                            <img
                                    src="data:image/jpg;base64,{game.box_art}"
                                    alt={game.title}
                                    loading="lazy"
                                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent">
                                <div class="absolute bottom-0 left-0 right-0 p-4">
                                    <h4 class="text-lg font-bold text-white mb-2 leading-tight line-clamp-2">
                                        {game.title}
                                    </h4>
                                    <div class="flex flex-wrap items-center gap-1.5">
                                        <!-- Rating -->
                                        {#if game.global_rating && parseFloat(game.global_rating) > 0}
                                            <div class="flex items-center gap-1 bg-yellow-500/20 px-2 py-0.5 rounded-full">
                                                <svg class="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <span class="text-yellow-400 font-semibold text-xs">{formatRating(game.global_rating)}</span>
                                            </div>
                                        {/if}

                                        <!-- First Genre -->
                                        {#if game.genres[0]}
                                            <span class="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full text-xs">
                                                {game.genres[0].name}
                                            </span>
                                        {/if}

                                        <!-- PEGI -->
                                        <span class="bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full text-xs font-bold">
                                            {game.pegi}+
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    {/each}
                </div>
            </div>
        {:else}
            <div class="text-center text-white py-10">
                <p class="text-xl">No game found!</p>
            </div>
        {/if}
    {/if}
</main>