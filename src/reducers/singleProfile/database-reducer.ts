import {APIRequestType, NameEntityType, ProfileElementType, RequestStatus} from '../../Store';
import {isNull, isNullOrUndefined} from 'util';
import {
    ChangeDateAction, ChangeDegreeAction,
    ChangeItemIdAction,
    ChangeLanguageSkillLevelAction,
    ChangeStringValueAction, CreateEntryAction,
    CreateNameEntityAction,
    DeleteEntryAction,
    ProfileActionCreator,
    ReceiveAPIResponseAction
} from './singleProfileActions';
import {AbstractAction, ActionType} from '../reducerIndex';
import {LanguageSkill} from '../../model/LanguageSkill';
import {deepFreeze} from '../../utils/ObjectUtil';
import {InternalDatabase} from '../../model/InternalDatabase';
import {Profile} from '../../model/Profile';
import {ProfileReducer} from './profile-reducer';
import {Sector} from '../../model/Sector';
import {Education} from '../../model/Education';
import {EducationEntry} from '../../model/EducationEntry';
import {Language} from '../../model/Language';
import {Qualification} from '../../model/Qualification';
import {QualificationEntry} from '../../model/QualificationEntry';


const initialState: InternalDatabase = InternalDatabase.createWithDefaults();

function handleChangeLanguageSkillLevel(state: InternalDatabase, action: ChangeLanguageSkillLevelAction): InternalDatabase {
    let newLangSkill: LanguageSkill = state.profile.languageSkills.get(action.languageSkillId).changeLevel(action.newLanguageLevel);
    let newProfile: Profile = state.profile.updateLanguageSkill(newLangSkill);
    return state.updateProfile(newProfile);
}
function handleChangeAbstract(state: InternalDatabase, action: ChangeStringValueAction): InternalDatabase {
    let newProfile: Profile = state.profile.changeDescription(action.value);
    return state.updateProfile(newProfile);
}

// FIXME move to database reducer
function handleRequestAPISuccess(state: InternalDatabase, action: ReceiveAPIResponseAction): InternalDatabase {
    let newState: InternalDatabase;
    // FIXME switch-i-fy
    if(action.requestType === APIRequestType.RequestLanguages) {
        newState = state.addAPILanguages(action.payload);
    } else if(action.requestType === APIRequestType.RequestProfile) {
        newState = state.parseProfile(action.payload);
    } else if(action.requestType === APIRequestType.SaveProfile) {
        newState = state;
    } else if(action.requestType === APIRequestType.RequestEducations) {
        newState = state.addAPIEducations(action.payload);
    } else if(action.requestType === APIRequestType.RequestQualifications) {
        newState = state.addAPIQualifications(action.payload);
    } else if(action.requestType === APIRequestType.RequestCareers) {
        newState = state.addAPITrainings(action.payload);
    } else if(action.requestType === APIRequestType.RequestSectors) {
        newState = state.addAPISectors(action.payload);
    }
    return newState.changeAPIRequestStatus(RequestStatus.Successful);
}

/**
 * Handles a potential {@link CreateNameEntityAction}. This validates that a name entity with the given name is not existant, and
 * then creates it. If an entity with the same name already exists, only the ID update is performed, which then
 * equals an {@see ChangeItemIdAction}.
 * @param database
 * @param action
 * @returns {InternalDatabase}
 */
function handleCreateNameEntity(database: InternalDatabase, action: CreateNameEntityAction): InternalDatabase {
    switch(action.entityType) {
        case NameEntityType.Training:
            return database;
        case NameEntityType.Education: {
            let education: Education = database.getEducationByName(action.name);
            if(isNullOrUndefined(education)) {
                education = Education.createNew(action.name);
            }
            let educationEntry: EducationEntry = database.profile.educationEntries.get(action.entryId);
            educationEntry = educationEntry.changeEducationId(education.id);
            let profile: Profile = database.profile.updateEducationEntry(educationEntry);
            return database.updateProfile(profile).updateEducation(education);
        }
        case NameEntityType.Language: {
            let language: Language = database.getLanguageByName(action.name);
            if(isNullOrUndefined(language)) {
                language = Language.createNew(action.name);
            }
            let languageSkill: LanguageSkill = database.profile.languageSkills.get(action.entryId);
            languageSkill.changeLanguageId(language.id);
            let profile: Profile = database.profile.updateLanguageSkill(languageSkill);
            return database.updateProfile(profile).updateLanguage(language);
        }
        case NameEntityType.Qualification: {
            let qualification: Qualification = database.getQualificationByName(action.name);
            if(isNullOrUndefined(qualification)) {
                qualification = Qualification.createNew(action.name);
            }
            let qualificationEntry: QualificationEntry = database.profile.qualificationEntries.get(action.entryId);
            qualificationEntry.changeQualificationId(qualification.id);
            let profile: Profile = database.profile.updateQualificationEntry(qualificationEntry);
            return database.updateProfile(profile).updateQualification(qualification);
        }
        case NameEntityType.Sector: {
            let sector: Sector = database.getSectorByName(action.name);
            if(!isNullOrUndefined(sector) && !isNullOrUndefined(action.entryId)) {
                // Sector already exists. Do not fromAPI a new one, only update the ID of the entry.
                let profile: Profile = ProfileReducer.reducerHandleItemIdChange(database.profile,
                    ProfileActionCreator.changeItemId(sector.id, action.entryId, ProfileElementType.SectorEntry));
                return database.updateProfile(profile);
            } else {
                return database.createNewSector(Sector.create(action.name), action.entryId);
            }
        }
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
    console.log('ConsultantProfile Reducer called for action type ' + ActionType[action.type]);
    switch(action.type) {
        // == Profile Element modification == //
        case ActionType.ChangeAbstract:
            return handleChangeAbstract(state, <ChangeStringValueAction> action);
        case ActionType.ChangeLanguageSkillLevel:
            return handleChangeLanguageSkillLevel(state, <ChangeLanguageSkillLevelAction> action);
        case ActionType.ChangeDate: {
            let newProfile: Profile = ProfileReducer.reducerHandleChangeDate(state.profile, <ChangeDateAction> action);
            return state.updateProfile(newProfile);
        }
        case ActionType.ChangeItemId: {
            let newProfile: Profile = ProfileReducer.reducerHandleItemIdChange(state.profile, <ChangeItemIdAction> action);
            return state.updateProfile(newProfile);
        }
        case ActionType.DeleteEntry: {
            let newProfile: Profile = ProfileReducer.reducerHandleRemoveEntry(state.profile, <DeleteEntryAction> action);
            return state.updateProfile(newProfile);
        }
        case ActionType.CreateEntry: {
            let newProfile: Profile = ProfileReducer.reducerHandleCreateEntry(state.profile, <CreateEntryAction> action);
            return state.updateProfile(newProfile);
        }
        case ActionType.ChangeCurrentPosition: {
            let newProfile: Profile = ProfileReducer.reducerHandleChangeCurrentPosition(state.profile, <ChangeStringValueAction> action);
            return state.updateProfile(newProfile);
        }
        case ActionType.ChangeDegree: {
            let newProfile: Profile = ProfileReducer.changeDegree(state.profile, <ChangeDegreeAction> action);
            return state.updateProfile(newProfile);
        }
        case ActionType.CreateEntity:
            return handleCreateNameEntity(state, <CreateNameEntityAction> action);
        // == Language Suggestion requests == //
        case ActionType.APIRequestPending:
            return state.changeAPIRequestStatus(RequestStatus.Pending);
        case ActionType.APIRequestFail:
            return state.changeAPIRequestStatus(RequestStatus.Failiure);
        case ActionType.APIRequestSuccess:
            return handleRequestAPISuccess(state, <ReceiveAPIResponseAction> action);
        default:
            return state;
    }
}