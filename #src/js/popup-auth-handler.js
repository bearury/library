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




