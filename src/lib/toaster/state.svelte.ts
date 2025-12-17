type Toast = {
    id: number;
    message: string;
    type: 'info' | 'success' | 'error';
    duration?: number;
};

class Toaster {
    static #instance: Toaster | null = null;
    #queue = $state<Toast[]>([]);

    private constructor() {}

    static getInstance(): Toaster {
        if (!Toaster.#instance) {
            Toaster.#instance = new Toaster();
        }
        return Toaster.#instance;
    }

    get queue(): Toast[] {
        return this.#queue;
    }

    addToast(message: string, type: 'info' | 'success' | 'error' = "success", duration: number = 3000) {
        console.log("Adding toast:", { message, type, duration });
        const id = Date.now();
        this.#queue.push({ id, message, type, duration });

        setTimeout(() => {
            this.removeToast(id);
        }, duration);
    }

    removeToast(id: number) {
        this.#queue = this.#queue.filter(toast => toast.id !== id);
    }
}

export const toaster = Toaster.getInstance();