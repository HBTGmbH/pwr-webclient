import * as redux from 'redux';
import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {
    getAllCurrentlyUsedSkillNames,
    getCareerSuggestionAPIString,
    getCompanySuggestionsAPIString,
    getConsultantApiString,
    getEducationSuggestionAPIString,
    getExportDocuments,
    getKeySkillsSuggestionAPIString,
    getLangSuggestionAPIString,
    getProfileAPIString,
    getProjectRolesSuggestionAPIString,
    getQualificationSuggestionAPIString,
    getSectorsSuggestionAPIString,
    getTrainingSuggestionAPIString,
    postGenerateProfile
} from '../../API_CONFIG';
import {APIProfile} from '../../model/APIProfile';
import {InternalDatabase} from '../../model/InternalDatabase';
import {AllConsultantsState, APIRequestType, ApplicationState} from '../../Store';
import {ProfileActionCreator} from './ProfileActionCreator';
import {ActionType} from '../ActionType';
import {ConsultantInfo} from '../../model/ConsultantInfo';
import {StatisticsActionCreator} from '../statistics/StatisticsActionCreator';
import {APIExportDocument, ExportDocument} from '../../model/ExportDocument';

export class ProfileAsyncActionCreator {

    private static logAxiosError(error: any) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error(error.response.data);
            console.error(error.response.status);
            console.error(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.error(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error', error.message);
        }
    }


    public static requestAllNameEntities() {
        return function(dispatch: redux.Dispatch<ApplicationState>) {
            console.log("Requesting all.",{});
            dispatch(ProfileAsyncActionCreator.requestQualifications());
            dispatch(ProfileAsyncActionCreator.requestLanguages());
            dispatch(ProfileAsyncActionCreator.requestEducations());
            dispatch(ProfileAsyncActionCreator.requestTrainings());
            dispatch(ProfileAsyncActionCreator.requestSectors());
            dispatch(ProfileAsyncActionCreator.requestCompanies());
            dispatch(ProfileAsyncActionCreator.requestProjectRoles());
            dispatch(ProfileAsyncActionCreator.requestKeySkills());
            dispatch(ProfileAsyncActionCreator.requestCareers());
        }
    }
    /**
     *
     * @param initials
     * @returns {(dispatch:redux.Dispatch<AllConsultantsState>)=>undefined}
     */
    public static requestSingleProfile(initials: string) {
        return function(dispatch: redux.Dispatch<AllConsultantsState>) {
            // Dispatch the action that sets the status to "Request Pendign" or similar
            dispatch(ProfileActionCreator.APIRequestPending());
            // Perform the actual request
            axios.get(getProfileAPIString(initials)).then(function(response: AxiosResponse) {
                let profile: APIProfile = Object.assign({}, response.data);
                // Parse the dates.
                dispatch(ProfileActionCreator.APIRequestSuccessfull(profile, APIRequestType.RequestProfile));
            }).catch(function(error:any) {
                ProfileAsyncActionCreator.logAxiosError(error);
                dispatch(ProfileActionCreator.APIRequestFailed());
            });

        };
    }

    public static saveFullProfile(initials: string, profile: APIProfile) {
        return function(dispatch: redux.Dispatch<AllConsultantsState>) {
            dispatch(ProfileActionCreator.APIRequestPending());
            axios.put(getProfileAPIString(initials), profile).then(function(response: AxiosResponse) {
                console.info('Notifications: ', response.data.notifications);
                dispatch(ProfileActionCreator.APIRequestSuccessfull(response.data, APIRequestType.SaveProfile));
            }).catch(function(error:any) {
                ProfileAsyncActionCreator.logAxiosError(error);
                dispatch(ProfileActionCreator.APIRequestFailed());
            });
        };
    }

    private static abstractAPISuggestionRequest(dispatch: redux.Dispatch<AllConsultantsState>, apiString: string, type:APIRequestType) {
        dispatch(ProfileActionCreator.APIRequestPending());
        axios.get(apiString).then(function(response: AxiosResponse) {
            dispatch(ProfileActionCreator.APIRequestSuccessfull(response.data, type));
        }).catch(function(error:any) {
            ProfileAsyncActionCreator.logAxiosError(error);
            dispatch(ProfileActionCreator.APIRequestFailed());
        });
    }

    public static requestLanguages() {
        return function(dispatch: redux.Dispatch<AllConsultantsState>) {
            ProfileAsyncActionCreator.abstractAPISuggestionRequest(dispatch, getLangSuggestionAPIString(), APIRequestType.RequestLanguages);
        };
    }

    public static requestEducations() {
        return function(dispatch: redux.Dispatch<InternalDatabase>) {
            ProfileAsyncActionCreator.abstractAPISuggestionRequest(
                dispatch,
                getEducationSuggestionAPIString(),
                APIRequestType.RequestEducations);
        };
    }

    public static requestQualifications() {
        return function(dispatch: redux.Dispatch<InternalDatabase>) {
            ProfileAsyncActionCreator.abstractAPISuggestionRequest(
                dispatch,
                getQualificationSuggestionAPIString(),
                APIRequestType.RequestQualifications);
        };
    }

    public static requestTrainings() {
        return function(dispatch: redux.Dispatch<InternalDatabase>) {
            ProfileAsyncActionCreator.abstractAPISuggestionRequest(
                dispatch,
                getTrainingSuggestionAPIString(),
                APIRequestType.RequestTrainings);
        };
    }

    public static requestSectors() {
        return function(dispatch: redux.Dispatch<InternalDatabase>) {
            ProfileAsyncActionCreator.abstractAPISuggestionRequest(
                dispatch,
                getSectorsSuggestionAPIString(),
                APIRequestType.RequestSectors);
        };
    }

    public static requestKeySkills() {
        return function(dispatch: redux.Dispatch<InternalDatabase>) {
            ProfileAsyncActionCreator.abstractAPISuggestionRequest(
                dispatch,
                getKeySkillsSuggestionAPIString(),
                APIRequestType.RequestKeySkills);
        };
    }


    public static requestCareers() {
        return function(dispatch: redux.Dispatch<InternalDatabase>) {
            ProfileAsyncActionCreator.abstractAPISuggestionRequest(
                dispatch,
                getCareerSuggestionAPIString(),
                APIRequestType.RequestCareers);
        };
    }

    public static requestProjectRoles() {
        return function(dispatch: redux.Dispatch<InternalDatabase>) {
            ProfileAsyncActionCreator.abstractAPISuggestionRequest(
                dispatch,
                getProjectRolesSuggestionAPIString(),
                APIRequestType.RequestProjectRoles);
        };
    }

    public static requestCompanies() {
        return function(dispatch: redux.Dispatch<InternalDatabase>) {
            ProfileAsyncActionCreator.abstractAPISuggestionRequest(
                dispatch,
                getCompanySuggestionsAPIString(),
                APIRequestType.RequestCompanies);
        };
    }

    public static logInUser(initials: string) {
        return function(dispatch: redux.Dispatch<InternalDatabase>, getState: () => ApplicationState) {
            axios.get(getConsultantApiString(initials)).then(function(response: AxiosResponse) {
                dispatch(ProfileAsyncActionCreator.requestSingleProfile(initials));
                dispatch({
                    type: ActionType.LogInUser,
                    consultantInfo: ConsultantInfo.fromAPI(response.data)
                });
                dispatch(ProfileAsyncActionCreator.requestAllNameEntities());
                dispatch(StatisticsActionCreator.AsyncGetProfileStatistics(initials));
                dispatch(StatisticsActionCreator.AsyncCheckAvailability());
            }).catch(function(error:any) {
                ProfileAsyncActionCreator.logAxiosError(error);
                dispatch(ProfileActionCreator.FailLogin());
            });
        };
    }

    public static generatePDFProfile(initials: string, viewProfileId: string) {
        return function(dispatch: redux.Dispatch<AllConsultantsState>) {
            let config: AxiosRequestConfig = {
                params: {
                    viewid: viewProfileId,
                    type: "PDF"
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            dispatch(ProfileActionCreator.APIRequestPending());
            axios.post(postGenerateProfile(initials), null, config).then((response: AxiosResponse) => {
                let location = response.data.filelocation;
                console.info("Received location: ", location);
                window.open(location, "_blank");
                dispatch(ProfileActionCreator.SucceedAPIRequest());
            }).catch(function (error: any) {
                ProfileAsyncActionCreator.logAxiosError(error);
                dispatch(ProfileActionCreator.APIRequestFailed());
            });
        }
    }

    public static generateDocXProfile(initials: string, viewProfileId: string) {
        return function(dispatch: redux.Dispatch<AllConsultantsState>) {
            let config: AxiosRequestConfig = {
                params: {
                    viewid: viewProfileId,
                    type: "DOC"
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            dispatch(ProfileActionCreator.APIRequestPending());
            axios.post(postGenerateProfile(initials), null, config).then((response: AxiosResponse) => {
                let location = response.data.filelocation;
                console.info("Received location: ", location);
                window.open(location, "_blank");
                dispatch(ProfileActionCreator.SucceedAPIRequest());
            }).catch(function (error: any) {
                ProfileAsyncActionCreator.logAxiosError(error);
                dispatch(ProfileActionCreator.APIRequestFailed());
            });
        }
    }

    public static getAllExportDocuments(initials: string) {
        return function(dispatch: redux.Dispatch<AllConsultantsState>) {
            axios.get(getExportDocuments(initials)).then((response: AxiosResponse) => {
                let apiExportDocs: Array<APIExportDocument> = response.data;
                let exportDocs = apiExportDocs.map(value => ExportDocument.fromAPI(value));
                dispatch(ProfileActionCreator.APIRequestSuccessfull(exportDocs, APIRequestType.RequestExportDocs));
            }).catch(function (error: any) {
                ProfileAsyncActionCreator.logAxiosError(error);
                dispatch(ProfileActionCreator.APIRequestFailed());
            });
        }
    }

    public static getAllCurrentlyUsedSkills() {
        return function(dispatch: redux.Dispatch<AllConsultantsState>) {
            axios.get(getAllCurrentlyUsedSkillNames()).then((response: AxiosResponse) => {
                let apiData: Array<String> = response.data;
                dispatch(ProfileActionCreator.APIRequestSuccessfull(apiData, APIRequestType.RequestSkillNames))
            }).catch(function (error: any) {
                ProfileAsyncActionCreator.logAxiosError(error);
                dispatch(ProfileActionCreator.APIRequestFailed());
            });
        }
    }
}