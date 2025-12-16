<script lang="ts">
    import { onMount } from 'svelte';
    import { libraryService } from "$lib/services/library";
    import type {Game, Genre, GenreInfo} from "$lib/types/api.types";
    import { authService } from "$lib/services/auth";
    import {gameService} from "$lib/services/game";

    type ViewMode = 'grid' | 'list';
    type SortOption = 'name' | 'date';

    let loading = true;
    let selectedCollection: 'to-play' | 'played' = 'to-play';
    let viewMode: ViewMode = 'grid';
    let sortBy: SortOption = 'name';
    let searchQuery = '';

    let playedGames: Game[] = [];
    let toPlayGames: Game[] = [];
    let genres: GenreInfo[] = [];
    let genreMap: Record<number, string> = {};

    onMount(async () => {
        await authService.getUser().then(async (user) => {
            const playedResp = await libraryService.getGamesPlayedFromUsername(user.username).catch(() => []);
            playedGames = playedResp.map((item: any) => item.game);

            const toPlayResp = await libraryService.getGamesToPlayFromUsername(user.username).catch(() => []);
            toPlayGames = toPlayResp.map((item: any) => item.game);

            genres = await gameService.getGenres().catch(() => []);

            genreMap = {};
            for (const g of genres) {
                genreMap[g.id] = g.name;
            }

        }).finally(() => loading = false);
    });

    function sortGames(games: Game[], sortOption: SortOption): Game[] {
        const sorted = [...games];
        switch (sortOption) {
            case 'name':
                return sorted.sort((a, b) => a.title.localeCompare(b.title));
            case 'date':
                return sorted.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
            default:
                return sorted;
        }
    }

    function filterGames(games: Game[], query: string): Game[] {
        if (!query.trim()) return games;
        const lowerQuery = query.toLowerCase();
        return games.filter(game =>
            game.title.toLowerCase().includes(lowerQuery)
        );
    }

    $: currentGames = selectedCollection === 'to-play' ? toPlayGames : playedGames;
    $: filteredGames = filterGames(currentGames, searchQuery);
    $: sortedGames = sortGames(filteredGames, sortBy);
    $: genreMap = Object.fromEntries(genres.map(g => [g.id, g.name]));
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
        <div class="mb-8">
            <h1 class="text-4xl font-bold text-white mb-2">My Library</h1>
            <p class="text-gray-400">Manage and organize your game collections</p>
        </div>

        <div class="flex flex-col lg:flex-row gap-6 mb-8">
            <button on:click={() => selectedCollection = 'to-play'} class="flex-1 p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl border-2 transition-all {selectedCollection === 'to-play' ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-purple-500/20 hover:border-purple-500/50'}">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <span class="text-4xl">📚</span>
                        <div class="text-left">
                            <h2 class="text-2xl font-bold text-white">To Play</h2>
                            <p class="text-gray-400 text-sm">Games in your backlog</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text">{toPlayGames.length}</div>
                        <div class="text-sm text-gray-400">games</div>
                    </div>
                </div>
            </button>

            <button on:click={() => selectedCollection = 'played'} class="flex-1 p-6 bg-slate-800/50 backdrop-blur-sm rounded-xl border-2 transition-all {selectedCollection === 'played' ? 'border-green-500 shadow-lg shadow-green-500/20' : 'border-purple-500/20 hover:border-purple-500/50'}">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <span class="text-4xl">✅</span>
                        <div class="text-left">
                            <h2 class="text-2xl font-bold text-white">Played</h2>
                            <p class="text-gray-400 text-sm">Completed games</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 text-transparent bg-clip-text">{playedGames.length}</div>
                        <div class="text-sm text-gray-400">games</div>
                    </div>
                </div>
            </button>
        </div>

        <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-4 mb-6">
            <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                <div class="flex-1 max-w-md">
                    <div class="relative">
                        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input type="text" bind:value={searchQuery} placeholder="Search in {collectionName}..." class="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"/>
                    </div>
                </div>

                <div class="flex items-center gap-3">
                    <select bind:value={sortBy} class="px-4 py-2.5 bg-slate-900/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all cursor-pointer">
                        <option value="name">Sort: Name</option>
                        <option value="date">Sort: Release Date</option>
                    </select>

                    <div class="flex gap-1 bg-slate-900/50 rounded-lg p-1 border border-purple-500/30">
                        <button on:click={() => viewMode = 'grid'} class="p-2 rounded transition-all {viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}" title="Grid view">Grid</button>
                        <button on:click={() => viewMode = 'list'} class="p-2 rounded transition-all {viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}" title="List view">List</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
                <span class="text-3xl">{collectionIcon}</span>
                <div>
                    <h2 class="text-2xl font-bold text-white">{collectionName}</h2>
                    <p class="text-gray-400 text-sm">{filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'}{searchQuery ? ` found for "${searchQuery}"` : ''}</p>
                </div>
            </div>
        </div>

        {#if sortedGames.length === 0}
            <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-12 text-center">
                <div class="text-6xl mb-4">{searchQuery ? '🔍' : '🎮'}</div>
                <h3 class="text-xl font-bold text-white mb-2">{searchQuery ? 'No games found' : 'No games yet'}</h3>
                <p class="text-gray-400 mb-6">{searchQuery ? `No games match "${searchQuery}" in this collection` : 'Start adding games to build your collection!'}</p>
                {#if searchQuery}<button on:click={() => searchQuery = ''} class="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all">Clear Search</button>{/if}
            </div>
        {:else if viewMode === 'grid'}
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {#each sortedGames as game}
                    <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer group">
                        <div class="aspect-video overflow-hidden relative bg-slate-900">
                            <img src={"data:image/png;base64," + game.box_art} alt={game.title} class="w-full h-full object-cover" />
                            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <div class="absolute bottom-3 left-3 right-3">
                                    <div class="flex items-center justify-between text-sm text-white">
                                        <span>{new Date(game.release_date).getFullYear()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="p-4">
                            <h3 class="text-white font-bold text-lg mb-2 line-clamp-1">{game.title}</h3>
                            <div class="flex flex-wrap gap-1">
                                {#each (game.genres?.slice(0,2) ?? []) as genreId}
                                    <span class="px-2 py-1 bg-purple-600/30 text-purple-300 rounded text-xs">
                                        {genreMap[genreId] ?? 'Unknown'}
                                    </span>
                                {/each}
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {:else}
            <div class="space-y-4">
                {#each sortedGames as game}
                    <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer overflow-hidden group">
                        <div class="flex">
                            <div class="w-64 h-36 flex-shrink-0 bg-slate-900 overflow-hidden">
                                <img src={"data:image/jpg;base64," + game.box_art} alt={game.title} class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"/>
                            </div>
                            <div class="flex-1 p-5 flex flex-col justify-between">
                                <h3 class="text-white font-bold text-xl mb-2">{game.title}</h3>
                                <div class="flex flex-wrap gap-2 mb-3">
                                    {#each (game.genres ?? []) as genreId}
                                        <span class="px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-xs">
                                            {genreMap[genreId] ?? 'Unknown'}
                                        </span>
                                    {/each}
                                </div>
                                <span class="text-gray-400">{game.release_date}</span>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    {/if}
</main>
