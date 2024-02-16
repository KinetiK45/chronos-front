import { useEffect } from "react";

function SelectedDay({ calendarId = 1,
                         date = new Date(),
                         color = '#237cfd'}) {
    useEffect(() => {
        const current_cell = document
            .querySelector('.selected-calendar-day');
        if (current_cell) {
            current_cell.style.backgroundColor = color;
        }
    }, [color]);

    return (
        <div className={'selected-calendar-day'}>
            <div>{`${date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'long' })}`}</div>
        </div>
    );
}

export default SelectedDay;
