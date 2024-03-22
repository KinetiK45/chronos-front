import './Navigation.css';
import Requests from "../API/requests";
import {useEffect, useState} from "react";

function logout() {
    localStorage.removeItem('user_id');
    localStorage.removeItem('token');
    window.location.href = `${window.location.origin}/login`;
}

function Navigation() {

    const [userdata, setUserdata] = useState({
        username: 'Loading...',
    });

    useEffect(() => {
        const fetchData = async () => {
            const resp = await Requests.user_by_id(localStorage.getItem('user_id'));
            if (resp.state === true){
                setUserdata(resp.data[0]);
            }
        }
        if (localStorage.getItem('user_id'))
            fetchData();
    }, []);

    return (
        <div id={'navigation'}>
            <a href={`${window.location.origin}/users/${localStorage.getItem('user_id')}`}>temp</a>
            {localStorage.getItem('user_id') &&
                <div className={'userdata-min'}>
                    <img src={Requests.get_img_link(localStorage.getItem('user_id'))} alt={'Ava'}/>
                    <a href={`${window.location.origin}/users/${localStorage.getItem('user_id')}`}>
                        {`${userdata.full_name}`}
                    </a>
                    <button onClick={logout}>logout</button>
                </div>
            }
            {!localStorage.getItem('user_id') &&
                <a href={`${window.location.origin}/login`}>Вхід</a>
            }
        </div>
    );
}

export default Navigation;
