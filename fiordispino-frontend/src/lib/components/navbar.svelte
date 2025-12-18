<script>
    import "../../app.css";
    import { page } from '$app/stores';

    let currentPath = $derived($page.url.pathname);
</script>


<header class="bg-black/30 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-10">
    <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
            <a href="/" class="flex items-center gap-2 text-white hover:text-purple-400 transition-colors">
                <span class="text-3xl">🎮</span>
                <span class="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            Fiordispino
          </span>
            </a>

            <nav class="flex items-center gap-4">
                <a href="/" class="{currentPath === '/' ? 'text-purple-400 font-semibold' : 'text-gray-400 hover:text-white'} transition-colors">Home</a>
                <a href="/profile" class="{currentPath === '/profile' ? 'text-purple-400 font-semibold' : 'text-gray-400 hover:text-white'} transition-colors">Profile</a>
                <a href="/profile/my-library" class="{currentPath === '/profile/my-library' || currentPath.startsWith('/library/') ? 'text-purple-400 font-semibold' : 'text-gray-400 hover:text-white'} transition-colors">Library</a>
            </nav>
        </div>
    </div>
</header>