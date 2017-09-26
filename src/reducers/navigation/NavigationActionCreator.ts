import {AbstractAction} from '../profile/database-actions';
import {ActionType} from '../ActionType';
import * as redux from 'redux';
import {ApplicationState} from '../reducerIndex';
import {Paths} from '../../Paths';
import {ProfileActionCreator} from '../profile/ProfileActionCreator';
import {browserHistory} from 'react-router';
import {COOKIE_INITIALS_NAME} from '../../model/PwrConstants';
import * as Cookies from 'js-cookie';
import {ViewProfileActionCreator} from '../view/ViewProfileActionCreator';

export interface SetNavigationTargetAction extends AbstractAction {
    target: string;
}

export interface SetCurrentLocationAction extends AbstractAction {
    currentLocation: string;
}

export namespace NavigationActionCreator {

    /**
     * Sets the navigation target for an intercepted navigation action.
     * Continue or drop are possible when a target is set.
     * @param target
     * @returns {{type: ActionType, target: string}}
     * @constructor
     */
    function SetNavigationTarget(target: string): SetNavigationTargetAction {
        return {
            type: ActionType.SetNavigationTarget,
            target: target
        }
    }

    function SetCurrentLocation(location: string): SetCurrentLocationAction {
        return {
            type: ActionType.SetCurrentLocation,
            currentLocation: location
        }
    }

    export function DropNavigationTarget(): AbstractAction {
        return {
            type: ActionType.DropNavigationTarget
        }
    }


    function navigate(to: string, dispatch: redux.Dispatch<ApplicationState>): void {
        console.debug("Navigating to " + to);
        browserHistory.push(to);
        dispatch(SetCurrentLocation(to));
    }

    /**
     * Invokes async navigation to the given target; performs all necessary side effects.
     * @param target
     * @constructor
     */
    export function AsyncNavigateTo(target: string) {
        return function(dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            let state: ApplicationState = getState();
            let currentLocation = state.navigationSlice.currentLocation();
            let changes = state.databaseReducer.profile().changesMade();
            if(target === Paths.USER_SPECIAL_LOGOUT ) {
                if(changes > 0) {
                    dispatch(SetNavigationTarget(target));
                } else {
                    navigate(Paths.APP_ROOT, dispatch);
                    Cookies.remove(COOKIE_INITIALS_NAME);
                    dispatch(ProfileActionCreator.logOutUser());
                    dispatch(ViewProfileActionCreator.ResetViewState());
                }
            } if(currentLocation === Paths.USER_PROFILE && target !== Paths.USER_PROFILE && changes > 0) {
                dispatch(SetNavigationTarget(target));
            } else {
                navigate(target, dispatch);
            }
        }
    }

    export function AsyncContinueToTarget() {
        return function(dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            let target: string = getState().navigationSlice.targetLocation();
            switch(target) {
                case Paths.USER_SPECIAL_LOGOUT: {
                    navigate(Paths.APP_ROOT, dispatch);
                    Cookies.remove(COOKIE_INITIALS_NAME);
                    dispatch(ProfileActionCreator.logOutUser());
                    dispatch(ViewProfileActionCreator.ResetViewState());
                    break;
                }
                default:
                    navigate(target, dispatch);
                    break;
            }
        }
    }


}