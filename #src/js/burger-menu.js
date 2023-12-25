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
