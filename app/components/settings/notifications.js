import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ScrollView } from 'react-native';
import Text from '../controls/custom-text';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import SafeComponent from '../shared/safe-component';
import PreferenceToggleItem from './preference-toggle-item';
import SettingsToggleItem from './settings-toggle-item';

const bgStyle = {
    flexGrow: 1,
    flex: 1,
    paddingVertical: vars.listViewPaddingVertical / 2,
    paddingHorizontal: vars.listViewPaddingHorizontal,
    backgroundColor: vars.darkBlueBackground05
};

const spacer = {
    height: 24
};

const text = {
    color: vars.txtMedium,
    marginBottom: vars.spacing.small.midi2x,
    marginLeft: vars.spacing.small.midi2x
};

// const state = PreferenceStore.prefs;

@observer
export default class Notifications extends SafeComponent {
    // Property names can be found in ./preference-store.js
    renderThrow() {
        return (
            <View style={bgStyle}>
                <ScrollView>
                    {/* <PreferenceToggleItem
                        property={'doNotDisturbModeEnabled'}
                        title={tx('title_dndMode')}
                        description={tx('title_dndModeDescription')}
                    /> */}
                    {/* !state.doNotDisturbModeEnabled && */
                        <View>
                            {/* <View style={spacer} />
                            <Text style={text}>{tx('title_notifyOf')}</Text>
                            <PreferenceToggleItem
                                property={'allActivityNotifsEnabled'}
                                title={tx('title_allActivity')}
                            /> */}
                            {/* <PreferenceToggleItem
                                property={'directNotifsEnabled'}
                                title={tx('title_directMessagesAndMentions')}
                            /> */}
                            {/* TODO Specific Keywords implementation */}

                            {/* <View style={spacer} />
                            <Text style={text}>{tx('title_messagePreviewOnLock')}</Text>
                            <PreferenceToggleItem
                                property={'displayMessageContentEnabled'}
                                title={tx('title_displayMessageContent')}
                            /> */}
                            {/* <View style={spacer} /> */}
                            <Text style={text}>{tx('title_playSound')}</Text>
                            <PreferenceToggleItem
                                property="allActivitySoundsEnabled"
                                title={tx('title_allActivity')}
                            />
                        </View>
                    }
                    <View style={spacer} />
                    <Text style={text}>{tx('title_emailNotifs')}</Text>
                    {/* <PreferenceToggleItem
                        property={'allEmailNotifsEnabled'}
                        title={tx('title_allActivity')}
                    /> */}
                    <SettingsToggleItem
                        property="messageNotifications"
                        title={tx('title_forNewMessage')}
                    />
                </ScrollView>
            </View>
        );
    }
}
