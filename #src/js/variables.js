const widthContainerDesktop = 1440;
const widthContainerDesTab = 1024;
const widthContainerTablet = 768;

/**
 * @type {[{id: 'login' | 'register', title: string}]}
 */
const noAuthButton = [
    {
        id: 'login',
        title: 'Log In'
    },
    {
        id: 'register',
        title: 'Register'
    }
]

/**
 * @type {[{id: 'profile' | 'logout', title: string}]} authButton
 */

const authButton = [
    {
        id: 'profile',
        title: 'My Profile',
    },
    {
        id: 'logout',
        title: 'Log Out'
    }
]

const status = {
    LOGIN: noAuthButton[0].id,
    REGISTER: noAuthButton[1].id,
    PROFILE: authButton[0].id,
    LOGOUT: authButton[1].id
}

const login = [
    {
        id: 'text',
        type: 'text',
        title: 'E-mail or readers card',
    },
    {
        id: 'password',
        type: 'password',
        title: 'Password',
    }
]

const register = [
    {
        id: 'firstName',
        type: 'text',
        title: 'First name',
    },
    {
        id: 'lastName',
        type: 'text',
        title: 'Last name',
    },
    {
        id: 'email',
        type: 'email',
        title: 'E-mail',
    },
    {
        id: 'password',
        type: 'password',
        title: 'Password',
    }
]

const libraryCardButtonNoAuth = [
    {
        id: 'register',
        title: 'Sign Up'
    },
    {
        id: 'login',
        title: 'Log In'
    }
]

const libraryCardButtonIsAuth = [
    {
        id: 'profile',
        title: 'Profile'
    },
]

const cardProfile = [
    {
        title: 'visits',
        image: './img/union.svg'
    },
    {
        title: 'bonuses',
        image: './img/star.svg'
    },            {
        title: 'Books',
        image: './img/book.svg'
    },
]
