import Requests from "../API/requests";
import Navigation from "../components/Navigation";
import './Profile.css';
import {useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";

function Profile() {

    const {userId} = useParams();
    const [userData, setUserData] = useState({
        id: 1,
        username: 'Loading...',
        full_name: 'Loading...',
    });

    useEffect(() => {
        const fetchData = async () => {
            const resp = await Requests.user_by_id(userId);
            setUserData(resp.data[0]);
            console.log(JSON.stringify(resp.data[0]));
        };
        fetchData();
    }, [userId]);

    const fileInputRef = useRef(null);

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        Requests.avatarUpload(file, userId, localStorage.getItem('token'))
            .then((resp) => {
                if (resp.data.state === true)
                    window.location.reload();
                else {
                    alert('Unexpected error');
                }
        });
    };

    const [calendars, setCalendars] = useState([]);

    useEffect( () => {
        const fetchData = async () => {
            try {
                const resp = await Requests.allCalendars(
                    localStorage.getItem('token')
                );
                setCalendars(resp.data);
                console.log(JSON.stringify(resp));
            } catch (e){
                if (e.response.status === 401){
                    localStorage.clear();
                    window.location.href = '/login';
                }
                console.error(e);
            }
        }
        fetchData();
    }, [])

    return (
        <div className="main">
            <Navigation/>
            <div className={'main-content'}>
                <div className={'center-block'}>
                    <div className={'user-info'}>
                        <div className={'avatar-container'}>
                            <img className={'profileAvatar'} src={Requests.get_img_link(userData.id)} alt={'AVATAR'} onClick={handleImageClick}/>
                            <input type="file" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} accept="image/*"/>
                        </div>
                        <div className={'right-size-block'}>
                            <h1>{`${userData.full_name}`}</h1>
                        </div>
                    </div>
                    <div className={'calendars'}>
                        <h1 style={{
                            textAlign: 'left'
                        }}>Календари:</h1>
                        <div
                             className={'user-calendars'}
                        >
                            {calendars &&
                                calendars.map((calendarData) => (
                                    <>
                                        <div className={'main-calendar-info'}>
                                            {/*<div>{JSON.stringify(calendarData)}</div>*/}
                                            <h1><a href={`/calendars/${calendarData.id}`}>{calendarData.title}</a></h1>
                                            <h3>{calendarData.description}</h3>
                                        </div>
                                        <div className={'calendar-info-optional'}>
                                            <a href={`${window.location.origin}/calendars/${calendarData.id}/settings`}>⚙️</a>
                                            {
                                                calendarData?.user_id !== Number.parseInt(localStorage.getItem('user_id')) &&
                                                <div>creator: {calendarData.user_id}</div>
                                            }
                                        </div>
                                    </>
                                ))
                            }
                        </div>
                        <button
                            id={'create-calendar-button'}
                            onClick={() => {
                            Requests.createCalendar(localStorage.getItem('token')).then((resp)=>{
                                if (resp.state === true){
                                    Requests.calendarById(localStorage.getItem('token'), resp.data).then((resp2) => {
                                        if (resp2.state === true){
                                            setCalendars([...calendars, resp2.data]);
                                        }
                                    })
                                }
                            })
                        }}>Create calendar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
