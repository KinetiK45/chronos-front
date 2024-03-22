function datePeriodStr(targetDate, currentViewDate) {
    let time = targetDate.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' });
    if (targetDate.getDate() === currentViewDate.getDate())
        return time;
    return `${targetDate.toLocaleDateString(undefined, {day: 'numeric', month: 'long'})} ${time}`;
}

function DayViewEventDataDisplay({eventData, currentViewDate}) {
    return <div
        style={{
            padding: '5px',
        }}
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
            }}
            title={`${eventData.title}`}
        >{`${eventData.title}`}</div>
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
                {
                    eventData.category === 'task' &&
                    <div
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                    >
                        <input
                            type="checkbox"
                            name={`task-${eventData.id}-complete`}
                        />
                        <label htmlFor={`task-${eventData.id}-complete`}>📝</label>
                    </div>
                }

                {
                    eventData.category === 'arrangement' &&
                    <div
                        style={{
                            whiteSpace: 'pre-wrap',
                            overflowWrap: 'break-word',
                            wordWrap: 'break-word',
                        }}
                    >{`Место проведения: ${eventData.place ? eventData.place : 'Не указано'}`}</div>
                }
                <div
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                >
                    <input
                        type="checkbox"
                        name={`task-${eventData.id}-notification`}
                        defaultChecked={eventData.category === 'reminder'}
                    />
                    <label htmlFor={`task-${eventData.id}-notification`}>🔔</label>
                </div>
            </>
        }
        {
            eventData.type && eventData.type !== 'own' &&
            <div>Created by other user</div>
        }
    </div>

}

export default DayViewEventDataDisplay;
