class PopupMenu {
    show = false;
    constructor() {
        this.profileButton = document.querySelector('.profile__link');
        this.popup = document.querySelector('.popup-menu');

        this.generateTitlePopup();
        this.setClickEventListener(this.profileButton);
        this.setScrollEventListener();
        this.generateButtonPopup();
    }

    setClickEventListener() {
        this.profileButton.addEventListener('click', () => {
            this.toggleClassPopup();
            this.generateButtonPopup();
            this.generateTitlePopup();
            burger.status && burger.toggleClassActive();
        })
    }

    setScrollEventListener() {
        window.addEventListener('wheel', () => {
            this.closePopup()
        })
    }

    generateButtonPopup() {
        this.deleteHtmlButton()
        if (state.getAuthStatus()) {
            authButton.map(btn => this.createHtmlButton(btn))
        } else {
            noAuthButton.map(btn => this.createHtmlButton(btn))
        }
    }

    /**
     * @param {{id: string, title: string}} param
     */
    createHtmlButton(param) {
        const button = document.createElement('button')
        button.classList.add('popup-menu__item')
        button.setAttribute('id', param.id)
        button.textContent = param.title;
        this.setEventListenerForButton(button)
        this.popup.append(button)
    }

    generateTitlePopup () {
        const title = document.querySelector('.popup-menu__title');
        if (state.getAuthStatus()) {
            title.classList.add('card')
            title.textContent = `${state.getUser().card}`
        } else {
            title.classList.remove('card')
            title.textContent = 'Profile'
        }
    }

    setEventListenerForButton(button) {
        button.addEventListener('click', (event) => {
            popupAuth.showPopup = true;
            if (event.target.id === status.LOGIN || event.target.id === status.REGISTER) {
                popupAuth.showPopupAuth(event.target.id);
            } else if (event.target.id === status.PROFILE) {
                // const popupProfile = new PopupProfile()
                popupProfile.showPopup()
            } else if (event.target.id === status.LOGOUT) {
                state.clearUser()
                this.closePopup();
            } else {
                return console.log( '🆘: The error of obtaining status from the ID button from profile form! ')
            }
        })
    }

    deleteHtmlButton(){
        const buttons = this.popup.querySelectorAll('button')
        buttons.forEach(btn => this.popup.removeChild(btn))
    }

    toggleClassPopup() {
        this.popup.classList.toggle('active');
    }


    closePopup () {
        this.popup.classList.remove('active');
    }
}

const popupMenu = new PopupMenu();


