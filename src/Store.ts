import {InternalDatabase} from './model/InternalDatabase';
import {AdminState} from './model/admin/AdminState';
import {StatisticsStore} from './model/statistics/StatisticsStore';

/**
 * State encapsulating all consultants.
 */
export interface AllConsultantsState {
    requestingConsultants: boolean;
}

export enum RequestStatus {
    Pending,
    Successful,
    Failiure,
    Inactive
}

export enum APIRequestType {
    RequestCareers,
    RequestKeySkills,
    RequestProjectRoles,
    RequestCompanies,
    RequestSectors,
    RequestTrainings,
    RequestQualifications,
    RequestEducations,
    RequestProfile,
    RequestCreateViewProfile,
    SaveProfile,
    RequestLanguages,
    RequestExportDocs
}

export enum ProfileElementType {
    SkillEntry,
    SectorEntry,
    TrainingEntry,
    EducationEntry,
    QualificationEntry,
    LanguageEntry,
    KeySkill,
    Project,
    CareerEntry,
    Company,
    ProjectRole
}




export interface ApplicationState {
    databaseReducer: InternalDatabase;
    adminReducer: AdminState;
    statisticsReducer: StatisticsStore;
}

