import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, HTMLMotionProps } from "framer-motion";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
}

export function Button({ className, variant = "primary", size = "md", children, ...props }: ButtonProps) {
    const variants = {
        primary: "bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg shadow-brand-primary/25 border border-white/10",
        secondary: "bg-glass-highlight border border-glass-border text-white backdrop-blur-md hover:bg-glass-highlight/80",
        ghost: "bg-transparent text-slate-300 hover:text-white hover:bg-white/5",
    };

    const sizes = {
        sm: "px-3 py-2 text-sm min-h-[40px]",
        md: "px-4 py-3 text-base min-h-[44px]",
        lg: "px-6 py-4 text-lg min-h-[48px]",
    };

    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            className={cn(
                "rounded-full font-medium transition-all duration-200 flex items-center justify-center gap-2 touch-manipulation",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
}
