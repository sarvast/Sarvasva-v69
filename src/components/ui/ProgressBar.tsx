import { motion } from "framer-motion";

interface ProgressBarProps {
    progress: number; // 0 to 100
    color?: string;
    height?: number;
}

export function ProgressBar({ progress, color = "bg-neon-aqua", height = 8 }: ProgressBarProps) {
    return (
        <div className={`w-full bg-white/10 rounded-full overflow-hidden h-[${height}px]`}>
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full ${color} shadow-[0_0_10px_rgba(113,244,229,0.5)]`}
                style={{ height }}
            />
        </div>
    );
}
