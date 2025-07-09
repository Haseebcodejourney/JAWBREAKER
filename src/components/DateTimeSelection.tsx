
import React from 'react';
import { Input } from '@/components/ui/input';

interface DateTimeSelectionProps {
  selectedDate: string;
  selectedTime: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}

const DateTimeSelection: React.FC<DateTimeSelectionProps> = ({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange
}) => {
  const availableTimes = [
    '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Date
        </label>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Available Times
        </label>
        <div className="grid grid-cols-3 gap-2">
          {availableTimes.map((time) => (
            <button
              key={time}
              onClick={() => onTimeChange(time)}
              className={`p-3 text-sm rounded-lg border ${
                selectedTime === time
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-gray-300 hover:border-gray-400'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DateTimeSelection;
