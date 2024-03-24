import {useState} from "react";

function datePeriodStr(targetDate, currentViewDate) {
    let time = targetDate.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' });
    if (targetDate.getDate() === currentViewDate.getDate())
        return time;
    return `${targetDate.toLocaleDateString(undefined, {day: 'numeric', month: 'long'})} ${time}`;
}

function DayViewEventDataDisplay({eventData, currentViewDate, onEditButtonPressed}) {

    const [mouseOnData, setMouseOnData] = useState(false);

    return <div
        style={{
            padding: '5px',
        }}
        onMouseEnter={(event) => setMouseOnData(true)}
        onMouseLeave={(event) => setMouseOnData(false)}
    >
        {/*<div style={{*/}
        {/*    whiteSpace: 'pre-wrap',*/}
        {/*    overflowWrap: 'break-word',*/}
        {/*    wordWrap: 'break-word',*/}
        {/*}}>{JSON.stringify(eventData)}</div>*/}
        <div
            style={{
                fontSize: '18px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                textOverflow: 'ellipsis',
                paddingRight: mouseOnData ? '20px' : '',
            }}
            title={`${eventData.title}`}
        >{`${eventData.title}`}</div>
        {mouseOnData &&
            <svg
                style={{
                    position: "absolute",
                    right: 5,
                    top: 5
                }}
                onClick={() => onEditButtonPressed()}
                xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 32 32">
                <path d="M 20.96875 3.9160156 C 19.778811 3.9206328 18.52575 4.2457344 17.296875 5.0058594 C 16.964283 5.211704 16.635788 5.4265814 16.310547 5.6445312 C 16.310093 5.6448354 16.309048 5.6442271 16.308594 5.6445312 A 0.287 0.287 0 0 0 16.335938 6.1816406 C 16.341365 6.1853565 16.343925 6.1941909 16.349609 6.1972656 C 20.381609 8.3782656 23.658219 11.669891 25.824219 15.712891 A 0.287 0.287 0 0 0 26.085938 15.880859 A 0.287 0.287 0 0 0 26.349609 15.699219 A 0.287 0.287 0 0 0 26.351562 15.697266 C 26.57166 15.37011 26.787062 15.039663 26.994141 14.705078 C 29.021141 11.426078 27.947375 7.978625 25.984375 6.015625 C 24.758125 4.78875 22.951982 3.9083203 20.96875 3.9160156 z M 14.058594 7.4492188 C 13.871844 7.4707187 13.690063 7.5430625 13.539062 7.6640625 C 12.562062 8.4470625 11.623469 9.2772969 10.730469 10.154297 C 6.3334687 14.476297 3.8931094 20.542734 4.0371094 26.802734 C 4.0561094 27.437734 4.5661719 27.947891 5.2011719 27.962891 C 5.3771719 27.966891 5.5506094 27.96875 5.7246094 27.96875 C 11.793609 27.96875 17.643703 25.542578 21.845703 21.267578 C 22.719703 20.377578 23.548125 19.44175 24.328125 18.46875 C 24.571125 18.16875 24.620172 17.745437 24.451172 17.398438 C 22.355172 13.092437 18.912328 9.6459687 14.611328 7.5429688 C 14.437328 7.4579688 14.245344 7.4277188 14.058594 7.4492188 z M 7.78125 18.792969 C 7.8554844 18.779438 7.9327656 18.779422 8.0097656 18.794922 C 10.617766 19.323922 12.676078 21.382234 13.205078 23.990234 C 13.268078 24.297234 13.078203 24.609797 12.783203 24.716797 C 10.854203 25.413797 8.8202344 25.838359 6.7402344 25.943359 C 6.3602344 25.962359 6.0376406 25.639766 6.0566406 25.259766 C 6.1606406 23.179766 6.5862031 21.144797 7.2832031 19.216797 C 7.3634531 18.994797 7.5585469 18.833563 7.78125 18.792969 z"></path>
            </svg>
        }
        <div>{`${
            datePeriodStr(eventData.startAt, currentViewDate)
        }—${
            datePeriodStr(eventData.endAt, currentViewDate)
        }`}</div>
        <div style={{
            whiteSpace: 'pre-wrap',
            overflowWrap: 'break-word',
            wordWrap: 'break-word',
        }}>{`${eventData.description}`}</div>
        {eventData.category &&
            <>
                <hr/>
                <div>{`${eventData.category.toUpperCase()}`}</div>
            </>
        }
    </div>

}

export default DayViewEventDataDisplay;
