import { useState } from "react";
import { Calendar } from "@demark-pro/react-booking-calendar";

import "@demark-pro/react-booking-calendar/dist/react-booking-calendar.css";

export function BookingCalendar() {
    const [selected, setSelected] = useState([null, null]);

    return (
        <Calendar
            selected={selected}
            reserved={[
                {
                    startDate: new Date(2030, 4, 12, 14, 0),
                    endDate: new Date(2030, 4, 14, 10, 0),
                },
            ]}
            onChange={setSelected}
        />
    );
}