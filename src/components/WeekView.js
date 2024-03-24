import './WeekView.css';
import {useState} from "react";
import WeekViewEvent from "./WeekViewEvent";

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
                      calendarData = {id: 1},
                      date = new Date(),
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
            {/*    {getWeekDates().map((day, index) => (*/}
            {/*        <div key={index} className={'day-name'}>*/}
            {/*            {day}*/}
            {/*        </div>*/}
            {/*    ))}*/}
            {/*</div>*/}
            <div
                className="hours-container"
                style={{
                    width: '1200px'
                }}
            >
                {[...Array(48).keys()].map((hour, index) => (
                    <div
                        key={`hour-index-${index}`}
                        className="hour-label"
                        style={{
                            left: '0px',
                            width: '5%',
                            textAlign: 'center',
                            WebkitUserSelect: 'none',
                            MozUserSelect: 'none',
                            msUserSelect: 'none',
                            userSelect: 'none',
                        }}
                    >
                        {`${new Date(0, 0, 0, hour / 2, hour % 2 ? 30 : 0)
                            .toLocaleTimeString(undefined, {hour: "numeric", minute: "numeric"})}`}
                    </div>
                ))}
                <div
                    className={'week-events-container'}
                >
                    {getWeekDates().map((week_day, index) => (
                        <div
                            style={{
                                position: 'absolute',
                                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                border: '1px solid white',
                                width: `${100/7}%`,
                                height: '100%',
                                left: `${100/7 * index}%`,
                                overflowX: 'scroll'
                            }}
                        >
                            {
                                getInfoByDay(week_day)[0].map((week_day_event) => (
                                    <WeekViewEvent
                                        eventData={week_day_event}
                                        currentViewDate={week_day}
                                        countColumns={7}
                                        isResizable={false}
                                    />
                                ))
                            }
                        </div>
                    ))}
                </div>
                <div
                    className={'current-time-line'}
                    style={{
                        display: date.getDate() === new Date().getDate() ? '' : 'none',
                        pointerEvents: 'none',
                    }}
                ></div>
            </div>
        </div>
    );
}

export default WeekView;
