export function toLocalDateInputField(date) {
    const localTimeStringFormatted = date.toLocaleTimeString('UK', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
    });

    return `${date.getFullYear()}-${
        date.toLocaleDateString('UK', {month: '2-digit'})}-${
        date.toLocaleDateString('UK', {day: '2-digit'})}T${
        localTimeStringFormatted}`;
}

export function hexToRgba(hex, alpha = 1) {
    const hexColor = hex.replace(/^#/, '');
    const bigint = parseInt(hexColor, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function blockEvents(event) {
    event.stopPropagation();
}

export function calculateEventLeft(column, countColumns) {
    return column * 100 / countColumns;
}

export function calculateEventH(day_event, currentViewDate) {
    let start = getDateMinutes(day_event.startAt, currentViewDate);
    let end = getDateMinutes(day_event.endAt, currentViewDate);
    return getEventHeightPercent(start, end);
}

export function getEventHeightPercent(start, end){
    return (end - start) * 100 / (24 * 60);
}

export function getDateMinutes(targetDate, currentViewDate){
    if (targetDate.getDate() < currentViewDate.getDate())
        return 0;
    if (targetDate.getDate() > currentViewDate.getDate()){
        return 23 * 60 + 59;
    }
    return targetDate.getHours() * 60 + targetDate.getMinutes();
}

export function toShortDateFormat(date = new Date()){
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
}

export function getStartEndMonthByDate(date = new Date()){
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);
    return [startOfMonth, endOfMonth];
}

export function getStartEndDatesByDate(date = new Date()) {
    const start = new Date(date);
    const end = new Date(date);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return [start, end];
}

export function cropDateToCurrent(targetDate = new Date(), currentDate = new Date()){
    const dateBounds = getStartEndDatesByDate(currentDate);
    if (targetDate.getTime() < dateBounds[0].getTime())
        return dateBounds[0];
    if (targetDate.getTime() > dateBounds[1].getTime())
        return dateBounds[1];
    return targetDate;
}
