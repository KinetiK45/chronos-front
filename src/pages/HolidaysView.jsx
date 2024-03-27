import Navigation from "../components/Navigation";
import {useEffect, useState} from "react";
import Requests from "../API/requests";
import '../components/MonthView.css';
import ViewTitle from "../components/ViewTitle";
import {filterEventsToTargetDate, getDaysInMonth, getWeekDates, toMonthTitleFormat} from "../utils/Utils";
import CalendarCell from "../components/CalendarCell";
function HolidaysView() {

    const [monthDayViewAnchor, setMonthDayViewAnchor] = useState(new Date());

    const [holidays, setHolidays] = useState([]);
    //заполнение holidays
    useEffect(() => {
        // const fetchData = async () => {
        //     const resp = Requests.getNationalHolidays(2024, 'UA');
        //     console.log(JSON.stringify(resp));
        // }
        //
        // fetchData();

        const holidaysTemp =
            [
                {
                    "date": "2024-01-01",
                    "localName": "Новий Рік",
                    "name": "New Year's Day",
                    "countryCode": "UA",
                    "fixed": true,
                    "global": true,
                    "counties": null,
                    "launchYear": null,
                    "type": "Public"
                }, {
                "date": "2024-01-07",
                "localName": "Різдво",
                "name": "(Julian) Christmas",
                "countryCode": "UA",
                "fixed": true,
                "global": true,
                "counties": null,
                "launchYear": null,
                "type": "Public"
            }, {
                "date": "2024-03-08",
                "localName": "Міжнародний жіночий день",
                "name": "International Women's Day",
                "countryCode": "UA",
                "fixed": true,
                "global": true,
                "counties": null,
                "launchYear": null,
                "type": "Public"
            }, {
                "date": "2024-05-01",
                "localName": "День праці",
                "name": "International Workers' Day",
                "countryCode": "UA",
                "fixed": true,
                "global": true,
                "counties": null,
                "launchYear": null,
                "type": "Public"
            }, {
                "date": "2024-05-05",
                "localName": "Великдень",
                "name": "Easter Sunday",
                "countryCode": "UA",
                "fixed": false,
                "global": true,
                "counties": null,
                "launchYear": null,
                "type": "Public"
            }, {
                "date": "2024-05-09",
                "localName": "День перемоги над нацизмом у Другій світовій війні",
                "name": "Victory day over Nazism in World War II",
                "countryCode": "UA",
                "fixed": true,
                "global": true,
                "counties": null,
                "launchYear": null,
                "type": "Public"
            }, {
                "date": "2024-06-23",
                "localName": "Трійця",
                "name": "Pentecost",
                "countryCode": "UA",
                "fixed": false,
                "global": true,
                "counties": null,
                "launchYear": null,
                "type": "Public"
            }, {
                "date": "2024-06-28",
                "localName": "День Конституції",
                "name": "Constitution Day",
                "countryCode": "UA",
                "fixed": true,
                "global": true,
                "counties": null,
                "launchYear": null,
                "type": "Public"
            }, {
                "date": "2024-08-24",
                "localName": "День Незалежності",
                "name": "Independence Day",
                "countryCode": "UA",
                "fixed": true,
                "global": true,
                "counties": null,
                "launchYear": null,
                "type": "Public"
            }, {
                "date": "2024-10-14",
                "localName": "День захисника України",
                "name": "Defender of Ukraine Day",
                "countryCode": "UA",
                "fixed": true,
                "global": true,
                "counties": null,
                "launchYear": null,
                "type": "Public"
            }, {
                "date": "2024-12-25",
                "localName": "Різдво",
                "name": "(Gregorian and Revised Julian) Christmas",
                "countryCode": "UA",
                "fixed": true,
                "global": true,
                "counties": null,
                "launchYear": null,
                "type": "Public"
            }];
        holidaysTemp.forEach((element) => {
            element.date = new Date(element.date);
            element.color = '#FFFFFF'
        });
        setHolidays(holidaysTemp);

    }, []);

    return (
        <div className="main">
            <Navigation/>
            <div className={'main-content'}>
                <div className={'center-block'}>
                    <h1>Holidays</h1>
                    <div
                        className={'month-calendar'}
                        style={{
                            width: 1200,
                        }}
                    >
                        <ViewTitle
                            titleStr={toMonthTitleFormat(monthDayViewAnchor)}
                            onPrev={() => {
                                let newDate = new Date(monthDayViewAnchor);
                                newDate.setMonth(monthDayViewAnchor.getMonth() - 1);
                                setMonthDayViewAnchor(newDate);
                            }}
                            onNext={() => {
                                let newDate = new Date(monthDayViewAnchor);
                                newDate.setMonth(monthDayViewAnchor.getMonth() + 1);
                                setMonthDayViewAnchor(newDate);
                            }}
                        />
                        <div
                            className={'day-names'}
                        >
                            {getWeekDates(monthDayViewAnchor).map((date, index) => (
                                <div key={`day-name-${index}`} className={'day-name'}>
                                    {`${date.toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase()}`}
                                </div>
                            ))}
                        </div>
                        <div
                            className={'days'}
                        >
                            {monthDayViewAnchor && getDaysInMonth(monthDayViewAnchor)
                                .map((date) => (
                                        <div
                                            key={`calendar-day-${date.toLocaleDateString()}`}
                                            style={
                                                {
                                                    gridColumn: date.getDay() === 0 ? 7 : date.getDay(),
                                                    gridColumnEnd: 'auto',
                                                }
                                            }
                                        >
                                            {
                                                <CalendarCell
                                                    date={date}
                                                    holidays={holidays.filter(
                                                        (holiday) => holiday.date.toLocaleDateString() === date.toLocaleDateString()
                                                    )}
                                                />
                                            }
                                        </div>
                                    )
                                )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HolidaysView;
