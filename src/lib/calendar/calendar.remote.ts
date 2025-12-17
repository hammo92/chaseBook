import { query } from '$app/server';
import { error } from '@sveltejs/kit';
import { z } from 'zod';
import { addMinutes } from 'date-fns';
import type { AvailabilityList, Slot } from '$lib/calendar/types';

const SLOT_DURATION_MINUTES = 30;

export const getDaySlots = query.batch(z.string().date(), async (days) => {
    const sortedDays = [...days].sort();
    const start = sortedDays[0];
    const end = sortedDays[sortedDays.length - 1];

    const response = await fetch(`https://calendar.meetchase.ai/api/availability?start=${start}&end=${end}`);

    if (!response.ok) {
        error(502, `Failed to fetch availability: ${response.status}`);
    }

    const rawSlots = await response.json() as AvailabilityList;

    // Normalize slots to 30-minute duration as per spec
    const slots: Slot[] = rawSlots.map((slot) => ({
        start: slot.start,
        end: addMinutes(new Date(slot.start), SLOT_DURATION_MINUTES).toISOString()
    }));

    const slotsByDay = Object.groupBy(slots, (slot) => slot.start.slice(0, 10));

    return (day) => slotsByDay[day] ?? [];
});