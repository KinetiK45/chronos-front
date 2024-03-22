import Navigation from "../components/Navigation";
import {useEffect, useState} from "react";
import Requests from "../API/requests";
import {useParams} from "react-router-dom";
import './CalendarSettings.css';
function CalendarSettings() {

    const {calendarId} = useParams();
    const [calendarData, setCalendarData] = useState(null);
    const [calendarUsers, setCalendarUsers] = useState([]);
    const [editedFiels, setEditedFiels] = useState({});

    useEffect( () => {
        const fetchData = async () => {
            const resp = await Requests.calendarById(
                localStorage.getItem('token'), calendarId
            );
            setCalendarData(resp.data);
        }
        fetchData();
    }, [calendarId]);


    useEffect(() => {
        // Пользовательская функция сравнения для сортировки по ролям
        const compareRoles = (user1, user2) => {
            const rolesOrder = { "owner": 1, "editor": 2, "inspector": 3 };
            return rolesOrder[user1.role] - rolesOrder[user2.role];
        }
        const fetchData = async () => {
            const resp = await Requests.usersByCalendar(localStorage.getItem('token'), calendarId);
            if (resp.state === true){
                resp.data.sort(compareRoles);
                setCalendarUsers(resp.data);
            }
        }
        fetchData();
    }, [calendarId]);
    async function saveChanges() {
        const resp = await Requests.editCalendar(localStorage.getItem('token'),
            {...editedFiels,
                'calendar_id': Number.parseInt(calendarId),
            });
        if (resp.state === true)
            window.location.href = `/users/${localStorage.getItem('user_id')}`;
    }

    const [usersFound, setUsersFound] = useState([]);
    return (
        <div className="main">
            <Navigation/>
            <div className={'main-content'}>
                <div className={'center-block'}>
                    {/*{calendarData && <div>{JSON.stringify(calendarData)}</div>}*/}
                    {calendarData &&
                        <div className={'calendar-info-editor'}>
                            <label htmlFor={'title'}>Title:</label>
                            <input
                                type={'text'}
                                placeholder={'Title'}
                                name={'title'}
                                defaultValue={calendarData.title}
                                readOnly={'calendar_user' in calendarData
                                    && calendarData.calendar_user.role === 'inspector'}
                                onChange={(event) =>
                                    setEditedFiels({...editedFiels, 'title': event.target.value})
                                }
                            />
                            <label htmlFor={'description'}>Description:</label>
                            <input
                                type={'text'}
                                placeholder={'Description'}
                                name={'description'}
                                readOnly={'calendar_user' in calendarData
                                    && calendarData.calendar_user.role === 'inspector'}
                                defaultValue={calendarData.description}
                                onChange={(event) =>
                                    setEditedFiels({...editedFiels, 'description': event.target.value})
                                }
                            />
                            <label htmlFor={'custom-color'}>Колір ваших івентів</label>
                            <input
                                type={'color'}
                                name={'custom-color'}
                                defaultValue={calendarData?.calendar_user?.custom_color || calendarData.color}
                                onChange={(event) =>
                                    setEditedFiels({...editedFiels, 'color': event.target.value})
                                }
                            />
                            <button onClick={saveChanges}>Save</button>
                        </div>
                    }
                    <div className={'calendar-users'}>
                        {calendarUsers &&
                            calendarUsers.map((userdata) => (
                                <div
                                    className={'calendar-user-inspect'}
                                    key={`calendar-user-inspect-${userdata.user_id}`}
                                >
                                    <div className={'calendar-user-inspect-userdata'}>
                                        <img
                                            className={'calendar-user-inspect-avatar'}
                                            src={Requests.get_img_link(userdata.user_id)}
                                            alt={'Ava'}
                                        />
                                        <a href={`${window.location.origin}/users/${userdata.user_id}`}>
                                            {`${userdata.full_name}`}
                                        </a>
                                    </div>
                                    {
                                        userdata.role && userdata.role !== 'owner' &&
                                        <select
                                            className={'role-select'}
                                            defaultValue={userdata.role || 'inspector'}
                                            onChange={(event) => {
                                                Requests.updateRole(localStorage.getItem('token'),
                                                    {
                                                        calendar_id: Number.parseInt(calendarId),
                                                        user_id: userdata.user_id,
                                                        role: event.target.value
                                                    }
                                                )
                                            }}
                                        >
                                            <option value="editor">Editor</option>
                                            <option value="inspector">Inspector</option>
                                        </select>
                                    }
                                    {
                                        (!('role' in userdata) || userdata.role === 'owner') &&
                                        <div>Owner</div>
                                    }
                                </div>
                            ))
                        }
                    </div>
                    <input
                        type={'text'}
                        placeholder={'Username'}
                        name={'userFinder'}
                        onChange={(event) => {
                            if (event.target.value.trim().length > 0)
                                Requests.findUsername(event.target.value).then((resp) => {
                                    if (resp.state === true)
                                        setUsersFound(resp.data)
                                })
                            else
                                setUsersFound([]);
                        }}
                    />
                    <div className={'users-found'}>
                        {usersFound.map((userdata) => (
                            <div className={'calendar-user-inspect-userdata'}>
                                <img
                                    className={'calendar-user-inspect-avatar'}
                                    src={Requests.get_img_link(userdata.id)}
                                    alt={'Ava'}
                                />
                                <a href={`${window.location.origin}/users/${userdata.id}`}>
                                    {`${userdata.full_name}`}
                                </a>
                                <button onClick={() => {
                                    Requests.shareCalendar(localStorage.getItem('token'), {
                                        user_id: userdata.id,
                                        calendar_id: calendarId
                                    }).then((resp) => {
                                        alert(resp.message);
                                    })
                                }} >Поделиться с этим пользователем</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CalendarSettings;
