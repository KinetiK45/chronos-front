import {useEffect, useRef} from "react";
import './WeekViewEvent.css';
import {
    calculateEventH,
    calculateEventLeft,
    getDateMinutes,
    getEventHeightPercent,
    hexToRgba,
} from "../utils/Utils";
import WeekViewEventDataDisplay from "./WeekViewEventDataDisplay";

const TRANSITION_DURATION = '0.5s';

function WeekViewEvent({
                          eventData,
                          currentViewDate,
                          countColumns,
                          isResizable = true}) {
    const eventDataRef = useRef(null);
    const eventLineRef = useRef(null);

    useEffect(() => {
        const height = eventDataRef.current.scrollHeight; //текущая высота элемента
        eventDataRef.current.style.width = `${100 / countColumns}%`;
        const parentHeight = document.querySelector('.hours-container').offsetHeight; //высота родителя

        const topPercent = getEventHeightPercent(0, getDateMinutes(eventData.startAt, currentViewDate)); //отступ сверху

        const heightCalculated = calculateEventH(eventData, currentViewDate);
        const minHeightPercent = Math.max(heightCalculated, 14 / parentHeight * 100);
        eventDataRef.current.style.minHeight = `${minHeightPercent}%`;

        const maxHeightPercent = Math.max(heightCalculated, height / parentHeight * 100);
        eventDataRef.current.style.maxHeight = `${maxHeightPercent}%`;

        if (maxHeightPercent + topPercent >= 100){
            eventDataRef.current.style.bottom = 0;
            eventDataRef.current.style.top = '';
            eventDataRef.current.style.height = `${100 - topPercent}%`;
        }
        else {
            eventDataRef.current.style.top = `${topPercent}%`;
            eventDataRef.current.style.bottom = '';
            eventDataRef.current.style.height = `${calculateEventH(eventData, currentViewDate)}%`;
        }
    }, [currentViewDate, eventData]);

    let timeoutId = null;
    const handleMouseEnter = () => {
        console.log('onmouse enter');
        eventDataRef.current.style.zIndex = 2;
        eventLineRef.current.style.zIndex = 3;
        timeoutId = setTimeout(() => {
            eventDataRef.current.style.height = eventDataRef.current.style.maxHeight;
            eventDataRef.current.style.width = '100%';
            eventDataRef.current.style.left = '0%';
            eventLineRef.current.style.left = '0%';
        }, 1000); // Время задержки в миллисекундах (здесь 1000 миллисекунд = 1 секунда)
    }

    return <div>
        <div
            key={`event-${eventData.id}-time-line`}
            ref={eventLineRef}
            className={'week-event-timeline'}
            style={
                {
                    backgroundColor: `${hexToRgba(eventData.color || '#FFFFFF')}`,
                    height: `${calculateEventH(eventData, currentViewDate)}%`,
                    top: `${getEventHeightPercent(0, getDateMinutes(eventData.startAt, currentViewDate))}%`,
                    left: `${calculateEventLeft(eventData.columnIndex, countColumns)}%`,
                    cursor: isResizable ? 'ns-resize' : 'default',
                }
            }/>
        <div
            ref={eventDataRef}
            className={`week-event event-${eventData.id}`}
            key={`event-${eventData.id}`}
            onClick={(event) => {
                event.stopPropagation();
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => {
                clearTimeout(timeoutId);
                eventDataRef.current.style.width = `${100 / countColumns}%`;
                eventDataRef.current.style.left = `${calculateEventLeft(eventData.columnIndex, countColumns)}%`;
                eventLineRef.current.style.left = `${calculateEventLeft(eventData.columnIndex, countColumns)}%`;
                eventDataRef.current.style.zIndex = '';
                eventLineRef.current.style.zIndex = '';
                eventDataRef.current.style.height = eventDataRef.current.style.minHeight;
            }}
            style={
                {
                    background: `linear-gradient(135deg, ${
                        hexToRgba(eventData.color || '#a2a2a2', 0.3
                        )}, transparent)`,
                    // width: `${100 / countColumns}%`,
                    left: `${calculateEventLeft(eventData.columnIndex, countColumns)}%`,
                    transitionDuration: TRANSITION_DURATION,
                }
            }
        >
            {/*<div*/}
            {/*    className={'week-event-title'}*/}
            {/*>{`${eventData.title}`}</div>*/}
            <WeekViewEventDataDisplay
                eventData={eventData}
                currentViewDate={currentViewDate}
            />
        </div>
    </div>

}

export default WeekViewEvent;
