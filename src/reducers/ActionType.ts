/**
 * Created by nt on 29.05.2017.
 */

import {MetaDataActionCreator} from './metadata/MetaDataActions';
import AddOrReplaceBuildInfo = MetaDataActionCreator.AddOrReplaceBuildInfo;
export enum ActionType {

    AddSkill,
    SwapIndex,
    UserLoginFailed,

    ChangeViewProfileName,
    ChangeViewProfileDescription,
    ChangeViewProfileCharsPerLine,
    ReceiveViewProfile,
    SortViewProfile,
    SetSelectedIndexes,
    SelectViewProfile,
    DeleteViewProfile,
    SaveViewProfile,
    /* Clears all cached view profiles from the client */
    ClearViewProfiles,
    ReplaceExportDocuments,

    SetUserInitials,

    LogOutUser,
    DeleteSkill,
    UpdateSkillRating,
    LogInUser,
    CreateProject,
    DeleteProject,
    SaveProject,
    SaveEntry,
    CreateEntry,
    DeleteEntry,
    APIRequestSuccess,
    APIRequestSuccess_NoContent,
    APIRequestFail,
    APIRequestPending,
    ChangeLanguageSkillLevel,

    ChangeFirstName,
    ChangeLastName,
    ChangeBirthDate,
    RequestConsultants,
    ReceiveConsultants,
    // == Single ConsultantProfile Actions == //
    ChangeAbstract,
    // == Admin Actions
    RequestNotifications,
    ReceiveNotifications,
    FailRequestNotifications,

    RequestTrashedNotifications,
    ReceiveTrashedNotifications,
    FailRequestTrashedNotifications,

    RequestNotificationTrashing,

    AdminNavigate,
    AdminRequestStatus,

    ChangeUsername,
    ChangePassword,

    ChangeAdminLoginStatus,
    LogInAdmin,
    LogOutAdmin,

    /**
     * Requests all consultant informations that are available. This should replace the old informations available.
     */
    ReceiveAllConsultants,
    ReceiveSingleConsultant,

    OpenSkillNotificationDialog,
    SetSkillNotificationEditStatus,
    CloseAndResetSkillNotificationDlg,
    SetSkillNotificationError,
    SetSkillNotificationAction,
    SetNewSkillName,

    // == Statistics
    ReceiveSkillUsageMetrics,
    ReceiveRelativeSkillUsageMetrics,
    ReceiveProfileSkillMetrics,
    ReceiveNetwork,
    ReceiveConsultantClusterInfo,
    StatisticsAvailable,
    StatisticsNotAvailable,
    ReceiveScatterSkills,
    AddNameEntityUsageInfo,
    AddSkillUsageInfo,

    // == Skill reducer
    AddCategoryToTree,
    AddSkillToTree,
    ReadSkillHierarchy,

    UpdateSkillCategory,
    RemoveSkillCategory,
    MoveSkill,
    RemoveSkillServiceSkill,
    UpdateSkillServiceSkill,
    BatchAddSkills,

    SetCurrentSkillName,
    SetCurrentSkillRating,
    SetAddSkillStep,
    StepBackToSkillInfo,
    ChangeSkillComment,
    SetCurrentChoice,
    SetAddSkillError,
    SetNoCategoryReason,
    ResetAddSkillDialog,

    // == MEta data
    AddOrReplaceBuildInfo,
    SetServiceAvaiabiltiy,

    // == Navigation
    SetCurrentLocation,
    SetNavigationTarget,
    DropNavigationTarget,
}