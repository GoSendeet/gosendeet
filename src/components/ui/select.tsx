import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default";
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-purple300 focus-visible:ring-purple200 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className,
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className,
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({ className }: { className?: string }) {
  const rafRef = React.useRef<number>(0);
  const isScrollingRef = React.useRef(false);
  const [canScrollUp, setCanScrollUp] = React.useState(false);
  const viewportRef = React.useRef<HTMLElement | null>(null);

  const checkScroll = React.useCallback(() => {
    if (viewportRef.current) {
      setCanScrollUp(viewportRef.current.scrollTop > 0);
    }
  }, []);

  const startScroll = React.useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isScrollingRef.current) return;

      const viewport = (e.currentTarget as HTMLElement)
        .closest("[data-slot=select-content]")
        ?.querySelector("[data-radix-select-viewport]") as HTMLElement | null;
      if (!viewport) return;
      viewportRef.current = viewport;
      isScrollingRef.current = true;

      const step = () => {
        if (!isScrollingRef.current || !viewportRef.current) return;
        viewportRef.current.scrollTop -= 4;
        checkScroll();
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [checkScroll],
  );

  const stopScroll = React.useCallback(() => {
    isScrollingRef.current = false;
    cancelAnimationFrame(rafRef.current);
  }, []);

  React.useEffect(() => {
    const handleGlobalUp = () => stopScroll();
    window.addEventListener("pointerup", handleGlobalUp);
    window.addEventListener("pointercancel", handleGlobalUp);
    return () => {
      window.removeEventListener("pointerup", handleGlobalUp);
      window.removeEventListener("pointercancel", handleGlobalUp);
      stopScroll();
    };
  }, [stopScroll]);

  // Setup scroll listener on mount
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const content = document.querySelector("[data-slot=select-content]");
      const viewport = content?.querySelector(
        "[data-radix-select-viewport]",
      ) as HTMLElement | null;
      if (viewport) {
        viewportRef.current = viewport;
        checkScroll();
        viewport.addEventListener("scroll", checkScroll);
        return () => viewport.removeEventListener("scroll", checkScroll);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [checkScroll]);

  if (!canScrollUp) return null;

  return (
    <div
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-pointer items-center justify-center py-1 hover:bg-accent/50 active:bg-accent",
        className,
      )}
      onPointerDown={startScroll}
      onPointerUp={stopScroll}
    >
      <ChevronUpIcon className="size-4" />
    </div>
  );
}

function SelectScrollDownButton({ className }: { className?: string }) {
  const rafRef = React.useRef<number>(0);
  const isScrollingRef = React.useRef(false);
  const [canScrollDown, setCanScrollDown] = React.useState(true);
  const viewportRef = React.useRef<HTMLElement | null>(null);

  const checkScroll = React.useCallback(() => {
    if (viewportRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = viewportRef.current;
      setCanScrollDown(scrollTop + clientHeight < scrollHeight - 1);
    }
  }, []);

  const startScroll = React.useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isScrollingRef.current) return;

      const viewport = (e.currentTarget as HTMLElement)
        .closest("[data-slot=select-content]")
        ?.querySelector("[data-radix-select-viewport]") as HTMLElement | null;
      if (!viewport) return;
      viewportRef.current = viewport;
      isScrollingRef.current = true;

      const step = () => {
        if (!isScrollingRef.current || !viewportRef.current) return;
        viewportRef.current.scrollTop += 4;
        checkScroll();
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [checkScroll],
  );

  const stopScroll = React.useCallback(() => {
    isScrollingRef.current = false;
    cancelAnimationFrame(rafRef.current);
  }, []);

  React.useEffect(() => {
    const handleGlobalUp = () => stopScroll();
    window.addEventListener("pointerup", handleGlobalUp);
    window.addEventListener("pointercancel", handleGlobalUp);
    return () => {
      window.removeEventListener("pointerup", handleGlobalUp);
      window.removeEventListener("pointercancel", handleGlobalUp);
      stopScroll();
    };
  }, [stopScroll]);

  // Setup scroll listener on mount
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const content = document.querySelector("[data-slot=select-content]");
      const viewport = content?.querySelector(
        "[data-radix-select-viewport]",
      ) as HTMLElement | null;
      if (viewport) {
        viewportRef.current = viewport;
        checkScroll();
        viewport.addEventListener("scroll", checkScroll);
        return () => viewport.removeEventListener("scroll", checkScroll);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [checkScroll]);

  if (!canScrollDown) return null;

  return (
    <div
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-pointer items-center justify-center py-1 hover:bg-accent/50 active:bg-accent",
        className,
      )}
      onPointerDown={startScroll}
      onPointerUp={stopScroll}
    >
      <ChevronDownIcon className="size-4" />
    </div>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
