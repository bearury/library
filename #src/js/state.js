class State extends Observable {

    _state = {
        user: {},
        users: [],
        isAuth: false,
    }

    constructor() {
        super()

        this._state.user = api.getUserData()
        this._state.users = api.getUsersData()
        this._state.isAuth = !!this._state.user
    }

    /**
     * @param {User} user
     */
    setUser (user) {
        this._state.user = api.setUserData(user)
        this.setAuthStatus(true)
        this.notifyObserver()
    }

    clearUser () {
        this._state.user = api.removeUserData()
        this.setAuthStatus(false)
        this.notifyObserver()
    }

    getUser(){
        return this._state.user
    }

    setAuthStatus (status) {
        this._state.isAuth = status
    }

    getAuthStatus () {
        return this._state.isAuth
    }

    /**
     * @param {User} user
     */
    addUser(user){
        const candidate = this.checkUser(user)
        if (!candidate) {
            const newUser = {...user,
                visits: 1,
                books: [],
                card: this.generateNumberCard(),
                bonuses: 23,
                buyCard: false
            }
            this._state.users = api.setUsersData(newUser)
            this.setUser(newUser)
        }
        return !candidate
    }

    generateNumberCard(){
        return [...Array(9)].map(() => Math.floor(Math.random() * 16).toString(16).toUpperCase()).join('');
    }

    updateUserInUserArray(user) {
        const arrUsers = this._state.users.filter(u => u.email !== user.email)
        this._state.users = api.updateUsersData([...arrUsers, user])
    }


    loginUser(user) {
        const candidate = this.checkUser(user)
        if (candidate && candidate.password === user.password) {
            return this.changeUser({...candidate, visits :candidate.visits + 1})
        }
    }

    changeUser(user) {
        this.updateUserInUserArray(user)
        this.setUser(user)
        return user
    }

    checkUser(user) {
        const usersArr = api.getUsersData()
        console.log( '⭐: ', usersArr, user )

        return usersArr.find(u => u.email === user.text || u.card === user.text)
    }
    getUsers(){
        return this._state.users
    }
}

const state = new State()

