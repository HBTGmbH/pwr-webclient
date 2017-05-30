import {AdminState} from '../../model/admin/AdminState';
import {AbstractAction} from '../profile/database-actions';
import {isNullOrUndefined} from 'util';
import {NavigateAction, ReceiveNotifcationsAction, TrashNotificationAction} from './admin-actions';
import {AdminNotification} from '../../model/admin/AdminNotification';
import {ActionType} from '../ActionType';
import {RequestStatus} from '../../Store';
import * as Immutable from 'immutable';
import {browserHistory} from 'react-router'

export class AdminReducer {
    public static ReceiveNotifications(state: AdminState, action: ReceiveNotifcationsAction): AdminState {
        let notifications = action.notifications.map(an => AdminNotification.fromAPI(an));
        return state.notifications(Immutable.List<AdminNotification>(notifications)).requestStatus(RequestStatus.Successful);
    }

    public static ReceiveTrashedNotifications(state: AdminState, action: ReceiveNotifcationsAction): AdminState {
        let notifications = action.notifications.map(an => AdminNotification.fromAPI(an));
        return state.trashedNotifications(Immutable.List<AdminNotification>(notifications)).requestStatus(RequestStatus.Successful);
    }

    public static RequestNotificationTrashing(state: AdminState, action: TrashNotificationAction) {
        return state.requestStatus(action.requestStatus);
    }

    public static FailRequest(state: AdminState): AdminState {
        return state.requestStatus(RequestStatus.Failiure);
    }

    public static PendRequest(state: AdminState): AdminState {
        return state.requestStatus(RequestStatus.Pending);
    }

    public static NaviagateTo(state: AdminState, action: NavigateAction) {
        browserHistory.push(action.location);
        return state;
    }


    public static reduce(state : AdminState, action: AbstractAction) : AdminState {
        if(isNullOrUndefined(state)) {
            return AdminState.createDefault();
        }
        switch(action.type) {
            case ActionType.ReceiveNotifications:
                return AdminReducer.ReceiveNotifications(state, action as ReceiveNotifcationsAction);
            case ActionType.RequestTrashedNotifications:
            case ActionType.RequestNotifications:
                return AdminReducer.PendRequest(state);
            case ActionType.FailRequestTrashedNotifications:
            case ActionType.FailRequestNotifications:
                return AdminReducer.FailRequest(state);
            case ActionType.ReceiveTrashedNotifications:
                return AdminReducer.ReceiveTrashedNotifications(state, action as ReceiveNotifcationsAction);
            case ActionType.RequestNotificationTrashing:
                return AdminReducer.RequestNotificationTrashing(state, action as TrashNotificationAction);
            case ActionType.AdminNavigate:
                return AdminReducer.NaviagateTo(state, action as NavigateAction);
            default:
                return state;
        }
    }
}