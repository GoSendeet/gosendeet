import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Loader } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md cursor-pointer font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-xs hover:-translate-y-0.5 hover:shadow-lg",
        destructive:
          "bg-[#EC2D30] text-white shadow-xs hover:bg-destructive/90 hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-grey200 bg-background shadow-xs hover:bg-accent hover:text-accent-foreground hover:-translate-y-0.5 hover:shadow-md dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-[#1A1C1D] text-white shadow-xs hover:bg-[#000010] hover:-translate-y-0.5 hover:shadow-lg",
        ghost: "hover:text-accent-foreground hover:bg-accent/10 p-0",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "md:px-6 px-4 md:py-3 py-2 md:has-[>svg]:px-6 has-[>svg]:px-4 rounded-full",
        sm: "h-9 rounded-full py-4 gap-1.5 px-4 has-[>svg]:px-4",
        lg: "h-10 rounded-full px-6 has-[>svg]:px-4",
        icon: "size-9",
        ghost: "px-0",
        large: "md:px-16 px-6 md:py-3 py-2 rounded-full",
        custom: "rounded-full md:py-3 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  ...props
}: Omit<React.ComponentProps<"button">, "loading"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  const [isLoading, setLoading] = React.useState(loading);

  React.useEffect(() => {
    setLoading(loading);
  }, [loading]);

  // Optional: Access and call props.onClick manually
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!navigator.onLine) {
      toast.error("Please check your internet connection.");
      setLoading(false);
      return;
    }

    props?.onClick?.(event);
  };

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={handleClick}
      disabled={isLoading || props.disabled}
      {...props} // spread props after removing `loading`
    >
      {props.children}
      {isLoading && <Loader className="ml-2 animate-spin" />}
    </Comp>
  );
}

export { Button, buttonVariants };
