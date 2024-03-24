function datePeriodStr(targetDate, currentViewDate) {
    let time = targetDate.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' });
    if (targetDate.getDate() === currentViewDate.getDate())
        return time;
    return `${targetDate.toLocaleDateString(undefined, {day: 'numeric', month: 'long'})} ${time}`;
}

function WeekViewEventDataDisplay({eventData, currentViewDate, onEditButtonPressed}) {


    return <div
        style={{
            padding: '2px',
            fontSize: '14px',
        }}
    >
        {/*<div style={{*/}
        {/*    whiteSpace: 'pre-wrap',*/}
        {/*    overflowWrap: 'break-word',*/}
        {/*    wordWrap: 'break-word',*/}
        {/*}}>{JSON.stringify(eventData)}</div>*/}
        <div
            style={{
                fontSize: '14px',
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
            </>
        }
    </div>

}

export default WeekViewEventDataDisplay;
