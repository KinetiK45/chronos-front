import './Navigation.css';

function logout() {
    localStorage.removeItem('user_id');
    localStorage.removeItem('token');
    window.location.href = `${window.location.origin}/login`;
}

function Navigation() {
    return (
        <div id={'navigation'}>
            <a href={`${window.location.origin}/calendars`}>calendars</a>
            <a href={`${window.location.origin}/`}>Ссылка в никуда1</a>
            {localStorage.getItem('user_id') &&
                <>
                    <a href={`${window.location.origin}/users/${localStorage.getItem('user_id')}`}>
                        {`USERID: ${localStorage.getItem('user_id')}`}
                    </a>
                    <div onClick={logout}>LOGOUT</div>
                </>
            }
            {!localStorage.getItem('user_id') &&
                <a href={`${window.location.origin}/login`}>Вхід</a>
            }
        </div>
    );
}

export default Navigation;
