<script lang="ts">
    import "../app.css";
    import favicon from '$lib/assets/favicon.svg';
    import Footer from "$lib/components/footer.svelte";

    let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="{favicon}" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">

	{@render children()}

	<!-- Footer -->
	<Footer/>

</div>