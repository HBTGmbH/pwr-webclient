import {ActionType} from '../ActionType';
import * as redux from 'redux';
import {ApplicationState, PWR_HISTORY} from '../reducerIndex';
import {LoginStatus} from '../../model/LoginStatus';
import {isNullOrUndefined} from 'util';
import {COOKIE_PASSWORD, COOKIE_USERNAME} from '../../model/PwrConstants';
import {Paths} from '../../Paths';
import {ProfileServiceClient} from '../../clients/ProfileServiceClient';
import {PowerApiError} from '../../clients/PowerHttpClient';
import {SkillServiceClient} from '../../clients/SkillServiceClient';
import {CrossCuttingAsyncActionCreator} from '../crosscutting/CrossCuttingAsyncActionCreator';
import {AbstractAction, ChangeStringValueAction} from '../BaseActions';
import {ChangeLoginStatusAction} from './login-action';

const profileServiceClient = ProfileServiceClient.instance();
const skillServiceClient = SkillServiceClient.instance();

export class LoginActionCreator {

    public static ChangeUsername(val: string): ChangeStringValueAction {
        return {
            type: ActionType.ChangeUsername,
            value: val
        };
    }

    public static ChangePassword(val: string): ChangeStringValueAction {
        return {
            type: ActionType.ChangePassword,
            value: val
        };
    }

    public static ChangeLoginStatus(status: LoginStatus): ChangeLoginStatusAction {
        return {
            type: ActionType.ChangeLoginStatus,
            status: status
        };
    }

    public static LogInUser(): AbstractAction {
        return {
            type: ActionType.LogInUser
        };
    }

    public static LogOutUser(): AbstractAction {
        return {
            type: ActionType.LogOutUser
        };
    }

    public static AsyncRestoreFromLocalStorage() {
        return function (dispatch: redux.Dispatch<ApplicationState>) {
            const storedUsername = window.localStorage.getItem(COOKIE_USERNAME);
            const storedPassword = window.localStorage.getItem(COOKIE_PASSWORD);
            Promise.all([
                dispatch(LoginActionCreator.ChangeUsername(storedUsername)),
                dispatch(LoginActionCreator.ChangePassword(storedPassword))]
            ).then(() => dispatch(LoginActionCreator.AsyncValidateAuthentication(storedUsername, storedPassword, true, true)));
        };
    }

    public static AsyncLogOutUser() {
        return function (dispatch: redux.Dispatch<ApplicationState>) {
            PWR_HISTORY.push(Paths.APP_ROOT);
            dispatch(LoginActionCreator.LogOutUser());
        };
    }

    public static AsyncValidateAuthentication(username: string, password: string, rememberLogin?: boolean, restoreRoute?: boolean) {
        return function (dispatch: redux.Dispatch<ApplicationState>) {
            if (isNullOrUndefined(rememberLogin)) {
                rememberLogin = false;
            }
            console.log("Attempting Login!");
            profileServiceClient.authenticateAdmin().then(body => {
                console.log("Login accepted!");
                const rolesArray : String[] = body.roles;
                if (rememberLogin) {
                    localStorage.setItem(COOKIE_USERNAME, username);
                    localStorage.setItem(COOKIE_PASSWORD, password);
                }
                if (rolesArray) {
                    //Login als Admin
                    if (rolesArray.indexOf('ADMIN') >= 0) {
                        dispatch(LoginActionCreator.ChangeLoginStatus(LoginStatus.INITIALS));
                        dispatch(LoginActionCreator.LogInUser());
                        if (!restoreRoute) {
                            PWR_HISTORY.push(Paths.ADMIN_INBOX);
                        }
                        if (window.location.pathname.startsWith('/app/home')) {
                            PWR_HISTORY.push(Paths.ADMIN_INBOX);
                        }
                    } else if (rolesArray.indexOf('USER') >= 0) {
                        //Login als User
                        dispatch(CrossCuttingAsyncActionCreator.AsyncLogInUser(username, Paths.USER_HOME));
                    }
                } else {
                    throw new Error ("User doesn't have a list of roles. " +
                        "An empty array should always be sent in response, even when an existing user has no roles.");
                }
            }).catch((error: PowerApiError) => {
                console.error(error);
                if (error.status != -1) {
                    console.log("Login rejected!");
                    dispatch(LoginActionCreator.ChangeLoginStatus(LoginStatus.REJECTED));
                } else {
                    console.log("Login failed!");
                    dispatch(LoginActionCreator.ChangeLoginStatus(LoginStatus.UNAVAILABLE));
                }
            });
        };
    }
}
