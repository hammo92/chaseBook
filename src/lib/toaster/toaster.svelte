<script lang="ts">
    import { toaster } from './state.svelte';
    import { fly, fade } from 'svelte/transition';
    import { flip } from 'svelte/animate';
    import { X, CheckCircle, AlertCircle, Info } from 'lucide-svelte';

    const icons = {
        success: CheckCircle,
        error: AlertCircle,
        info: Info
    } as const;

    const colors = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        info: 'bg-gray-50 border-gray-200 text-gray-800'
    } as const;

    const iconColors = {
        success: 'text-green-500',
        error: 'text-red-500',
        info: 'text-gray-500'
    } as const;
</script>

<div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
    {#each toaster.queue as toast (toast.id)}
        {@const Icon = icons[toast.type]}
        <div
            class={["flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg min-w-[300px]", colors[toast.type]]}
            in:fly={{ x: 100, duration: 200 }}
            out:fade={{ duration: 150 }}
            animate:flip={{ duration: 200 }}
        >
            <Icon class={["size-5", iconColors[toast.type]]} />
            <p class="flex-1 text-sm font-medium">{toast.message}</p>
            <button
                class="p-1 hover:bg-black/5 rounded transition-colors cursor-pointer"
                onclick={() => toaster.removeToast(toast.id)}
            >
                <X class="size-4" />
            </button>
        </div>
    {/each}
</div>
