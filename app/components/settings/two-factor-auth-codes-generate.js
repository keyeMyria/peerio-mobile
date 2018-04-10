import React from 'react';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';
import { View, Text } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import buttons from '../helpers/buttons';
import { User } from '../../lib/icebear';
import routes from '../routes/routes';
import TwoFactorAuthCodes from './two-factor-auth-codes';

const paddingVertical = vars.listViewPaddingVertical;
const paddingHorizontal = vars.listViewPaddingHorizontal;

const bgStyle = {
    flexGrow: 1,
    flex: 1,
    paddingVertical,
    paddingHorizontal,
    backgroundColor: vars.darkBlueBackground05
};

const headerStyle = {
    color: vars.txtDark,
    fontWeight: 'bold',
    fontSize: vars.font.size.bigger,
    marginLeft: vars.spacing.small.midi2x
};

const buttonCenterStyle = {
    marginVertical: paddingVertical,
    flexDirection: 'row',
    justifyContent: 'center'
};

@observer
export default class TwoFactorAuthCodesGenerate extends SafeComponent {
    @observable backupCodes;

    disable2fa() {
        User.current.disable2fa();
        routes.main.settings('security');
    }

    async reissueCodes() {
        this.backupCodes = await User.current.reissueBackupCodes();
    }

    renderThrow() {
        if (this.backupCodes) return <TwoFactorAuthCodes codes={this.backupCodes} />;
        return (
            <View style={bgStyle}>
                <View>
                    <Text style={headerStyle}>
                        {tx('title_2FAEnabled')}
                        {tx('title_2FABackupCode')}
                    </Text>
                    <View style={buttonCenterStyle}>
                        {buttons.uppercasePeerioBlueButton(
                            tx('button_2FAGenerateCodes'),
                            () => this.reissueCodes(),
                            null,
                            { width: vars.wideRoundedButtonWidth })}
                    </View>
                </View>
                <View style={{ left: paddingHorizontal + 12, bottom: paddingVertical, position: 'absolute' }}>
                    {buttons.uppercaseRedButton('button_2FADeactivate', this.disable2fa)}
                </View>
            </View>
        );
    }
}
