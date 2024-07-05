import React, { useState } from "react";
import { format } from "date-fns";
import { MoodEntry } from "@/app/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Edit, Save, X } from "lucide-react";

interface MoodHistoryProps {
  moodEntries: MoodEntry[];
  onEditMood: (editedEntry: MoodEntry) => void;
}

const MoodHistory: React.FC<MoodHistoryProps> = ({
  moodEntries,
  onEditMood,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedMood, setEditedMood] = useState("");
  const [editedIntensity, setEditedIntensity] = useState(5);
  const [editedNote, setEditedNote] = useState("");

  const handleEdit = (entry: MoodEntry) => {
    setEditingId(entry.id);
    setEditedMood(entry.mood);
    setEditedIntensity(entry.intensity);
    setEditedNote(entry.note);
  };

  const handleSave = (id: string) => {
    onEditMood({
      id,
      date: moodEntries.find((entry) => entry.id === id)!.date,
      mood: editedMood,
      intensity: editedIntensity,
      note: editedNote,
    });
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Mood History</h2>
      <ul className="space-y-4">
        {moodEntries.map((entry) => (
          <li
            key={entry.id}
            className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow"
          >
            {editingId === entry.id ? (
              <div className="space-y-2">
                <Input
                  value={editedMood}
                  onChange={(e) => setEditedMood(e.target.value)}
                  className="mb-2"
                />
                <div>
                  <label className="block mb-1">
                    Intensity: {editedIntensity}
                  </label>
                  <Slider
                    value={[editedIntensity]}
                    onValueChange={(value) => setEditedIntensity(value[0])}
                    max={10}
                    step={1}
                  />
                </div>
                <Textarea
                  value={editedNote}
                  onChange={(e) => setEditedNote(e.target.value)}
                  className="mb-2"
                />
                <div className="flex justify-end space-x-2">
                  <Button onClick={() => handleSave(entry.id)} size="sm">
                    <Save className="mr-2 h-4 w-4" /> Save
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center">
                  <span className="font-bold">
                    {format(new Date(entry.date), "PPP")}
                  </span>
                  <Button
                    onClick={() => handleEdit(entry)}
                    size="sm"
                    variant="ghost"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2">Mood: {entry.mood}</div>
                <div>Intensity: {entry.intensity}/10</div>
                {entry.note && (
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {entry.note}
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MoodHistory;
