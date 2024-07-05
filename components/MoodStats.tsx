import React from "react";
import { MoodEntry } from "@/app/page";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface MoodStatsProps {
  moodEntries: MoodEntry[];
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

const MoodStats: React.FC<MoodStatsProps> = ({ moodEntries }) => {
  const moodCounts = moodEntries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(moodCounts).map(([mood, count]) => ({
    name: mood,
    value: count,
  }));

  const totalEntries = moodEntries.length;
  const averageIntensity =
    moodEntries.reduce((sum, entry) => sum + entry.intensity, 0) / totalEntries;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">Mood Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p>Total entries: {totalEntries}</p>
          <p>Average intensity: {averageIntensity.toFixed(2)}/10</p>
          <ul className="mt-2">
            {data.map(({ name, value }) => (
              <li key={name}>
                {name}: {value} ({((value / totalEntries) * 100).toFixed(1)}%)
              </li>
            ))}
          </ul>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MoodStats;
