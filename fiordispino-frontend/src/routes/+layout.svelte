<script>import "../app.css";
import favicon from '$lib/assets/favicon.svg';

let { children } = $props();</script>

<svelte:head>
	<link rel="icon" href="{favicon}" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">

	{@render children()}

	<!-- Footer -->
	<footer class="bg-black/40 backdrop-blur-md border-t border-purple-500/20 mt-auto">
		<div class="container mx-auto px-4 py-12">
			<div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
				<!-- Brand Section -->
				<div class="col-span-1">
					<div class="flex items-center gap-2 mb-4">
						<span class="text-3xl">🎮</span>
						<span class="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
					  GameFeed
					</span>
					</div>
					<p class="text-gray-400 text-sm mb-4">
						Your ultimate gaming companion. Discover, track, and share your gaming journey.
					</p>
					<!-- Social Links -->
					<div class="flex gap-3">
						<a href="#" class="w-10 h-10 flex items-center justify-center bg-slate-800/50 hover:bg-purple-600/30 border border-purple-500/30 hover:border-purple-500/50 rounded-lg transition-all text-gray-400 hover:text-white">
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
								<path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
							</svg>
						</a>
						<a href="#" class="w-10 h-10 flex items-center justify-center bg-slate-800/50 hover:bg-purple-600/30 border border-purple-500/30 hover:border-purple-500/50 rounded-lg transition-all text-gray-400 hover:text-white">
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
							</svg>
						</a>
						<a href="#" class="w-10 h-10 flex items-center justify-center bg-slate-800/50 hover:bg-purple-600/30 border border-purple-500/30 hover:border-purple-500/50 rounded-lg transition-all text-gray-400 hover:text-white">
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
								<path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
							</svg>
						</a>
						<a href="#" class="w-10 h-10 flex items-center justify-center bg-slate-800/50 hover:bg-purple-600/30 border border-purple-500/30 hover:border-purple-500/50 rounded-lg transition-all text-gray-400 hover:text-white">
							<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
								<path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
							</svg>
						</a>
					</div>
				</div>

				<!-- Quick Links -->
				<div>
					<h3 class="text-white font-semibold mb-4">Explore</h3>
					<ul class="space-y-2">
						<li><a href="/" class="text-gray-400 hover:text-purple-400 transition-colors text-sm">Home</a></li>
						<li><a href="/discover" class="text-gray-400 hover:text-purple-400 transition-colors text-sm">Discover Games</a></li>
						<li><a href="/trending" class="text-gray-400 hover:text-purple-400 transition-colors text-sm">Trending</a></li>
						<li><a href="/new-releases" class="text-gray-400 hover:text-purple-400 transition-colors text-sm">New Releases</a></li>
						<li><a href="/top-rated" class="text-gray-400 hover:text-purple-400 transition-colors text-sm">Top Rated</a></li>
					</ul>
				</div>

				<!-- Categories -->
				<div>
					<h3 class="text-white font-semibold mb-4">Categories</h3>
					<ul class="space-y-2">
						<li><a href="/category/action" class="text-gray-400 hover:text-purple-400 transition-colors text-sm">Action</a></li>
						<li><a href="/category/rpg" class="text-gray-400 hover:text-purple-400 transition-colors text-sm">RPG</a></li>
						<li><a href="/category/adventure" class="text-gray-400 hover:text-purple-400 transition-colors text-sm">Adventure</a></li>
						<li><a href="/category/strategy" class="text-gray-400 hover:text-purple-400 transition-colors text-sm">Strategy</a></li>
						<li><a href="/category/indie" class="text-gray-400 hover:text-purple-400 transition-colors text-sm">Indie</a></li>
					</ul>
				</div>

				<!-- Support -->
				<div>
					<h3 class="text-white font-semibold mb-4">Support</h3>
					<ul class="space-y-2">
						<li><a href="/about" class="text-gray-400 hover:text-purple-400 transition-colors text-sm">About Us</a></li>
						<li><a href="/contact" class="text-gray-400 hover:text-purple-400 transition-colors text-sm">Contact</a></li>
						<li><a href="/faq" class="text-gray-400 hover:text-purple-400 transition-colors text-sm">FAQ</a></li>
						<li><a href="/privacy" class="text-gray-400 hover:text-purple-400 transition-colors text-sm">Privacy Policy</a></li>
						<li><a href="/terms" class="text-gray-400 hover:text-purple-400 transition-colors text-sm">Terms of Service</a></li>
					</ul>
				</div>
			</div>

			<!-- Bottom Bar -->
			<div class="pt-8 border-t border-purple-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
				<p class="text-gray-400 text-sm text-center md:text-left">
					© 2024 GameFeed. All rights reserved. Made with 💜 for gamers.
				</p>
				<div class="flex gap-4">
					<a href="/sitemap" class="text-gray-400 hover:text-purple-400 transition-colors text-sm">Sitemap</a>
					<a href="/accessibility" class="text-gray-400 hover:text-purple-400 transition-colors text-sm">Accessibility</a>
					<a href="/cookies" class="text-gray-400 hover:text-purple-400 transition-colors text-sm">Cookie Settings</a>
				</div>
			</div>
		</div>
	</footer>
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