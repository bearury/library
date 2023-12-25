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






