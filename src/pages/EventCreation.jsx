import Requests from "../API/requests";
import Navigation from "../components/Navigation";
import {useParams} from "react-router-dom";
import {useState} from "react";
import {toLocalDateInputField} from "../utils/Utils";

function getStartEndDateLocal(date) {
    let start = new Date(date);
    start.setHours(0 - start.getTimezoneOffset() / 60, 0, 0, 0);
    let end = new Date(date);
    end.setHours(23 - start.getTimezoneOffset() / 60, 59, 59, 999);
    return [start, end];
}

function EventCreation() {
    const {calendarId} = useParams();

    // eslint-disable-next-line no-restricted-globals
    const searchParams = new URLSearchParams(location.search);

    const [startAt, setStartAt] = useState(searchParams.has('startAt') ? new Date(searchParams.get('startAt')) : new Date());
    const [endAt, setEndAt] = useState(searchParams.has('endAt') ? new Date(searchParams.get('endAt')) : new Date());
    const [allDay, setAllDay] = useState(false);


    // useEffect(() => {
    //     if (allDay === true){
    //         let date = new Date(searchParams.get('startAt'));
    //         date.setHours(0, 0, 0, 0);
    //         setStartAt(date);
    //         date.setHours(23, 59, 59, 999);
    //         setEndAt(date);
    //     }
    // }, [allDay, searchParams]);

    function submitFrom() {
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const notification = document.getElementById('notification').checked;
        const category = document.getElementById('categorySelector').value;

        if (!title) {
            alert('Пожалуйста, заполните название');
            return;
        }

        if (!allDay && startAt.getTime() >= endAt.getTime()) {
            alert(`Выберите корректные дату и время.`);
            return;
        }
        const data = {
            calendar_id: calendarId,
            title: title,
            description: description,
            notification: notification,
            allDay: allDay,
            startAt: allDay ? getStartEndDateLocal(startAt)[0].toISOString().slice(0, -8) : document.getElementById('startAt').value,
            endAt: allDay ? getStartEndDateLocal(startAt)[1].toISOString().slice(0, -8) : document.getElementById('endAt').value,
            category: category
        }
        // alert(JSON.stringify(data));
        Requests.createEvent(localStorage.getItem('token'), data).then((resp) => {
            if (resp.state === true){
                window.location = `/calendars/${calendarId}?view=day&date=${data.startAt}`;
            }
        });
    }

    return <div className="main">
        <Navigation/>
        <div className={'main-content'}>
            <div className={'center-block'}>
                <div id={'event-creation'}>
                    <br/>
                    <input
                        id={'title'}
                        type={'text'}
                        placeholder={'Title'}
                    />
                    <br/>
                    <input
                        id={'description'}
                        type={'text'}
                        placeholder={'Description'}
                    />
                    <br/>
                    <label htmlFor="notification">Notification:</label>
                    <input
                        type="checkbox"
                        id="notification"
                        name="notification"
                    />
                    <br/>
                    {
                        allDay === true &&
                        <label htmlFor="allDay">{`Целый день ${startAt.toLocaleDateString()}: `}</label>
                    }
                    {
                        allDay === false &&
                        <label htmlFor="allDay">All day: </label>
                    }
                    <input
                        type="checkbox"
                        id="allDay"
                        name="allDay"
                        onChange={() => {
                            setAllDay(!allDay)
                        }}
                    />
                    <br/>
                    {allDay === false &&
                        <>
                            <label htmlFor={'startAt'}>Start at:</label>
                            <input
                                id={'startAt'}
                                name={'startAt'}
                                type={'datetime-local'}
                                defaultValue={toLocalDateInputField(startAt)}
                                onChange={() => setStartAt(new Date(document.getElementById('startAt').value))}
                            />
                            <br/>
                            <label htmlFor={'endAt'}>End at:</label>
                            <input
                                id={'endAt'}
                                name={'endAt'}
                                type={'datetime-local'}
                                defaultValue={toLocalDateInputField(endAt)}
                                onChange={() => setEndAt(new Date(document.getElementById('endAt').value))}
                            />
                            <br/>
                        </>
                    }
                    <label htmlFor={'categorySelector'}>Category:</label>
                    <select id="categorySelector">
                        <option value="arrangement">Arrangement</option>
                        <option value="reminder">Reminder</option>
                        <option value="task">Task</option>
                    </select>
                    <button onClick={submitFrom}>Submit</button>
                </div>
            </div>
        </div>
    </div>
}

export default EventCreation;
