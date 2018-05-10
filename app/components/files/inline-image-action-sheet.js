import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import { tx } from '../utils/translator';
import { fileState } from '../states';
import routerModal from '../routes/router-modal';
import ActionSheetLayout from '../layout/action-sheet-layout';
import { config } from '../../lib/icebear';

@observer
export default class InlineImageActionSheet extends SafeComponent {
    static show(file) {
        const { isLegacy } = file;
        const exists = file && !file.isPartialDownload && file.tmpCached;
        const title = exists ? tx('button_open') : tx('button_download');
        const actionButtons = [
            {
                title: 'button_share',
                disabled: isLegacy,
                action: () => {
                    fileState.currentFile = file;
                    routerModal.shareFileTo();
                }
            },
            {
                title,
                action: () => {
                    if (file.tmpCached) config.FileStream.launchViewer(file.tmpCachePath);
                    else file.tryToCacheTemporarily(true);
                }
            },
            {
                title: 'button_delete',
                isDestructive: true,
                action: async () => {
                    const result = await fileState.deleteFile(file);
                    if (result) ActionSheetLayout.hide();
                }
            }
        ];
        ActionSheetLayout.show({
            hasCancelButton: true,
            actionButtons
        });
    }
}
