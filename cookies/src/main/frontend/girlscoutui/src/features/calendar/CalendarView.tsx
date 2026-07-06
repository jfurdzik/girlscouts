import { useState } from "react";
import { Calendar } from "@demark-pro/react-booking-calendar";

import "@demark-pro/react-booking-calendar/dist/react-booking-calendar.css";

export function CalendarView() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);


    const mockAvailability = {
        "2026-07-10": ["09:00", "09:30", "10:00"],
        "2026-07-11": ["13:00", "13:30", "14:00"],
    };

    const dateString = selectedDate ? selectedDate.toISOString().split("T")[0] : "";
    const slots = selectedDate == null ? [] : mockAvailability[dateString] ?? [];

    return (
        <>
        <Calendar
            selected={selectedDate}
            reserved={[
                {
                    startDate: new Date(2030, 4, 12, 14, 0),
                    endDate: new Date(2030, 4, 14, 10, 0),
                },
            ]}
            onChange={setSelectedDate}
        />

        {selectedDate &&
            slots.map(slot => (
                <button key={slot} onClick={() => setSelectedTime(slot)}>
                    { slot }
                </button>))
        }


        {
        selectedTime && (
            <div>
                Date: {dateString}
                Time: {selectedTime}
            </div>)
        }
        </>

    );
}