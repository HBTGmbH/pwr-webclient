import {AdminState} from '../../model/admin/AdminState';
import {isNullOrUndefined} from 'util';
import {
    ChangeRequestStatusAction,
    OpenSkillNotificationDialogAction,
    ReceiveAllConsultantsAction,
    ReceiveConsultantAction,
    ReceiveNotificationsAction,
    SetNewSkillNameAction,
    SetSkillNotificationActionAction,
    SetSkillNotificationEditStatusAction
} from './admin-actions';
import {AdminNotification} from '../../model/admin/AdminNotification';
import {ActionType} from '../ActionType';
import {RequestStatus} from '../../Store';
import * as Immutable from 'immutable';
import {ConsultantInfo} from '../../model/ConsultantInfo';
import {APIProfileEntryNotification, ProfileEntryNotification} from '../../model/admin/ProfileEntryNotification';
import {Comparators} from '../../utils/Comparators';
import {APISkillNotification, SkillNotification} from '../../model/admin/SkillNotification';
import {SkillNotificationEditStatus} from '../../model/admin/SkillNotificationEditStatus';
import {SkillNotificationAction} from '../../model/admin/SkillNotificationAction';
import {AbstractAction, ChangeBoolValueAction, ChangeNumberValueAction, ChangeStringValueAction} from '../BaseActions';

export class AdminReducer {

    /**
     * Consumes the given {@link ReceiveNotificationsAction} and replaces all present notifications with the notifications
     * present in the action (after parsing). The action represents a successful request, resulting in the request status
     * of the store set to successful.
     * @param state is the current application state that is not mutated.
     * @param action is the action that is consumed. {@link ReceiveNotificationsAction#notifications} must not be null.
     * @returns {AdminState} a copy of the previous state with {@link AdminState#notifications()} updated and {@link AdminState#requestStatus()} set to
     *          {@link RequestStatus#Successful}
     * @throws TypeError if an invalid action has been provided.
     * @see ReceiveNotificationsAction
     */
    public static ReceiveNotifications(state: AdminState, action: ReceiveNotificationsAction): AdminState {
        if (isNullOrUndefined(action.notifications)) throw new TypeError('ReceiveNotificationAction.notifications must not be null or undefined.');
        let apiProfileEntryNotifications = action.notifications.filter((value, index, array) => value.type === AdminNotification.TP_PROFILE_ENTRY);
        let apiProfileUpdateNotifications = action.notifications.filter(notification => notification.type === AdminNotification.TP_PROFILE_UPDATE);
        let apiSkillNotifications = action.notifications.filter(notification => notification.type === AdminNotification.TP_SKILL);


        let profileEntryNotifications = apiProfileEntryNotifications
            .map(an => ProfileEntryNotification.fromAPI(an as APIProfileEntryNotification))
            .sort((a, b) => Comparators.compareAdminNotification(a.adminNotification(), b.adminNotification()));
        let profileUpdateNotifications = apiProfileUpdateNotifications
            .map(an => AdminNotification.fromAPI(an))
            .sort(Comparators.compareAdminNotification);
        let skillNotifications = apiSkillNotifications
            .map(an => SkillNotification.fromAPI(an as APISkillNotification))
            .sort((a, b) => Comparators.compareAdminNotification(a.adminNotification(), b.adminNotification()));

        return state
            .profileEntryNotifications(Immutable.List<ProfileEntryNotification>(profileEntryNotifications))
            .profileUpdateNotifications(Immutable.List<AdminNotification>(profileUpdateNotifications))
            .skillNotifications(Immutable.List<SkillNotification>(skillNotifications))
            .requestStatus(RequestStatus.Successful);
    }

    /**
     * Consumes the given {@link ReceiveNotificationsAction} and replaces all present trashed notifications with the given
     * notifications. The action represents a successful request, resulting in the {@link AdminState#requestStatus()} set to
     * {@link RequestStatus#Successful}.
     * @param state is the current application state that is not mutated.
     * @param action is the action that is consumed. {@link ReceiveNotificationsAction#notifications} must not be null.
     * @returns {AdminState} a copy of the previous state with {@link AdminState#notifications()} updated and {@link AdminState#requestStatus()} set to
     *          {@link RequestStatus#Successful}
     * @throws TypeError if an invalid action has been provided.
     * @see ReceiveNotificationsAction
     */
    public static ReceiveTrashedNotifications(state: AdminState, action: ReceiveNotificationsAction): AdminState {
        let notifications = action.notifications.map(an => AdminNotification.fromAPI(an));
        return state.trashedNotifications(Immutable.List<AdminNotification>(notifications)).requestStatus(RequestStatus.Successful);
    }


    public static RequestNotificationTrashing(state: AdminState, action: ChangeRequestStatusAction) {
        return state.requestStatus(action.requestStatus);
    }

    public static ReceiveAllConsultants(state: AdminState, action: ReceiveAllConsultantsAction): AdminState {
        let consultants = Immutable.Map<string, ConsultantInfo>();
        action.consultants.forEach((value, index, array) => {
            consultants = consultants.set(value.initials(), value);
        });
        return state.consultantsByInitials(consultants);
    }

    public static ReceiveSingleConsultant(state: AdminState, receiveConsultantAction: ReceiveConsultantAction) {
        let consultants = state.consultantsByInitials().set(receiveConsultantAction.consultant.initials(), receiveConsultantAction.consultant);
        return state.consultantsByInitials(consultants);
    }

    public static SetSkillNotificationEditStatus(state: AdminState, action: SetSkillNotificationEditStatusAction) {
        if (typeof SkillNotificationEditStatus[action.skillNotificationEditStatus] === 'undefined')
            throw new RangeError('Enum value for SkillNotificationEditStatus is out of range: ' + action.skillNotificationEditStatus);
        if (action.skillNotificationEditStatus === SkillNotificationEditStatus.DISPLAY_EDIT_DIALOG) {
            state = state.isSkillNameEdited(true);
        }
        return state.skillNotificationEditStatus(action.skillNotificationEditStatus);
    }

    public static OpenSkillNotificationDialog(state: AdminState, setSkillInfoAction: OpenSkillNotificationDialogAction) {
        let notification = state.skillNotifications().find((value, key, iter) => value.adminNotification().id() === setSkillInfoAction.notificationId);
        return state.selectedSkillNotification(notification).skillNotificationEditStatus(SkillNotificationEditStatus.FETCHING_DATA);
    }

    public static SetSkillNotificationError(state: AdminState, action: ChangeStringValueAction) {
        return state.skillNotificationError(action.value);
    }

    public static SetSkillNotification(state: AdminState, setSkillNotificationAction: SetSkillNotificationActionAction) {

        return state.skillNotificationSelectedAction(setSkillNotificationAction.skillNotificationAction);
    }

    public static reduce(state: AdminState, action: AbstractAction): AdminState {
        if (isNullOrUndefined(state)) return AdminState.createDefault();
        switch (action.type) {
            case ActionType.ReceiveNotifications:
                return AdminReducer.ReceiveNotifications(state, action as ReceiveNotificationsAction);
            case ActionType.ReceiveTrashedNotifications:
                return AdminReducer.ReceiveTrashedNotifications(state, action as ReceiveNotificationsAction);
            case ActionType.AdminRequestStatus:
                return state.requestStatus((action as ChangeRequestStatusAction).requestStatus);
            case ActionType.ReceiveAllConsultants:
                return AdminReducer.ReceiveAllConsultants(state, action as ReceiveAllConsultantsAction);
            case ActionType.ReceiveSingleConsultant:
                return AdminReducer.ReceiveSingleConsultant(state, action as ReceiveConsultantAction);
            case ActionType.SetSkillNotificationEditStatus:
                return AdminReducer.SetSkillNotificationEditStatus(state, action as SetSkillNotificationEditStatusAction);
            case ActionType.CloseAndResetSkillNotificationDlg:
                return state
                    .skillNotificationEditStatus(SkillNotificationEditStatus.CLOSED)
                    .isSkillNameEdited(false)
                    .selectedSkillNotification(null)
                    .skillNotificationError('')
                    .skillNotificationSelectedAction(SkillNotificationAction.ACTION_OK);
            case ActionType.OpenSkillNotificationDialog:
                return AdminReducer.OpenSkillNotificationDialog(state, action as OpenSkillNotificationDialogAction);
            case ActionType.SetSkillNotificationError:
                return AdminReducer.SetSkillNotificationError(state, action as ChangeStringValueAction);
            case ActionType.SetSkillNotificationAction:
                return AdminReducer.SetSkillNotification(state, action as SetSkillNotificationActionAction);
            case ActionType.SetNewSkillName: {
                let act = action as SetNewSkillNameAction;
                return state.selectedSkillNotification(state.selectedSkillNotification().newName(act.name));
            }
            case ActionType.SetReportUploadProgress: {
                let act = action as ChangeNumberValueAction;
                return state.templateUploadProgress(act.value);
            }
            case ActionType.SetReportUploadPending: {
                let act = action as ChangeBoolValueAction;
                return state.templateUploadPending(act.value);
            }
            default:
                return state;
        }
    }

}
