import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import ContactList from '../contacts/contact-list';
import SafeComponent from '../shared/safe-component';

@observer
export default class MockContactList extends SafeComponent {
    renderThrow() {
        return (
            <View style={{ backgroundColor: 'white', flex: 1, flexGrow: 1 }}>
                <ContactList />
            </View>
        );
    }
}
