import * as redux from 'redux';
import * as Immutable from 'immutable';
import {ApplicationState} from '../reducerIndex';
import {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import {SkillUsageMetric} from '../../model/statistics/SkillUsageMetric';
import {
    AddNameEntityUsageInfoAction,
    AddSkillUsageInfoAction,
    ReceiveConsultantClusterInfoAction,
    ReceiveNetworkAction,
    ReceiveProfileSkillMetrics,
    ReceiveScatterSkillsAction,
    ReceiveSkillUsageMetricsAction
} from './statistics-actions';
import {ActionType} from '../ActionType';
import {ProfileSkillMetrics} from '../../model/statistics/ProfileSkillMetrics';
import {Network} from '../../model/statistics/Network';
import {ConsultantClusterInfo} from '../../model/statistics/ConsultantClusterInfo';
import {ScatterSkill} from '../../model/statistics/ScatterSkill';
import {ConsultantInfo} from '../../model/ConsultantInfo';
import {NameEntity} from '../profile-new/profile/model/NameEntity';
import {ProfileElementType} from '../../Store';
import {AbstractAction} from '../BaseActions';
import {StatisticsServiceClient} from '../../clients/StatisticsServiceClient';

const statisticsClient = StatisticsServiceClient.instance();

export class StatisticsActionCreator {

    public static ReceiveSkillUsageMetrics(metrics: Array<SkillUsageMetric>): ReceiveSkillUsageMetricsAction {
        return {
            type: ActionType.ReceiveSkillUsageMetrics,
            metrics: metrics
        };
    }

    public static ReceiveRelativeSkillUsageMetrics(metrics: Array<SkillUsageMetric>): ReceiveSkillUsageMetricsAction {
        return {
            type: ActionType.ReceiveRelativeSkillUsageMetrics,
            metrics: metrics
        };
    }

    public static ReceiveProfileMetrics(metrics: ProfileSkillMetrics): ReceiveProfileSkillMetrics {
        return {
            type: ActionType.ReceiveProfileSkillMetrics,
            metrics: metrics
        };
    }

    public static ReceiveNetwork(network: Network): ReceiveNetworkAction {
        return {
            type: ActionType.ReceiveNetwork,
            network: network
        };
    }

    public static StatisticsAvailable(): AbstractAction {
        return {
            type: ActionType.StatisticsAvailable
        };
    }


    public static StatisticsNotAvailable(): AbstractAction {
        return {
            type: ActionType.StatisticsNotAvailable
        };
    }

    public static ReceiveConsultantClusterInfo(consultantClusterInfo: ConsultantClusterInfo): ReceiveConsultantClusterInfoAction {
        return {
            type: ActionType.ReceiveConsultantClusterInfo,
            consultantClusterInfo: consultantClusterInfo
        };
    }

    public static ReceiveScatterSkills(scatterSkills: Immutable.List<ScatterSkill>): ReceiveScatterSkillsAction {
        return {
            type: ActionType.ReceiveScatterSkills,
            scatterSkills: scatterSkills
        };
    }

    public static AddSkillUsageInfo(skillName: string, consultants: Array<ConsultantInfo>): AddSkillUsageInfoAction {
        return {
            type: ActionType.AddSkillUsageInfo,
            consultantInfos: consultants,
            skillName: skillName
        };
    }

    public static AsyncCheckAvailability() {
        return function (dispatch: redux.Dispatch<ApplicationState>) {
            statisticsClient.headStatisticsServiceAvailable()
                .then((response: AxiosResponse) => dispatch(StatisticsActionCreator.StatisticsAvailable()))
                .catch(error => dispatch(StatisticsActionCreator.StatisticsNotAvailable()));
        };
    }

    public static AsyncRequestSkillUsages() {
        return function (dispatch: redux.Dispatch<ApplicationState>) {
            statisticsClient.getSkillUsagesAbsolute()
                .then(metrics => dispatch(StatisticsActionCreator.ReceiveSkillUsageMetrics(metrics.map(value => SkillUsageMetric.fromAPI(value)))))
                .then(() => dispatch(StatisticsActionCreator.StatisticsAvailable()))

                .catch((error: any) => console.error(error))
                .catch(() => dispatch(StatisticsActionCreator.AsyncCheckAvailability()));

            statisticsClient.getSkillUsageRelative()
                .then(metrics => dispatch(StatisticsActionCreator.ReceiveRelativeSkillUsageMetrics(metrics.map(value => SkillUsageMetric.fromAPI(value)))))
                .then(() => dispatch(StatisticsActionCreator.StatisticsAvailable()))

                .catch((error: any) => console.error(error))
                .catch(() => dispatch(StatisticsActionCreator.AsyncCheckAvailability()));

            dispatch(StatisticsActionCreator.AsyncRequestScatterSkills());
        };
    }

    public static AsyncGetProfileStatistics(initials: string) {
        return function (dispatch: redux.Dispatch<ApplicationState>) {
            statisticsClient.getProfileStatistics(initials)
                .then((metrics) => dispatch(StatisticsActionCreator.ReceiveProfileMetrics(ProfileSkillMetrics.fromAPI(metrics))))
                .then(() => dispatch(StatisticsActionCreator.StatisticsAvailable()))
                .catch((error: AxiosError) => console.error(error))
                .catch(() => dispatch(StatisticsActionCreator.AsyncCheckAvailability()));
        };
    }

    public static AsyncRequestNetwork() {
        return function (dispatch: redux.Dispatch<ApplicationState>) {
            statisticsClient.getKMedProfileNetwork()
                .then((network) => dispatch(StatisticsActionCreator.ReceiveNetwork(Network.fromAPI(network))))
                .then(() => dispatch(StatisticsActionCreator.StatisticsAvailable()))
                .catch((error: any) => console.error(error))
                .catch(() => dispatch(StatisticsActionCreator.AsyncCheckAvailability()));
        };
    }

    public static AsyncRequestConsultantClusterInfo(initials: string) {
        return function (dispatch: redux.Dispatch<ApplicationState>) {
            statisticsClient.getConsultantClusterInfo(initials)
                .then((info) =>
                    dispatch(StatisticsActionCreator.ReceiveConsultantClusterInfo(ConsultantClusterInfo.fromAPI(info))))
                .then(() => dispatch(StatisticsActionCreator.StatisticsAvailable()))
                .catch((error: any) => console.error(error))
                .catch(() => dispatch(StatisticsActionCreator.AsyncCheckAvailability()));
        };
    }

    public static AsyncRequestScatterSkills() {
        return function (dispatch: redux.Dispatch<ApplicationState>) {
            statisticsClient.getScatterSkills()
                .then((skills) => dispatch(StatisticsActionCreator.ReceiveScatterSkills(Immutable.List<ScatterSkill>(skills.map(value => ScatterSkill.fromAPI(value))))))
                .then((skills) => dispatch(StatisticsActionCreator.StatisticsAvailable()))
                .catch((error: any) => console.error(error))
                .catch(() => dispatch(StatisticsActionCreator.AsyncCheckAvailability()));
        };
    }

    /**
     * Requests name entity info unless the info is already available in the store.
     * @param nameEntity
     * @param type
     * @returns {(dispatch:redux.Dispatch<ApplicationState>, getState:()=>ApplicationState)=>undefined}
     * @constructor
     */
    public static AsyncRequestNameEntityUsageInfo(nameEntity: NameEntity, type: ProfileElementType) {
        return function (dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            let state = getState();
            if (!state.statisticsReducer.nameEntityUsageInfo().has(nameEntity)) {
                let config: AxiosRequestConfig = {
                    params: {
                        'name-entity': nameEntity.name,
                        'type': type
                    }
                };
                statisticsClient.getNameEntityUsageInfo(config)
                    .then((data) => dispatch(Object.assign({},
                        new AddNameEntityUsageInfoAction(ActionType.AddNameEntityUsageInfo, nameEntity,
                            data.map(value => ConsultantInfo.fromAPI(value))))))
                    .catch((error: any) => console.error(error))
                    .catch(() => dispatch(StatisticsActionCreator.AsyncCheckAvailability()));
            }
        };
    }

    public static AsyncRequestSkillUsageInfo(skillName: string) {
        return function (dispatch: redux.Dispatch<ApplicationState>, getState: () => ApplicationState) {
            let state = getState();
            if (!state.statisticsReducer.skillUsageInfo().has(skillName)) {
                statisticsClient.getSkillUsageInfo(skillName)
                    .then((infos) => dispatch(StatisticsActionCreator.AddSkillUsageInfo(skillName,
                        infos.map(value => ConsultantInfo.fromAPI(value)))))
                    .catch((error: any) => console.error(error))
                    .catch(() => dispatch(StatisticsActionCreator.AsyncCheckAvailability()));
            }
        };
    }
}
