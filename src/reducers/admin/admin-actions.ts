import {AbstractAction} from '../profile/database-actions';
import {AdminNotification, APIAdminNotification} from '../../model/admin/AdminNotification';
import {RequestStatus} from '../../Store';
import {LoginStatus} from '../../model/LoginStatus';
import {ConsultantInfo} from '../../model/ConsultantInfo';
import {APISkillCategory, APISkillServiceSkill, SkillCategoryNode} from '../../model/admin/SkillTree';
import {ActionType} from '../ActionType';

/**
 * Represents an action where an array of {@link APIAdminNotification} is received from an external source and parsed.
 * These notifications will replace all existing notifications, no delta checks are performed, and the request status will be
 * set to successful.
 *
 * {@link ReceiveNotificationsAction#notifications} must not be null, otherwise, an exception is thrown
 * in the reducer.
 *
 * {@link ReceiveNotificationsAction#notifications} do not need any predefined order, as the resulting {@link AdminNotification}
 * objects will be sorted in their natural order
 *
 * For more behaviour, see {@link AdminReducer#ReceiveNotifications}.
 *
 * Can either have {@link ActionType#ReceiveNotifications} or {@link ActionType#ReceiveTrashedNotifications}
 */
export interface ReceiveNotificationsAction extends AbstractAction {
    type: ActionType.ReceiveNotifications | ActionType.ReceiveTrashedNotifications;
    notifications: Array<APIAdminNotification>;
}

/**
 * Represents an action where the {@link AdminState#requestStatus} is changed to the given {@link RequestStatus}
 */
export interface ChangeRequestStatusAction extends AbstractAction {
    requestStatus: RequestStatus;
}

export interface NavigateAction extends AbstractAction {
    location: string;
}

export interface ChangeLoginStatusAction extends AbstractAction {
    status: LoginStatus;
}

export interface ReceiveAllConsultantsAction extends AbstractAction {
    consultants: Array<ConsultantInfo>;
}

export interface ReceiveConsultantAction extends AbstractAction {
    consultant: ConsultantInfo;
}

export interface ReceiveSkillCategoryAction extends AbstractAction {
    skillCategory: APISkillCategory;
}

export interface SetSkillTreeAction extends AbstractAction {
    rootNode: SkillCategoryNode;
}

export interface AddSkillsToTreeAction extends AbstractAction {
    skills: Array<APISkillServiceSkill>;
}