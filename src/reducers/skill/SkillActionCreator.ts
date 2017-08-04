import {APISkillCategory, SkillCategory} from '../../model/skill/SkillCategory';
import {SkillActions} from './SkillActions';
import {ActionType} from '../ActionType';
import * as redux from 'redux';
import {ApplicationState, RequestStatus} from '../../Store';
import {
    deleteBlacklistCategory,
    deleteCategory,
    deleteLocaleFromCategory,
    getCategoryById,
    getCategoryChildrenByCategoryId,
    getRootCategoryIds,
    getSkillByName,
    getSkillsForCategory,
    patchMoveSkill,
    postLocaleToCategory,
    postNewCategory
} from '../../API_CONFIG';
import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import {APISkillServiceSkill, SkillServiceSkill} from '../../model/skill/SkillServiceSkill';
import {AbstractAction, ChangeNumberValueAction, ChangeStringValueAction} from '../profile/database-actions';
import {AddSkillStep} from '../../model/skill/AddSkillStep';
import {isNullOrUndefined} from 'util';
import {ProfileActionCreator} from '../profile/ProfileActionCreator';
import {UnCategorizedSkillChoice} from '../../model/skill/UncategorizedSkillChoice';
import {AdminActionCreator} from '../admin/AdminActionCreator';


export namespace SkillActionCreator {
    import AddCategoryToTreeAction = SkillActions.AddCategoryToTreeAction;
    import AddSkillToTreeAction = SkillActions.AddSkillToTreeAction;
    import ReadSkillHierarchyAction = SkillActions.ReadSkillHierarchyAction;
    import SetAddSkillStepAction = SkillActions.SetAddSkillStepAction;
    import Timer = NodeJS.Timer;
    import SetCurrentChoiceAction = SkillActions.SetCurrentChoiceAction;
    import PartiallyUpdateSkillCategoryAction = SkillActions.PartiallyUpdateSkillCategoryAction;
    import RemoveSkillCategoryAction = SkillActions.RemoveSkillCategoryAction;

    export function AddCategoryToTree(parentId: number, category: SkillCategory): AddCategoryToTreeAction {
        return {
            type: ActionType.AddCategoryToTree,
            parentId: parentId,
            toAdd: category
        };
    }

    export function AddSkillToTree(categoryId: number, skill: SkillServiceSkill): AddSkillToTreeAction {
        return {
            type: ActionType.AddSkillToTree,
            categoryId: categoryId,
            toAdd: skill
        };
    }

    export function ReadSkillHierarchy(skill: APISkillServiceSkill): ReadSkillHierarchyAction {
        return {
            type: ActionType.ReadSkillHierarchy,
            skill: skill
        };
    }

    export function SetCurrentSkillName(name: string): ChangeStringValueAction {
        return {
            value: name,
            type: ActionType.SetCurrentSkillName
        };
    }

    export function SetCurrentSkillRating(rating: number): ChangeNumberValueAction {
        return {
            value: rating,
            type: ActionType.SetCurrentSkillRating
        };
    }

    export function SetAddSkillStep(step: AddSkillStep): SetAddSkillStepAction {
        return {
            type: ActionType.SetAddSkillStep,
            step: step
        }
    }

    export function StepBackToSkillInfo(): AbstractAction {
        return {
            type: ActionType.StepBackToSkillInfo
        }
    }

    export function ResetAddSkillDialog(): AbstractAction {
        return {
            type: ActionType.ResetAddSkillDialog
        }
    }

    export function ChangeSkillComment(comment: string): ChangeStringValueAction {
        return {
            type: ActionType.ChangeSkillComment,
            value: comment
        }
    }

    export function SetCurrentChoice(choice: UnCategorizedSkillChoice): SetCurrentChoiceAction {
        return {
            type: ActionType.SetCurrentChoice,
            currentChoice: choice
        }
    }

    function SetAddSkillError(text: string): ChangeStringValueAction {
        return {
            type: ActionType.SetAddSkillError,
            value: text
        }
    }

    function SetNoCategoryReason(reason: string): ChangeStringValueAction {
        return {
            type: ActionType.SetNoCategoryReason,
            value: reason
        }
    }

    function PartiallyUpdateSkillCategory(skillCategory: SkillCategory): PartiallyUpdateSkillCategoryAction {
        return {
            type: ActionType.PartiallyUpdateSkillCategory,
            skillCategory: skillCategory
        }
    }

    function RemoveSkillCategory(id: number): RemoveSkillCategoryAction {
        return {
            type: ActionType.RemoveSkillCategory,
            id: id
        }
    }

    export function AsyncLoadChildrenIntoTree(parentId: number, currentDepth: number) {
        return function (dispatch: redux.Dispatch<ApplicationState>) {
            axios.get(getCategoryChildrenByCategoryId(parentId)).then(function (response: AxiosResponse) {
                let data: number[] = response.data;
                data.forEach((value, index, array) => dispatch(AsyncLoadCategoryIntoTree(parentId, value, currentDepth - 1)));
            }).catch(function (error: any) {
                console.log(error);
            });
        };
    }

    export function AsyncLoadRootChildrenIntoTree() {
        return function (dispatch: redux.Dispatch<ApplicationState>) {
            axios.get(getRootCategoryIds()).then(function (response: AxiosResponse) {
                let categories: number[] = response.data;
                categories.forEach((value, index, array) => dispatch(AsyncLoadCategoryIntoTree(-1, value, 1)));
            }).catch(function (error: any) {
                console.log(error);
            });
        };
    }

    export function AsyncUpdateCategoryInTree(categoryId: number) {
        return function (dispatch: redux.Dispatch<ApplicationState>) {
            axios.get(getCategoryById(categoryId)).then(function (response: AxiosResponse) {
                let data: APISkillCategory = response.data;
                let category = SkillCategory.fromAPI(data);
                dispatch(PartiallyUpdateSkillCategory(category));
            }).catch(function (error: any) {
                console.log(error);
            });
        };
    }

    export function AsyncLoadCategoryIntoTree(parentId: number, id: number, remainingDepth: number) {
        return function (dispatch: redux.Dispatch<ApplicationState>) {
            axios.get(getCategoryById(id)).then(function (response: AxiosResponse) {
                let data: APISkillCategory = response.data;
                let category = SkillCategory.fromAPI(data);
                dispatch(AddCategoryToTree(parentId, category));
                dispatch(AsyncLoadSkillsForCategory(category.id()));
                if (remainingDepth > 0) {
                    dispatch(AsyncLoadChildrenIntoTree(category.id(), remainingDepth));
                }

            }).catch(function (error: any) {
                console.log(error);
            });
        };
    }

    export function AsyncLoadSkillsForCategory(categoryId: number) {
        return function (dispatch: redux.Dispatch<ApplicationState>) {
            axios.get(getSkillsForCategory(categoryId)).then(function (response: AxiosResponse) {
                let skills: Array<APISkillServiceSkill> = response.data;
                skills.forEach(apiSkill => dispatch(AddSkillToTree(categoryId, SkillServiceSkill.fromAPI(apiSkill))));
            }).catch(function (error: any) {
                console.log(error);
            });
        };
    }

    export function AsyncRequestSkillHierarchy(skillName: string) {
        return function (dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            let state = getState();
            if (!state.skillReducer.categorieHierarchiesBySkillName().has(skillName)) {
                let config: AxiosRequestConfig = {params: {qualifier: skillName}};
                axios.get(getSkillByName(), config).then((response: AxiosResponse) => {
                    dispatch(ReadSkillHierarchy(response.data));
                }).catch(function (error: any) {
                    console.error(error);
                });
            }
        };
    }

    /**
     * Invokes witelisting of the {@link SkillCategory} identified by the given ID.
     * If the category is already whitelisted, nothing will change.
     * If the category is not existent, BAD REQUEST is returned.
     * @param categoryId of the category to be whitelisted
     */
    export function AsyncWhitelistCategory(categoryId: number) {
        return function (dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            axios.delete(deleteBlacklistCategory(categoryId)).then((response: AxiosResponse) => {
                let apiCategory: APISkillCategory = response.data;
                let parentId: number = null;
                if(!isNullOrUndefined(apiCategory.category)) {
                    parentId = apiCategory.category.id;
                }
                //dispatch(AddCategoryToTree(null, SkillCategory.fromAPI(apiCategory)));
                dispatch(AsyncLoadCategoryIntoTree(parentId, apiCategory.id, 1));
                dispatch(AsyncLoadSkillsForCategory(categoryId));
            }).catch((error: AxiosError) => {
                console.log(error);
            });
        }
    }

    export function AsyncBlacklistCategory(categoryId: number) {
        return function (dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            axios.post(deleteBlacklistCategory(categoryId)).then((response: AxiosResponse) => {
                let apiCategory: APISkillCategory = response.data;
                let parentId: number = null;
                if(!isNullOrUndefined(apiCategory.category)) {
                    parentId = apiCategory.category.id;
                }
                //dispatch(AddCategoryToTree(null, SkillCategory.fromAPI(apiCategory)));
                dispatch(AsyncLoadCategoryIntoTree(parentId, apiCategory.id, 1));
                dispatch(AsyncLoadSkillsForCategory(categoryId));
            }).catch((error: AxiosError) => {
                console.log(error);
            });
        }
    }

    const partiallyUpdateCategory = (apiSkillCategory: APISkillCategory, dispatch: redux.Dispatch<ApplicationState>) => {
        let skillCategory = SkillCategory.fromAPI(apiSkillCategory);
        dispatch(PartiallyUpdateSkillCategory(skillCategory));
        dispatch(AdminActionCreator.ChangeRequestStatus(RequestStatus.Successful));
    }

    export function AsyncAddLocale(categoryId: number, locale: string, qualifier: string) {
        return function(dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            let config: AxiosRequestConfig = {
                params: {
                    lang: locale,
                    qualifier: qualifier
                }
            };
            dispatch(AdminActionCreator.ChangeRequestStatus(RequestStatus.Pending));
            axios.post(postLocaleToCategory(categoryId), {}, config).then((response: AxiosResponse) => {
                partiallyUpdateCategory(response.data, dispatch);
            }).catch((error: AxiosError) => {
                console.log(error);
                dispatch(AdminActionCreator.ChangeRequestStatus(RequestStatus.Failiure));
            });
        }
    }

    export function AsyncDeleteLocale(categoryId: number, language: string) {
        return function(dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            dispatch(AdminActionCreator.ChangeRequestStatus(RequestStatus.Pending));
            axios.delete(deleteLocaleFromCategory(categoryId, language)).then((response: AxiosResponse) => {
                partiallyUpdateCategory(response.data, dispatch);
            }).catch((error: AxiosError) => {
                console.log(error);
                dispatch(AdminActionCreator.ChangeRequestStatus(RequestStatus.Failiure));
            });
        }
    }

    export function AsyncCreateCategory(qualifier: string, parentId: number) {
        return function(dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            let category: SkillCategory = SkillCategory.of(null, qualifier);
            dispatch(AdminActionCreator.ChangeRequestStatus(RequestStatus.Pending));
            axios.post(postNewCategory(parentId), category).then((response: AxiosResponse) => {
                let data: APISkillCategory = response.data;
                dispatch(AdminActionCreator.ChangeRequestStatus(RequestStatus.Successful));
                dispatch(AddCategoryToTree(parentId, SkillCategory.fromAPI(data)));
            }).catch((error: AxiosError) => {
                dispatch(AdminActionCreator.ChangeRequestStatus(RequestStatus.Failiure));
            });
        }
    }

    export function AsyncDeleteCategory(categoryId: number) {
        return function(dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            dispatch(AdminActionCreator.ChangeRequestStatus(RequestStatus.Pending));
            axios.delete(deleteCategory(categoryId)).then((respone: AxiosResponse) => {
                dispatch(RemoveSkillCategory(categoryId));
                dispatch(AdminActionCreator.ChangeRequestStatus(RequestStatus.Successful));
            }).catch((error: AxiosError) => {
                dispatch(AdminActionCreator.ChangeRequestStatus(RequestStatus.Failiure));
            })
        }
    }

    export function AsyncMoveSkill(skillId: number, newCategoryId: number, oldCategoryId: number) {
        return function(dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            dispatch(AdminActionCreator.ChangeRequestStatus(RequestStatus.Pending));
            axios.patch(patchMoveSkill(skillId, newCategoryId)).then((response: AxiosResponse) => {
                dispatch(AsyncUpdateCategoryInTree(oldCategoryId));
                dispatch(AsyncUpdateCategoryInTree(newCategoryId));
                dispatch(AdminActionCreator.ChangeRequestStatus(RequestStatus.Successful));
            }).catch((error: AxiosError) => {
                dispatch(AdminActionCreator.ChangeRequestStatus(RequestStatus.Failiure));
            });
        }
    }



    export function AsyncProgressAddSkill() {
        return function (dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            let state = getState().skillReducer;
            let step = state.currentAddSkillStep();
            // Simple state machine that defines how to progress from one state into another.
            // State progression is rather simple, for more, see AddSkillStep enum
            if(step === AddSkillStep.NONE) {
                dispatch(SetAddSkillStep(AddSkillStep.SKILL_INFO))
            } else if (step === AddSkillStep.SKILL_INFO) {
                let skillName = state.currentSkillName();
                let hierarchy = state.categorieHierarchiesBySkillName().get(state.currentSkillName());
                if(!isNullOrUndefined(hierarchy)) {
                    dispatch(SetAddSkillStep(AddSkillStep.SHOW_CATEGORY));
                } else {
                    dispatch(SetAddSkillStep(AddSkillStep.CATEGORY_REQUEST_PENDING));
                    let config: AxiosRequestConfig = {params: {qualifier: skillName}};
                    axios.get(getSkillByName(), config).then((response: AxiosResponse) => {
                        if(response.status === 200) {
                            if(response.data.category != null) {
                                dispatch(ReadSkillHierarchy(response.data));
                                dispatch(SetAddSkillStep(AddSkillStep.SHOW_CATEGORY))
                            } else {
                                dispatch(SetNoCategoryReason("NO_CATEGORY_AVAILABLE"));
                                dispatch(SetAddSkillStep(AddSkillStep.SHOW_EDITING_OPTIONS));
                            }
                        } else if(response.status === 204){
                            dispatch(SetNoCategoryReason("NO_CATEGORY_AVAILABLE"));
                            dispatch(SetAddSkillStep(AddSkillStep.SHOW_EDITING_OPTIONS));
                        } else {
                            dispatch(SetNoCategoryReason("SERVER_ERROR"));
                            dispatch(SetAddSkillStep(AddSkillStep.SHOW_EDITING_OPTIONS));
                        }
                    }).catch(function (error: AxiosError) {
                        console.error(error);
                        if(!isNullOrUndefined(error.response) && (error.response.status === 400 || error.response.status === 404)) {
                            dispatch(SetNoCategoryReason("SERVICE_NOT_AVAILABLE"));
                        } else {
                            dispatch(SetNoCategoryReason("UNKNOWN"));
                        }
                        dispatch(SetAddSkillStep(AddSkillStep.SHOW_EDITING_OPTIONS));
                    });
                }
            } else if (step === AddSkillStep.SHOW_CATEGORY) {
                dispatch(SetAddSkillStep(AddSkillStep.DONE));
            } else if(step === AddSkillStep.SHOW_EDITING_OPTIONS) {
                if(state.currentChoice() === UnCategorizedSkillChoice.PROCEED_WITH_COMMENT && state.skillComment().trim() !== "") {
                    dispatch(SetAddSkillStep(AddSkillStep.DONE));
                } else if(state.currentChoice() === UnCategorizedSkillChoice.PROCEED_WITH_COMMENT) {
                    dispatch(SetAddSkillError("Comment necessary"));
                } else {
                    dispatch(SetAddSkillStep(AddSkillStep.DONE));
                }
            } else if (step === AddSkillStep.DONE) {
                dispatch(ProfileActionCreator.AddSkill(state.currentSkillName(), state.currentSkillRating(), state.skillComment()));
                dispatch(ResetAddSkillDialog());
            }
        }

    }

}