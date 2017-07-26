import {SkillStore} from '../../model/skill/SkillStore';
import {AbstractAction, ChangeNumberValueAction, ChangeStringValueAction} from '../profile/database-actions';
import {isNullOrUndefined} from 'util';
import {ActionType} from '../ActionType';
import {SkillActions} from './SkillActions';
import {APISkillCategory} from '../../model/skill/SkillCategory';
import {AddSkillStep} from '../../model/skill/AddSkillStep';
import {UnCategorizedSkillChoice} from '../../model/skill/UncategorizedSkillChoice';
export namespace SkillReducer {
    import AddCategoryToTreeAction = SkillActions.AddCategoryToTreeAction;
    import AddSkillToTreeAction = SkillActions.AddSkillToTreeAction;
    import ReadSkillHierarchyAction = SkillActions.ReadSkillHierarchyAction;
    import SetAddSkillStepAction = SkillActions.SetAddSkillStepAction;
    import SetCurrentChoiceAction = SkillActions.SetCurrentChoiceAction;

    export function buildHierarchy(category: APISkillCategory): string {
        if(!isNullOrUndefined(category)) {
            if(!isNullOrUndefined(category.category)) {
                return category.qualifier +  " => " + buildHierarchy(category.category);
            }
            else {
                return category.qualifier;
            }
        }
        return "";
    }


    function resetAddSkillDialog(skillStore: SkillStore): SkillStore {
        return skillStore.currentChoice(UnCategorizedSkillChoice.PROCEED_WITH_COMMENT)
            .addSkillError(null).skillComment("").currentSkillName("").currentSkillRating(1)
            .currentAddSkillStep(AddSkillStep.NONE)
    }

    export function reduce(skillStore: SkillStore, action: AbstractAction): SkillStore {
        if(isNullOrUndefined(skillStore)) return SkillStore.empty();
        switch(action.type) {
            case ActionType.AddCategoryToTree: {
                let act = action as AddCategoryToTreeAction;
                return skillStore.skillTreeRoot(skillStore.skillTreeRoot().addCategoryToTree(act.parentId, act.toAdd))
            }
            case ActionType.AddSkillToTree: {
                let act = action as AddSkillToTreeAction;
                return skillStore.skillTreeRoot(skillStore.skillTreeRoot().addSkillToTree(act.categoryId, act.toAdd));
            }
            case ActionType.ReadSkillHierarchy: {
                let act = action as ReadSkillHierarchyAction;
                if(!isNullOrUndefined(act.skill.category)) {
                    let map = skillStore.categorieHierarchiesBySkillName();
                    map = map.set(act.skill.qualifier, act.skill.qualifier + " => " + buildHierarchy(act.skill.category));
                    return skillStore.categorieHierarchiesBySkillName(map);
                }
                return skillStore;
            }
            case ActionType.SetCurrentSkillName: {
                let act = action as ChangeStringValueAction;
                return skillStore.currentSkillName(act.value);
            }
            case ActionType.SetCurrentSkillRating: {
                let act = action as ChangeNumberValueAction;
                return skillStore.currentSkillRating(act.value);
            }
            case ActionType.SetAddSkillStep: {
                let act = action as SetAddSkillStepAction;
                return skillStore.currentAddSkillStep(act.step);
            }
            case ActionType.StepBackToSkillInfo: {
                return resetAddSkillDialog(skillStore).currentAddSkillStep(AddSkillStep.SKILL_INFO);
            }
            case ActionType.ChangeSkillComment: {
                let act = action as ChangeStringValueAction;
                return skillStore.skillComment(act.value).addSkillError(null);
            }
            case ActionType.SetCurrentChoice: {
                let act = action as SetCurrentChoiceAction;
                return skillStore.currentChoice(act.currentChoice);
            }
            case ActionType.SetAddSkillError: {
                let act = action as ChangeStringValueAction;
                return skillStore.addSkillError(act.value);
            }
            case ActionType.ResetAddSkillDialog: {
                return resetAddSkillDialog(skillStore);
            }
            case ActionType.SetNoCategoryReason: {
                let act = action as ChangeStringValueAction;
                return skillStore.noCategoryReason(act.value);
            }
            default:
                return skillStore;
        }

    }
}