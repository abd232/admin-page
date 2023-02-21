
export class MoneyService {

    getMoneysSmall() {
        return fetch('data/money-small.json').then(res => res.json()).then(d => d.data);
    }

    getMoneys() {
        return fetch('data/money.json').then(res => res.json()).then(d => d.data);
    }

    getMoneysWithOrdersSmall() {
        return fetch('data/money-orders-small.json').then(res => res.json()).then(d => d.data);
    }
}
    