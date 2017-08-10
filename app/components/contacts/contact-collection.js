import { DeviceEventEmitter } from 'react-native';
import { observable, action, when } from 'mobx';
import RNContacts from 'react-native-contacts';
import RoutedState from '../routes/routed-state';
import { contactStore, warnings, chatStore, User } from '../../lib/icebear';
import { tx } from '../utils/translator';
import fileState from '../files/file-state';
import chatState from '../messaging/chat-state';
import { loadGroupSettings } from './contacts-groups';
import contactAddState from './contact-add-state';

class MappedCollection {
    getKey(item) {
        throw new Error('Must override getKey');
    }

    @observable items = [];
    @observable itemsMap = observable.shallowMap();

    findByItemKey(item) {
        return this.findByKey(this.getKey(item));
    }

    findByKey(key) {
        return this.items.filter(i => this.getKey(i) === key);
    }

    exists(item) {
        return !!this.findByKey(this.getKey(item)).length;
    }

    @action add(item) {
        if (this.exists(item)) return;
        this.items.push(item);
        this.itemsMap.set(this.getKey(item), item);
    }

    @action remove(item) {
        const existing = this.items.filter(i => this.getKey(i) === this.getKey(item));
        existing.forEach(e => {
            const i = this.items.indexOf(e);
            if (i === -1) return;
            this.items.splice(i, 1);
        });
        this.itemsMap.delete(this.getKey(item));
    }

    @action toggle(c) {
        this.exists(c) ? this.remove(c) : this.add(c);
    }

    @action clear() {
        this.items = [];
        this.itemsMap.clear();
    }
}

export default class ContactCollection extends MappedCollection {
    getKey(item) {
        return item.username;
    }
}