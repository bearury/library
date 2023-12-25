class PopupProfile{
    constructor() {
        this.popupProfile = document.querySelector('.popup-profile');
        this.icon = this.popupProfile.querySelector('.popup-profile__icon');
        this.user = this.popupProfile.querySelector('.popup-profile__user');
        this.userInfoCounts = this.popupProfile.querySelectorAll('.user-info__count');
        this.bookList = this.popupProfile.querySelector('.popup-profile__list');
        this.cardNumber = this.popupProfile.querySelector('.popup-profile__card-number');

        this.closeBtn = this.popupProfile.querySelector('.popup-profile__close-btn')
        this.closeBtn.addEventListener('click', () => {
            this.closePopup()
        })

        this.copyBtn = this.popupProfile.querySelector('.popup-profile__copy-btn')
        this.copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(state.getUser().card)
        })
    }

    initialUserInfo () {
        if (state.getAuthStatus()){
            this.insertUserInfo();
        } else {
            console.error( '🆘: User information reading error!!!' );
        }
    }

    showPopup () {
        this.popupProfile.classList.add('active');
        this.initialUserInfo();
    }

    insertUserInfo(){
        const {firstName, lastName, visits, bonuses, books, card } = state.getUser()
        this.icon.textContent = firstName.slice(0,1).toUpperCase() +
            lastName.slice(0,1).toUpperCase();
        if (firstName.length + lastName.length > 9 ){
            this.user.innerHTML = `${firstName}` + '<br/>' + `${lastName}`;
        } else {
            this.user.textContent = `${firstName}` + ` ${lastName}`;
        }


        this.userInfoCounts.forEach((count, index) => {
            switch (index) {
                case 0:{
                    count.textContent = visits;
                    break;
                }
                case 1:{
                    count.textContent = bonuses;
                    break;
                }
                case 2:{
                    count.textContent = books.length;
                    break;
                }
            }
        })

        this.bookList.replaceChildren();
        const arrBooks = favorites.filter( fav =>  books.includes(fav.id));

        arrBooks.length ? arrBooks.map(book => {
            const bookNode = this.createHtmlListItem(book);
            this.bookList.append(bookNode);
        }) : this.bookList.textContent = 'Not yet one book is not rented'

        this.cardNumber.textContent = card;
    }

    createHtmlListItem(book){
        const bookNode = document.createElement('li');
        bookNode.classList.add('popup-profile__list-item');
        bookNode.setAttribute('id', book.id)

        const title = document.createElement('div');
        title.classList.add('popup-profile__list-title');
        title.textContent = book.name + ', ' + book.author;

        const separator = document.createElement('div');
        separator.classList.add('popup-profile__separator-list-item');

        const removeBtn = document.createElement('button');
        removeBtn.classList.add('popup-profile__list-remove-btn');
        removeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" class="svg-icon">
                    <path d="M2 16.8507L17 2.00003" stroke="#0C0C0E" stroke-width="3" fill="red"/>
                    <path d="M2 2.14926L17 17" stroke="#0C0C0E" stroke-width="3"/>
                </svg>`
        removeBtn.addEventListener('click', (e) => {
            this.removeBook(e.currentTarget.parentNode.id)
        })
        bookNode.append(title, separator, removeBtn);
        return bookNode;
    }

    removeBook (id) {
        const newArrBook = state.getUser().books.filter(bookId => bookId !== id);
        state.changeUser({...state.getUser(), books: newArrBook});
        this.insertUserInfo();
    }

    closePopup () {
        this.popupProfile.classList.add('close')

        setTimeout(() => {
            this.popupProfile.classList.remove('active')
            this.popupProfile.classList.remove('close')
        }, 500)
    }
}


const popupProfile = new PopupProfile();
