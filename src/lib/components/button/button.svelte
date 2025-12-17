<script lang="ts">
    import type { HTMLButtonAttributes } from "svelte/elements";
    import type { Snippet } from "svelte";
    import tippy from 'tippy.js';
    import type { Attachment } from 'svelte/attachments';

    let {
        variant = 'ghost',
        children,
        class: className,
        tooltip,
        ...rest
    }: HTMLButtonAttributes & {
        variant?: 'primary' | 'ghost';
        children?: Snippet;
        class?: string;
        tooltip?: string;
    } = $props();

    function withTooltip(content: string | undefined): Attachment {
        return (element) => {
            if(!content) return;
            const instance = tippy(element, {
                content,
                animation: 'scale',
                theme: 'light'
            });
            return instance.destroy;
        };
    }
</script>

<button
    {@attach withTooltip(tooltip)}
    class={[
        "p-3 rounded-xl transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed",
        variant === 'primary'
            ? "bg-chase-500 text-white hover:bg-chase-600 disabled:hover:bg-chase-500"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:hover:bg-transparent",
        className
    ]}
    type="button"
    {...rest}
>
    {@render children?.()}
</button>