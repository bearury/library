/**
 * @typedef User
 * @type {object}
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} password
 * @property {number} visits
 * @property {number} bonuses
 * @property {[Book]} books
 * @property {string} card
 * @property {boolean} buyCard
 */

/**
 * @typedef Book
 * @type {object}
 * @property {string} name
 * @property {string} author
 */


class Api {
    _key = {
        user: 'library-user',
        users: 'library-users',
    }
    getUserData() {
        return JSON.parse(localStorage.getItem(this._key.user))
    }

    /**
     * @param {User} user
     */
    setUserData (user) {
        localStorage.setItem(this._key.user, JSON.stringify(user))
        return JSON.parse(localStorage.getItem(this._key.user))
    }

    removeUserData () {
        localStorage.removeItem(this._key.user)
        //TODO Object.entries(obj).length === 0;
        return {}
    }

    getUsersData () {
        const arr = JSON.parse(localStorage.getItem(this._key.users))
        return  (Array.isArray(arr) && arr.length) ? arr : []
    }

    /**
     * @param {User} candidate
     */
    setUsersData (candidate) {
        const usersArr = [...this.getUsersData(), candidate]
        localStorage.setItem(this._key.users, JSON.stringify(usersArr))
        return this.getUsersData()
    }

    updateUsersData(users) {
        localStorage.removeItem(this._key.users)
        localStorage.setItem(this._key.users, JSON.stringify(users))
        return this.getUsersData()
    }
}

const api = new Api()
