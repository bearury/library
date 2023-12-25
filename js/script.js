// JS-функция определения поддержки WebP
document.addEventListener('DOMContentLoaded', function() {
    testWebP(document.body)
})
function testWebP(elem) {
    const webP = new Image();
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    webP.onload = webP.onerror = function () {
    webP.height === 2 ? elem.classList.add('webp-true') : elem.classList.add('webp-false')
    }
}

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

class Observable {
    _observers = []

    attach(observer) {
        this._observers.push(observer)
    }

    detach(observer) {
        this._observers = this._observers.filter(o => o !== observer)
    }

    notifyObserver() {
        this._observers.forEach(o => o.update())
    }
}

class Observer {
    update(){}
}

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


const CLASSES = {
    BODY: "body",
	BURGER: ".header__burger",
	MENU: ".header__menu",
	PROFILE: ".header__profile",
	ITEM: ".menu__item",
	WRAPPER: ".wrapper",
}
class Burger {
	constructor() {
		this.status = false
		this.arrayHtmlElements = []
		this.addArrayHtmlElements(CLASSES)
		this.addEventListenerAllClass()
	}

	addArrayHtmlElements(objClass) {
		Object.keys(objClass).forEach((cls) => {
			if(cls === 'ITEM') {
				this[cls] = document.querySelectorAll(CLASSES[cls]);
				this[cls].forEach(el => {
					this.arrayHtmlElements.push(el)
				})
			} else {
                this[cls] = document.querySelector(CLASSES[cls])
				this.arrayHtmlElements.push(this[cls])
			}
		})
	}

	addEventListenerAllClass() {
		this.arrayHtmlElements.forEach((el) => {
            if (el === this.BODY || el === this.MENU) return
			el.addEventListener("click", (e) => {
				e.stopPropagation()

                e.target === popupAuth.popupAuth && popupAuth.closePopupAuth();
                e.target === popupProfile.popupProfile && popupProfile.closePopup();
                e.target === popupBuy.popup && popupBuy.closePopup();
                e.target.id !== 'icon-profile' && popupMenu.closePopup();

				if(this.BURGER.contains(e.target)) {
					this.toggleClassActive()
                } else if (this.status && this.PROFILE.contains(e.target)) {
                    return
				} else if (this.status &&
                    (!this.MENU.contains(e.target) || this.getItemsContains(this.ITEM, e.target))) {
					this.toggleClassActive()
				}
			})
            }
		)
	}

    getItemsContains(items, target) {
        let contain = false
        items.forEach(i => {
            if(i.contains(target)) {
                contain = true
            }
        })
        return contain
    }

	toggleClassActive() {
		this.toggleStatus()
		this.arrayHtmlElements.forEach((el) => el.classList.toggle("active"))
	}

	toggleStatus() {
		this.status = !this.status
	}
}

const burger = new Burger()

const favorites = [
    {
        id: '01',
        name: 'THE BOOK EATERS',
        author: 'Sunyi Dean',
        description : 'An unusual sci-fi story about a book eater woman who tries desperately to save her dangerous mind-eater son from tradition and certain death. Complete with dysfunctional family values, light Sapphic romance, and a strong, complex protagonist. Not for the faint of heart.',
        poster : './img/book-winter-1.jpg',
        season: 'winter',
    },
    {
        id: '02',
        name: 'Cackle',
        author: 'Rachel Harrison',
        description : 'Are your Halloween movies of choice The Witches of Eastwick and Practical Magic? Look no further than here - where a woman recovering from a breakup moves to a quaint town in upstate New York and befriends a beautiful witch.',
        poster : './img/book-winter-2.jpg',
        season: 'winter',
    },
    {
        id: '03',
        name: 'Dante: Poet of the Secular World',
        author: 'Erich Auerbach',
        description : 'Auerbach\'s engaging book places the \'Comedy\' within the tradition of epic, tragedy, and philosophy in general, arguing for Dante\'s uniqueness as one who raised the individual and his drama of soul into something of divine significance—an inspired introduction to Dante\'s main themes.',
        poster : './img/book-winter-3.jpg',
        season: 'winter',
    },
    {
        id: '04',
        name: 'The Last Queen',
        author: 'Clive Irving',
        description : 'A timely and revelatory new biography of Queen Elizabeth (and her family) exploring how the Windsors have evolved and thrived as the modern world has changed around them.',
        poster : './img/book-winter-4.jpg',
        season: 'winter',
    },
    {
        id: '05',
        name: 'The Body',
        author: 'Stephen King',
        description : 'Powerful novel that takes you back to a nostalgic time, exploring both the beauty and danger and loss of innocence that is youth.',
        poster : './img/book-spring-1.jpg',
        season: 'spring',
    },

    {
        id: '06',
        name: 'Carry: A Memoir of Survival on Stolen Land',
        author: 'Toni Jenson',
        description : 'This memoir about the author\'s relationship with gun violence feels both expansive and intimate, resulting in a lyrical indictment of the way things are.',
        poster : './img/book-spring-2.jpg',
        season: 'spring',
    },
    {
        id: '07',
        name: 'Days of Distraction',
        author: 'Alexandra Chang',
        description : 'A sardonic view of Silicon Valley culture, a meditation on race, and a journal of displacement and belonging, all in one form-defying package of spare prose.',
        poster : './img/book-spring-3.jpg',
        season: 'spring',
    },
    {
        id: '08',
        name: 'Dominicana',
        author: 'Angie Cruz',
        description : 'A fascinating story of a teenage girl who marries a man twice her age with the promise to bring her to America. Her marriage is an opportunity for her family to eventually immigrate. For fans of Isabel Allende and Julia Alvarez.',
        poster : './img/book-spring-4.jpg',
        season: 'spring',
    },
    {
        id: '09',
        name: 'Crude: A Memoir',
        author: 'Pablo Fajardo & Sophie Tardy-Joubert',
        description : 'Drawing and color by Damien Roudeau | This book illustrates the struggles of a group of indigenous Ecuadoreans as they try to sue the ChevronTexaco company for damage their oil fields did to the Amazon and her people',
        poster : './img/book-summer-1.jpg',
        season: 'summer',
    },
    {
        id: '10',
        name: 'Let My People Go Surfing',
        author: 'Yvon Chouinard',
        description : 'Chouinard—climber, businessman, environmentalist—shares tales of courage and persistence from his experience of founding and leading Patagonia, Inc. Full title: Let My People Go Surfing: The Education of a Reluctant Businessman, Including 10 More Years of Business Unusual.',
        poster : './img/book-summer-2.jpg',
        season: 'summer',
    },
    {
        id: '11',
        name: 'The Octopus Museum: Poems',
        author: 'Brenda Shaughnessy',
        description : 'This collection of bold and scathingly beautiful feminist poems imagines what comes after our current age of environmental destruction, racism, sexism, and divisive politics.',
        poster : './img/book-summer-3.jpg',
        season: 'summer',
    },
    {
        id: '12',
        name: 'Shark Dialogues: A Novel',
        author: 'Kiana Davenport',
        description : 'An epic saga of seven generations of one family encompasses the tumultuous history of Hawaii as a Hawaiian woman gathers her four granddaughters together in an erotic tale of villains and dreamers, queens and revolutionaries, lepers and healers.',
        poster : './img/book-summer-4.jpg',
        season: 'summer',
    },
    {
        id: '13',
        name: 'Casual Conversation',
        author: 'Renia White',
        description : 'White\'s impressive debut collection takes readers through and beyond the concepts of conversation and the casual - both what we say to each other and what we don\'t, examining the possibilities around how we construct and communicate identity. ',
        poster : './img/book-autumn-1.jpg',
        season: 'autumn',
    },
    {
        id: '14',
        name: 'The Great Fire',
        author: 'Lou Ureneck',
        description : 'The harrowing story of an ordinary American and a principled Naval officer who, horrified by the burning of Smyrna, led an extraordinary rescue effort that saved a quarter of a million refugees from the Armenian Genocide',
        poster : './img/book-autumn-2.jpg',
        season: 'autumn',
    },
    {
        id: '15',
        name: 'Rickey: The Life and Legend',
        author: 'Howard Bryant',
        description : 'With the fall rolling around, one can\'t help but think of baseball\'s postseason coming up! And what better way to prepare for it than reading the biography of one of the game\'s all-time greatest performers, the Man of Steal, Rickey Henderson?',
        poster : './img/book-autumn-3.jpg',
        season: 'autumn',
    },
    {
        id: '16',
        name: 'Slug: And Other Stories',
        author: 'Megan Milks',
        description : 'Exes Tegan and Sara find themselves chained together by hairballs of codependency. A father and child experience the shared trauma of giving birth to gods from their wounds.',
        poster : './img/book-autumn-4.jpg',
        season: 'autumn',
    },
]

class Favorites extends Observer {
	favorites = []
	constructor(data) {
        super();
		this.container = document.querySelector(".favorites__items")
		if (data instanceof Array && data.length) {
			this.favorites = this.createHtmlElement(data)
		} else {
			throw new Error("Неверные данные")
		}
        this.setButtonStatus();
		this.flag = false;

        this.timerId = null;
	}

	/**
	 * @param {{ id: string, name: string, author: string, description: string,  poster: string, season: 'winter' | 'spring' | 'summer' | 'autumn', button: 'Buy' | 'Own'}[]} data
	 */

	createHtmlElement(data) {
        this.container.replaceChildren()
		const arrFavorites = []
		data.forEach((fav) => {
			const favorite = document.createElement("li");
            favorite.setAttribute("id", `${fav.id}`);
			favorite.classList.add("favorites__book");
			favorite.setAttribute("data-season", fav.season);


			const border = document.createElement("div");
			border.classList.add("book__border");

			const description = document.createElement("div");
			description.classList.add("book__description");

			const title = document.createElement("div");
			title.classList.add("book__title");
			title.textContent = "Staff Picks";

			const name = document.createElement("div");
			name.classList.add("book__name");
			name.textContent = fav.name;

			const author = document.createElement("div");
			author.classList.add("book__author");
			author.textContent = `By ${fav.author}`;

			const about = document.createElement("div");
			about.classList.add("book__about");
			about.innerText = fav.description;

			const button = document.createElement("button");
			button.classList.add("book__button");
            button.addEventListener('click', (e) => {
                this.buttonHandler(e.target)
            })

			const poster = document.createElement("div");
			poster.classList.add("book__poster");

			const image = document.createElement("img");
			image.setAttribute("src", fav.poster);
			image.setAttribute("alt", `poster-${fav.season}`);

			border.append(description, button);
			description.append(title, name, author, about);
			poster.append(image);

			favorite.append(border, poster);

			arrFavorites.push(favorite);
			this.container.append(favorite);
		})
		return arrFavorites;
	}

    setButtonStatus(){
        this.favorites.forEach(fav => {
            const button = fav.querySelector('.book__button');
            if (state.getAuthStatus()){
                const id = state.getUser().books.find(bookId => bookId === fav.id);
                if (id) {
                    button.textContent = 'Own';
                    button.disabled = true;
                } else {
                    button.textContent = 'Buy';
                    button.disabled = false;
                }
            } else {
                button.textContent = 'Buy';
                button.disabled = false;
            }
        })
    }

    buttonHandler(target){
        if (state.getAuthStatus() && !state.getUser().buyCard) {
            popupBuy.showPopup();
        } else if (state.getAuthStatus() && state.getUser().buyCard){
            state.changeUser({
                ...state.getUser(), books: [
                    ...state.getUser().books ,target.parentNode.parentNode.id
                ]})
            this.setButtonStatus()
        } else {
            popupAuth.showPopup = true;
            popupAuth.showPopupAuth(status.LOGIN);
        }
    }

    setVisibleFavorites(id) {
        if (this.flag) {
            clearTimeout(this.timerId)
            this.favorites.forEach((fav) => {
                fav.classList.remove("close");
                fav.classList.remove("start");

                if (fav.getAttribute("data-season") === id) {
                    fav.classList.add("active");
                    fav.addEventListener('animationend', () => this.transitionEndCallback());
                } else {
                    fav.classList.remove("active");
                }
            })
        } else {
            this.flag = true;
            this.favorites.forEach((fav) => {
                fav.classList.add("close");
            })
            this.timerId = setTimeout(() => {
                this.favorites.forEach((fav) => {
                    fav.classList.remove("close");
                    fav.classList.remove("start");
                    if (fav.getAttribute("data-season") === id) {
                        fav.classList.add("active");
                        fav.addEventListener('animationend', () => this.transitionEndCallback());
                    } else {
                        fav.classList.remove("active");
                    }
                })
            }, 300)
        }
    }
    transitionEndCallback() {
        this.flag = false;
    }


    update() {
        this.setButtonStatus()
    }
}


class FavoritesRadioButton{
	checked = null
	constructor() {
		this.buttons = document.querySelectorAll(".filter-list__selector");
		this.setState();

		this.buttons.forEach((btn) => {
			btn.addEventListener("change", (e) => {
                fav.setVisibleFavorites(e.target.id);
			})
		})
	}

	setState() {
		this.checked = document.querySelector('input[name="selector"]:checked');
        fav.favorites.forEach((fav) => {
            if (fav.getAttribute("data-season") === this.checked.id) {
                fav.classList.add("start");
            }
        })
	}
}

const fav = new Favorites(favorites);
const radioButtons = new FavoritesRadioButton();

state.attach(fav)

class Pagination {
    constructor() {
        this.activeDot = 0;
        this.groupButton = null;
        this.countDot = null;

        this.createHtmlElement(slider.countCard, slider.visibleCard)
        this.setActiveDot(this.activeDot);
    }

    createHtmlElement(count, visible) {
        const pagination = document.querySelector('.about__pagination');
        pagination.replaceChildren();

        for (let i = 0; i < (count - visible + 1); i++) {
            const dot = document.createElement('button');
            dot.classList.add('pagination__dot');
            dot.setAttribute('id', i);
            dot.addEventListener('click', (event) => this.buttonClickHandler(event));
            pagination.append(dot);
        }

        this.groupButton = document.querySelectorAll('.pagination__dot');
        this.countDot = this.groupButton.length;
        this.setActiveDot(this.activeDot);
    }

    buttonClickHandler(e) {
        const id = Number(e.target.id);
        slider.setAnimation(this.activeDot, id);
        this.disableButton();
        arrowSlider.disableButton();
        this.setActiveDot(id);
    }

    disableButton () {
        this.groupButton.forEach(btn => btn.disabled = true);
    }

    unDisableButton () {
        const inactiveButtons = [...this.groupButton].filter(btn => this.activeDot !== +btn.id)
        inactiveButtons.forEach(btn => btn.disabled = false);
    }

    setActiveDot(id) {
        if(this.groupButton.length <= id) {
            this.activeDot = this.groupButton.length - 1
        } else {
            this.activeDot = id
        }
        const inactiveButtons = [...this.groupButton].filter(btn => this.activeDot !== +btn.id)
        inactiveButtons.forEach(btn => btn.classList.remove('active'));
        this.groupButton[`${this.activeDot}`].classList.add('active');
    }
}

class ArrowSlider {
    constructor() {
        this.arrows = document.querySelectorAll('.about__arrow');
        this.setAddEventListener(this.arrows);
        this.disableButton();
        this.unDisableButton();
    }

    disableButton() {
        this.arrows.forEach(el => el.disabled = true)
    }

    unDisableButton() {
        if (pagination.activeDot + 1 === pagination.countDot) {
            this.arrows[0].disabled = false
        } else if (pagination.activeDot === 0) {
            this.arrows[1].disabled = false
        } else {
            this.arrows[0].disabled = false
            this.arrows[1].disabled = false
        }
    }

    setAddEventListener(arrows){
        arrows.forEach((el, index) => el.addEventListener('click', () => this.buttonClickHandler(index)));
    }

    buttonClickHandler(index) {
        this.disableButton();
        pagination.disableButton();
        if ((0 >= (pagination.activeDot) && index === 0)){
            this.unDisableButton();
            return;
        }
        if ((0 <= pagination.activeDot) && (pagination.activeDot + 1) <= pagination.countDot  ) {
            if (index === 0) {
                slider.setAnimation(pagination.activeDot, pagination.activeDot - 1);
                pagination.setActiveDot(pagination.activeDot - 1);
            } else if (index === 1) {
                slider.setAnimation(pagination.activeDot, pagination.activeDot + 1);
                pagination.setActiveDot(pagination.activeDot + 1);
            }
        } else {
            this.unDisableButton();
        }
    }
}


class Slider {
    constructor() {
        this.slider = document.querySelector('.about__slider');
        this.sliderContainer = document.querySelector('.about__slider-container');
        this.containerWidth = document.querySelector('.about__container').offsetWidth;
        this.countCard = this.slider.children.length;

        this.gapSlides = this.getGapSlides();
        this.widthSlide = this.getWidthSlide();

        this.visibleCard = this.setVisibleCard();
        this.root = document.documentElement;
        this.setWithSliderContainer();

        this.slider.addEventListener('animationend', () => this.endTransitionHandler());
    }

    setVisibleCard(){
        let overallWidth = window.innerWidth > this.containerWidth ? this.containerWidth : window.innerWidth;
        const count = Math.floor((overallWidth - this.getPaddingX())  / this.getWidthSlideTakingGap());
        return count === 0 ? 1 : count;
    }

    setWithSliderContainer() {
        this.sliderContainer.style.width = `${(this.setVisibleCard() * this.widthSlide) + ((this.setVisibleCard() - 1) * this.gapSlides)}px`;
    }

    setAnimation(activeDot, id) {
        this.root.style.setProperty('--startTr', -(activeDot * this.getWidthSlideTakingGap()));
        this.root.style.setProperty('--endTr', -(id * this.getWidthSlideTakingGap()));
        this.slider.classList.add('transition');
    }

    endTransitionHandler() {
        this.slider.classList.remove('transition');
        this.changePosition()
        pagination.unDisableButton();
        arrowSlider.unDisableButton();
    }

    changePosition() {
        this.slider.style.transform = `translateX(-${pagination.activeDot * this.getWidthSlideTakingGap()}px)`;
    }

    getWidthSlideTakingGap() {
        const widthSlide = this.slider.children[0].offsetWidth;
        return widthSlide + this.getGapSlides();
    }

    getGapSlides() {
        const widthSlide = this.slider.children[0].offsetLeft + this.slider.children[0].getBoundingClientRect().width;
        const nextPositionSlide = this.slider.children[1].offsetLeft;
        return nextPositionSlide - widthSlide;
    }

    getWidthSlide() {
        return this.slider.children[0].offsetWidth;
    }

    getPaddingX() {
        return (window.innerWidth >= 1440) ? 15 : 150
    }
}


const slider = new Slider();
const pagination = new Pagination();
const arrowSlider = new ArrowSlider();


window.addEventListener('resize', function() {
    const visibleCard = slider.setVisibleCard();
    pagination.createHtmlElement(slider.countCard, visibleCard);
    slider.changePosition();
    slider.setWithSliderContainer();
});







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

class PopupAuthHandler {
    constructor() {
        this.content = document.querySelector('.popup-auth__content')
        this.statusPopup = 'login';
        this.clickSubmitButton = false;
    }


    createHtmlElement() {
        const title = document.createElement('h3')
        title.classList.add('popup-auth__title')
        title.textContent = `${this.statusPopup}`

        const form = document.createElement('form')
        form.classList.add('popup-auth__form')

        if (this.statusPopup === status.LOGIN) {
            login.map( data => {
                this.createHtmlFieldElement(data)
                form.append(this.field)
            })
        } else if (this.statusPopup === status.REGISTER) {
            register.map( data => {
                this.createHtmlFieldElement(data)
                form.append(this.field)
            })
        }

        const underForm = document.createElement('div')
        underForm.classList.add('popup-auth__block-button')

        const submitButton = document.createElement('button')
        submitButton.classList.add('popup-auth__button-submit')
        submitButton.setAttribute('type', 'submit')
        submitButton.textContent = `${
            this.statusPopup === 'login' ? 'Log In' :
            this.statusPopup === 'register' ? 'Sign Up' : 'Error'
        }`

        underForm.append(submitButton)

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.clickSubmitButton = true
            if (this.validationForm(form)) {
                this.submitHandler(form)
            }
        })

        form.addEventListener('input', () => {
            this.clickSubmitButton && this.validationForm(form)
        })

        form.append(underForm)

        const subtitle = document.createElement('div');
        subtitle.classList.add('popup-auth__subtitle')
        subtitle.textContent = `${
            this.statusPopup === 'login' ? 'Don’t have an account?' :
            this.statusPopup === 'register' ? 'Already have an account?' : 'Error'
        }`

        const changeStatusButton = document.createElement('button')
        changeStatusButton.textContent = `${
            this.statusPopup === 'login' ? 'Sign Up' :
            this.statusPopup === 'register' ? 'Log In' : 'Error'
        }`
        changeStatusButton.addEventListener('click', () => this.changeStatusFormHandler())
        subtitle.append(changeStatusButton);

        this.content.append(title, form, subtitle)
    }


    submitHandler(form) {
        const candidate = {}

        const allInput = form.querySelectorAll('input')

        allInput.forEach(el => {
                el.id ? candidate[el.id] = el.value : ''
            }
        )
        if (this.statusPopup === status.REGISTER) {
            state.addUser(candidate)
                ? popupAuth.closePopupAuth()
                : this.createErrorOriginalUser(form, 'A user with such an email already exists!')
        } else if (this.statusPopup === status.LOGIN) {
            state.loginUser(candidate)
                ? popupAuth.closePopupAuth()
                : this.createErrorOriginalUser(form, 'Incorrect email, card or password')
        }

        this.clickSubmitButton = false
    }

    validationForm(form) {
        let result = true
        this.deleteErrorOriginalUser()
        const allInput = form.querySelectorAll('input')
        for (const input of allInput) {
            this.deleteError(input)

            if (!input.value.length) {
                this.createError(input, 'The field cannot be empty')
                result = false
            }

            if (input.id === 'firstName' && input.value.length > 15) {
                this.createError(input, 'First name can\'t be more than 15 characters')
                result = false
            }

            if (input.id === 'lastName' && input.value.length > 15) {
                this.createError(input, 'Last name can\'t be more than 15 characters')
                result = false
            }

            if (input.id === 'email' && !/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(input.value)) {
                this.createError(input, 'E-mail should be correct')
                result = false
            }

            if (input.id === 'password' && !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/.test(input.value)) {
                this.createError(input, 'The password should be at least 8 characters, contains lower and upper register, and digit')
                result = false
            }
        }
        return result
    }

    createErrorOriginalUser(form, text) {
        const block = form.querySelector('.popup-auth__block-button')
        if(!block.querySelector('.popup-auth__user-error')) {
            const innerError = document.createElement('p')
            innerError.classList.add('popup-auth__user-error')
            innerError.textContent = text
            block.append(innerError)
        }
    }

    deleteErrorOriginalUser() {
        const block = document.querySelector('.popup-auth__block-button')
        const error = document.querySelector('.popup-auth__user-error')
        if (error) {
            block.removeChild(error)
        }
    }



    createError (input, text) {
        input.classList.add('error')

        if(!input.parentNode.querySelector('.field__error')) {
            const errorField = document.createElement('div')
            errorField.textContent = text
            errorField.classList.add('field__error')
            input.parentNode.append(errorField)
        }
    }

    deleteError (input) {
        input.classList.remove('error')
        if (input.parentNode.childNodes.length === 3) {
            input.parentNode.removeChild(input.parentNode.childNodes[2])
        }
    }

    setStatusPopup (status) {
        this.statusPopup = status;
    }

    getStatusPopup () {
        return this.statusPopup;
    }

    changeStatusFormHandler() {
        this.clickSubmitButton = false;
        this.clearHtmlElement();
        this.getStatusPopup() === status.LOGIN ? this.setStatusPopup(status.REGISTER) : this.setStatusPopup(status.LOGIN)
        this.createHtmlElement();
    }

    clearHtmlElement() {
        this.content.replaceChildren();
    }

    createHtmlFieldElement(data) {
        this.field = document.createElement('div')
        this.field.classList.add('popup__field')

        const label = document.createElement('label')
        label.classList.add('field__label')
        label.setAttribute('for', `${data.id}`)
        label.textContent = `${data.title}`

        const input = document.createElement('input')
        input.classList.add('field__input')
        input.setAttribute('id', `${data.id}`)
        input.setAttribute('type', `${data.type}`)

        this.field.append(label, input)
    }

}






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

class PopupBuy {
    _statusSendSubmit = false;
    constructor() {
        this.popup = document.querySelector('.popup-buy');
        this.form = document.querySelector('.popup-buy__form');
        this.submitBtn = document.querySelector('.popup-buy__button-submit');
        this.errorField = document.querySelector('.popup-buy__error');
        this.inputs = this.form.querySelectorAll('input');

        this.submitBtn.addEventListener('click', (event) => {
            this.setStatusSendSubmit(true);
            this.validationForm(this.form) && this.submitHandler(event);
        })

        this.form.addEventListener('input', (e) => {
            this.autoFloorInput(e.target);
            this.setStatusSubmitBtn();
            this.getStatusSendSubmit() && this.validationForm(this.form);
        })

        this.closeBtn = document.querySelector('.popup-buy__button');

        this.closeBtn.addEventListener('click', () => {
            this.closePopup()
        })
    }



    submitHandler (event) {
        event.stopPropagation();
        /**
         * @type {{readersName: string, readersCard: string }}
         */
        const valuesInputs = {};

        this.inputs.forEach(el => {
                el.id ? valuesInputs[el.id] = el.value : ''
            }
        )

        state.changeUser({...state.getUser(), buyCard: true});
        this.closePopup();

        this.inputs.forEach(el => el.value  = '');
    }

    validationForm() {
        let result = true
        for (const input of this.inputs) {
            this.deleteError(input)

            if (!input.value.length) {
                this.createError(input, 'The field cannot be empty')
                result = false
            }

            if (input.id === 'card' && !/^([0-9\ %]{19})$/.test(input.value)) {
                this.createError(input, 'Number card should be correct')
                result = false
            }

            if ((input.id === 'code1' || input.id === 'code2') && !/^([0-9]{2}$)/.test(input.value)) {
                this.createError(input, 'There must be at least 2 digits')
                result = false
            }

            if (input.id === 'cvc' && !/^([0-9]{3}$)/.test(input.value)) {
                this.createError(input, 'There must be at least 3 digits')
                result = false
            }

            if (input.id === 'code' && !/^(\d{5}(?:[-\s]\d{4})?$)|(^\d{6}$)/.test(input.value)) {
                this.createError(input, 'The format should be хххххх or xxxxx-xxxx')
                result = false
            }
        }
        return result
    }

    validationFormForBtn () {
        let result = true
        for (const input of this.inputs) {
            if (!input.value.length) {
                result = false
            }
        }
        return result
    }

    setStatusSubmitBtn () {
        if (this.validationFormForBtn()) {
            this.submitBtn.disabled = false;
        } else {
            this.submitBtn.disabled = true;
        }
    }

    createError (input, text) {
        input.classList.add('error');
        let errorElement = '';

        if (input.id === 'code1' || input.id === 'code2') {
            errorElement = input.parentNode.parentNode.querySelector('.field__error');
        } else {
            errorElement = input.parentNode.querySelector('.field__error');
        }

        if(!errorElement ) {
            const errorField = document.createElement('div')
            errorField.textContent = text
            errorField.classList.add('field__error')
            if (input.id === 'code1' || input.id === 'code2'){
                input.parentNode.parentNode.append(errorField)
            } else {
                input.parentNode.append(errorField)
            }
        }
    }

    deleteError (input) {
        input.classList.remove('error');
        let errorElement = '';

        if (input.id === 'code1' || input.id === 'code2') {
            errorElement = input.parentNode.parentNode.querySelector('.field__error');
        } else {
            errorElement = input.parentNode.querySelector('.field__error');
        }

        if (errorElement) {
            if (input.id === 'code1' || input.id === 'code2'){
                input.parentNode.parentNode.removeChild(errorElement);
            } else {
                input.parentNode.removeChild(errorElement);
            }
        }
    }

    deleteAllErrors () {
        const inputs = this.form.querySelectorAll('input')
        for (const input of inputs) {
            this.deleteError(input)
        }
    }

    autoFloorInput (input) {
        if (input.id === 'card' || input.id === 'code1' || input.id === 'code2' || input.id === 'cvc') {
            let cardCode = input.value.replace(/[^\d]/g, '').substring(0,16);
            cardCode = cardCode !== '' ? cardCode.match(/.{1,4}/g).join(' ') : '';
            input.value = cardCode;
        } else if (input.id === 'name' || input.id === 'city'){
            input.value = input.value.replace(/[^\D]/g, '').replace(/[a-z, а-я]*/g, txt => txt.toUpperCase())
        } else if (input.id === 'code') {
            input.value = input.value.replace(/[^0-9\-]/, '').substring(0,10);
        }
    }

    setStatusSendSubmit (status) {
        this._statusSendSubmit = status;
    }

    getStatusSendSubmit () {
        return this._statusSendSubmit;
    }

    showPopup () {
        this.popup.classList.add('active');
    }

    closePopup () {
        this.deleteAllErrors();
        this.setStatusSendSubmit(false);
        this.inputs.forEach(el => el.value  = '');
        this.submitBtn.disabled = true;

        this.popup.classList.add('close')
        setTimeout(() => {
            this.popup.classList.remove('active')
            this.popup.classList.remove('close')
        }, 500)
    }
}

const popupBuy = new PopupBuy();

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



