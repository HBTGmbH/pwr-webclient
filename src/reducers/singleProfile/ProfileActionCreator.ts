import {APIRequestType, ProfileElementType} from '../../Store';
import {AbstractAction, ActionType} from '../reducerIndex';
import {NameEntity} from '../../model/NameEntity';
import {
    ChangeStringValueAction,
    CreateEntryAction,
    DeleteEntryAction, DeleteProjectAction,
    ReceiveAPIResponseAction,
    SaveEntryAction, SaveProjectAction, UpdateNameEntityAction
} from './database-actions';
import {Project} from '../../model/Project';

export class ProfileActionCreator {
    public static changeAbstract(newAbstract: string): ChangeStringValueAction {
        return {
            type: ActionType.ChangeAbstract,
            value: newAbstract
        };
    }

    /**
     * Creates an action that updates the state so that its profile request status is pending.
     * @returns {{type: ActionType}}
     */
    public static APIRequestPending() : AbstractAction {
        return {
            type: ActionType.APIRequestPending
        };
    }

    /**
     * Creates an action that update the state so the received consultant profile is used to replace
     * the current profile.
     * @param payload
     * @param reqType
     */
    public static APIRequestSuccessfull(payload: any, reqType: APIRequestType) : ReceiveAPIResponseAction {
        return {
            type: ActionType.APIRequestSuccess,
            payload: payload,
            requestType: reqType
        };
    }

    public static APIRequestFailed() : AbstractAction {
        return { type: ActionType.APIRequestFail };
    }

    public static deleteEntry(id: string, elementType: ProfileElementType): DeleteEntryAction {
        return {
            type: ActionType.DeleteEntry,
            elementType: elementType,
            elementId: id
        };
    }

    public static createEntry(elementType: ProfileElementType): CreateEntryAction {
        return {
            type: ActionType.CreateEntry,
            entryType: elementType
        };
    }

    public static saveEntry(entry: any, nameEntity: NameEntity, elementType: ProfileElementType): SaveEntryAction {
        return {
            type: ActionType.SaveEntry,
            entry: entry,
            nameEntity: nameEntity,
            entryType: elementType
        };
    }

    public static saveProject(project: Project, newCompanies: Array<NameEntity>, newRoles: Array<NameEntity>): SaveProjectAction {
        return {
            type: ActionType.SaveProject,
            project: project,
            newCompanies: newCompanies,
            newRoles: newRoles
        }
    }

    public static deleteProject(id: string): DeleteProjectAction {
        return {
            type: ActionType.DeleteProject,
            id: id
        }
    }

    public static createProject(): AbstractAction {
        return {
            type: ActionType.CreateProject
        }
    }


}

