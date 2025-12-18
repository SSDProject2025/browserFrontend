<script lang="ts">
    import { onMount } from 'svelte';
    import { libraryService } from "$lib/services/library";
    import type {Game, GenreInfo} from "$lib/types/api.types";
    import { authService } from "$lib/services/auth";
    import {gameService} from "$lib/services/game";

    type ViewMode = 'grid' | 'list';
    type SortOption = 'name' | 'date' | 'rating';

    let loading = true;
    let selectedCollection: 'to-play' | 'played' = 'to-play';
    let viewMode: ViewMode = 'grid';
    let sortBy: SortOption = 'name';
    let searchQuery = '';

    let playedGames: Game[] = [];
    let toPlayGames: Game[] = [];

    onMount(async () => {
        await authService.getUser().then(async (user) => {
            const playedResp = await libraryService.getGamesPlayedFromUsername(user.username).catch(() => []);
            playedGames = playedResp.map((item: any) => item);

            const toPlayResp = await libraryService.getGamesToPlayFromUsername(user.username).catch(() => []);
            toPlayGames = toPlayResp.map((item: any) => item);

        }).finally(() => loading = false);
    });

    function sortGames(games: Game[], sortOption: SortOption): Game[] {
        const sorted = [...games];
        switch (sortOption) {
            case 'name':
                return sorted.sort((a, b) => a.game.title.localeCompare(b.game.title));
            case 'date':
                return sorted.sort((a, b) => new Date(b.game.release_date).getTime() - new Date(a.game.release_date).getTime());
            case 'rating':
                return sorted.sort((a, b) => {
                    const ratingA = parseFloat(a.game.global_rating) || 0;
                    const ratingB = parseFloat(b.game.global_rating) || 0;
                    return ratingB - ratingA;
                });
            default:
                return sorted;
        }
    }

    function filterGames(games: Game[], query: string): Game[] {
        if (!query.trim()) return games;
        const lowerQuery = query.toLowerCase();
        return games.filter(game =>
            game.game.title.toLowerCase().includes(lowerQuery)
        );
    }

    function formatRating(rating: string | undefined): string {
        if (!rating) return 'N/A';
        const num = parseFloat(rating);
        return isNaN(num) ? 'N/A' : num.toFixed(1);
    }

    function formatDate(dateString: string): string {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch {
            return dateString;
        }
    }

    function getPegiLabel(pegi: number): string {
        return `PEGI ${pegi}`;
    }

    function getPegiColor(pegi: number): string {
        if (pegi <= 7) return 'bg-green-600';
        if (pegi <= 12) return 'bg-yellow-600';
        if (pegi <= 16) return 'bg-orange-600';
        return 'bg-red-600';
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
                        <option value="rating">Sort: Rating</option>
                    </select>

                    <div class="flex gap-1 bg-slate-900/50 rounded-lg p-1 border border-purple-500/30">
                        <button on:click={() => viewMode = 'grid'} class="p-2 rounded transition-all {viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}" title="Grid view">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                            </svg>
                        </button>
                        <button on:click={() => viewMode = 'list'} class="p-2 rounded transition-all {viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}" title="List view">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
                            </svg>
                        </button>
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
                    <a href="/{game.game.id}">
                        <div class="bg-slate-900/50 rounded-xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all hover:scale-105 cursor-pointer group">
                            <!-- Box Art -->
                            <div class="aspect-[3/4] overflow-hidden relative">
                                <img
                                        src={"data:image/png;base64," + game.game.box_art}
                                        alt={game.game.title}
                                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div class="absolute bottom-0 left-0 right-0 p-3 space-y-2">
                                        <div class="flex items-center justify-between text-xs text-white">
                                            <span class="flex items-center gap-1">
                                                <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                                </svg>
                                                {formatRating(game.game.global_rating)}
                                            </span>
                                            <span class="text-gray-300">
                                                {game.game.rating_count} reviews
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <!-- PEGI Badge -->
                                <div class="absolute top-2 right-2 {getPegiColor(game.game.pegi)} text-white text-xs font-bold px-2 py-1 rounded">
                                    {getPegiLabel(game.game.pegi)}
                                </div>
                            </div>

                        <!-- Game Info -->
                        <div class="p-4 space-y-3">
                            <div>
                                <h3 class="text-white font-bold text-base line-clamp-2 mb-1 min-h-[3rem]">
                                    {game.game.title}
                                </h3>
                                <p class="text-gray-400 text-xs">
                                    {formatDate(game.game.release_date)}
                                </p>
                            </div>

                            <!-- Genres -->
                            <div class="flex flex-wrap gap-1">
                                {#each (game.game.genres ?? []).slice(0, 3) as genre}
                                    <span class="px-2 py-1 bg-purple-600/30 text-purple-300 rounded text-xs font-medium">
                                        {typeof genre === 'object' ? genre.name : genre}
                                    </span>
                                {/each}
                                {#if (game.game.genres?.length ?? 0) > 3}
                                    <span class="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-xs">
                                        +{(game.game.genres?.length ?? 0) - 3}
                                    </span>
                                {/if}
                            </div>

                            <!-- Description Preview -->
                            {#if game.game.description}
                                <p class="text-gray-400 text-xs line-clamp-2 leading-relaxed">
                                    {game.game.description}
                                </p>
                            {/if}

                            <!-- Stats -->
                            <div class="flex items-center justify-between pt-2 border-t border-purple-500/20">
                                <div class="flex items-center gap-1 text-yellow-400">
                                    <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                    </svg>
                                    <span class="text-xs font-semibold text-white">
                                        {formatRating(game.game.global_rating)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {:else}
            <div class="space-y-4">
                {#each sortedGames as game}
                    <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer overflow-hidden group">
                        <div class="flex flex-col sm:flex-row">
                            <!-- Box Art -->
                            <div class="w-full sm:w-48 h-64 sm:h-auto flex-shrink-0 bg-slate-900 overflow-hidden relative">
                                <img
                                        src={"data:image/png;base64," + game.game.box_art}
                                        alt={game.game.title}
                                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <!-- PEGI Badge -->
                                <div class="absolute top-3 right-3 {getPegiColor(game.game.pegi)} text-white text-xs font-bold px-2 py-1 rounded">
                                    {getPegiLabel(game.game.pegi)}
                                </div>
                            </div>

                            <!-- Game Details -->
                            <div class="flex-1 p-6 flex flex-col justify-between">
                                <div class="space-y-3">
                                    <div>
                                        <h3 class="text-white font-bold text-2xl mb-2">{game.game.title}</h3>
                                        <div class="flex items-center gap-4 text-sm text-gray-400">
                                            <span class="flex items-center gap-1">
                                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                                                </svg>
                                                {formatDate(game.game.release_date)}
                                            </span>
                                            <span class="flex items-center gap-1">
                                                <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                                </svg>
                                                <span class="text-white font-semibold">{formatRating(game.game.global_rating)}</span>
                                                <span class="text-gray-500">({game.game.rating_count} reviews)</span>
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Description -->
                                    {#if game.game.description}
                                        <p class="text-gray-300 text-sm leading-relaxed line-clamp-3">
                                            {game.game.description}
                                        </p>
                                    {/if}

                                    <!-- Genres -->
                                    <div class="flex flex-wrap gap-2">
                                        {#each (game.game.genres ?? []) as genre}
                                            <span class="px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-xs font-medium">
                                                {typeof genre === 'object' ? genre.name : genre}
                                            </span>
                                        {/each}
                                    </div>
                                </div>

                                <!-- Action Buttons -->
                                <div class="flex items-center gap-3 mt-4 pt-4 border-t border-purple-500/20">
                                    <a href="/{game.game.id}">
                                        <button class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-all">
                                            View Details
                                        </button>
                                    </a>
                                    <button class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-all">
                                        {selectedCollection === 'to-play' ? 'Mark as Played' : 'Move to Backlog'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    {/if}
</main>