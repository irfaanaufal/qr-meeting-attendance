import React from 'react';
import { motion } from 'motion/react';

export default function LightPullThemeSwitcher({ theme, toggleTheme }) {
    const handleToggle = () => {
        if (toggleTheme) {
            toggleTheme();
        } else {
            const root = document.documentElement;
            if (root.classList.contains('dark')) {
                root.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            } else {
                root.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
        }
    };

    return (
        <div className="relative h-12 w-12 flex items-center justify-center overflow-visible">
            <motion.div
                drag="y"
                dragDirectionLock
                onDragEnd={(event, info) => {
                    if (info.offset.y > 15) {
                        handleToggle();
                    }
                }}
                dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
                dragTransition={{ bounceStiffness: 600, bounceDamping: 15 }}
                dragElastic={0.08}
                whileDrag={{ cursor: 'grabbing' }}
                className="relative z-20 w-6 h-6 rounded-full cursor-grab active:cursor-grabbing
                    bg-[radial-gradient(circle_at_center,_#facc15,_#fcd34d,_#fef9c3)] 
                    dark:bg-[radial-gradient(circle_at_center,_#9ca3af,_#4b5563,_#1f2937)] 
                    shadow-[0_0_15px_5px_rgba(250,204,21,0.5)] 
                    dark:shadow-[0_0_15px_3px_rgba(75,85,99,0.3)]
                    transition-shadow duration-200"
            >
                {/* Pull Cord String extending upwards */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[1.5px] h-[120px] bg-zinc-400 dark:bg-zinc-650 pointer-events-none z-10 opacity-70" />
            </motion.div>
        </div>
    );
}

