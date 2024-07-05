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
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: selectedDate.toISOString(),
      mood: mood,
      intensity: intensity,
      note: note,
    };
    setMoodEntries([newEntry, ...moodEntries]);
    setNote("");
    setIntensity(5);
  };

  const handleCustomMoodSubmit = () => {
    if (customMood.trim()) {
      handleSelectMood(customMood);
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
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
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
      </header>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <nav
          className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out z-30 w-64 bg-white dark:bg-gray-800 shadow-lg overflow-y-auto
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
        </nav>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4">
          {view === "add" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
              <h2 className="text-xl font-bold mb-4">Add New Mood Entry</h2>
              <MoodSelector onSelectMood={handleSelectMood} />
              <div className="mt-4 space-y-2">
                <Input
                  type="text"
                  value={customMood}
                  onChange={(e) => setCustomMood(e.target.value)}
                  placeholder="Enter custom mood"
                />
                <Button onClick={handleCustomMoodSubmit} className="w-full">
                  Add Custom Mood
                </Button>
              </div>
              <div className="mt-4">
                <label className="block mb-2">
                  Mood Intensity: {intensity}
                </label>
                <Slider
                  value={[intensity]}
                  onValueChange={(value) => setIntensity(value[0])}
                  max={10}
                  step={1}
                />
              </div>
              <div className="mt-4">
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note about your mood (optional)"
                />
              </div>
              <div className="mt-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
                      {format(selectedDate, "PP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
          {view === "list" && (
            <MoodHistory
              moodEntries={moodEntries}
              onEditMood={handleEditMood}
            />
          )}
          {view === "calendar" && <MoodCalendar moodEntries={moodEntries} />}
          {view === "trends" && <MoodTrends moodEntries={moodEntries} />}
          {view !== "add" && <MoodStats moodEntries={moodEntries} />}
        </main>
      </div>
    </div>
  );
}
