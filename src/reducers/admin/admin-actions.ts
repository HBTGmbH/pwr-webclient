
import {AbstractAction} from '../profile/database-actions';
import {AdminNotification, APIAdminNotification} from '../../model/admin/AdminNotification';
import {RequestStatus} from '../../Store';
import {LoginStatus} from '../../model/LoginStatus';

export interface ReceiveNotifcationsAction extends AbstractAction {
    notifications: Array<APIAdminNotification>;
}

export interface RequestStatusAction extends AbstractAction {
    requestStatus: RequestStatus;
}

export interface NavigateAction extends AbstractAction {
    location: string;
}

export interface ChangeLoginStatusAction extends AbstractAction {
    status: LoginStatus;
}