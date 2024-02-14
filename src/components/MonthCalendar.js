import './MonthCalendar.css';
import CalendarCell from "./CalendarCell";

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();
const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
let days = [];

for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
}

function MonthCalendar({calendarData}) {

    return (
        <div className={'month-calendar'}>
            <div className={'calendar-info'}>
                <h1>{calendarData.title}</h1>
                <h3>{calendarData.description}</h3>
            </div>
            <div className={'days'}>
                {days.map((day) => (
                    <CalendarCell date={new Date(currentYear, currentMonth, day)} calendarId={calendarData.id}/>
                    )
                )}
            </div>
        </div>
    );
}

export default MonthCalendar;
