<script lang="ts">
    import { format, parse } from 'date-fns';
    import { fade } from 'svelte/transition';
    import type { Slot } from '$lib/calendar/types';
    import { Clock, CheckCircle, ArrowLeft } from 'lucide-svelte';
    import { bookMeeting } from './booking.remote';
    import { Button } from '$lib/components/button';
    import { untrack } from 'svelte';
    import { showToast } from '$lib/toaster';
    import { BookingSchema } from './schemas';

    let {
        day,
        slot,
        onClose
    }: {
        day: string;
        slot: Slot;
        onClose: () => void;
    } = $props();

    const dayDate = $derived(parse(day, 'yyyy-MM-dd', new Date()));
    const startDate = $derived(new Date(slot.start));
    const endDate = $derived(new Date(slot.end));

    $effect(() => {
        bookMeeting.fields.start.set(slot.start);
        bookMeeting.fields.end.set(slot.end);
        untrack(() => {
            booked = false;
            emailRecipient = "";
        });
    });

    const {start, end, firstName, lastName, email} = bookMeeting.fields;

    let booked = $state(false);
    let emailRecipient = $state("");

</script>

<div class="flex flex-col sm:flex-row rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden" in:fade>
    <div
        class="flex flex-col items-center justify-center px-8 py-6 border-b sm:border-b-0 sm:border-r border-gray-100 bg-gray-50"
    >
        <p class="text-xs font-medium uppercase tracking-wide text-gray-700">
            {format(dayDate, 'EEEE')}
        </p>
        <p class="text-4xl font-bold tracking-tight text-gray-900">
            {format(dayDate, 'd')}
        </p>
        <p class="text-sm font-medium text-gray-700">
            {format(dayDate, 'MMM')}
        </p>
        <div class="mt-4 flex items-center gap-2 text-sm">
            <Clock class="size-4 text-gray-500" />
            <span>{format(startDate, 'HH:mm')} - {format(endDate, 'HH:mm')}</span>
        </div>
    </div>

    <div class="flex-1 p-6">
        {#if booked}
            <div class="text-center py-8">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle class="size-8 text-green-500" />
                </div>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">Meeting Booked!</h2>
                <p class="text-gray-500 mb-6">
                    We've sent a confirmation to <strong>{emailRecipient}</strong>
                </p>
                <Button variant="primary" onclick={onClose}>Done</Button>
            </div>
        {:else}
            <div class="flex items-center gap-4 mb-6">
                <button
                    class="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    onclick={onClose}
                >
                    <ArrowLeft class="size-5 text-gray-500" />
                </button>
                <h2 class="text-xl font-bold text-gray-900">Book your meeting</h2>
            </div>

            <form
                {...bookMeeting.preflight(BookingSchema).enhance(async ({ data, submit }) => {
                    try {
                        await submit();
                        emailRecipient = data.email;
                        booked = true;
                    } catch (error) {
                        showToast("Something went wrong booking your slot, please try again", "error");
                    }
                })}
                class="space-y-4"
            >
                <input type="hidden" {...start.as('text')} />
                <input type="hidden" {...end.as('text')} />

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
                            First name
                        </label>
                        <input
                            {...firstName.as('text')}
                            id="firstName"
                            class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chase-500 focus:border-transparent"
                        />
                        {#each firstName?.issues() as issue, i (i)}
                            <p class="text-red-500 text-xs mt-1">{issue.message}</p>
                        {/each}
                    </div>
                    <div>
                        <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
                            Last name
                        </label>
                        <input
                            {...lastName.as('text')}
                            id="lastName"
                            class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chase-500 focus:border-transparent"
                        />
                        {#each lastName?.issues() as issue, i (i)}
                            <p class="text-red-500 text-xs mt-1">{issue.message}</p>
                        {/each}
                    </div>
                </div>

                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        {...email.as('text')}
                        id="email"
                        type="email"
                        class="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-chase-500 focus:border-transparent"
                    />
                    {#each email?.issues() as issue, i (i)}
                        <p class="text-red-500 text-xs mt-1">{issue.message}</p>
                    {/each}
                </div>

                <div class="flex w-full justify-end">
                    <Button variant="primary" disabled={!!bookMeeting.pending} class="ml-auto" type="submit">
                        {bookMeeting.pending ? 'Booking...' : 'Confirm Booking'}
                    </Button>
                </div>
            </form>
        {/if}
    </div>
</div>
