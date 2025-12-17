<script lang="ts">
	import './layout.css';
    import {Header} from '$lib/layout/header'
    import {Toaster} from '$lib/toaster'

	let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href='/favicon.png' />
    <title>Book a meeting</title>
    <meta name="description" content="Select one of the times available to book your meeting with our team" />
</svelte:head>
<div class="min-h-screen bg-background text-foreground">
    <Header />
    {@render children()}
</div>
<Toaster />
