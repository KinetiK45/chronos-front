import './Main.css';
import Requests from "../API/requests";
import Navigation from "../components/Navigation";

async function handle_reg() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const password_confirmation = document.getElementById('password-confirm').value.trim();
    const email = document.getElementById('email').value.trim();
    const full_name = document.getElementById('full_name').value.trim();

    if (username === ''
        || password === ''
        || password_confirmation === ''
        || email === ''
        || full_name === '') {
        return displayError('Заполните все поля');
    } else if (password !== password_confirmation) {
        return displayError('Пароли не совпадают');
    }

    const resp = await Requests.registration(username, password, email, full_name);
    if (resp.state === true){
        window.location.href = '/login';
    }
    else
        displayError(resp.message);
}

const displayError = (errorMessage) => {
    const errorsContainer = document.querySelector('.errors');
    errorsContainer.textContent = errorMessage;
    errorsContainer.style.display = 'block';
    setTimeout(()=>{errorsContainer.style.display = 'none'}, 5000);
};

function Registration() {
    // useEffect(()=>{
    //     if (localStorage.getItem('user_id')){
    //         window.location.href = `/profile/${localStorage.getItem('user_id')}`;
    //     }
    // }, []);

    return (
        <div className="main">
            <Navigation/>
            <div className={'main-content'}>
                <div className={'center-block'}>
                    <h1>Реєстрація</h1>
                    <div className={'errors'}></div>
                    <div className={'inputs'}>
                        <label htmlFor={'username'}>Логін:</label>
                        <input id={'username'} name={'username'} type={'text'} placeholder={'username'}/>
                        <label htmlFor={'full_name'}>Імʼя:</label>
                        <input id={'full_name'} name={'full_name'} type={'text'} placeholder={'full name'}/>
                        <label htmlFor={'password'}>Пароль:</label>
                        <input id={'password'} name={'password'} type={'password'} placeholder={'password'}/>
                        <label htmlFor={'password-confirm'}></label>
                        <input id={'password-confirm'} name={'password-confirm'} type={'password'} placeholder={'password confirmation'}/>
                        <label htmlFor={'email'}>Пошта:</label>
                        <input id={'email'} name={'email'} type={'email'} placeholder={'email'} pattern={'^.*@.*\\..*$'}/>
                    </div>
                    <div className={'text-line'}>
                        <p>Маєте аккаунт? <a href={`${window.location.origin}/login`}>Вхід</a></p>
                    </div>
                    <br/>
                    <button className={'form-submit'} onClick={handle_reg}>Зареєструватись</button>
                </div>
            </div>
        </div>
    );
}

export default Registration;
