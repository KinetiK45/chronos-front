import {useEffect, useState} from "react";
import MonthView from "./MonthView";
import DayView from "./DayView";
import WeekView from "./WeekView";
import {getStartEndMonthByDate} from "../utils/Utils";
import Requests from "../API/requests";
// import Requests from "../API/requests";

function CalendarView({
                          calendarData,
                      }) {
    const [viewMode, setViewMode] = useState('month');
    const [selectedDay, setSelectedDay] = useState(new Date());
    const [holidays, setHolidays] = useState([]);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);

        if (searchParams.has('date')){
            let temp = new Date(searchParams.get('date'));
            if (temp.toString() !== 'Invalid Date'){
                temp.setHours(0,0,0,0);
                setSelectedDay(temp);
            }
        }

        if (searchParams.has('view') && ['month', 'week', 'day'].includes(searchParams.get('view'))){
            setViewMode(searchParams.get('view'));
        }
    }, []);

    //заполнение holidays
    useEffect(() => {
        // const fetchData = async () => {
        //     const resp = Requests.getNationalHolidays(2024, 'UA');
        //     console.log(JSON.stringify(resp));
        // }
        //
        // fetchData();

        const holidaysTemp =
            [
            {
            "date": "2024-01-01",
            "localName": "Новий Рік",
            "name": "New Year's Day",
            "countryCode": "UA",
            "fixed": true,
            "global": true,
            "counties": null,
            "launchYear": null,
            "type": "Public"
        }, {
            "date": "2024-01-07",
            "localName": "Різдво",
            "name": "(Julian) Christmas",
            "countryCode": "UA",
            "fixed": true,
            "global": true,
            "counties": null,
            "launchYear": null,
            "type": "Public"
        }, {
            "date": "2024-03-08",
            "localName": "Міжнародний жіночий день",
            "name": "International Women's Day",
            "countryCode": "UA",
            "fixed": true,
            "global": true,
            "counties": null,
            "launchYear": null,
            "type": "Public"
        }, {
            "date": "2024-05-01",
            "localName": "День праці",
            "name": "International Workers' Day",
            "countryCode": "UA",
            "fixed": true,
            "global": true,
            "counties": null,
            "launchYear": null,
            "type": "Public"
        }, {
            "date": "2024-05-05",
            "localName": "Великдень",
            "name": "Easter Sunday",
            "countryCode": "UA",
            "fixed": false,
            "global": true,
            "counties": null,
            "launchYear": null,
            "type": "Public"
        }, {
            "date": "2024-05-09",
            "localName": "День перемоги над нацизмом у Другій світовій війні",
            "name": "Victory day over Nazism in World War II",
            "countryCode": "UA",
            "fixed": true,
            "global": true,
            "counties": null,
            "launchYear": null,
            "type": "Public"
        }, {
            "date": "2024-06-23",
            "localName": "Трійця",
            "name": "Pentecost",
            "countryCode": "UA",
            "fixed": false,
            "global": true,
            "counties": null,
            "launchYear": null,
            "type": "Public"
        }, {
            "date": "2024-06-28",
            "localName": "День Конституції",
            "name": "Constitution Day",
            "countryCode": "UA",
            "fixed": true,
            "global": true,
            "counties": null,
            "launchYear": null,
            "type": "Public"
        }, {
            "date": "2024-08-24",
            "localName": "День Незалежності",
            "name": "Independence Day",
            "countryCode": "UA",
            "fixed": true,
            "global": true,
            "counties": null,
            "launchYear": null,
            "type": "Public"
        }, {
            "date": "2024-10-14",
            "localName": "День захисника України",
            "name": "Defender of Ukraine Day",
            "countryCode": "UA",
            "fixed": true,
            "global": true,
            "counties": null,
            "launchYear": null,
            "type": "Public"
        }, {
            "date": "2024-12-25",
            "localName": "Різдво",
            "name": "(Gregorian and Revised Julian) Christmas",
            "countryCode": "UA",
            "fixed": true,
            "global": true,
            "counties": null,
            "launchYear": null,
            "type": "Public"
        }];
        holidaysTemp.forEach((element) => {
            element.date = new Date(element.date);
        });
        setHolidays(holidaysTemp);

    }, []);

    //заполнение цвета и дат после запроса
    function fillEventsFullData(events, calendarData) {
        events.forEach((event) => {
            event.startAt = new Date(event.startAt);
            event.endAt = new Date(event.endAt);
            if (!('color' in event) && 'color' in calendarData) {
                event.color = calendarData.color;
            }
        });
        return events;
    }

    //заполнение events
    useEffect(() => {
        const fetchData = async () => {
            const startEndCurrentMonth = getStartEndMonthByDate();
            const events_resp = await Requests.allEvents(
                localStorage.getItem('token'),
                calendarData.id,
                startEndCurrentMonth[0],
                startEndCurrentMonth[1]
            );
            if (events_resp.data.events) {
                setEvents(fillEventsFullData(events_resp.data.events, calendarData));
            }
        };
        if (calendarData !== null)
            fetchData();
    }, [calendarData]);

    const handleSelectChange = (event) => {
        setViewMode(event.target.value);
    };

    function selectViewMode(day, viewMode = 'day'){
        if (day !== selectedDay){
            setSelectedDay(day);
        }
        setViewMode(viewMode);
    }


    const [eventsPeriod, setEventsPeriod] = useState(getStartEndMonthByDate());

    function getInfoByDay(targetDate = new Date()) {
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999); // Устанавливаем конец дня (23:59:59.999)
        if (targetDate.getTime() < eventsPeriod[0].getTime()
            || targetDate.getTime() > eventsPeriod[1].getTime()) {
            const targetMonthDates = getStartEndMonthByDate(targetDate);
            Requests.allEvents(
                localStorage.getItem('token'),
                calendarData.id,
                targetMonthDates[0],
                targetMonthDates[1]
            ).then((resp) => {
                if (resp.data.events){
                    resp.data.events.forEach((element) => {
                        element.startAt = new Date(element.startAt);
                        element.endAt = new Date(element.endAt);
                        if (events.findIndex(event => event.id === element.id) === -1) {
                            events.push(element);
                        }
                    });
                }
                setEventsPeriod([
                    new Date(Math.min(eventsPeriod[0].getTime(), targetMonthDates[0].getTime())),
                    new Date(Math.max(eventsPeriod[1].getTime(), targetMonthDates[1].getTime()))
                ])
            })
        }

        const eventsOnTargetDate = events.filter(
            event => event.startAt <= endOfDay && event.endAt >= targetDate
        );

        const holidaysOnTargetDate = holidays.filter(
            holiday => holiday.date.toDateString() === targetDate.toDateString()
        );

        return [eventsOnTargetDate
            .sort((a, b) => a.startAt.getTime() - b.startAt.getTime()
                || (b.endAt.getTime() - b.startAt.getTime()) - (a.endAt.getTime() - a.startAt.getTime())),
            holidaysOnTargetDate];

    }

    return (
        <div
            className={'calendar-view'}
        >
            <div className={'calendar-info'}>
                <h1>{calendarData.title}</h1>
                <h3>{calendarData.description}</h3>
            </div>
            <div>
                <label htmlFor="timeInterval">View mode: </label>
                <select
                    id="timeInterval"
                    value={viewMode}
                    onChange={handleSelectChange}>
                    <option value="month">Month</option>
                    <option value="week">Week</option>
                    <option value="day">Day</option>
                </select>
            </div>
            <a href={`/calendars/${calendarData.id}/createEvent?startAt=${selectedDay.toISOString()}&endAt=${selectedDay.toISOString()}`}>Create Event</a>
            {viewMode === 'month' &&
                <MonthView
                    calendarData={calendarData}
                    getInfoByDay={getInfoByDay}
                    onDaySelect={selectViewMode}
                    selectedDate={selectedDay}
                />
            }
            {
                viewMode === 'day' &&
                <DayView
                    calendarData={calendarData}
                    initialDate={selectedDay}
                    getInfoByDay={getInfoByDay}
                />
            }
            {
                viewMode === 'week' &&
                <WeekView
                    calendarData={calendarData}
                    date={selectedDay}
                    getInfoByDay={getInfoByDay}
                />
            }
        </div>
    );
}

export default CalendarView;
