import {APIRequestType, DateFieldType, RequestStatus} from '../../Store';
import {isNullOrUndefined} from 'util';
import {
    ChangeAbstractAction,
    ChangeDateAction,
    ChangeLanguageSkillLevelAction,
    ChangeLanguageSkillNameAction,
    ReceiveAPIResponseAction
} from './singleProfileActions';
import {AbstractAction, ActionType} from '../reducerIndex';
import {LanguageSkill} from '../../model/LanguageSkill';
import {deepFreeze} from '../../utils/ObjectUtil';
import {InternalDatabase} from '../../model/InternalDatabase';
import * as $ from 'jquery';
import {EducationEntry} from '../../model/EducationEntry';
import {QualificationEntry} from '../../model/QualificationEntry';


const initialState: InternalDatabase = new InternalDatabase();
console.log(initialState);
initialState.APIRequestStatus = RequestStatus.Successful;


function handleChangeLanguageSkill(state: InternalDatabase, action: ChangeLanguageSkillNameAction) : InternalDatabase {
    // Copy the whole array.
    let newLangSkills: Array<LanguageSkill> = state.languageSkillById.slice(0);
    // Replace the skill.
    newLangSkills[action.languageSkillId] = newLangSkills[action.languageSkillId].changeLanguageId(action.newLanguageId);
    let newState: InternalDatabase = Object.assign({}, state);
    newState.languageSkillById = newLangSkills;
    return newState;
}

function handleChangeLanguageSkillLevel(state: InternalDatabase, action: ChangeLanguageSkillLevelAction): InternalDatabase {
    // Copy the whole array.
    let newLangSkills: Array<LanguageSkill> = state.languageSkillById.slice(0);
    // Replace the skill.
    newLangSkills[action.languageSkillId] = newLangSkills[action.languageSkillId].changeLevel(action.newLanguageLevel);
    let newState: InternalDatabase = Object.assign({}, state);
    newState.languageSkillById = newLangSkills;
    return newState;
}
function handleChangeAbstract(state: InternalDatabase, action: ChangeAbstractAction): InternalDatabase {
    let newState: InternalDatabase = Object.assign({}, state);
    newState.description = action.newAbstract;
    return newState;
}

function handleReceiveFullProfile(state: InternalDatabase, action: ReceiveAPIResponseAction) : InternalDatabase {
    // To keep the code in the databaseReducer class itself clean, a full clone of the old databaseReducer is created, on which all
    // further operations are then performed.
    let clonedState: InternalDatabase = $.extend(true,  new InternalDatabase(), state);
    console.log("Cloned state:", clonedState);
    clonedState.parseFromAPI(action.payload);
    return clonedState;
}

function handleRequestLanguageSuccess(state: InternalDatabase, languages: Array<any>): InternalDatabase {
    // Clone state to allow mutation
    let clonedState: InternalDatabase = $.extend(true,  new InternalDatabase(), state);
    clonedState.addAPILanguages(languages);
    return clonedState;
}

function handleRequestAPISuccess(state: InternalDatabase, action: ReceiveAPIResponseAction): InternalDatabase {
    let newState: InternalDatabase;
    if(action.requestType === APIRequestType.RequestLanguages) {
        newState = handleRequestLanguageSuccess(state, action.payload);
    } else if(action.requestType === APIRequestType.RequestProfile) {
        newState = handleReceiveFullProfile(state, action);
    } else if(action.requestType === APIRequestType.SaveProfile) {
        newState = state;
    }
    return Object.assign({}, newState, {APIRequestStatus : RequestStatus.Successful});
}

function handleChangeDate(state: InternalDatabase, action: ChangeDateAction): InternalDatabase {
    switch (action.targetField) {
        case DateFieldType.CareerFrom: {
            // Copy the array.
            let newCareers = state.careerById.slice(0);
            // Copy the references into a new career object and replace it in the new array
            newCareers[action.targetFieldId] = newCareers[action.targetFieldId].changeStartDate(action.newDate);
            // Copy all references into a new state object.
            return Object.assign({}, state, {careerById: newCareers});
        }
        case DateFieldType.CareerTo: {
            // Copy the array.
            let newCareers = state.careerById.slice(0);
            // Copy the references into a new career object and replace it in the new array
            newCareers[action.targetFieldId] = newCareers[action.targetFieldId].changeEndDate(action.newDate);
            // Copy all references into a new state object.
            return Object.assign({}, state, {careerById: newCareers});
        }
        case DateFieldType.EducationDate: {
            // Copy the array.
            let newEducation: Array<EducationEntry> = state.educationEntriesById.slice(0);
            newEducation[action.targetFieldId] = newEducation[action.targetFieldId].changeDate(action.newDate);
            // Copy all references into a new state object.
            let newState: InternalDatabase = Object.assign({}, state);
            newState.educationEntriesById = newEducation;
            return newState;
        }
        case DateFieldType.QualificationDate: {
            // Copy the array.
            let newQualificationsById: Array<QualificationEntry> = state.qualificationEntriesById.slice(0);
            // Copy the references into a new career object and replace it in the new array
            newQualificationsById[action.targetFieldId] = Object.assign({}, newQualificationsById[action.targetFieldId]);
            // Replace the start date. This is a typesafe way to do that (Instead of using another object in Object.assign).
            newQualificationsById[action.targetFieldId].date = action.newDate;
            // Copy all references into a new state object.
            let newState: InternalDatabase = Object.assign({}, state);
            newState.qualificationEntriesById = newQualificationsById;
            return newState;
        }
        default:
            return state;
    }
}

/**
 * Reducer for the single profile part of the global state.
 * @param state
 * @param action
 * @returns {SingleProfile}
 */
export function databaseReducer(state : InternalDatabase, action: AbstractAction) : InternalDatabase {
    if(isNullOrUndefined(state)) {
        state = initialState;
    }
    deepFreeze(state);
    console.log("ConsultantProfile Reducer called for action type " + ActionType[action.type]);
    switch(action.type) {
        // == Profile Element modification == //
        case ActionType.ChangeAbstract:
            return handleChangeAbstract(state, <ChangeAbstractAction> action);
        case ActionType.ChangeLanguageSkillName:
            return handleChangeLanguageSkill(state, <ChangeLanguageSkillNameAction> action );
        case ActionType.ChangeLanguageSkillLevel:
            return handleChangeLanguageSkillLevel(state, <ChangeLanguageSkillLevelAction> action);
        case ActionType.ChangeDate:
            return handleChangeDate(state, <ChangeDateAction> action);
        // == Language Suggestion requests == //
        case ActionType.APIRequestPending:
            return Object.assign({}, state, {APIRequestStatus: RequestStatus.Pending});
        case ActionType.APIRequestFail:
            return Object.assign({}, state, {APIRequestStatus: RequestStatus.Failiure});
        case ActionType.APIRequestSuccess:
            return handleRequestAPISuccess(state, <ReceiveAPIResponseAction> action);
        default:
            return state;
    }
}