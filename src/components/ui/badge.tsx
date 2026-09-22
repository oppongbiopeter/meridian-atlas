import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-border px-2 py-0.5 text-xs font-medium tracking-wide text-muted-foreground",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground border-transparent",
        outline: "bg-transparent",
        muted: "border-transparent bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
