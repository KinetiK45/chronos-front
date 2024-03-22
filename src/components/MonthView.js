import './MonthView.css';
import CalendarCell from "./CalendarCell";
import {useState} from "react";

function getDaysInMonth(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = [];

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        daysArray.push(date);
    }

    return daysArray;
}

function getMonthTitle(day){
    let month = day.toLocaleDateString(undefined, { month: 'long' });
    month = month.charAt(0).toUpperCase() + month.slice(1);
    return `${month} ${day.getFullYear()}`;
}

function MonthView({
                       calendarId,
                       getInfoByDay,
                       selectedDate = new Date(),
                       onDaySelect = function (day, viewMode){}
}) {
    const weekdays = Array.from({ length: 7 }, (_, index) => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1 + index);
        return currentDate.toLocaleDateString(undefined, { weekday: 'short' });
    });

    const [monthDayView, setMonthDayView] = useState(selectedDate);

    return (
        <div
            className={'month-calendar'}
        >
            <div className={'month-header'}>
                <button
                    onClick={() => {
                        let newDate = new Date(monthDayView);
                        newDate.setMonth(monthDayView.getMonth() - 1);
                        setMonthDayView(newDate);
                    }
                }
                >prev</button>
                <h3>{getMonthTitle(monthDayView)}</h3>
                <button onClick={() => {
                    let newDate = new Date(monthDayView);
                    newDate.setMonth(monthDayView.getMonth() + 1);
                    setMonthDayView(newDate);
                    }
                }>next</button>
            </div>

            <div className={'days-names'}>
                {weekdays.map((day, index) => (
                    <div key={index} className={'day-name'}>
                        {day}
                    </div>
                ))}
            </div>
            <div className={'days'}>
                {monthDayView && getDaysInMonth(monthDayView)
                    .map((date) => (
                            <div
                                onClick={() => onDaySelect(date, 'day')}
                                key={`calendar-day-${date.toLocaleDateString()}`}
                                style={
                                    {
                                        gridColumn: date.getDay() === 0 ? 7 : date.getDay(),
                                        gridColumnEnd: 'auto',
                                    }
                                }
                            >
                                {
                                    <CalendarCell
                                        date={date}
                                        calendarId={calendarId}
                                        events={getInfoByDay(date)[0]}
                                        holidays={getInfoByDay(date)[1]}
                                    />
                                }
                            </div>
                        )
                    )}

            </div>
        </div>
    );
}

export default MonthView;
