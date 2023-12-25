class ProfileIcon extends Observer {
    _publisher = null;
    constructor() {
        super()
        this.profileButton = document.querySelector('.profile__link');
        this.setProfileIcon();
    }


    setProfileIcon() {
        this.profileButton.replaceChildren()
        if (state.getAuthStatus()) {
            this.generateUserIcon(state.getUser())
        } else {
            const icon = document.createElement('img')
            icon.setAttribute('alt', 'icon-profile')
            icon.setAttribute('src', './img/icon_profile.svg')
            icon.setAttribute('id', 'icon-profile')
            this.profileButton.append(icon)
        }
    }

    generateUserIcon(user) {
        const first = user.firstName.slice(0,1).toUpperCase()
        const second  = user.lastName.slice(0,1).toUpperCase()

        const icon = document.createElement('div')
        icon.setAttribute('title', `${user.firstName} ${user.lastName}`)
        icon.classList.add('profile__icon')
        icon.textContent = `${first+second}`
        icon.setAttribute('id', 'icon-profile')
        this.profileButton.append(icon)
    }

    update() {
        this.setProfileIcon()
    }

    subscribe(publisher) {
        this._publisher = publisher;
    }

    unsubscribe() {
        this._publisher = null;
    }
}

const profileIcon = new ProfileIcon()

state.attach(profileIcon)
profileIcon.subscribe(state)
