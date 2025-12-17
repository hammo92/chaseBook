import { form } from '$app/server';
import { error } from '@sveltejs/kit';
import { z } from 'zod';

const BookingSchema = z.object({
    start: z.string(),
    end: z.string(),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Please enter a valid email'),
});

export const bookMeeting = form(BookingSchema, async ({ start, end, firstName, lastName, email }) => {
    const response = await fetch('https://calendar.meetchase.ai/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            start,
            end,
            attendees: [{ name: `${firstName} ${lastName}`, email }]
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        error(response.status, errorData.detail || 'Failed to book meeting');
    }

    return { success: true };
});
