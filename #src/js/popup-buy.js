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
