export { default as Toaster } from './toaster.svelte';
import { toaster } from './state.svelte';

export const showToast = (
    message: string,
    type: 'info' | 'success' | 'error' = 'info',
    duration?: number
) => {
    toaster.addToast(message, type, duration);
};
