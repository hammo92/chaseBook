<script lang="ts">
    import { format, addDays, subDays, startOfDay, isBefore } from 'date-fns';
    import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Calendar } from 'lucide-svelte';
    import { Button } from '$lib/components/button';
    import { Booking } from '$lib/booking';
    import Day from './day.svelte';
    import type { Slot } from './types';
    import {flip} from 'svelte/animate'
    import {fade} from 'svelte/transition'

    const DATE_FORMAT = 'yyyy-MM-dd';
    const DISPLAY_COUNT = 5;
    const today = startOfDay(new Date());

    let intervalStart = $state(today);
    let intervalEnd = $derived(addDays(intervalStart, DISPLAY_COUNT - 1));
    let intervalDays = $derived(
        [...Array(DISPLAY_COUNT)].map((_, i) => format(addDays(intervalStart, i), DATE_FORMAT))
    );
    const canGoBack = $derived(!isBefore(subDays(intervalStart, 1), today));

    let selectedSlot = $state<Slot | null>(null);
    let selectedDay = $state<string | null>(null);

    const selectSlot = (day: string, slot: Slot) => {
        selectedDay = day;
        selectedSlot = slot;
    };


    const clearSelection = () => {
        selectedSlot = null;
        selectedDay = null;
    };

    const moveIntervalByDays = (period = 1, direction: 'future' | 'past' = 'future') => {
        if (direction === 'future') {
            intervalStart = addDays(intervalStart, period);
        } else {
            const newStart = subDays(intervalStart, period);
            intervalStart = isBefore(newStart, today) ? today : newStart;
        }
    };


</script>


<div class="flex flex-col gap-8 max-w-7xl mx-auto px-4 py-8">
    <header class="text-center space-y-2">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-chase-500/10 text-chase-500 text-sm font-medium">
            <Calendar class="size-4" />
            <span>Schedule your meeting</span>
        </div>
        <h1 class="text-4xl font-bold tracking-tight text-gray-900">
            Select a time slot
        </h1>
        <p class="text-gray-500 text-lg">
            Choose an available time that works best for you
        </p>
    </header>

    {#if selectedSlot && selectedDay}
        <Booking
                day={selectedDay}
                slot={selectedSlot}
                onClose={clearSelection}
        />

    {:else}
        <div in:fade class="flex flex-col gap-8">
            <nav class="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm p-2">
                <div class="flex gap-1">
                    <Button onclick={() => moveIntervalByDays(5, 'past')} aria-label="Previous week" tooltip="Go back 5 days" disabled={!canGoBack}>
                        <ChevronsLeft class="size-5" />
                    </Button>
                    <Button onclick={() => moveIntervalByDays(1, 'past')} aria-label="Previous day" tooltip="Go back 1 day" disabled={!canGoBack}>
                        <ChevronLeft class="size-5" />
                    </Button>
                </div>

                <div class="text-center">
                    <p class="text-sm text-gray-500">Showing</p>
                    <p class="font-semibold text-gray-900">
                        {format(intervalStart, 'd MMM')} — {format(intervalEnd, 'd MMM yyyy')}
                    </p>
                </div>

                <div class="flex gap-1">
                    <Button onclick={() => moveIntervalByDays(1, 'future')} aria-label="Next day" tooltip="Go forward 1 day">
                        <ChevronRight class="size-5" />
                    </Button>
                    <Button onclick={() => moveIntervalByDays(5, 'future')} aria-label="Next week" tooltip="Go forward 5 days">
                        <ChevronsRight class="size-5" />
                    </Button>
                </div>
            </nav>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {#each intervalDays as day (day)}
                    <div animate:flip={{duration:200}}>
                        <Day {day} onSelectSlot={(slot) => selectSlot(day, slot)} />
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</div>
