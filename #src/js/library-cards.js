class LibraryCards extends Observer{
    constructor() {
        super();
        this.blockButtons = document.querySelector('.get-reader__block-button');
        this.blockInfo = document.querySelector('.find-card__block-info');
        this.userInfoCounts = this.blockInfo.querySelectorAll('.user-info__count');

        this.showInfo = false;
        this.generateFindCardElements();
        this.generateAuthButton();
        this.generateTextContent();
        this.handlerStateInput();

    }

    generateAuthButton () {
        this.blockButtons.replaceChildren();
        if (state.getAuthStatus()) {
            libraryCardButtonIsAuth.map( btn => {
                this.blockButtons.append(this.createHtmlBtnAuth(btn))
            })
        } else {
            libraryCardButtonNoAuth.map( btn => {
                this.blockButtons.append(this.createHtmlBtnAuth(btn))
            })
        }
    }

    createHtmlBtnAuth ({id, title}) {
        const button = document.createElement('button');
        button.setAttribute('id', id);
        button.classList.add('get-reader__button');
        button.textContent = title;
        popupMenu.setEventListenerForButton(button)

        return button;
    }

    generateFindCardElements (user) {
        this.blockInfo.replaceChildren();
        if (state.getAuthStatus()) {
            this.blockInfo.append(this.createHtmlUserInfo(state.getUser()))
        } else if (this.showInfo){
            this.blockInfo.append(this.createHtmlUserInfo(user))
        } else {
            this.blockInfo.append(this.createHtmlBtnElement());
        }
    }


    createHtmlUserInfo (user) {
        const {visits, bonuses, books} = user;
        const card = cardProfile.map(({title, image}, index) => {
            const item = document.createElement('li');
            item.classList.add('block-info__item');

            const titleElement = document.createElement('div');
            titleElement.classList.add('block-info__title');
            titleElement.textContent = title;

            const wrapperIcon = document.createElement('div');
            wrapperIcon.classList.add('user-info__icon');

            const icon = document.createElement('img');
            icon.setAttribute('src', image);
            icon.setAttribute('alt', 'icon');
            wrapperIcon.append(icon);

            const count = document.createElement('div');
            count.classList.add('user-info__count');

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
            item.append(titleElement, wrapperIcon, count)
            return item
        })

        const list = document.createElement('ul');
        list.classList.add('block-info');
        list.append(...card);

        return list;
    }

    createHtmlBtnElement () {
        const button = document.createElement('button');
        button.classList.add('find-card__button');
        button.textContent = 'Check the card';
        button.addEventListener('click', () => {
            this.buttonSubmitHandler();
        })

        return button;
    }

    buttonSubmitHandler() {
        const form = document.querySelector('.find-card__form');
        const inputs = form.querySelectorAll('input');
        const users = state.getUsers();

        /**
         * @type {{readersName: string, readersCard: string }}
         */
        const valuesFields = {}

        inputs.forEach(el => {
                el.id ? valuesFields[el.id] = el.value : ''
            }
        )

        const findUser = users.find( user =>
            user.firstName + user.lastName === valuesFields.readersName.replaceAll(' ','') &&
            user.card === valuesFields.readersCard
        )

        if (findUser) {
            this.showInfo = true;
            this.generateFindCardElements(findUser);
            setTimeout(() => {
                this.showInfo = false;
                this.generateFindCardElements();
                inputs.forEach(input => input.value = '')
            }, 10000)
        }
    }

    generateTextContent() {
        const titleForm = document.querySelector('.find-card__title');
        const titleReader = document.querySelector('.get-reader__title');
        const textReader = document.querySelector('.get-reader__subtitle');

        if (state.getAuthStatus()) {
            titleForm.textContent = 'Your Library card';
            titleReader.textContent = 'Visit your profile';
            textReader.textContent = 'With a digital library card you get free access to the Library’s wide array of digital resources including e-books, databases, educational resources, and more.'

        } else {
            titleForm.textContent = 'Find your Library card ';
            titleReader.textContent = 'Get a reader card';
            textReader.textContent = 'You will be able to see a reader card after logging into account or you can register a new account'
        }
    }

    handlerStateInput(){
        const inputs = document.querySelectorAll('.find-card__input');

        if (state.getAuthStatus()) {
            const {firstName, lastName, card} = state.getUser()
            inputs.forEach(i => {
                i.disabled = true
            })
            inputs[0].value = firstName + ' ' + lastName;
            inputs[1].value = card;
        } else {
            inputs.forEach(i => {
                i.value = ''
                i.disabled = false
            })
        }
    }


    update() {
        this.generateAuthButton();
        this.generateFindCardElements();
        this.generateTextContent();
        this.handlerStateInput();
    }
}

const digitalCard = new LibraryCards();

state.attach(digitalCard)

