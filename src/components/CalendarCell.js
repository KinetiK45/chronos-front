import './CalendarCell.css';
import {useEffect, useState} from "react";

function CalendarCell({calendarId= 1, date= new Date(), color = '#0068ff'}) {
    useEffect(()=>{
        const current_cell = document.querySelector(`.calendar-${calendarId}-cell-${date.getDate()}`);
        current_cell.style.backgroundColor = color;
        if (date.toLocaleDateString() === new Date().toLocaleDateString()){
            current_cell.classList.add('current-day');
        }

    }, [calendarId, color, date]);

    let classNames = [
        'calendar-cell',
        `calendar-${calendarId}-cell-${date.getDate()}`
    ]

    const [isSelected, select] = useState(false);

    return (
        <div className={classNames.join(' ')}>
            <div className={'date-of-month'}>{date.getDate()}</div>
        </div>
    );
}

export default CalendarCell;
