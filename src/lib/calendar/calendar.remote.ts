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

    const now = new Date();
    const slots: Slot[] = rawSlots.reduce<Slot[]>((acc, slot) => {
        const slotStart = new Date(slot.start);
        if (slotStart > now) {
            acc.push({
                start: slot.start,
                end: addMinutes(slotStart, SLOT_DURATION_MINUTES).toISOString()
            });
        }
        return acc;
    }, []);

    const slotsByDay = Object.groupBy(slots, (slot) => slot.start.slice(0, 10));

    return (day) => slotsByDay[day] ?? [];
});