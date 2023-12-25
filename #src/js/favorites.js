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
