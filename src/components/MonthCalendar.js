import './MonthCalendar.css';
import CalendarCell from "./CalendarCell";
import {useState} from "react";
import SelectedDay from "./SelectedDay";

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();

function getDaysInMonth(year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = [];

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        daysArray.push(date);
    }

    return daysArray;
}

function MonthCalendar({calendarData}) {
    const [hidden, setHide] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const weekdays = Array.from({ length: 7 }, (_, index) => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1 + index);
        return currentDate.toLocaleDateString(undefined, { weekday: 'short' });
    });

    function getInfoByDay(targetDate){
        const eventsOnTargetDate = calendarData.fullData.events.filter(event => {
            const eventDate = new Date(event.startAt);
            return eventDate.toDateString() === targetDate.toDateString();
        });

        const holidaysOnTargetDate = calendarData.fullData.holidays.filter(holiday => {
            const holidayDate = new Date(holiday.date);
            return holidayDate.toDateString() === targetDate.toDateString();
        });

        return [eventsOnTargetDate, holidaysOnTargetDate];
    }

    return (
        <div
            className={'month-calendar'}
        >
            <div className={'calendar-info'}>
                <h1
                    onClick={() => setHide(!hidden)}
                >{calendarData.title}</h1>
                {hidden &&
                    <h3>{calendarData.description}</h3>
                }
            </div>
            {hidden &&
                <>
                    <div className={'days-names'}>
                        {weekdays.map((day, index) => (
                            <div key={index} className={'day-name'}>
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className={'days'}>
                        {getDaysInMonth(currentYear, currentMonth)
                            // .filter((date) => date.toLocaleDateString() !== selectedDate.toLocaleDateString())
                            .map((date) => (
                                    <div
                                        key={`calendar-day-${date.toLocaleDateString()}`}
                                    style={
                                        {
                                            gridColumn: date.toLocaleDateString() === selectedDate.toLocaleDateString() ?
                                                 1 : date.getDay() === 0 ? 7 : date.getDay(),
                                            gridColumnEnd: date.toLocaleDateString() === selectedDate.toLocaleDateString() ?
                                                8 : 'auto'
                                        }
                                    }
                                        onClick={() => {setSelectedDate(date)}}
                                    >
                                        {
                                            date.toLocaleDateString() !== selectedDate.toLocaleDateString() &&
                                            <CalendarCell
                                                date={date}
                                                calendarId={calendarData.id}
                                                eventsSize={getInfoByDay(date)}
                                            />
                                        }
                                        {
                                            date.toLocaleDateString() === selectedDate.toLocaleDateString() &&
                                            <SelectedDay
                                                calendarId={calendarData.id}
                                                date={selectedDate}
                                            />
                                        }
                                    </div>
                                )
                            )}

                    </div>
                </>
            }
        </div>
    );
}

export default MonthCalendar;
