import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 select-none',
  {
    variants: {
      variant: {
        default:     'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-glow-sm hover:shadow-glow-blue hover:-translate-y-0.5 active:translate-y-0',
        destructive: 'bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25',
        outline:     'border border-white/[0.1] bg-white/[0.03] text-white/80 hover:bg-white/[0.07] hover:text-white hover:-translate-y-0.5',
        secondary:   'bg-white/[0.06] text-white hover:bg-white/[0.1]',
        ghost:       'text-white/60 hover:bg-white/[0.04] hover:text-white',
        link:        'text-blue-400 underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm:      'h-8 rounded-lg px-4 text-xs',
        lg:      'h-12 rounded-xl px-8 text-base',
        xl:      'h-14 rounded-xl px-10 text-base',
        icon:    'h-10 w-10 p-0',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
