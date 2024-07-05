"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import MoodSelector from "@/components/MoodSelector";
import MoodHistory from "@/components/MoodHistory";
import MoodCalendar from "@/components/MoodCalendar";
import MoodStats from "@/components/MoodStats";
import MoodTrends from "@/components/MoodTrends";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { useTheme } from "next-themes";
import {
  Moon,
  Sun,
  BarChart,
  CalendarDays,
  List,
  PlusCircle,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

export interface MoodEntry {
  id: string;
  date: string;
  mood: string;
  intensity: number;
  note: string;
}

export default function Home() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [customMood, setCustomMood] = useState("");
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState("");
  const [view, setView] = useState<"add" | "list" | "calendar" | "trends">(
    "add"
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showMoodDialog, setShowMoodDialog] = useState(false);
  const { toast } = useToast();

  const intensityLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  useEffect(() => {
    setMounted(true);
    const storedEntries = localStorage.getItem("moodEntries");
    if (storedEntries) {
      setMoodEntries(JSON.parse(storedEntries));
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("moodEntries", JSON.stringify(moodEntries));
    }
  }, [moodEntries, mounted]);

  const handleSelectMood = (mood: string) => {
    setSelectedMood(mood);
    setShowMoodDialog(true);
  };

  const handleAddMood = () => {
    if (selectedMood) {
      const newEntry: MoodEntry = {
        id: Date.now().toString(),
        date: selectedDate.toISOString(),
        mood: selectedMood,
        intensity: intensity,
        note: note,
      };
      setMoodEntries([newEntry, ...moodEntries]);
      setNote("");
      setIntensity(5);
      setSelectedMood(null);
      setShowMoodDialog(false);
      toast({
        title: "Mood Added",
        description: "Your mood has been successfully recorded.",
        className: "bg-green-500 border-green-500",
        style: {
          color: "white",
        },
      });
    }
  };

  const handleCustomMoodSubmit = () => {
    if (customMood.trim()) {
      setSelectedMood(customMood);
      setShowMoodDialog(true);
      setCustomMood("");
    }
  };

  const handleEditMood = (editedEntry: MoodEntry) => {
    setMoodEntries(
      moodEntries.map((entry) =>
        entry.id === editedEntry.id ? editedEntry : entry
      )
    );
  };

  const handleViewChange = (
    newView: "add" | "list" | "calendar" | "trends"
  ) => {
    setView(newView);
    setSidebarOpen(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 md:flex-row">
      {/* Sidebar */}
      <aside
        className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg overflow-y-auto transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
        `}
      >
        <div className="p-4 space-y-2">
          <Button
            variant={view === "add" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => handleViewChange("add")}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Mood
          </Button>
          <Button
            variant={view === "list" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => handleViewChange("list")}
          >
            <List className="mr-2 h-4 w-4" /> Mood History
          </Button>
          <Button
            variant={view === "calendar" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => handleViewChange("calendar")}
          >
            <CalendarDays className="mr-2 h-4 w-4" /> Calendar View
          </Button>
          <Button
            variant={view === "trends" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => handleViewChange("trends")}
          >
            <BarChart className="mr-2 h-4 w-4" /> Mood Trends
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-md p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Mood Tracker
            </h1>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="h-[1.2rem] w-[1.2rem]" />
                ) : (
                  <Moon className="h-[1.2rem] w-[1.2rem]" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-2 sm:p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {view === "add" && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
                  <h2 className="text-2xl font-bold mb-4 sm:mb-6">
                    How are you feeling?
                  </h2>
                  <MoodSelector onSelectMood={handleSelectMood} />
                  <div className="mt-4 sm:mt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Custom Mood
                      </label>
                      <div className="flex space-x-2">
                        <Input
                          type="text"
                          value={customMood}
                          onChange={(e) => setCustomMood(e.target.value)}
                          placeholder="Enter custom mood"
                          className="flex-grow"
                        />
                        <Button onClick={handleCustomMoodSubmit}>Add</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {view === "list" && (
                <MoodHistory
                  moodEntries={moodEntries}
                  onEditMood={handleEditMood}
                />
              )}
              {view === "calendar" && (
                <MoodCalendar moodEntries={moodEntries} />
              )}
              {view === "trends" && <MoodTrends moodEntries={moodEntries} />}
            </motion.div>
          </AnimatePresence>
          {view !== "add" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <MoodStats moodEntries={moodEntries} />
            </motion.div>
          )}
        </main>
      </div>

      {/* Mood Dialog */}
      <Dialog open={showMoodDialog} onOpenChange={setShowMoodDialog}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[800px] w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              Add Mood: {selectedMood}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Mood Intensity
                </label>
                <div className="grid grid-cols-5 gap-2 sm:flex sm:flex-wrap">
                  {intensityLevels.map((level) => (
                    <Button
                      key={level}
                      variant={intensity === level ? "default" : "outline"}
                      className={`w-full h-12 sm:w-10 sm:h-10 text-lg sm:text-base ${
                        intensity === level
                          ? "bg-blue-500 text-white"
                          : "hover:bg-blue-100 dark:hover:bg-blue-900"
                      }`}
                      onClick={() => setIntensity(level)}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Note</label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note about your mood (optional)"
                  className="h-[120px] text-base"
                />
              </div>
            </div>
            <div className="flex-1 mt-4 md:mt-0">
              <label className="block text-sm font-medium mb-1">Date</label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border w-full"
              />
            </div>
          </div>
          <DialogFooter className="mt-4 flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <Button
              onClick={() => setShowMoodDialog(false)}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button onClick={handleAddMood} className="w-full sm:w-auto">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
