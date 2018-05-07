import routes from '../routes/routes';
import HeaderIconBase from './header-icon-base';

export default class BackIcon extends HeaderIconBase {
    icon = 'arrow-back';
    action = () => {
        return this.props.action ? this.props.action() : routes.main.back();
    };
}
