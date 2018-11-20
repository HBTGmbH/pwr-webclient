import {APIRequestType, ProfileElementType} from '../../Store';
import {error, isNullOrUndefined} from 'util';
import {
    AbstractAction,
    AddSkillAction,
    ChangeStringValueAction,
    CreateEntryAction,
    DeleteEntryAction,
    DeleteProjectAction,
    DeleteSkillAction,
    LoginAction,
    ReceiveAPIResponseAction,
    RemoveSkillFromProjectAction,
    SaveEntryAction,
    SaveProjectAction,
    UpdateSkillRatingAction
} from './database-actions';
import {ProfileStore} from '../../model/ProfileStore';
import {Profile} from '../../model/Profile';
import {ProfileReducer} from './profile-reducer';
import {NameEntity} from '../../model/NameEntity';
import {Project} from '../../model/Project';
import {APINameEntity} from '../../model/APIProfile';
import {ActionType} from '../ActionType';
import * as Immutable from 'immutable';
import {LoginStatus} from '../../model/LoginStatus';
import {ConsultantInfo} from '../../model/ConsultantInfo';

export class DatabaseReducer {
    private static AddAPINameEntities(names: Array<APINameEntity>, reference: Immutable.Map<string, NameEntity>): Immutable.Map<string, NameEntity> {
        let res: Immutable.Map<string, NameEntity> = reference;
        names.forEach(apiName => {
            let name: NameEntity = NameEntity.fromAPI(apiName);
            res = res.set(name.id(), name);
        });
        return res;
    }

    private static HandleChangeAbstract(state: ProfileStore, action: ChangeStringValueAction): ProfileStore {
        let newProfile: Profile = state.profile().description(action.value);
        return state.profile(newProfile);
    }


    private static DeleteEntry(state: ProfileStore, action: DeleteEntryAction): ProfileStore {
        let newProfile: Profile = ProfileReducer.reducerHandleRemoveEntry(state.profile(), action);
        return state.profile(newProfile);
    }

    private static CreateEntry(state: ProfileStore, action: CreateEntryAction): ProfileStore {
        let newProfile: Profile = ProfileReducer.reducerHandleCreateEntry(state.profile(), <CreateEntryAction> action);
        return state.profile(newProfile);
    }

    private static UpdateNameEntity(database: ProfileStore, entity: NameEntity, type: ProfileElementType): ProfileStore {
        switch (type) {
            case ProfileElementType.TrainingEntry:
                return database.trainings(database.trainings().set(entity.id(), entity));
            case ProfileElementType.SectorEntry:
                return database.sectors(database.sectors().set(entity.id(), entity));
            case ProfileElementType.EducationEntry:
                return database.educations(database.educations().set(entity.id(), entity));
            case ProfileElementType.QualificationEntry:
                return database.qualifications(database.qualifications().set(entity.id(), entity));
            case ProfileElementType.LanguageEntry:
                return database.languages(database.languages().set(entity.id(), entity));
            case ProfileElementType.CareerEntry:
                return database.careers(database.careers().set(entity.id(), entity));
            case ProfileElementType.KeySkill:
                return database.keySkills(database.keySkills().set(entity.id(), entity));
            default:
                throw error('Unknown switch value ' + ProfileElementType[type]);
        }
    }


    private static SaveEntry(database: ProfileStore, action: SaveEntryAction): ProfileStore {
        if (!isNullOrUndefined(action.nameEntity) && action.nameEntity.isNew) {
            database = DatabaseReducer.UpdateNameEntity(database, action.nameEntity, action.entryType);
        }
        let profile: Profile = ProfileReducer.reducerUpdateEntry(database.profile(), action);
        return database.profile(profile);
    }

    private static DeleteProject(database: ProfileStore, action: DeleteProjectAction): ProfileStore {
        let idToRemove: string = (<DeleteProjectAction> action).id;
        let newProfile: Profile = database.profile();
        newProfile = newProfile.projects(newProfile.projects().remove(idToRemove));
        return database.profile(newProfile);
    }

    private static SaveProject(database: ProfileStore, action: SaveProjectAction): ProfileStore {
        // project with role IDs cleared.
        let project: Project = database.profile().projects().get(action.state.project.id());
        project = project.description(action.state.project.description());
        project = project.name(action.state.project.name());
        project = project.endDate(action.state.project.endDate());
        project = project.startDate(action.state.project.startDate());
        project = project.isNew(action.state.project.isNew());
        project = project.roleIds(project.roleIds().clear());
        action.state.roles.forEach(role => {
            let projectRole: NameEntity = ProfileStore.findNameEntityByName(role, database.projectRoles());
            if (isNullOrUndefined(projectRole)) {
                projectRole = NameEntity.createNew(role);
                database = database.projectRoles(database.projectRoles().set(projectRole.id(), projectRole));
            }
            project = project.roleIds(project.roleIds().push(projectRole.id()));
        });

        // Fix end customer and broker
        let broker: NameEntity = ProfileStore.findNameEntityByName(action.state.brokerACValue, database.companies());
        if (isNullOrUndefined(broker)) {
            broker = NameEntity.createNew(action.state.brokerACValue);
            database = database.companies(database.companies().set(broker.id(), broker));
        }
        project = project.brokerId(broker.id());

        // End customer
        let endCustomer: NameEntity = ProfileStore.findNameEntityByName(action.state.clientACValue, database.companies());
        if (isNullOrUndefined(endCustomer)) {
            endCustomer = NameEntity.createNew(action.state.clientACValue);
            database = database.companies(database.companies().set(endCustomer.id(), endCustomer));
        }
        project = project.endCustomerId(endCustomer.id());

        let profile: Profile = ProfileReducer.reducerHandleSaveProject(database.profile(), project);
        return database.profile(profile);
    }

    private static CreateProject(database: ProfileStore): ProfileStore {
        let newProfile: Profile = database.profile();
        let proj: Project = Project.createNew();
        newProfile = newProfile.projects(newProfile.projects().set(proj.id(), proj));
        return database.profile(newProfile);
    }

    private static UpdateSkillRating(database: ProfileStore, action: UpdateSkillRatingAction): ProfileStore {
        return database.profile(ProfileReducer.reducerHandleUpdateSkillRating(database.profile(), action));
    }

    private static DeleteSkill(database: ProfileStore, action: DeleteSkillAction): ProfileStore {
        return database.profile(ProfileReducer.reducerHandleDeleteSkill(database.profile(), action));
    }

    private static ApiRequestSuccessful(state: ProfileStore, action: ReceiveAPIResponseAction): ProfileStore {
        let newState: ProfileStore = state;
        switch (action.requestType) {
            case APIRequestType.RequestLanguages:
                return state.languages(DatabaseReducer.AddAPINameEntities(action.payload, state.languages()));
            case APIRequestType.RequestProfile:
                return state.parseProfile(action.payload);
            case APIRequestType.SaveProfile:
                return state.parseProfile(action.payload.profile);
            case APIRequestType.RequestEducations:
                return state.educations(DatabaseReducer.AddAPINameEntities(action.payload, state.educations()));
            case APIRequestType.RequestQualifications:
                return state.qualifications(DatabaseReducer.AddAPINameEntities(action.payload, state.qualifications()));
            case APIRequestType.RequestTrainings:
                return state.trainings(DatabaseReducer.AddAPINameEntities(action.payload, state.trainings()));
            case APIRequestType.RequestSectors:
                return state.sectors(DatabaseReducer.AddAPINameEntities(action.payload, state.sectors()));
            case APIRequestType.RequestKeySkills:
                return state.keySkills(DatabaseReducer.AddAPINameEntities(action.payload, state.keySkills()));
            case APIRequestType.RequestCareers:
                return state.careers(DatabaseReducer.AddAPINameEntities(action.payload, state.careers()));
            case APIRequestType.RequestProjectRoles:
                return state.projectRoles(DatabaseReducer.AddAPINameEntities(action.payload, state.projectRoles()));
            case APIRequestType.RequestCompanies:
                return state.companies(DatabaseReducer.AddAPINameEntities(action.payload, state.companies()));
            case APIRequestType.RequestSkillNames:
                return state.currentlyUsedSkillNames(Immutable.Set<string>(action.payload));
        }
        return newState;
    }

    private static LogInUser(database: ProfileStore, action: LoginAction): ProfileStore {
        database = database.loginStatus(LoginStatus.SUCCESS);
        return database.loggedInUser(action.consultantInfo);
    }

    private static LogOutUser(database: ProfileStore): ProfileStore {
        database = database.loggedInUser(ConsultantInfo.empty());
        return database.profile(Profile.createDefault()).loginStatus(LoginStatus.INITIALS);
    }

    private static AddSkill(state: ProfileStore, action: AddSkillAction): ProfileStore {
        let profile = ProfileReducer.reducerHandleAddSkill(state.profile(), action);
        return state.profile(profile);
    }

    public static SetUserInitials(state: ProfileStore, initials: string,  checkValue?: boolean): ProfileStore {
        let loggedInUser = state.loggedInUser().initials(initials);
        let status = LoginStatus.INITIALS;
        if (checkValue) {
            status = initials.length > 0 ? LoginStatus.INITIALS : LoginStatus.INVALID_NAME;
        }
        return state.loggedInUser(loggedInUser).loginStatus(status);
    }

    public static Reduce(state: ProfileStore, action: AbstractAction): ProfileStore {
        console.debug("Database Reducer called with " + ActionType[action.type], action);
        if (isNullOrUndefined(state)) {
            state = ProfileStore.createWithDefaults();
        }
        switch (action.type) {
            case ActionType.ChangeAbstract:
                return DatabaseReducer.HandleChangeAbstract(state, action as ChangeStringValueAction);
            case ActionType.DeleteEntry:
                return DatabaseReducer.DeleteEntry(state, action as DeleteEntryAction);
            case ActionType.CreateEntry:
                return DatabaseReducer.CreateEntry(state, action as CreateEntryAction);
            case ActionType.SaveEntry:
                return DatabaseReducer.SaveEntry(state, action as SaveEntryAction);
            case ActionType.SaveProject:
                return DatabaseReducer.SaveProject(state, action as SaveProjectAction);
            case ActionType.DeleteProject:
                return DatabaseReducer.DeleteProject(state, action as DeleteProjectAction);
            case ActionType.CreateProject:
                return DatabaseReducer.CreateProject(state);
            case ActionType.UpdateSkillRating:
                return DatabaseReducer.UpdateSkillRating(state, action as UpdateSkillRatingAction);
            case ActionType.DeleteSkill:
                return DatabaseReducer.DeleteSkill(state, action as DeleteSkillAction);
            case ActionType.APIRequestSuccess:
                return DatabaseReducer.ApiRequestSuccessful(state, action as ReceiveAPIResponseAction);
            case ActionType.LogInUser:
                return DatabaseReducer.LogInUser(state, action as LoginAction);
            case ActionType.LogOutUser:
                return DatabaseReducer.LogOutUser(state);
            case ActionType.UserLoginFailed:
                return state.loginStatus(LoginStatus.REJECTED);
            case ActionType.AddSkill:
                return DatabaseReducer.AddSkill(state, action as AddSkillAction);
            case ActionType.SetUserInitials:
                return DatabaseReducer.SetUserInitials(state, (<ChangeStringValueAction>action).value, true);
            case ActionType.RemoveSkillFromProject: {
                let profile = ProfileReducer.reducerHandleRemoveSkillFromProject(state.profile(), action as RemoveSkillFromProjectAction);
                return state.profile(profile);
            }
            case ActionType.ClearUserInitials: {
                return DatabaseReducer.SetUserInitials(state, '', false);
            }
            default:
                return state;
        }
    }


}
