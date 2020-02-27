import {LoginStatus} from '../../model/LoginStatus';
import {AbstractAction} from '../BaseActions';

export interface ChangeLoginStatusAction extends AbstractAction {
    status: LoginStatus;
}
