import Navigation from "../components/Navigation";
import {useEffect, useState} from "react";
import Requests from "../API/requests";
import MonthCalendar from "../components/MonthCalendar";

function Calendars() {
    const [calendars, setCalendars] = useState();
    // const [events, setEvents] = useState([]);

    useEffect( () => {
        const fetchData = async () => {
            const resp = await Requests.allCalendars(
                localStorage.getItem('token')
            );
            const events_resp = await Requests.allEvents(
                localStorage.getItem('token'),
                'US',
                resp.data[0].id
            );
            resp.data[0].fullData = events_resp.data;
            setCalendars(resp.data);
            console.log(JSON.stringify(events_resp.data));
        }
        fetchData();
    }, [])

    return (
        <div className="main">
            <Navigation/>
            <div className={'main-content'}>
                <div className={'center-block'}>
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

export default Calendars;
