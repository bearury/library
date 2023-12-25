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

@@include('./variables.js')
@@include('./api.js')
@@include('./observer.js')
@@include('./state.js')
@@include('./burger-menu.js')
@@include('./favorites-data.js')
@@include('./favorites.js')
@@include('./cross-review.js')
@@include('./slider.js')
@@include('./profile-icon.js')
@@include('./popup-auth-handler.js')
@@include('./popup-auth.js')
@@include('./popup-menu.js')
@@include('./popup-profile.js')
@@include('./popup-buy.js')
@@include('./library-cards.js')

