import Navigation from "../components/Navigation";
import {useEffect, useState} from "react";
import Requests from "../API/requests";
import {useParams} from "react-router-dom";
import './CalendarSettings.css';
import EditableTextInput from "../components/EditableTextInput";
import UserFinder from "../components/UserFinder";
function CalendarSettings() {

    const {calendarId} = useParams();
    const [calendarData, setCalendarData] = useState(undefined);
    const [calendarUsers, setCalendarUsers] = useState([]);
    const [permissions, setPermissions] = useState({
        fieldsEdit: false,
        roleEdit: false,
    });
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
        if (calendarData){
            setPermissions({
                fieldsEdit: !('calendar_user' in calendarData && calendarData.calendar_user.role === 'inspector'),
                roleEdit: Number.parseInt(localStorage.getItem('user_id')) === calendarData.user_id
            });
            // alert(JSON.stringify({
            //     fieldsEdit: !('calendar_user' in calendarData && calendarData.calendar_user.role === 'inspector'),
            //     roleEdit: Number.parseInt(localStorage.getItem('user_id')) === calendarData.user_id
            // }))
        }
    }, [calendarData]);
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
    async function sendEditedData(editedFields) {
        const resp = await Requests.editCalendar(localStorage.getItem('token'),
            {...editedFields,
                'calendar_id': Number.parseInt(calendarId),
            });
        if (resp.state !== true){
            alert(resp.message);
            window.location.reload();
        }
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
                            <h1>
                                <EditableTextInput
                                    initialText={calendarData.title}
                                    placeholder={'Title'}
                                    onEdited={async (value) => {
                                        await sendEditedData({
                                            title: value,
                                        });
                                    }}
                                />
                            </h1>
                            <h3 style={{
                                padding: '5px',
                            }}>
                                <EditableTextInput
                                    initialText={calendarData.description}
                                    placeholder={'Description'}
                                    onEdited={async (value) => {
                                        await sendEditedData({
                                            description: value,
                                        });
                                    }}
                                />
                            </h3>
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
                                    <div>
                                        <input
                                            type={'color'}
                                            defaultValue={calendarData?.calendar_user?.custom_color || calendarData.color}
                                            onChange={(event) =>
                                                sendEditedData({color: event.target.value})
                                            }
                                        />
                                        <label htmlFor={'custom-color'}>Колір ваших івентів</label>
                                    </div>
                                    {/*<div>{JSON.stringify(userdata)}</div>*/}
                                    {
                                        permissions.roleEdit && userdata.role !== 'owner' &&
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
                                        (!permissions.roleEdit || userdata.role === 'owner') &&
                                        <div>{`${userdata.role}`}</div>
                                    }
                                </div>
                            ))
                        }
                    </div>
                    <UserFinder
                        exclude_ids={calendarUsers.map((calendarUser) => calendarUser.user_id)}
                        onFound={(found_users_data) => setUsersFound(found_users_data)}
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
