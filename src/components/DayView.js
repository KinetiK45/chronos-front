import './DayView.css';
import {useEffect, useState} from "react";
import EventEditor from "./EventEditor";
import DayViewEvent from "./DayViewEvent";
import Requests from "../API/requests";
import {toLocalDateInputField} from "../utils/Utils";

function DayView({ calendarData = {id: 1},
                     initialDate = new Date(),
                     getInfoByDay
                 }) {

    const [currentViewDate, setCurrentViewDate] = useState(initialDate);
    const [events, setEvents] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [eventEditor, setEventEditor] = useState(undefined);
    const isViewer = 'calendar_user' in calendarData && calendarData.calendar_user.role === 'inspector';
    useEffect(() => {
        const data = getInfoByDay(currentViewDate);
        setEvents(fillViewColumns(data[0]));
        setHolidays(data[1]);

    }, [currentViewDate, getInfoByDay]);

    const [eventColumnsSize, setEventColumnsSize] = useState(2);

    // рассчет колонок для ивентов
    function fillViewColumns(events) {
        const columns = [];
        for (let event of events) {
            if (!('id' in event))
                continue;
            let index = undefined;
            const minHMinutes = 33;
            for (let i = 0; i < columns.length; i++) {
                if (columns[i].getHours() > 22 && columns[i].getMinutes() > 30)
                    continue;
                if (columns[i] < event.startAt){
                    if (event.endAt.getTime() - event.startAt.getTime() < minHMinutes * 60 * 1000){
                        columns[i] = new Date(event.startAt.getTime() + minHMinutes * 60 * 1000);
                    }
                    else
                        columns[i] = event.endAt;
                    index = i;
                    break;
                }
            }
            if (index === undefined){
                setEventColumnsSize(Math.min(columns.length + 2, 4));
                index = columns.length;
                if (event.endAt.getTime() - event.startAt.getTime() < minHMinutes * 60 * 1000){
                    columns.push(new Date(event.startAt.getTime() + minHMinutes * 60 * 1000));
                }
                else
                    columns.push(event.endAt);
            }
            event.columnIndex = index;
        }
        // setEventColumnsSize(3);
        return events;
    }

    function refreshEvents(new_events = events) {
        setEvents(
            fillViewColumns(
                [...new_events].sort((a, b) =>
                    a.startAt.getTime() - b.startAt.getTime()
                    || (b.endAt.getTime() - b.startAt.getTime()) - (a.endAt.getTime() - a.startAt.getTime()))
            )
        );
    }

    useEffect(() => {
        const updateLine = () => {
            const timeUpd = new Date();
            const dayView = document.querySelector('.selected-calendar-day');
            const currentTimeLine = document.querySelector('.current-time-line');
            if (dayView && currentTimeLine){
                const top = (timeUpd.getHours() * 60 + timeUpd.getMinutes()) / (23 * 60 + 59) * 100;
                currentTimeLine.style.top = `${top}%`;
            }
            setTimeout(updateLine, 60000);
        }
        updateLine();
    }, []);


    //создание ивентов
    function calculateEventCreate(event) {
        if (isViewer){
            return;
        }
        // Получаем координаты клика относительно верхнего края блока hours-container
        const offsetY = event.clientY - event.currentTarget.getBoundingClientRect().top;
        const offsetX = event.clientX - event.currentTarget.getBoundingClientRect().left;

        const column = Math.floor((offsetX / event.currentTarget.clientWidth) * eventColumnsSize);

        // Рассчитываем процентное расстояние
        const hours = (offsetY / event.currentTarget.clientHeight) * 24;
        let startAt = new Date(currentViewDate);
        startAt.setHours(Math.floor(hours), Math.round(hours % 1 * 6) * 10, 0, 0);
        const endAt = new Date(startAt.getTime() + 1000 * 60 * 30);

        const newEvent = {
            calendar_id: calendarData.id,
            title: 'New Event',
            description: '',
            category: 'task',
            startAt: startAt,
            endAt: endAt,
            color: calendarData?.calendar_user?.custom_color
                ? calendarData.calendar_user.custom_color
                : calendarData.color
        };

        const creationData = {...newEvent};
        creationData.startAt = toLocalDateInputField(creationData.startAt);
        creationData.endAt = toLocalDateInputField(creationData.endAt);

        Requests.createEvent(localStorage.getItem('token'), creationData)
            .then((resp) => {
                if (resp.state !== true){
                    refreshEvents(events.filter((ev) => 'id' in ev));
                    alert(`Creation fail: ${resp.message}`);
                }
                else {
                    newEvent.id = resp.data;
                    refreshEvents([...events.filter((ev) => 'id' in ev), newEvent]);
                }
            });

        newEvent.columnIndex = column;
        refreshEvents([...events, newEvent]);

        setEventEditor({
            eventData: newEvent,
            startAt: startAt,
            endAt: endAt,
            columnIndex: column === eventColumnsSize - 1 ? column - 1 : column + 1,
        });
    }


    const [editorEnabled, setEditorEnabled] = useState(false);

    function onEditorCalled(editorData) {
        setEditorEnabled(!editorEnabled);
        setEventEditor(editorData);
    }

    return (
        <div
            className={'selected-calendar-day'}
        >
            <div className={'month-header'}>
                <button
                    onClick={() => {
                        setCurrentViewDate(new Date(currentViewDate.getTime() - 24 * 60 * 60 * 1000));
                    }
                    }
                >prev</button>
                <h1>{`${currentViewDate.toLocaleDateString(undefined,
                    { weekday: 'short', day: 'numeric', month: 'long' })}`}</h1>
                <button onClick={() => {
                    setCurrentViewDate(new Date(currentViewDate.getTime() + 24 * 60 * 60 * 1000));
                }
                }>next</button>
            </div>
            {holidays.length > 0 &&
                <div className={'holidays'}>
                    <h3>Holidays:</h3>
                    {holidays.map((el) =>(
                        <div key={el.localName}>
                            {el.localName}
                        </div>
                    ))}
                </div>
            }

            <div
                className="hours-container"
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
                        {`${new Date(currentViewDate.getFullYear(), currentViewDate.getMonth(), currentViewDate.getDate(), hour / 2, hour % 2 ? 30 : 0)
                            .toLocaleTimeString(undefined, {hour: "numeric", minute: "numeric"})}`}
                    </div>
                ))}
                <div
                    className={'events-container'}
                    onDoubleClick={calculateEventCreate}
                    style={{
                        cursor: isViewer ? 'default' : 'copy',
                    }}
                >
                    { events &&
                        events.map((day_event) => (
                            <DayViewEvent
                                key={`event-${day_event.id}-full`}
                                eventData={day_event}
                                currentViewDate={currentViewDate}
                                countColumns={eventColumnsSize}
                                onEditorCalled={onEditorCalled}
                                onTimeChange={refreshEvents}
                                isResizable={!isViewer}
                            />
                        ))
                    }

                    {
                        !isViewer && editorEnabled && eventEditor &&
                        <EventEditor
                            eventEditor={eventEditor}
                            countColumns={eventColumnsSize}
                            onEdited={(dataUpdated) => {
                                setEvents(prevEvents => {
                                    return prevEvents.map(event => {
                                        if (event.id === dataUpdated.id) {
                                            return dataUpdated;
                                        }
                                        return event;
                                    });
                                });
                            }}
                            onDelete={(event_id) => {
                                Requests.deleteEvent(localStorage.getItem('token'), event_id).then((resp) => {
                                    if (resp.state === true){
                                        refreshEvents(events.filter((ev) => ev.id !== event_id));
                                        setEditorEnabled(false);
                                    }
                                    else {
                                        alert(`Error deleting event: ${resp.message}`);
                                    }
                                })
                            }}
                        />
                    }
                </div>
                <div
                    className={'current-time-line'}
                    style={{
                        display: currentViewDate.getDate() === new Date().getDate() ? '' : 'none',
                        pointerEvents: 'none',
                    }}
                ></div>
            </div>
        </div>
    );
}

export default DayView;
