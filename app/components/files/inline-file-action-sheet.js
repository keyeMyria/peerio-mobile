import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import { tx } from '../utils/translator';
import { fileState } from '../states';
import routes from '../routes/routes';
import ActionSheetLayout from '../layout/action-sheet-layout';

@observer
export default class InlineFileActionSheet extends SafeComponent {
    static show(file) {
        const { isLegacy } = file;
        const exists = file && !file.isPartialDownload && file.cached;
        const title = exists ? tx('button_open') : tx('button_download');
        const actionButtons = [
            {
                title: 'button_share',
                disabled: isLegacy,
                action: () => {
                    fileState.currentFile = file;
                    routes.modal.shareFileTo();
                }
            },
            {
                title,
                action: () => {
                    if (file.cached) file.launchViewer();
                    else fileState.download(file);
                }
            },
            {
                title: tx('button_move'),
                action: () => {
                    fileState.currentFile = file;
                    routes.modal.moveFileTo();
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
