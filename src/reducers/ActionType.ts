/**
 * Created by nt on 29.05.2017.
 */

export enum ActionType {

    SaveLanguageSkill = "SaveLanguageSkill",
    SetModifiedStatus = "SetModifiedStatus",
    ClearUserInitials = "ClearUserInitials",

    AddSkill = "AddSkill",
    RemoveSkillFromProject = "RemoveSkillFromProject",
    UserLoginFailed = "UserLoginFailed",
    ReplaceExportDocuments = "ReplaceExportDocuments",

    SetUserInitials = "SetUserInitials",

    LogOutUser = "LogOutUser",
    DeleteSkill = "DeleteSkill",
    UpdateSkillRating = "UpdateSkillRating",
    LogInUser = "LogInUser",
    CreateProject = "CreateProject",
    DeleteProject = "DeleteProject",
    SaveProject = "SaveProject",
    SaveEntry = "SaveEntry",
    CreateEntry = "CreateEntry",
    DeleteEntry = "DeleteEntry",
    APIRequestSuccess = "APIRequestSuccess",
    ChangeLanguageSkillLevel = "ChangeLanguageSkillLevel",

    ChangeFirstName = "ChangeFirstName",
    ChangeLastName = "ChangeLastName",
    ChangeBirthDate = "ChangeBirthDate",
    RequestConsultants = "RequestConsultants",
    ReceiveConsultants = "ReceiveConsultants",
    // == Single ConsultantProfile Actions == //
    ChangeAbstract = "ChangeAbstract",
    // == Admin Actions
    ReceiveNotifications = "ReceiveNotifications",
    ReceiveTrashedNotifications = "ReceiveTrashedNotifications",
    AdminRequestStatus = "AdminRequestStatus",
    SetCustomSkillFiltering = "SetCustomSkillFiltering",
    ChangeUsername = "ChangeUsername",
    ChangePassword = "ChangePassword",
    ChangeAdminLoginStatus = "ChangeAdminLoginStatus",
    LogInAdmin = "LogInAdmin",
    LogOutAdmin = "LogOutAdmin",

    /**
     * Requests all consultant informations that are available. This should replace the old informations available.
     */
    ReceiveAllConsultants = "ReceiveAllConsultants",
    ReceiveSingleConsultant = "ReceiveSingleConsultant",

    // == Notification Dialog
    OpenSkillNotificationDialog = "OpenSkillNotificationDialog",
    SetSkillNotificationEditStatus = "SetSkillNotificationEditStatus",
    CloseAndResetSkillNotificationDlg = "CloseAndResetSkillNotificationDlg",
    SetSkillNotificationError = "SetSkillNotificationError",
    SetSkillNotificationAction = "SetSkillNotificationAction",
    SetNewSkillName = "SetNewSkillName",

    // == Report Upload
    SetReportUploadPending = "SetReportUploadPending",
    SetReportUploadProgress = "SetReportUploadProgress",

    // == Statistics
    ReceiveSkillUsageMetrics = "ReceiveSkillUsageMetrics",
    ReceiveRelativeSkillUsageMetrics = "ReceiveRelativeSkillUsageMetrics",
    ReceiveProfileSkillMetrics = "ReceiveProfileSkillMetrics",
    ReceiveNetwork = "ReceiveNetwork",
    ReceiveConsultantClusterInfo = "ReceiveConsultantClusterInfo",
    StatisticsAvailable = "StatisticsAvailable",
    StatisticsNotAvailable = "StatisticsNotAvailable",
    ReceiveScatterSkills = "ReceiveScatterSkills",
    AddNameEntityUsageInfo = "AddNameEntityUsageInfo",
    AddSkillUsageInfo = "AddSkillUsageInfo",

    // == Skill reducer
    AddCategoryToTree = "AddCategoryToTree",
    AddSkillToTree = "AddSkillToTree",
    ReadSkillHierarchy = "ReadSkillHierarchy",
    SetTreeChildrenOpen = "SetTreeChildrenOpen",
    FilterTree = "FilterTree",
    MoveCategory = "MoveCategory",
    UpdateSkillCategory = "UpdateSkillCategory",
    RemoveSkillCategory = "RemoveSkillCategory",
    MoveSkill = "MoveSkill",
    RemoveSkillServiceSkill = "RemoveSkillServiceSkill",
    UpdateSkillServiceSkill = "UpdateSkillServiceSkill",
    BatchAddSkills = "BatchAddSkills",
    LoadTree = "LoadTree",
    SetCurrentSkillName = "SetCurrentSkillName",
    SetCurrentSkillRating = "SetCurrentSkillRating",
    SetAddSkillStep = "SetAddSkillStep",
    StepBackToSkillInfo = "StepBackToSkillInfo",
    ChangeSkillComment = "ChangeSkillComment",
    SetCurrentChoice = "SetCurrentChoice",
    SetAddSkillError = "SetAddSkillError",
    SetNoCategoryReason = "SetNoCategoryReason",
    SetDoneMessage = "SetDoneMessage",
    SetAddToProjectId = "SetAddToProjectId",
    ResetAddSkillDialog = "ResetAddSkillDialog",

    // == Meta data
    AddOrReplaceBuildInfo = "AddOrReplaceBuildInfo",
    AddOrReplaceClientInfo = "AddOrReplaceClientInfo",
    SetServiceAvaiabiltiy = "SetServiceAvaiabiltiy",

    // == Navigation
    SetCurrentLocation = "SetCurrentLocation",
    SetNavigationTarget = "SetNavigationTarget",
    DropNavigationTarget = "DropNavigationTarget",

    // == View Profile
    SetViewProfile = "SetViewProfile",
    RemoveViewProfile = "RemoveViewProfile",
    SetSortInProgress = "SetSortInProgress",
    ResetViewState = "ResetViewState",
    ClearViewProfiles = "ClearViewProfiles",

    // == Cross Cutting
    SetRequestPending = "SetRequestPending",

    // == Templates
    SetTemplate = "SetTemplate",
    RemoveTemplate = "RemoveTemplate",
    ResetTemplate = "ResetTemplate",
    ClearTemplates = "ClearTemplates",
    CreateTemplate = "CreateTemplate",
    ChangeTemplate = "ChangeTemplate",
    SetPreview = "SetPreview",
    TemplateRequestFailed = "TemplateRequestFailed",

    // == Profile Actions
    UpdateEntrySuccessful = "[Profile] UpdateEntrySuccessful",
    DeleteEntrySuccessful = "[Profile] DeleteEntrySuccessful",
    UpdateProfileSkillSuccessful = "[Profile] UpdateProfileSkillSuccessful",
    DeleteProfileSkillSuccessful = "[Profile] DeleteProfileSkillSuccessful",
    UpdateProjectSuccessful = "[Profile] UpdateProjectSuccessful",
    DeleteProjectSuccessful = "[Profile] DeleteProjectSuccessful",
    LoadBaseProfileAction = "[Profile] LoadBaseProfileAction",
    LoadEntriesAction = "[Profile] LoadEntriesAction",
    LoadSkillsAction = "[Profile] LoadSkillsAction",
    LoadProjectsAction = "[Profile] LoadProjectsAction",

    // == Profile => Projects
    SelectProject = "[Profile][Project] SelectProject",
    SetEditingProject = "[Profile][Project] SetEditingProject",
    EditSelectedProject = "[Profile][Project] EditSelectedProject",
    CancelEditSelectedProject = "[Profile][Project] CancelEditSelectedProject",

    // == Consultant
    UpdateConsultantAction = "UpdateConsultantAction",

    // == SuggestionActions
    UpdateSuggestionField = "UpdateSuggestionField",
    UpdateSkillSuggestionField = "UpdateSkillSuggestionField",
}
