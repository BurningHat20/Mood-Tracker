import React from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
} from "date-fns";
import { MoodEntry } from "@/app/page";
import { cn } from "@/lib/utils";

interface MoodCalendarProps {
  moodEntries: MoodEntry[];
}

const MoodCalendar: React.FC<MoodCalendarProps> = ({ moodEntries }) => {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getMoodForDay = (day: Date) => {
    return moodEntries.find((entry) => isSameDay(new Date(entry.date), day));
  };

  const getMoodColor = (intensity: number) => {
    const hue = 120 - intensity * 12; // 120 (green) to 0 (red)
    return `hsl(${hue}, 70%, 50%)`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Mood Calendar</h2>
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-bold p-2">
            {day}
          </div>
        ))}
        {days.map((day) => {
          const moodEntry = getMoodForDay(day);
          return (
            <div
              key={day.toString()}
              className={cn(
                "border p-2 h-24 relative rounded-lg",
                isToday(day) && "border-blue-500 border-2",
                !moodEntry && "bg-gray-100 dark:bg-gray-700"
              )}
              style={
                moodEntry
                  ? { backgroundColor: getMoodColor(moodEntry.intensity) }
                  : {}
              }
            >
              <div
                className={cn(
                  "absolute top-1 left-1",
                  isToday(day) && "font-bold"
                )}
              >
                {format(day, "d")}
              </div>
              {moodEntry && (
                <div className="flex flex-col justify-center items-center h-full">
                  <div className="text-xl">{moodEntry.mood.split(" ")[0]}</div>
                  <div className="text-xs">{moodEntry.mood.split(" ")[1]}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MoodCalendar;
