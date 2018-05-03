import HeaderIconBase from './header-icon-base';

export default class MenuIcon extends HeaderIconBase {
    icon = 'more-vert';
    style = { marginRight: -4 };
    action = () => this.props.action();
}
