import {isNullOrUndefined} from 'util';
import {ActionType} from '../ActionType';
import {LoginStatus} from '../../model/LoginStatus';
import {COOKIE_PASSWORD, COOKIE_USERNAME} from '../../model/PwrConstants';
import {AbstractAction, ChangeStringValueAction} from '../BaseActions';
import {LoginState} from '../../model/login/LoginState';
import {ChangeLoginStatusAction} from './login-action';

export class LoginReducer {

    public static ChangeUsername(state: LoginState, action: ChangeStringValueAction) {
        return state.loginName(action.value);
    }

    public static ChangePassword(state: LoginState, action: ChangeStringValueAction) {
        return state.loginPass(action.value);
    }

    public static ChangeLoginStatus(state: LoginState, action: ChangeLoginStatusAction) {
        return state.loginStatus(action.status);
    }

    public static LogInUser(state: LoginState, action: AbstractAction): LoginState {
        return state.loginStatus(LoginStatus.SUCCESS);
    }

    public static LogOutUser(state: LoginState): LoginState {
        window.localStorage.removeItem(COOKIE_USERNAME);
        window.localStorage.removeItem(COOKIE_PASSWORD);
        return LoginState.createDefault();
    }


    public static reduce(state: LoginState, action: AbstractAction): LoginState {
        if (isNullOrUndefined(state)) return LoginState.createDefault();
        switch (action.type) {
            case ActionType.ChangeLoginStatus:
                return LoginReducer.ChangeLoginStatus(state, action as ChangeLoginStatusAction);
            case ActionType.ChangeUsername:
                return LoginReducer.ChangeUsername(state, action as ChangeStringValueAction);
            case ActionType.ChangePassword:
                return LoginReducer.ChangePassword(state, action as ChangeStringValueAction);
            case ActionType.LogInUser:
                return LoginReducer.LogInUser(state, action);
            case ActionType.LogOutUser:
                return LoginReducer.LogOutUser(state);
            default:
                return state;
        }
    }

}
