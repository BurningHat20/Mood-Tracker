"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";

const moods = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "😢", label: "Sad" },
  { emoji: "😠", label: "Angry" },
  { emoji: "😴", label: "Tired" },
  { emoji: "😰", label: "Anxious" },
  { emoji: "😌", label: "Relaxed" },
  { emoji: "🥳", label: "Excited" },
  { emoji: "🤔", label: "Confused" },
];

interface MoodSelectorProps {
  onSelectMood: (mood: string) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ onSelectMood }) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleMoodClick = (mood: string) => {
    setSelectedMood(mood);
  };

  const handleAddMood = () => {
    if (selectedMood) {
      onSelectMood(selectedMood);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000); // Hide popup after 2 seconds
      setSelectedMood(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {moods.map(({ emoji, label }) => (
          <motion.div
            key={label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => handleMoodClick(`${emoji} ${label}`)}
              variant={
                selectedMood === `${emoji} ${label}` ? "default" : "outline"
              }
              className={`w-full h-24 flex flex-col items-center justify-center text-center ${
                selectedMood === `${emoji} ${label}`
                  ? "ring-2 ring-primary"
                  : ""
              }`}
            >
              <span className="text-4xl mb-2">{emoji}</span>
              <span className="text-sm">{label}</span>
            </Button>
          </motion.div>
        ))}
      </div>
      <Button
        onClick={handleAddMood}
        disabled={!selectedMood}
        className="w-full mt-4"
      >
        Add Mood
      </Button>

      <Dialog open={showPopup} onOpenChange={setShowPopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mood Added Successfully!</DialogTitle>
          </DialogHeader>
          <p>Your mood has been recorded.</p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MoodSelector;
