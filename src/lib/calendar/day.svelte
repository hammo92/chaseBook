<script lang="ts">
    import { getDaySlots } from './calendar.remote';
    import { format, parse, isToday } from 'date-fns';
    import { slide, fade } from 'svelte/transition';
    import type { Slot } from './types';
    import { Calendar } from 'lucide-svelte';

    let { day, onSelectSlot }: { day: string; onSelectSlot?: (slot: Slot) => void } = $props();

    const slotsQuery = $derived(getDaySlots(day));
    const dayDate = $derived(parse(day, 'yyyy-MM-dd', new Date()));
    const isCurrentDay = $derived(isToday(dayDate));
</script>

{#snippet slotItem(slot: Slot)}
    <button
        class="
            group relative w-full rounded-xl px-4 py-3
            bg-white border border-gray-100
            hover:border-green-400 hover:bg-green-500/5
            shadow-sm hover:shadow-md
            transition-all duration-200 ease-out
            text-left flex items-center gap-3 cursor-pointer
        "
        in:slide={{ duration: 200 }}
        onclick={() => onSelectSlot?.(slot)}
    >
        <span class="w-1 h-8 rounded-full bg-green-500 group-hover:bg-green-600 transition-colors"></span>
        <span class="flex flex-col">
            <span class="font-semibold text-gray-900">{format(new Date(slot.start), 'HH:mm')}</span>
            <span class="text-xs text-gray-500">{format(new Date(slot.end), 'HH:mm')}</span>
        </span>
    </button>
{/snippet}

<div
    class="
        flex flex-col rounded-2xl bg-white
        border border-gray-100 shadow-sm
        overflow-hidden
        h-full
    "
    in:fade
>
    <header
        class={[
            "text-center py-4 px-4 border-b border-gray-100",
            isCurrentDay ? "bg-chase-500 text-white" : "bg-gray-50"
        ]}
    >
        <p class={["text-xs font-medium uppercase tracking-wide", isCurrentDay ? "text-white" : "text-gray-700"]}>
            {format(dayDate, 'EEEE')}
        </p>
        <p class={["text-3xl font-bold tracking-tight", isCurrentDay ? "text-white" : "text-gray-900"]}>
            {format(dayDate, 'd')}
        </p>
        <p class={["text-sm font-medium", isCurrentDay ? "text-white" : "text-gray-700"]}>
            {format(dayDate, 'MMM')}
        </p>
    </header>

    <div class="flex flex-col gap-2 p-4 min-h-[280px] max-h-[400px] overflow-y-auto">
        {#if slotsQuery.loading}
            {#each { length: 3 } as _, i (i)}
                <div
                    class="h-14 rounded-xl bg-gray-100 animate-pulse"
                ></div>
            {/each}
        {:else if slotsQuery.error}
            <div class="flex flex-col items-center justify-center py-8 text-center">
                <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                    <span class="text-red-500 text-xl">!</span>
                </div>
                <p class="text-sm font-medium text-gray-900">Unable to load</p>
                <p class="text-xs text-gray-500">Please try again</p>
            </div>
        {:else if slotsQuery.current?.length}
            {#each slotsQuery.current as slot (slot.start)}
                {@render slotItem(slot)}
            {/each}
        {:else if slotsQuery.current?.length === 0}
            <div class="flex flex-col items-center justify-center py-8 text-center">
                <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <span class="text-gray-400 text-lg"><Calendar class="size-4" /></span>
                </div>
                <p class="text-sm font-medium text-gray-900">No availability</p>
                <p class="text-xs text-gray-500">Try another day</p>
            </div>
        {/if}
    </div>
</div>
