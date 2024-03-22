import './EventEditor.css'
import {useEffect, useRef, useState} from "react";
import Requests from "../API/requests";
import {toLocalDateInputField} from "../utils/Utils";
function EventEditor({eventEditor, countColumns, onEdited, onDelete}) {

    const elementRef = useRef(null);
    const [category, setCategory] = useState(eventEditor.eventData.category);
    function onEdit() {
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const notification = document.getElementById('notification')
            ? document.getElementById('notification').checked : true;
        const category = document.getElementById('categorySelector').value;

        if (!title) {
            alert('Пожалуйста, заполните название');
            return;
        }

        const data = {...eventEditor.eventData};
        data.title = title;
        data.description = description;
        data.notification = notification;
        data.category = category;

        onEdited(data);

        const requestData = {...data}

        requestData.startAt = toLocalDateInputField(requestData.startAt);
        requestData.endAt = toLocalDateInputField(requestData.endAt);

        Requests.editEvent(localStorage.getItem('token'), requestData).then((resp) => {
            if (resp.state !== true)
                alert(JSON.stringify(resp));
        });
    }

    function deleteEvent(){
        onDelete(eventEditor.eventData.id);
    }


    useEffect(() => {
        const height = elementRef.current.clientHeight;
        const parentHeight = document.querySelector('.hours-container').offsetHeight;
        const topOffset = (eventEditor.eventData.startAt.getHours() * 60
            + eventEditor.eventData.startAt.getMinutes()) / (24 * 60);
        elementRef.current.style.maxWidth = elementRef.current.clientWidth;
        if (parentHeight * topOffset + height > parentHeight){
            elementRef.current.style.bottom = 0;
            elementRef.current.style.top = '';
        }
        else {
            elementRef.current.style.top = `${topOffset * 100}%`;
            elementRef.current.style.bottom = '';
        }
        elementRef.current.style.visibility = '';
    }, [eventEditor.eventData.startAt]);

    return <div
        className={'event-editor'}
        ref={elementRef}
        onDoubleClick={(event) => {event.stopPropagation();}}
        style={{
            width: `${100 / countColumns}%`,
            left: `${eventEditor.columnIndex * 100 / countColumns}%`,
            cursor: 'default',
            position: 'absolute',
            backgroundColor: 'gray',
            padding: "0 5px 0 5px",
            borderRadius: '5px',
            visibility: 'hidden',
        }}
    >
        {/*<div>{JSON.stringify(eventEditor)}</div>*/}
        <input
            id={'title'}
            type={'text'}
            placeholder={'Title'}
            defaultValue={eventEditor.eventData.title}
        />
        <textarea
            id="description"
            placeholder="Description"
            defaultValue={eventEditor.eventData.description}
            maxLength={255}
        />
        {category !== 'reminder' &&
            <>
                <label htmlFor="notification">Notification</label>
                <input
                    type="checkbox"
                    id="notification"
                    name="notification"
                />
            </>
        }
        <label htmlFor={'categorySelector'}>Type:</label>
        <select
            id="categorySelector"
            defaultValue={eventEditor.eventData.category || 'arrangement'}
            onChange={() => setCategory(document.getElementById('categorySelector').value)}
        >
            <option value="arrangement">Arrangement</option>
            <option value="reminder">Reminder</option>
            <option value="task">Task</option>
        </select>
        <div style={{
            display: "inline-flex",
        }}>
            <button onClick={onEdit}>Save</button>
            <button onClick={deleteEvent}>Delete</button>
        </div>
    </div>

}

export default EventEditor;
