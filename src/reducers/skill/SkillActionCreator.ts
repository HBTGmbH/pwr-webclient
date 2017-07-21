import {APISkillCategory, SkillCategory} from '../../model/skill/SkillCategory';
import {SkillActions} from './SkillActions';
import {ActionType} from '../ActionType';
import * as redux from 'redux';
import {ApplicationState} from '../../Store';
import {
    getCategoryById,
    getCategoryChildrenByCategoryId,
    getRootCategoryIds,
    getSkillByName,
    getSkillsForCategory
} from '../../API_CONFIG';
import axios, {AxiosResponse} from 'axios';
import {APISkillServiceSkill, SkillServiceSkill} from '../../model/skill/SkillServiceSkill';
import {AbstractAction, ChangeNumberValueAction, ChangeStringValueAction} from '../profile/database-actions';
import {AddSkillStep} from '../../model/skill/AddSkillStep';
import {isNullOrUndefined} from 'util';
import {ProfileActionCreator} from '../profile/ProfileActionCreator';
import {UnCategorizedSkillChoice} from '../../model/skill/UncategorizedSkillChoice';


export namespace SkillActionCreator {
    import AddCategoryToTreeAction = SkillActions.AddCategoryToTreeAction;
    import AddSkillToTreeAction = SkillActions.AddSkillToTreeAction;
    import ReadSkillHierarchyAction = SkillActions.ReadSkillHierarchyAction;
    import SetAddSkillStepAction = SkillActions.SetAddSkillStepAction;
    import Timer = NodeJS.Timer;
    import SetCurrentChoiceAction = SkillActions.SetCurrentChoiceAction;

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
                console.log(response.data);
                let categories: number[] = response.data;
                categories.forEach((value, index, array) => dispatch(AsyncLoadCategoryIntoTree(-1, value, 1)));
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
                axios.get(getSkillByName(skillName)).then((response: AxiosResponse) => {
                    dispatch(ReadSkillHierarchy(response.data));
                }).catch(function (error: any) {
                    console.error(error);
                });
            }
        };
    }

    export function AsyncProgressAddSkill() {
        return function (dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            let state = getState().skillReducer;
            let step = state.currentAddSkillStep();
            console.log("Step", step);
            if(step === AddSkillStep.NONE) {
                dispatch(SetAddSkillStep(AddSkillStep.SKILL_INFO))
            } else if (step === AddSkillStep.SKILL_INFO) {
                let skillName = state.currentSkillName();
                let hierarchy = state.categorieHierarchiesBySkillName().get(state.currentSkillName());
                if(!isNullOrUndefined(hierarchy)) {
                    dispatch(SetAddSkillStep(AddSkillStep.SHOW_CATEGORY));
                } else {
                    dispatch(SetAddSkillStep(AddSkillStep.CATEGORY_REQUEST_PENDING));
                    axios.get(getSkillByName(skillName)).then((response: AxiosResponse) => {
                        if(response.status === 200) {
                            dispatch(ReadSkillHierarchy(response.data));
                            dispatch(SetAddSkillStep(AddSkillStep.SHOW_CATEGORY))
                        } else if(response.status === 204){
                            dispatch(SetAddSkillStep(AddSkillStep.SHOW_EDITING_OPTIONS));
                        } else {
                            let error: any = new Error("Unexpected response status in response.");
                            error.response = response;
                            throw error;
                        }
                    }).catch(function (error: any) {
                        console.error(error);
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
                // FIXME it misses the rating; Remove from skill-tree-module, add here.
                dispatch(ProfileActionCreator.AddSkill(getState().skillReducer.currentSkillName()));
                dispatch(ResetAddSkillDialog());
            }
        }

    }

}