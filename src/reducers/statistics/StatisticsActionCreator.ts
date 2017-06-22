import * as redux from 'redux';
import {ApplicationState} from '../../Store';
import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {
    getConsultantClusterInfo,
    getKMedProfileNetwork,
    getProfileStatistics,
    getSkillUsageRelative,
    getSkillUsagesAbsolute,
    headStatisticsServiceAvailable
} from '../../API_CONFIG';
import {APINetwork, APISkillUsageMetric} from '../../model/statistics/ApiMetrics';
import {SkillUsageMetric} from '../../model/statistics/SkillUsageMetric';
import {
    ReceiveConsultantClusterInfoAction, ReceiveNetworkAction, ReceiveProfileSkillMetrics,
    ReceiveSkillUsageMetricsAction
} from './statistics-actions';
import {ActionType} from '../ActionType';
import {ProfileSkillMetrics} from '../../model/statistics/ProfileSkillMetrics';
import {Network} from '../../model/statistics/Network';
import {AbstractAction} from '../profile/database-actions';
import {ConsultantClusterInfo} from '../../model/statistics/ConsultantClusterInfo';

export class StatisticsActionCreator {

    public static ReceiveSkillUsageMetrics(metrics: Array<SkillUsageMetric>): ReceiveSkillUsageMetricsAction {
        return {
            type: ActionType.ReceiveSkillUsageMetrics,
            metrics: metrics
        }
    }

    public static ReceiveRelativeSkillUsageMetrics(metrics: Array<SkillUsageMetric>): ReceiveSkillUsageMetricsAction {
        return {
            type: ActionType.ReceiveRelativeSkillUsageMetrics,
            metrics: metrics
        }
    }

    public static ReceiveProfileMetrics(metrics: ProfileSkillMetrics): ReceiveProfileSkillMetrics {
        return {
            type: ActionType.ReceiveProfileSkillMetrics,
            metrics: metrics
        }
    }

    public static ReceiveNetwork(network: Network): ReceiveNetworkAction {
        return {
            type: ActionType.ReceiveNetwork,
            network: network
        }
    }

    public static StatisticsAvailable() : AbstractAction {
        return {
            type: ActionType.StatisticsAvailable
        }
    }


    public static StatisticsNotAvailable() : AbstractAction {
        return {
            type: ActionType.StatisticsNotAvailable
        }
    }

    public static ReceiveConsultantClusterInfo(consultantClusterInfo: ConsultantClusterInfo): ReceiveConsultantClusterInfoAction {
        return {
            type: ActionType.ReceiveConsultantClusterInfo,
            consultantClusterInfo: consultantClusterInfo
        }
    }

    public static AsyncCheckAvailability() {
        return function(dispatch: redux.Dispatch<ApplicationState>) {
            axios.head(headStatisticsServiceAvailable()).then((response: AxiosResponse) => {
                dispatch(StatisticsActionCreator.StatisticsAvailable());
            }).catch(error => {
                dispatch(StatisticsActionCreator.StatisticsNotAvailable());
            })
        }
    }

    public static AsyncRequestSkillUsages() {
        return function(dispatch: redux.Dispatch<ApplicationState>) {
            let config: AxiosRequestConfig = {
                params: {
                    max: 50
                }
            };
            axios.get(getSkillUsagesAbsolute(), config).then(function(response: AxiosResponse) {
                let data: Array<APISkillUsageMetric> = response.data;
                let res: Array<SkillUsageMetric> = data.map(value => SkillUsageMetric.fromAPI(value));
                dispatch(StatisticsActionCreator.ReceiveSkillUsageMetrics(res));
                dispatch(StatisticsActionCreator.StatisticsAvailable());
            }).catch(function(error:any) {
                console.error(error);
                dispatch(StatisticsActionCreator.AsyncCheckAvailability());
            });
            config.params = {
                max: 50
            };
            axios.get(getSkillUsageRelative(), config).then(function(response: AxiosResponse) {
                let data: Array<APISkillUsageMetric> = response.data;
                let res: Array<SkillUsageMetric> = data.map(value => SkillUsageMetric.fromAPI(value));
                dispatch(StatisticsActionCreator.ReceiveRelativeSkillUsageMetrics(res));
                dispatch(StatisticsActionCreator.StatisticsAvailable());
            }).catch(function(error:any) {
                console.error(error);
                dispatch(StatisticsActionCreator.AsyncCheckAvailability());
            });
        };
    }

    public static AsyncGetProfileStatistics(initials: string) {
        return function(dispatch: redux.Dispatch<ApplicationState>) {
            axios.get(getProfileStatistics(initials)).then(function (response: AxiosResponse) {
                dispatch(StatisticsActionCreator.ReceiveProfileMetrics(ProfileSkillMetrics.fromAPI(response.data)));
                dispatch(StatisticsActionCreator.StatisticsAvailable());
            }).catch(function(error:any) {
                console.error(error);
                dispatch(StatisticsActionCreator.AsyncCheckAvailability());
            });
        }
    }

    public static AsyncRequestNetwork() {
        return function(dispatch: redux.Dispatch<ApplicationState>) {
            axios.get(getKMedProfileNetwork()).then((response: AxiosResponse) => {
                let network: Network = Network.fromAPI(response.data as APINetwork);
                dispatch(StatisticsActionCreator.ReceiveNetwork(network));
                dispatch(StatisticsActionCreator.StatisticsAvailable());
            }).catch(function(error:any) {
                console.error(error);
                dispatch(StatisticsActionCreator.AsyncCheckAvailability());
            });
        }
    }

    public static AsyncRequestConsultantClusterInfo(initials: string) {
        return function(dispatch: redux.Dispatch<ApplicationState>) {
            axios.get(getConsultantClusterInfo(initials)).then((response: AxiosResponse) => {
                let info: ConsultantClusterInfo = ConsultantClusterInfo.fromAPI(response.data);
                dispatch(StatisticsActionCreator.ReceiveConsultantClusterInfo(info));
                dispatch(StatisticsActionCreator.StatisticsAvailable());
            }).catch(function(error:any) {
                console.error(error);
                dispatch(StatisticsActionCreator.AsyncCheckAvailability());
            });
        }
    }
}