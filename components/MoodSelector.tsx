"use client";

import React from "react";
import { motion } from "framer-motion";

const moods = [
  { emoji: "😊", label: "Happy", color: "#FFD700" },
  { emoji: "😐", label: "Neutral", color: "#A9A9A9" },
  { emoji: "😢", label: "Sad", color: "#4169E1" },
  { emoji: "😠", label: "Angry", color: "#FF4500" },
  { emoji: "😴", label: "Tired", color: "#8E44AD" },
  { emoji: "😰", label: "Anxious", color: "#2ECC71" },
  { emoji: "😌", label: "Relaxed", color: "#3498DB" },
  { emoji: "🥳", label: "Excited", color: "#E74C3C" },
  { emoji: "🤔", label: "Confused", color: "#F39C12" },
];

interface MoodSelectorProps {
  onSelectMood: (mood: string) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ onSelectMood }) => {
  return (
    <div className="p-2 sm:p-4">
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {moods.map(({ emoji, label, color }) => (
          <motion.button
            key={label}
            onClick={() => onSelectMood(`${emoji} ${label}`)}
            className="relative w-full aspect-square rounded-lg shadow-md flex flex-col items-center justify-center transition-all duration-200"
            style={{ backgroundColor: color }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">
              {emoji}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-white">
              {label}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default MoodSelector;
