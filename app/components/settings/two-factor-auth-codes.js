import React from 'react';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';
import { View, Text, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import FileOpener from 'react-native-file-opener';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import buttons from '../helpers/buttons';
import { User } from '../../lib/icebear';
import routes from '../routes/routes';

const paddingVertical = vars.listViewPaddingVertical;
const paddingHorizontal = vars.listViewPaddingHorizontal;

const bgStyle = {
    flexGrow: 1,
    flex: 1,
    paddingVertical,
    paddingHorizontal,
    backgroundColor: vars.settingsBg
};

const headerStyle = {
    color: vars.txtDark,
    fontWeight: 'bold',
    fontSize: vars.font.size.bigger,
    marginLeft: vars.spacing.normal
};

const infoStyle = {
    color: vars.txtDark,
    marginLeft: vars.spacing.normal,
    marginVertical: vars.spacing.xLarge
};

const labelStyle = {
    color: vars.txtDate,
    marginBottom: vars.spacing.small,
    fontSize: vars.font.size.smaller,
    marginLeft: vars.spacing.normal
};

const whiteStyle = {
    backgroundColor: vars.white, paddingVertical: vars.spacing.big, paddingHorizontal
};

const row = { flexDirection: 'row' };

const rowRight = [row, { justifyContent: 'flex-end', marginTop: vars.spacing.bigger }];

const column = { flex: 0.5, alignItems: 'center' };

const textStyle = { color: vars.txtDark, fontWeight: 'bold', marginVertical: vars.spacing.big };

/*
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function formatTableHTML(codes) {
    let result = '';
    for (let i = 1; i < codes.length; i += 2) {
        result += `<tr><td>${codes[i - 1]}</td><td>${codes[i]}</td></tr>`;
    }
    result = `<table>${result}</table>`;
    return result;
}
*/

function formatTableTxt(codes) {
    return `Your backup codes: \n\n${codes.join('\n')}`;
}

@observer
export default class TwoFactorAuthCodes extends SafeComponent {
    @observable codes = [];

    componentDidMount() {
        this.codes = this.props.codes || this.randomCodes;
    }

    get randomCodes() {
        const count = 12;
        const result = [];
        for (let i = 0; i < count; ++i) {
            result.push(Math.floor(Math.random() * 899999) + 100000);
        }
        return result;
    }

    async downloadCodes() {
        let mimeType = 'application/pdf';
        let filePath = '';

        // if (Platform.OS === 'android') {
        mimeType = 'text/plain';
        filePath = `${Platform.OS === 'android' ? RNFS.ExternalDirectoryPath : RNFS.DocumentDirectoryPath}/backup codes for ${User.current.username}.txt`;
        await RNFS.writeFile(filePath, formatTableTxt(this.codes), 'utf8');
        /* } else {
            const html = formatTableHTML(this.codes);
            filePath = (await RNHTMLtoPDF.convert({ html })).filePath;
        } */
        console.log(filePath);
        await FileOpener.open(filePath, mimeType);
        // await RNFS.unlink(filePath);
    }

    disable2fa() {
        User.current.disable2fa();
        routes.main.settings('security');
    }

    renderThrow() {
        return (
            <View style={bgStyle}>
                <View>
                    <Text style={headerStyle}>
                        {tx('title_2FABackupCode')}
                    </Text>
                    <Text style={infoStyle}>
                        {
`Save these backup codes in a safe place so that you
still login if you're unable to access your
authenticator app.`}
                    </Text>
                    <Text style={labelStyle}>
                        {tx('title_2FABackupCode')}
                    </Text>
                </View>
                <View style={whiteStyle}>
                    <View style={row}>
                        <View style={column}>
                            {this.codes.slice(0, this.codes.length / 2).map(i =>
                                <Text style={textStyle} key={i}>{i}</Text>
                            )}
                        </View>
                        <View style={column}>
                            {this.codes.slice(this.codes.length / 2, this.codes.length).map(i =>
                                <Text style={textStyle} key={i}>{i}</Text>
                            )}
                        </View>
                    </View>
                    <View style={rowRight}>
                        {buttons.uppercaseBlueButton(tx('title_download'), () => this.downloadCodes())}
                    </View>
                </View>
                <View style={{ left: paddingHorizontal + 12, bottom: paddingVertical, position: 'absolute' }}>
                    {buttons.uppercaseRedButton('button_2FADeactivate', this.disable2fa)}
                </View>
            </View>
        );
    }
}
