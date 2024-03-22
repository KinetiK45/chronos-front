import './CalendarCell.css';
import {useEffect} from "react";

function CalendarCell({
                          calendarId = 1,
                          date = new Date(),
                          events = [],
                          holidays = []
                      }) {

    useEffect(() => {
        const current_cell = document
            .querySelector(`.calendar-${calendarId}-cell-${date.getDate()}`);
        if (current_cell) {
            if (date.toLocaleDateString() === new Date().toLocaleDateString()) {
                current_cell.classList.add('current-day');
            }
        }
    }, [calendarId, date]);
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
                events.length !== 0 &&
                <div className={'events-size'}>{`${events.length}`}</div>
            }
            {
                holidays.length !== 0 &&
                <div className={'holidays-size'}>{`${holidays.length}`}</div>
            }
        </div>
    );
}

export default CalendarCell;
