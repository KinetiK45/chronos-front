import './CalendarCell.css';
import { useEffect } from "react";

function CalendarCell({
                          calendarId = 1,
                          date = new Date(),
                          color = '#237cfd',
                          eventsSize = 0
                      }) {

    useEffect(() => {
        const current_cell = document
            .querySelector(`.calendar-${calendarId}-cell-${date.getDate()}`);
        if (current_cell) {
            current_cell.style.backgroundColor = color;
            if (date.toLocaleDateString() === new Date().toLocaleDateString()) {
                current_cell.classList.add('current-day');
            }
        }
    }, [calendarId, color, date]);

    const classNames = [
        'calendar-cell',
        `calendar-${calendarId}-cell-${date.getDate()}`
    ];

    return (
        <div
            className={classNames.join(' ')}
        >
            <div className={'date-of-month'}>{date.getDate()}</div>
            {
                eventsSize && eventsSize.length === 2 &&
                <>
                    {
                        eventsSize[0].length !== 0 &&
                        <div className={'events-size'}>{`${eventsSize[0].length}`}</div>
                    }
                    {
                        eventsSize[1].length !== 0 &&
                        <div className={'holidays-size'}>{`${eventsSize[1].length}`}</div>
                    }
                </>

            }
        </div>
    );
}

export default CalendarCell;
