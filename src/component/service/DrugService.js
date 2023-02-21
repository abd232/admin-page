
export class DrugService {

    getDrugsSmall() {
        return fetch('data/drugs-small.json').then(res => res.json()).then(d => d.data);
    }

    getDrugs() {
        return fetch('data/drugs.json').then(res => res.json()).then(d => d.data);
    }

    getDrugsWithOrdersSmall() {
        return fetch('data/drugs-orders-small.json').then(res => res.json()).then(d => d.data);
    }
}
    