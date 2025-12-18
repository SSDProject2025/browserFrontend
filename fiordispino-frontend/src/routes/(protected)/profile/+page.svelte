<script lang="ts">
    import { onMount } from 'svelte';
    import type { Game, GenreInfo, User } from "$lib/types/api.types";
    import { authService } from "$lib/services/auth";
    import { libraryService } from "$lib/services/library";
    import { gameService } from "$lib/services/game";

    interface Collection {
        id: string;
        name: string;
        description: string;
        icon: string;
        games: Game[];
        color: string;
    }

    let user = {
        username: "Username",
        email: "gamer@example.com",
        avatar: "https://ui-avatars.com/api/?name=Gamer+Pro&background=9333ea&color=fff&size=256"
    };

    $: collections = [
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
    let userObject: User;
    let playedGames: Game[] = [];
    let toPlayGames: Game[] = [];

    onMount(async () => {
        try {
            userObject = await authService.getUser();

            user.username = userObject.username;
            user.email = userObject.email;
            user.avatar = "https://ui-avatars.com/api/?name=" + userObject.username + "&background=9333ea&color=fff&size=256";

            const playedResp = await libraryService.getGamesPlayedFromUsername(userObject.username).catch(() => []);
            playedGames = playedResp.map((item: any) => item);

            const toPlayResp = await libraryService.getGamesToPlayFromUsername(userObject.username).catch(() => []);
            toPlayGames = toPlayResp.map((item: any) => item);

        } catch (err) {
            console.error(err);
        } finally {
            loading = false;
        }
    });

    function formatRating(rating: number | undefined): string {
        return rating ? rating.toFixed(1) : 'N/A';
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
            <div class="h-48 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 relative">
                <div class="absolute inset-0 bg-black/20"></div>
            </div>
            <div class="relative px-8 pb-8">
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
                    </div>
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
                    <div class="p-6 border-b border-purple-500/20 bg-black/20 flex justify-between items-center">
                        <div class="flex items-center gap-3">
                            <span class="text-4xl">{collection.icon}</span>
                            <div>
                                <h2 class="text-2xl font-bold text-white">{collection.name}</h2>
                                <p class="text-gray-400 text-sm">{collection.description}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-3xl font-bold bg-gradient-to-r {collection.color} text-transparent bg-clip-text">
                                {collection.games.length}
                            </div>
                            <div class="text-sm text-gray-400">{collection.games.length === 1 ? 'game' : 'games'}</div>
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
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                {#each collection.games.slice(0, 4) as game}
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
                                                                {formatRating(game.game.global_rating ? parseFloat(game.game.global_rating) : undefined)}
                                                            </span>
                                                            <span class="text-gray-300">
                                                                {game.game.rating_count} ratings
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
                                                        {formatRating(game.game.global_rating ? parseFloat(game.game.global_rating) : undefined)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                {/each}
                            </div>

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