
export class AdminService {

    getAdminsSmall() {
        return fetch('data/Admins-small.json').then(res => res.json()).then(d => d.data);
    }

    getAdmins() {
        return fetch('data/Admins.json').then(res => res.json()).then(d => d.data);
    }

    getAdminsWithOrdersSmall() {
        return fetch('data/Admins-orders-small.json').then(res => res.json()).then(d => d.data);
    }
}
    