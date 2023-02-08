
export class DrugService {

    getDrugsSmall() {
        return fetch('data/products-small.json').then(res => res.json()).then(d => d.data);
    }

    getDrugs() {
        return fetch('data/products.json').then(res => res.json()).then(d => d.data);
    }

    getDrugsWithOrdersSmall() {
        return fetch('data/products-orders-small.json').then(res => res.json()).then(d => d.data);
    }
}
    