import * as redux from 'redux';
import {ViewProfileActions} from './ViewProfileActions';
import {ViewProfile} from '../../model/view/ViewProfile';
import {ActionType} from '../ActionType';
import {ApplicationState} from '../reducerIndex';
import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import {ViewProfileService} from '../../API_CONFIG';
import {SortableEntryField, SortableEntryType} from '../../model/view/NameComparableType';
import {AbstractAction} from '../profile/database-actions';
import {CrossCuttingActionCreator} from '../crosscutting/CrossCuttingActionCreator';
import {NavigationActionCreator} from '../navigation/NavigationActionCreator';
import {TemplateActionCreator} from '../template/TemplateActionCreator';

export namespace ViewProfileActionCreator {
    import SetViewProfileAction = ViewProfileActions.SetViewProfileAction;
    import RemoveViewProfileAction = ViewProfileActions.RemoveViewProfileAction;
    import patchMoveEntry = ViewProfileService.patchMoveEntry;
    import patchToggleEntry = ViewProfileService.patchToggleEntry;
    import SetSortInProgressAction = ViewProfileActions.SetSortInProgressAction;
    import patchSortEntry = ViewProfileService.patchSortEntry;
    import patchMoveNestedEntry = ViewProfileService.patchMoveNestedEntry;
    import patchToggleNestedEntry = ViewProfileService.patchToggleNestedEntry;
    import patchSortNestedEntry = ViewProfileService.patchSortNestedEntry;
    import patchToggleSkill = ViewProfileService.patchToggleSkill;
    import patchSetDisplayCategory = ViewProfileService.patchSetDisplayCategory;

    /**
     * Constructs an action that sets a view profile into the store. If a view profile with the same ID exists, the
     * old one is replaced
     * @param viewProfile
     * @return the action
     */
    export function SetViewProfile(viewProfile: ViewProfile): SetViewProfileAction {
        return {
            type: ActionType.SetViewProfile,
            viewProfile: viewProfile
        };
    }

    export function ClearViewProfiles(): AbstractAction {
        return {
            type: ActionType.ClearViewProfiles
        };
    }

    export function ResetViewState(): AbstractAction {
        return {
            type: ActionType.ResetViewState
        };
    }

    export function RemoveViewProfile(id: string): RemoveViewProfileAction {
        return {
            type: ActionType.RemoveViewProfile,
            id: id
        };
    }

    export function SetSortInProgress(inProgress: boolean): SetSortInProgressAction {
        return {
            type: ActionType.SetSortInProgress,
            inProgress: inProgress
        };
    }

    function succeedAndRead(response: AxiosResponse, dispatch: redux.Dispatch<ApplicationState>) {
        let viewProfile: ViewProfile = new ViewProfile(response.data);
        dispatch(SetViewProfile(viewProfile));
        dispatch(CrossCuttingActionCreator.endRequest());
    }

    export function AsyncCreateViewProfile(name: string, description: string) {
        return function (dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            dispatch(CrossCuttingActionCreator.startRequest());
            let initials = getState().databaseReducer.loggedInUser().initials();
            let body = {
                name: name,
                viewDescription: description
            };
            axios.post(ViewProfileService.postViewProfile(initials), body).then((response: AxiosResponse) => {
                succeedAndRead(response, dispatch);
                NavigationActionCreator.showSuccess('View Profile created.');
            }).catch((error: AxiosError) => {
                NavigationActionCreator.showError('Could not create view profile!');
                dispatch(CrossCuttingActionCreator.endRequest());
                console.error(error);
            });
        };
    }

    export function AsyncMoveEntry(id: string, movableEntry: string, sourceIndex: number, targetIndex: number) {
        return function (dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            let initials = getState().databaseReducer.loggedInUser().initials();
            dispatch(CrossCuttingActionCreator.startRequest());
            dispatch(SetSortInProgress(true));
            axios.patch(patchMoveEntry(initials, id, movableEntry, sourceIndex, targetIndex)).then((response: AxiosResponse) => {
                succeedAndRead(response, dispatch);
                dispatch(SetSortInProgress(false));
            }).catch((error: AxiosError) => {
                NavigationActionCreator.showError('Could not move entry');
                dispatch(CrossCuttingActionCreator.endRequest());
                dispatch(SetSortInProgress(false));
                console.error(error);
            });
        };
    }

    export function AsyncMoveNestedEntry(id: string, container: 'PROJECT' | 'DISPLAY_CATEGORY', containerIndex: number,
                                         movableEntry: string, sourceIndex: number, targetIndex: number) {
        return function (dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            let initials = getState().databaseReducer.loggedInUser().initials();
            dispatch(CrossCuttingActionCreator.startRequest());
            dispatch(SetSortInProgress(true));
            axios.patch(patchMoveNestedEntry(initials, id, container, containerIndex, movableEntry, sourceIndex, targetIndex)).then((response: AxiosResponse) => {
                succeedAndRead(response, dispatch);
                dispatch(SetSortInProgress(false));
            }).catch((error: AxiosError) => {
                NavigationActionCreator.showError('Could not move entries!');
                dispatch(CrossCuttingActionCreator.endRequest());
                dispatch(SetSortInProgress(false));
                console.error(error);
            });
        };
    }

    export function AsyncToggleNestedEntry(id: string, container: 'PROJECT' | 'DISPLAY_CATEGORY', containerIndex: number,
                                           toggleableEntry: string, index: number, isEnabled: boolean) {
        return function (dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            dispatch(CrossCuttingActionCreator.startRequest());
            let initials = getState().databaseReducer.loggedInUser().initials();
            axios.patch(patchToggleNestedEntry(initials, id, container, containerIndex, toggleableEntry, index, isEnabled)).then((response: AxiosResponse) => {
                succeedAndRead(response, dispatch);
            }).catch((error: AxiosError) => {
                NavigationActionCreator.showError('Could not toggle tnry!');
                dispatch(CrossCuttingActionCreator.endRequest());
                console.error(error);
            });
        };
    }

    export function AsyncToggleEntry(id: string, toggleableEntry: string, index: number, isEnabled: boolean) {
        return function (dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            dispatch(CrossCuttingActionCreator.startRequest());
            let initials = getState().databaseReducer.loggedInUser().initials();
            axios.patch(patchToggleEntry(initials, id, toggleableEntry, index, isEnabled)).then((response: AxiosResponse) => {
                succeedAndRead(response, dispatch);
            }).catch((error: AxiosError) => {
                NavigationActionCreator.showError('Could not toggle entry!');
                dispatch(CrossCuttingActionCreator.endRequest());
                console.error(error);
            });
        };
    }

    export function AsyncAutoSortEntry(id: string, entryType: SortableEntryType, field: SortableEntryField, doAscending: boolean) {
        return function (dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            dispatch(CrossCuttingActionCreator.startRequest());
            let initials = getState().databaseReducer.loggedInUser().initials();
            let config: AxiosRequestConfig = {params: {'do-ascending': doAscending}};
            axios.patch(patchSortEntry(initials, id, entryType, field), null, config).then((response: AxiosResponse) => {
                succeedAndRead(response, dispatch);
            }).catch((error: AxiosError) => {
                NavigationActionCreator.showError('Could not sorty entry!');
                dispatch(CrossCuttingActionCreator.endRequest());
                console.error(error);
            });
        };
    }

    export function AsyncToggleSkill(viewProfileId: string, skillName: string, isEnabled: boolean) {
        return function (dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            dispatch(CrossCuttingActionCreator.startRequest());
            let initials = getState().databaseReducer.loggedInUser().initials();
            let config: AxiosRequestConfig = {params: {'skill-name': skillName}};
            axios.patch(patchToggleSkill(initials, viewProfileId, isEnabled), null, config).then((response: AxiosResponse) => {
                succeedAndRead(response, dispatch);
            }).catch((error: AxiosError) => {
                NavigationActionCreator.showError('Could not toggle skill!');
                dispatch(CrossCuttingActionCreator.endRequest());
                console.error(error);
            });
        };
    }

    export function AsyncSetDisplayCategory(viewProfileId: string, skillName: string, newDisplayCategoryName: string) {
        return function (dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            dispatch(CrossCuttingActionCreator.startRequest());
            let initials = getState().databaseReducer.loggedInUser().initials();
            let config: AxiosRequestConfig = {
                params: {
                    'skill-name': skillName,
                    'display-category': newDisplayCategoryName
                }
            };
            axios.patch(patchSetDisplayCategory(initials, viewProfileId), null, config).then((response: AxiosResponse) => {
                succeedAndRead(response, dispatch);
            }).catch((error: AxiosError) => {
                NavigationActionCreator.showError('Could not set display category!');
                dispatch(CrossCuttingActionCreator.endRequest());
                console.error(error);
            });
        };
    }

    export function AsyncAutoSortNestedEntry(id: string, container: string, containerIndex: number,
                                             entryType: SortableEntryType, field: SortableEntryField, doAscending: boolean) {
        return function (dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            dispatch(CrossCuttingActionCreator.startRequest());
            let initials = getState().databaseReducer.loggedInUser().initials();
            let config: AxiosRequestConfig = {params: {'do-ascending': doAscending}};
            axios.patch(patchSortNestedEntry(initials, id, container, containerIndex, entryType, field), null, config).then((response: AxiosResponse) => {
                succeedAndRead(response, dispatch);
            }).catch((error: AxiosError) => {
                NavigationActionCreator.showError('Could not sort view profile!');
                dispatch(CrossCuttingActionCreator.endRequest());
                console.error(error);
            });
        };
    }


    export function AsyncDeleteViewProfile(id: string) {
        return function (dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            dispatch(CrossCuttingActionCreator.startRequest());
            let initials = getState().databaseReducer.loggedInUser().initials();
            axios.delete(ViewProfileService.deleteViewProfile(initials, id)).then(response => {
                dispatch(RemoveViewProfile(id));
                NavigationActionCreator.showSuccess('View profile deleted!');
                dispatch(CrossCuttingActionCreator.endRequest());
            }).catch((error: AxiosError) => {
                console.error(error);
                NavigationActionCreator.showError('Could not delete view profile!');
                dispatch(CrossCuttingActionCreator.endRequest());
            });
        };
    }

    function AsyncLoadViewProfile(id: string) {
        return function (dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            let initials = getState().databaseReducer.loggedInUser().initials();
            axios.get(ViewProfileService.getViewProfile(initials, id)).then((response: AxiosResponse) => {
                succeedAndRead(response, dispatch);
            }).catch((error: AxiosError) => {
                console.error(error);
                NavigationActionCreator.showError('Could not load view profile!');
                dispatch(CrossCuttingActionCreator.endRequest());
            });
        };
    }

    export function AsyncGenerateDocX(viewProfileId: string, templateId: string) {
        return function (dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            let initials = getState().databaseReducer.loggedInUser().initials();
            dispatch(CrossCuttingActionCreator.startRequest());
            axios.post(ViewProfileService.postReport(initials, viewProfileId, templateId)).then((response: AxiosResponse) => {
                let location = response.data;
                console.info('Received Export: ', location);
                TemplateActionCreator.DownloadReportFile(location);
                dispatch(CrossCuttingActionCreator.endRequest());
            }).catch(function (error: any) {
                console.error(error);
                NavigationActionCreator.showError('Could not generate document!');
                dispatch(CrossCuttingActionCreator.endRequest());
            });
        };
    }

    export function AsyncUpdateViewProfile(viewProfileId: string, description: string, name: string, charsPerLine: number) {
        return function (dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            let initials = getState().databaseReducer.loggedInUser().initials();
            let data = {
                viewDescription: description,
                name: name,
                charsPerLine: charsPerLine
            };
            dispatch(CrossCuttingActionCreator.startRequest());
            axios.patch(ViewProfileService.patchPartialUpdate(initials, viewProfileId), data).then((response: AxiosResponse) => {
                succeedAndRead(response, dispatch);
                NavigationActionCreator.showSuccess('View Profile Updated.');
            }).catch(function (error: any) {
                console.error(error);
                NavigationActionCreator.showError('Could not update view profiles!');
                dispatch(CrossCuttingActionCreator.endRequest());
            });
        };
    }

    /**
     * Loads all view profiles for the consultant that is currently logged in
     */
    export function AsyncLoadAllViewProfiles() {
        return function (dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            let initials = getState().databaseReducer.loggedInUser().initials();
            dispatch(ClearViewProfiles());
            dispatch(CrossCuttingActionCreator.startRequest());
            axios.get(ViewProfileService.getViewProfileIds(initials)).then((response: AxiosResponse) => {
                let ids: Array<string> = response.data;
                ids.forEach(id => dispatch(AsyncLoadViewProfile(id)));
            }).catch((error: AxiosError) => {
                NavigationActionCreator.showError('Could not load view profiles!');
                dispatch(CrossCuttingActionCreator.endRequest());
            });
        };
    }

    export function AsyncSetDescription(description: string, viewProfileId: string) {
        return function (dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            let initials = getState().databaseReducer.loggedInUser().initials();
            dispatch(CrossCuttingActionCreator.startRequest());
            let config: AxiosRequestConfig = {headers: {'Content-Type': 'text/plain'}};
            axios.patch(ViewProfileService.patchDescription(initials, viewProfileId), description, config).then((response: AxiosResponse) => {
                succeedAndRead(response, dispatch);
            }).catch(function (error: any) {
                console.error(error);
                NavigationActionCreator.showError('Could not set description!');
                dispatch(CrossCuttingActionCreator.endRequest());
            });
        };
    }


}