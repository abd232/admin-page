
export class UserService {

    getUsersSmall() {
        return fetch('data/Users-small.json').then(res => res.json()).then(d => d.data);
    }

    getUsers() {
        return fetch('data/Users.json').then(res => res.json()).then(d => d.data);
    }

    getUsersWithOrdersSmall() {
        return fetch('data/Users-orders-small.json').then(res => res.json()).then(d => d.data);
    }
}
    