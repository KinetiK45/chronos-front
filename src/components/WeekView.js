import DayOfWeek from "./DayOfWeek";
import './MonthView.css';
import {useState} from "react";
import DayView from "./DayView";

function getWeekTitle(startWeek = new Date(), endWeek = new Date()) {
    let month, year;
    let startMonth = startWeek.toLocaleDateString(undefined, { month: 'long' });
    startMonth = startMonth.charAt(0).toUpperCase() + startMonth.slice(1);
    let endMonth = endWeek.toLocaleDateString(undefined, { month: 'long' });

    if (startWeek.getMonth() === endWeek.getMonth())
        month = startMonth;
    else
        month = `${startMonth}-${endMonth}`;


    if (startWeek.getFullYear() === endWeek.getFullYear())
        year = startWeek.getFullYear();
    else
        year = `${startWeek.getFullYear()}-${endWeek.getFullYear()}`
    return `${month} ${year}`;

}

function WeekView({
                      calendarId = 1,
                      date = new Date(),
                      color = '#237cfd',
                      getInfoByDay
                 }) {
    const [weekDayView, setWeekDayView] = useState(date);
    function getWeekDates() {
        const result = [];
        const currentDay = weekDayView.getDay();
        const startDate = new Date(weekDayView);

        // Вычисляем начало текущей недели (понедельник)
        startDate.setDate(startDate.getDate() - currentDay + (currentDay === 0 ? -6 : 1));

        // Генерируем массив с датами текущей недели
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            result.push(currentDate);
        }

        return result;
    }

    return (
        <div className={'month-calendar'}>
            <div className={'month-header'}>
                <button
                    onClick={() => {
                        setWeekDayView(new Date(new Date(weekDayView.getTime() - 7 * 24 * 60 * 60 * 1000)));
                    }
                    }
                >prev</button>
                <h3>{getWeekTitle(getWeekDates()[0], getWeekDates()[6])}</h3>
                <button onClick={() => {
                    setWeekDayView(new Date(new Date(weekDayView.getTime() + 7 * 24 * 60 * 60 * 1000)));
                }
                }>next</button>
            </div>
            {/*<div className={'days-names'}>*/}
            {/*    {weekdays.map((day, index) => (*/}
            {/*        <div key={index} className={'day-name'}>*/}
            {/*            {day}*/}
            {/*        </div>*/}
            {/*    ))}*/}
            {/*</div>*/}
            <div className={'days'}>
                {weekDayView && getWeekDates().map((date) => (
                    <DayOfWeek
                        calendarId={calendarId}
                        date={date}
                        getInfoByDay={getInfoByDay}
                    />
                    )
                )}
            </div>
        </div>
    );
}

export default WeekView;
