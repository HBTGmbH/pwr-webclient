import {ActionType} from '../ActionType';
import {APIAdminNotification} from '../../model/admin/AdminNotification';
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
import * as redux from 'redux';
import {ApplicationState} from '../reducerIndex';
import {RequestStatus} from '../../Store';
import {ConsultantInfo} from '../../model/ConsultantInfo';
import {StatisticsActionCreator} from '../statistics/StatisticsActionCreator';
import {isNullOrUndefined} from 'util';
import {Paths} from '../../Paths';
import {ProfileEntryNotification} from '../../model/admin/ProfileEntryNotification';
import {SkillNotificationEditStatus} from '../../model/admin/SkillNotificationEditStatus';
import {APISkillServiceSkill} from '../../model/skill/SkillServiceSkill';
import {SkillActionCreator} from '../skill/SkillActionCreator';
import {APISkillCategory} from '../../model/skill/SkillCategory';
import {SkillNotificationAction} from '../../model/admin/SkillNotificationAction';
import {NavigationActionCreator} from '../navigation/NavigationActionCreator';
import {ProfileServiceClient} from '../../clients/ProfileServiceClient';
import {SkillServiceClient} from '../../clients/SkillServiceClient';
import {Alerts} from '../../utils/Alerts';
import {CrossCuttingAsyncActionCreator} from '../crosscutting/CrossCuttingAsyncActionCreator';
import {SuggestionAsyncActionCreator} from '../suggestions/SuggestionAsyncActionCreator';
import {AbstractAction, ChangeBoolValueAction, ChangeNumberValueAction, ChangeStringValueAction} from '../BaseActions';
import {makeDeferrable} from '../deferred/AsyncActionUnWrapper';

const profileServiceClient = ProfileServiceClient.instance();
const skillServiceClient = SkillServiceClient.instance();

export class AdminActionCreator {

    public static ReceiveNotifications(notifications: Array<APIAdminNotification>): ReceiveNotificationsAction {
        return {
            type: ActionType.ReceiveNotifications,
            notifications: notifications
        };
    }

    public static ReceiveTrashedNotifications(notifications: Array<APIAdminNotification>): ReceiveNotificationsAction {
        return {
            type: ActionType.ReceiveTrashedNotifications,
            notifications: notifications
        };
    }

    public static ChangeRequestStatus(to: RequestStatus): ChangeRequestStatusAction {
        return {
            type: ActionType.AdminRequestStatus,
            requestStatus: to
        };
    }

    public static ReceiveAllConsultants(consultants: Array<ConsultantInfo>): ReceiveAllConsultantsAction {
        return {
            type: ActionType.ReceiveAllConsultants,
            consultants: consultants
        };
    }

    public static ReceiveConsultant(consultant: ConsultantInfo): ReceiveConsultantAction {
        return {
            type: ActionType.ReceiveSingleConsultant,
            consultant: consultant
        };
    }

    public static SetSkillNotificationEditStatus(skillNotificationEditStatus: SkillNotificationEditStatus): SetSkillNotificationEditStatusAction {
        return {
            type: ActionType.SetSkillNotificationEditStatus,
            skillNotificationEditStatus: skillNotificationEditStatus
        };
    }

    public static CloseAndResetSkillNotificationDlg(): AbstractAction {
        return {
            type: ActionType.CloseAndResetSkillNotificationDlg
        };
    }

    public static OpenSkillNotificationDialog(notificationId: number): OpenSkillNotificationDialogAction {
        return {
            type: ActionType.OpenSkillNotificationDialog,
            notificationId: notificationId
        };
    }

    public static SetSkillNotificationErrorText(text: string): ChangeStringValueAction {
        return {
            type: ActionType.SetSkillNotificationError,
            value: text
        };
    }

    public static SetSkillNotificationAction(action: SkillNotificationAction): SetSkillNotificationActionAction {
        return {
            type: ActionType.SetSkillNotificationAction,
            skillNotificationAction: action
        };
    }

    public static AsyncNavigateToStatistics() {
        return function (dispatch: redux.Dispatch<ApplicationState>) {
            dispatch(StatisticsActionCreator.AsyncRequestSkillUsages());
            dispatch(NavigationActionCreator.AsyncNavigateTo(Paths.ADMIN_STATISTICS_SKILL));
        };
    }

    public static AsyncNavigateToNetwork() {
        return function (dispatch: redux.Dispatch<ApplicationState>) {
            dispatch(StatisticsActionCreator.AsyncRequestNetwork());
            dispatch(NavigationActionCreator.AsyncNavigateTo(Paths.ADMIN_STATISTICS_NETWORK));
        };
    }

    public static SetNewSkillName(newName: string): SetNewSkillNameAction {
        return {
            type: ActionType.SetNewSkillName,
            name: newName
        };
    }

    public static SetFilterNonCustomSkills(doFilter: boolean): ChangeBoolValueAction {
        return {
            type: ActionType.SetCustomSkillFiltering,
            value: doFilter
        };
    }

    public static SetReportUploadPending(pending: boolean): ChangeBoolValueAction {
        return {
            type: ActionType.SetReportUploadPending,
            value: pending
        };
    }

    public static SetReportUploadProgress(progress: number): ChangeNumberValueAction {
        return {
            type: ActionType.SetReportUploadProgress,
            value: progress
        };
    }


    public static AsyncRequestNotifications() {
        return function (dispatch: redux.Dispatch<ApplicationState>) {
            profileServiceClient.getAdminNotifications()
                .then(notifications => dispatch(AdminActionCreator.ReceiveNotifications(notifications)))
                .catch(console.error);
        };
    }

    public static AsyncRequestTrashedNotifications(username: string, password: string) {
        return function (dispatch: redux.Dispatch<ApplicationState>) {
            profileServiceClient.getTrashedAdminNotifications()
                .then(notifications => dispatch(AdminActionCreator.ReceiveTrashedNotifications(notifications)))
                .catch(console.error);
        };
    }

    public static AsyncTrashNotifications(ids: Array<number>) {
        return function (dispatch: redux.Dispatch<ApplicationState>) {
            profileServiceClient.trashNotifications(ids)
                .then(() => {
                    dispatch(AdminActionCreator.AsyncRequestNotifications());
                    NavigationActionCreator.showSuccess(ids.length + ' notifications successfully trashed.');
                })
                .catch(console.error);
        };
    }

    public static AsyncDeleteTrashed(username: string, password: string) {
        return function (dispatch: redux.Dispatch<ApplicationState>) {
            profileServiceClient.deleteTrashedNotifications()
                .then(ignored => {
                    dispatch(AdminActionCreator.AsyncRequestTrashedNotifications(username, password));
                    Alerts.showSuccess('Notifications successfully deleted!');
                }).catch(console.error);
        };
    }

    public static AsyncNavigateToInbox(username: string, password: string) {
        return function (dispatch: redux.Dispatch<ApplicationState>) {
            dispatch(AdminActionCreator.AsyncRequestNotifications());
            dispatch(NavigationActionCreator.AsyncNavigateTo(Paths.ADMIN_INBOX));
        };
    }

    public static AsyncNavigateToTrashbox(username: string, password: string) {
        return function (dispatch: redux.Dispatch<ApplicationState>) {
            dispatch(AdminActionCreator.AsyncRequestTrashedNotifications(username, password));
            dispatch(NavigationActionCreator.AsyncNavigateTo(Paths.ADMIN_TRASHBOX));
        };
    }

    public static AsyncNotificationInvokeDelete(notificationId: number) {
        return function (dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            profileServiceClient.invokeNotificationDelete(notificationId)
                .then(() => dispatch(AdminActionCreator.AsyncRequestNotifications()))
                .then(() => Alerts.showSuccess('Success'))
                .catch(console.error);
        };
    }

    public static AsyncNotificationInvokeOK(notificationId: number) {
        return function (dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            profileServiceClient.invokeNotificationOK(notificationId)
                .then(() => dispatch(AdminActionCreator.AsyncRequestNotifications()))
                .then(() => Alerts.showSuccess('Success'))
                .catch(console.error);
        };
    }

    public static AsyncNotificationInvokeEdit(notification: ProfileEntryNotification) {
        return function (dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            profileServiceClient.invokeNotificationEdit(notification)
                .then(() => dispatch(AdminActionCreator.AsyncRequestNotifications()))
                .then(() => Alerts.showSuccess('Success'))
                .catch(console.error);
        };
    }

    public static AsyncNotificationInvokeSkillEdit() {
        return function (dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            dispatch(AdminActionCreator.CloseAndResetSkillNotificationDlg());
            profileServiceClient.invokeNotificationEdit(getState().adminReducer.selectedSkillNotification())
                .then(() => dispatch(AdminActionCreator.AsyncRequestNotifications()))
                .then(() => Alerts.showSuccess('Success'))
                .catch(console.error);
        };
    }

    public static AsyncGetAllConsultants() {
        return function (dispatch: redux.Dispatch<ApplicationState>) {
            profileServiceClient.getConsultants()
                .then(apiConsultants => apiConsultants.map((value, index, array) => ConsultantInfo.fromAPI(value)))
                .then(consultants => dispatch(AdminActionCreator.ReceiveAllConsultants(consultants)))
                .catch(console.error);
        };
    }

    public static AsyncRedirectToUser(initials: string) {
        return function (dispatch: redux.Dispatch<ApplicationState>) {
            dispatch(CrossCuttingAsyncActionCreator.AsyncLogInUser(initials, Paths.USER_HOME));
        };
    }

    public static AsyncLoadConsultant(initials: string) {
        return function (dispatch: redux.Dispatch<ApplicationState>) {
            profileServiceClient.getConsultant(initials)
                .then(res => dispatch(AdminActionCreator.ReceiveConsultant(ConsultantInfo.fromAPI(res))))
                .catch(console.error);
        };
    }

    public static AsyncCreateConsultant(consultantInfo: ConsultantInfo) {
        return function (dispatch: redux.Dispatch<ApplicationState>) {
            let apiConsultant = consultantInfo.toAPI();
            profileServiceClient.createConsultant(apiConsultant)
                .then(value => dispatch(AdminActionCreator.AsyncLoadConsultant(consultantInfo.initials())))
                .then(() => Alerts.showSuccess('Created consultant ' + consultantInfo.initials()))
                .catch(console.error);
        };
    }

    public static AsyncUpdateConsultant(consultantInfo: ConsultantInfo) {
        return function (dispatch: redux.Dispatch<ApplicationState>) {
            let apiConsultant = consultantInfo.toAPI();
            profileServiceClient.updateConsultant(apiConsultant)
                .then(consultant => dispatch(AdminActionCreator.ReceiveConsultant(ConsultantInfo.fromAPI(consultant))))
                .then(ingored => Alerts.showSuccess('Consultant ' + apiConsultant.initials + ' updated!'))
                .catch(console.error);
        };
    }

    public static AsyncOpenSkillNotificationDialog(notificationId: number) {
        return function (dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            dispatch(AdminActionCreator.OpenSkillNotificationDialog(notificationId));
            let notification = getState().adminReducer.skillNotifications().find(value => value.adminNotification().id() == notificationId);
            skillServiceClient.getSkillByName(notification.skill().name())
                .then(skill => {
                    if (isNullOrUndefined(skill.category)) {
                        dispatch(AdminActionCreator.SetSkillNotificationEditStatus(SkillNotificationEditStatus.DISPLAY_INFO_NO_CATEGORY));
                    } else {
                        dispatch(SkillActionCreator.ReadSkillHierarchy(skill));
                        dispatch(AdminActionCreator.SetSkillNotificationEditStatus(SkillNotificationEditStatus.DISPLAY_INFO_CATEGORY));
                    }
                })
                .catch(error => {
                    console.error(error);
                    dispatch(AdminActionCreator.SetSkillNotificationEditStatus(SkillNotificationEditStatus.DISPLAY_ERROR));
                });
        };
    };

    private static skillAround = (category: APISkillCategory, skillName: string): APISkillServiceSkill => {
        return {'id': -1, 'category': category, 'qualifier': skillName, versions: []};
    };

    /**
     * Transition from DISPLAY_INFO_NO_CATEGORY to CATEGORY_PENDING
     * @param skillName
     * @returns a thunk for thunk middleware
     */
    public static AsyncCategorizeSkill(skillName: string) {
        return function (dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            let ApplicationState = getState().adminReducer;
            let allowedStates = [SkillNotificationEditStatus.DISPLAY_INFO_NO_CATEGORY, SkillNotificationEditStatus.DISPLAY_EDIT_DIALOG];
            if (allowedStates.indexOf(ApplicationState.skillNotificationEditStatus()) === -1) {
                throw new RangeError('Invalid status for AsyncCategorizeSkill. Expected one of ' + allowedStates);
            } else {
                skillServiceClient.categorizeSkill(skillName)
                    .then(category => AdminActionCreator.skillAround(category, skillName))
                    .then(skill => dispatch(SkillActionCreator.ReadSkillHierarchy(skill)))
                    .then(() => dispatch(AdminActionCreator.SetSkillNotificationEditStatus(SkillNotificationEditStatus.DISPLAY_INFO_CATEGORY)))
                    .catch(error => {
                        console.error(error);
                        if (!isNullOrUndefined(error.response)) {
                            dispatch(AdminActionCreator.SetSkillNotificationErrorText('ERR_' + error.response.status));
                        } else {
                            dispatch(AdminActionCreator.SetSkillNotificationErrorText('ERR_UNKNOWN'));
                        }
                        dispatch(AdminActionCreator.SetSkillNotificationEditStatus(SkillNotificationEditStatus.DISPLAY_INFO_CATEGORY_ERROR));
                    });
            }
        };
    }

    /**
     * Progresses the state machine from the action selection in the skill notification dialog
     * @constructor
     */
    public static AsyncProgressFromActionSelection() {
        return function (dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            let ApplicationState = getState().adminReducer;
            let allowedStates = [SkillNotificationEditStatus.DISPLAY_INFO_CATEGORY,
                SkillNotificationEditStatus.DISPLAY_INFO_CATEGORY_ERROR,
                SkillNotificationEditStatus.DISPLAY_INFO_NO_CATEGORY];
            if (allowedStates.indexOf(ApplicationState.skillNotificationEditStatus()) === -1) {
                throw new RangeError('Invalid status for AsyncProgressFromActionSelection. Expected one of ' + allowedStates);
            } else {
                if (ApplicationState.skillNotificationSelectedAction() === SkillNotificationAction.ACTION_OK) {
                    dispatch(AdminActionCreator.AsyncNotificationInvokeOK(ApplicationState.selectedSkillNotification().adminNotification().id()));
                    dispatch(AdminActionCreator.CloseAndResetSkillNotificationDlg());
                } else if (ApplicationState.skillNotificationSelectedAction() === SkillNotificationAction.ACTION_DELETE) {
                    dispatch(AdminActionCreator.AsyncNotificationInvokeDelete(ApplicationState.selectedSkillNotification().adminNotification().id()));
                    dispatch(AdminActionCreator.CloseAndResetSkillNotificationDlg());
                } else if (ApplicationState.skillNotificationSelectedAction() === SkillNotificationAction.ACTION_EDIT) {
                    dispatch(AdminActionCreator.SetSkillNotificationEditStatus(SkillNotificationEditStatus.DISPLAY_EDIT_DIALOG));
                } else {
                    throw new RangeError('Invalid value for skillNotificationSelectedAction. Was:' + SkillNotificationEditStatus[ApplicationState.skillNotificationSelectedAction()]);
                }
            }
        };
    }

    public static AsyncChangeSkillName(oldName: string, newName: string) {
        return function (dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            profileServiceClient.renameSkill(oldName, newName)
                .then(() => dispatch(SuggestionAsyncActionCreator.requestAllSkills()))
                .then(() => Alerts.showSuccess('Renamed ' + oldName + ' to ' + newName))
                .catch(console.error);
        };
    }

    @makeDeferrable(ActionType.AsyncDeleteEntry)
    public static AsyncDeleteConsultant(initials: string) {
        return function (dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            profileServiceClient.deleteConsultant(initials)
                .then(() => dispatch(AdminActionCreator.AsyncGetAllConsultants()))
                .then(() => Alerts.showSuccess(`Deleted Consultant ${initials}! Good Bye!`))
                .catch((error) => Alerts.showError(error));
        };

    }
}
