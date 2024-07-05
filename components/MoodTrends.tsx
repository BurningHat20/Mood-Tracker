import React from "react";
import { MoodEntry } from "@/app/page";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subDays } from "date-fns";

interface MoodTrendsProps {
  moodEntries: MoodEntry[];
}

const MoodTrends: React.FC<MoodTrendsProps> = ({ moodEntries }) => {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), i);
    const entry = moodEntries.find(
      (e) =>
        format(new Date(e.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
    return {
      date: format(date, "MMM dd"),
      intensity: entry ? entry.intensity : null,
    };
  }).reverse();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Mood Trends</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={last30Days}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="intensity"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        This chart shows your mood intensity over the last 30 days. Higher
        values indicate more positive moods.
      </p>
    </div>
  );
};

export default MoodTrends;
