import Navigation from "../components/Navigation";
// import CalendarCell from "../components/CalendarCell";
// import MonthCalendar from "../components/MonthCalendar";
import {useEffect, useState} from "react";
import Requests from "../API/requests";
import MonthCalendar from "../components/MonthCalendar";

function Calendar() {
    const [calendars, setCalendars] = useState([]);

    useEffect(async () => {
        const resp = await Requests.allCalendars(
            localStorage.getItem('token')
        );
        setCalendars(resp.data);
        const events_resp = await Requests.allEvents(
            localStorage.getItem('token'),
            'US',
            resp.data[0].id
        );
        console.log(events_resp.data);
    }, [])

    return (
        <div className="main">
            <Navigation/>
            <div className={'main-content'}>
                <div className={'center-block'}>
                    {/*<div>{JSON.stringify(calendars)}</div>*/}
                    {calendars &&
                        calendars.map((calendarData) => (
                            <MonthCalendar key={`calendar-${calendarData.id}`} calendarData={calendarData}/>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default Calendar;
