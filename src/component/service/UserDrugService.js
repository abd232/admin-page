
export class UserDrugService {

    getUserDrugs() {
        return fetch('data/userDrug-small.json').then(res => res.json()).then(d => d.data);
    }

    getUserDrugs() {
        return fetch('data/userDrug.json').then(res => res.json()).then(d => d.data);
    }

    getUserDrugsWithOrdersSmall() {
        return fetch('data/userDrug-orders-small.json').then(res => res.json()).then(d => d.data);
    }
}
    