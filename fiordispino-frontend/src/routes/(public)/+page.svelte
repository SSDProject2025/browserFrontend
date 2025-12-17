<script lang="ts">
    import {onMount} from "svelte";
    import type {Game} from "$lib/types/api.types";
    import {gameService} from "$lib/services/games";
    import Header from "$lib/components/header.svelte";

    let games = $state<Game[]>([]);
    let error = $state("")
    let loading = $state(true)
    let isRetrying = $state(false);

    const loadData = async () => {
        loading = true
        error = ""

        try {
            games = await gameService.getAll();
        } catch (e) {
            error = "Error on loading games"
        } finally {
            loading = false
        }
    };

    async function handleRetry() {
        isRetrying = true;
        await loadData()
        isRetrying = false;
    }

    function formatRating(rating: string): string {
        if (rating == "0.0")
            return "N/A"
        return rating;
    }

    onMount(() => {
        loadData();
    });
</script>

<Header/>

<main class="container mx-auto px-4 py-8">
    {#if loading}
        <div class="flex flex-col items-center justify-center min-h-[50vh]">
            <div class="relative w-16 h-16">
                <div class="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                <div class="absolute inset-0 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>

            <p class="mt-4 text-purple-300 text-lg font-medium animate-pulse">
                Loading library...
            </p>
        </div>
    {:else}
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
                <a href="/{games[0].id}" class="relative block h-96 rounded-2xl overflow-hidden group cursor-pointer">

                    <img src="data:image/jpg;base64,{games[0].box_art}"
                         alt={games[0].title}
                         class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
                        <div class="absolute bottom-0 left-0 right-0 p-8 flex justify-between items-end gap-4">

                            <h2 class="text-4xl font-bold text-white leading-none max-w-[85%]">
                                {games[0].title}
                            </h2>

                            <div class="flex items-center gap-1 text-yellow-400 shrink-0">
                                <span class="text-4xl font-bold">
                                    {formatRating(games[0].global_rating)}
                                </span>
                            </div>

                        </div>
                    </div>
                </a>
            {/if}

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                {#each games.slice(1, 5) as game}
                   <a href="/{game.id}" class="relative block h-96 rounded-2xl overflow-hidden group cursor-pointer">
                        <img src="data:image/jpg;base64,{game.box_art}"
                             alt={game.title}
                             class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
                            <div class="absolute bottom-0 left-0 right-0 p-8 flex justify-between items-end gap-4">

                                <h2 class="text-4xl font-bold text-white leading-none max-w-[85%]">
                                    {game.title}
                                </h2>

                                <div class="flex items-center gap-1 text-yellow-400 shrink-0">
                                    <span class="text-4xl font-bold">
                                        {formatRating(game.global_rating)}
                                    </span>
                                </div>

                            </div>
                        </div>
                    </a>
                {/each}
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {#each games.slice(5) as game}
                    <a href="/{game.id}" class="relative block h-96 rounded-2xl overflow-hidden group cursor-pointer">

                        <img src="data:image/jpg;base64,{game.box_art}"
                             alt={game.title}
                             class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />

                        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
                            <div class="absolute bottom-0 left-0 right-0 p-8 flex justify-between items-end gap-4">

                                <h2 class="text-4xl font-bold text-white leading-none max-w-[85%]">
                                    {game.title}
                                </h2>

                                <div class="flex items-center gap-1 text-yellow-400 shrink-0">
                                    <span class="text-4xl font-bold">
                                        {formatRating(game.global_rating)}
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