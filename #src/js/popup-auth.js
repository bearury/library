
class PopupAuth {
    showPopup = false;
    constructor(){
        this.popupAuthCloseButton = document.querySelector('.popup-auth__close-btn');
        this.authHandler = new PopupAuthHandler();
        this.popupAuthCloseButton.addEventListener('click', () => {
            this.showPopup = false;
            this.showPopupAuth();
            this.authHandler.clickSubmitButton = false;
        })
        this.popupAuth = document.querySelector('.popup-auth');
    }

    showPopupAuth(status) {
        if(this.showPopup) {
            popupMenu.toggleClassPopup();
            this.popupAuth.classList.add('active');
            this.authHandler.setStatusPopup(status);
            this.authHandler.createHtmlElement();
        } else {
            this.closePopupAuth();
        }
    }

    closePopupAuth() {
        this.popupAuth.classList.add('close');
        setTimeout(() => {
            this.popupAuth.classList.remove('close');
            this.popupAuth.classList.remove('active');
            this.authHandler.clearHtmlElement();
        }, 500);
    }
}

const popupAuth = new PopupAuth();
