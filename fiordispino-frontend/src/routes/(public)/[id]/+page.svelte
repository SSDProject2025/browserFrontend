<script lang="ts">
    import type {GameDetails} from "$lib/types/api.types";
    import { page } from '$app/state';
    import {gameService} from "$lib/services/game";
    import {onMount} from "svelte";
    import Header from "$lib/components/header.svelte";
    import { authService } from "$lib/services/auth";
    import { PUBLIC_API_SERVER_BASE_URL } from '$env/static/public';

    const gameID = $derived(page.params.id)
    let game = $state<GameDetails>();
    let error = $state("")
    let isRetrying = $state(false);
    let loading = $state(true);
    let user = $state(null);

    let isPlayed = $state(false);
    let playedId = $state<number | null>(null);
    let isToPlay = $state(false);
    let toPlayId = $state<number | null>(null);
    let statusLoading = $state(false);
    let actionLoading = $state(false);
    let showRatingModal = $state(false);
    let pendingAction = $state<'add' | 'move' | 'update' | null>(null);

    function editRating() {
        if (!playedId) return;
        openRatingModal('update');
    }

    function openRatingModal(action: 'add' | 'move' | 'update') {
        pendingAction = action;
        showRatingModal = true;
    }

    async function handleRating(rating: number) {
        showRatingModal = false;
        if (!game || !pendingAction) return;

        actionLoading = true;
        try {
            if (pendingAction === 'add') {
                await gameService.addGamePlayed(game.id, rating);
            } else if (pendingAction === 'move' && toPlayId) {
                await gameService.moveBacklogToPlayed(toPlayId, rating);
            } else if (pendingAction === 'update' && playedId) {
                // NUOVO CASO: Aggiornamento
                await gameService.updateGameRating(playedId, game.id, rating);
            }
            await checkUserGameStatus();
        } catch (e) {
            console.error(e);
            alert("Error saving game rating");
        } finally {
            actionLoading = false;
            pendingAction = null;
        }
    }

    function addToPlayed() {
        if (!game) return;
        openRatingModal('add');
    }

    async function addToBacklog() {
        if (!game) return;
        actionLoading = true;
        try {
            await gameService.addGameToPlay(game.id);
            await checkUserGameStatus();
        } catch (e) {
            alert("Error adding to backlog");
        } finally {
            actionLoading = false;
        }
    }

    async function moveToBacklog() {
        if (!playedId) {
            alert("Error: Cannot identify the played game instance.");
            return;
        }

        actionLoading = true;
        try {
            await gameService.movePlayedToBacklog(playedId);
            await checkUserGameStatus();
        } catch (e) {
            console.error(e);
            alert("Error moving game to backlog");
        } finally {
            actionLoading = false;
        }
    }

    function moveToPlayed() {
        if (!toPlayId) {
            alert("Error: Cannot identify the backlog instance.");
            return;
        }
        openRatingModal('move');
    }

    async function removeGame() {
        if (!confirm("Are you sure you want to remove this game from your library?")) return;

        actionLoading = true;
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Token ${token}` };

        try {
            if (isPlayed && playedId) {
                await fetch(`${PUBLIC_API_SERVER_BASE_URL}/games-played/${playedId}/`, { method: 'DELETE', headers });
            } else if (isToPlay && toPlayId) {
                await fetch(`${PUBLIC_API_SERVER_BASE_URL}/games-to-play/${toPlayId}/`, { method: 'DELETE', headers });
            }

            isPlayed = false; playedId = null;
            isToPlay = false; toPlayId = null;
        } catch (e) {
            alert("Error removing game");
        } finally {
            actionLoading = false;
        }
    }

    async function checkUserGameStatus() {
        if (!user || !game) return;
        statusLoading = true;

        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        };

        try {
            const resPlayed = await fetch(`${PUBLIC_API_SERVER_BASE_URL}/games-played/check-status/?game_id=${game.id}`, {
                method: 'GET',
                headers
            });

            if (resPlayed.ok) {
                const data = await resPlayed.json();
                playedId = data.id;
                isPlayed = !!data.id;
            }

            const resToPlay = await fetch(`${PUBLIC_API_SERVER_BASE_URL}/games-to-play/check-status/?game_id=${game.id}`, {
                method: 'GET',
                headers
            });

            if (resToPlay.ok) {
                const data = await resToPlay.json();
                toPlayId = data.id;
                isToPlay = !!data.id;
            }


        } catch (e) {
            console.error("Error checking status", e);
        } finally {
            statusLoading = false;
        }
    }

    const loadData = async () => {
        loading = true;
        error = "";

        try {
            game = await gameService.getById(Number(gameID));
        } catch (err) {
            error = "Error on loading game"
            console.error(err);
        } finally {
            loading = false;
        }
    }

    async function handleRetry() {
        isRetrying = true;
        await loadData()
        isRetrying = false;
    }

    onMount(async () => {
        try {
            user = await authService.getUser();
        } catch (e) {
            user = null;
        }

        await loadData();

        if (user && game) {
            await checkUserGameStatus();
        }
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

                    <div class="absolute bottom-0 left-0 right-0 p-8 md:p-12 flex flex-col md:flex-row justify-between items-end gap-6">

                        <div>
                            <h1 class="text-5xl md:text-7xl font-bold text-white leading-tight drop-shadow-lg">
                                {game.title}
                            </h1>
                        </div>

                        {#if user && !statusLoading}
                            <div class="flex gap-3 mb-2">

                                {#if isPlayed}
                                    <button
                                        onclick={editRating}
                                        disabled={actionLoading}
                                        class="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition shadow-lg hover:shadow-purple-500/25"
                                    >
                                        Rate
                                    </button>

                                    <button
                                        onclick={moveToBacklog}
                                        disabled={actionLoading}
                                        class="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition shadow-lg hover:shadow-purple-500/25"
                                    >
                                        Move to Backlog
                                    </button>

                                    <button
                                        onclick={removeGame}
                                        disabled={actionLoading}
                                        aria-label="Remove game from library"
                                        class="flex items-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition shadow-lg hover:shadow-red-500/25"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                    </button>

                                {:else if isToPlay}
                                    <button
                                        onclick={moveToPlayed}
                                        disabled={actionLoading}
                                        class="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition shadow-lg hover:shadow-purple-500/25"
                                    >
                                        Mark as Played
                                    </button>

                                    <button
                                        onclick={removeGame}
                                        disabled={actionLoading}
                                        aria-label="Remove game from library"
                                        class="flex items-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition shadow-lg hover:shadow-red-500/25"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                    </button>

                                {:else}
                                    <button
                                        onclick={addToPlayed}
                                        disabled={actionLoading}
                                        class="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition shadow-lg hover:shadow-purple-500/25"
                                    >
                                        Played
                                    </button>

                                    <button
                                        onclick={addToBacklog}
                                        disabled={actionLoading}
                                        class="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition shadow-lg"
                                    >
                                        Plan to Play
                                    </button>
                                {/if}
                            </div>
                        {/if}
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
                                {#each game.genres as genre}
                                    <span class="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-gray-300 border border-white/10 transition-all duration-300 hover:text-white hover:border-purple-500/50 hover:shadow-[0_0_10px_rgba(168,85,247,0.2)] cursor-default select-none">
                                        {genre.name || genre}
                                    </span>
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

{#if showRatingModal}
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all">

        <div class="relative w-full max-w-md transform scale-100 transition-all">

            <div class="relative bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-8 overflow-hidden">

                <div class="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[50px] rounded-full pointer-events-none"></div>

                <div class="text-center mb-8">
                    <h3 class="text-3xl font-bold text-white mb-2">Rate this Game</h3>
                    <p class="text-purple-300/80 text-sm">Tap a number to confirm your score</p>
                </div>

                <div class="grid grid-cols-5 gap-3 mb-8">
                    {#each Array(10) as _, i}
                        {@const score = i + 1}
                        <button
                            onclick={() => handleRating(score)}
                            class="aspect-square flex items-center justify-center rounded-xl text-lg font-bold transition-all duration-200 border border-white/10
                            bg-slate-800/50 text-gray-300
                            hover:bg-purple-600 hover:text-white hover:scale-105 hover:border-purple-500"
                        >
                            {score}
                        </button>
                    {/each}
                </div>

                <button
                    onclick={() => showRatingModal = false}
                    class="w-full py-3.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all font-semibold uppercase tracking-wide text-xs"
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
{/if}