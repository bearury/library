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
