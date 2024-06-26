import * as Immutable from 'immutable';
import {ApplicationState} from '../reducerIndex';
import {AxiosError, AxiosRequestConfig} from 'axios';
import {
    AddNameEntityUsageInfoAction,
    AddSkillUsageInfoAction,
    ReceiveConsultantClusterInfoAction,
    ReceiveProfileSkillMetrics,
    ReceiveScatterSkillsAction,
    ReceiveSkillUsageMetricsAction
} from './statistics-actions';
import {ActionType} from '../ActionType';
import {ConsultantInfo} from '../../model/ConsultantInfo';
import {NameEntity} from '../profile-new/profile/model/NameEntity';
import {ProfileElementType} from '../../Store';
import {AbstractAction} from '../BaseActions';
import {StatisticsServiceClient} from '../../clients/StatisticsServiceClient';
import {ThunkDispatch} from 'redux-thunk';
import {APIScatterSkill} from '../../model/statistics/ScatterSkill';
import {APIConsultantClusterInfo, APIProfileSkillMetric, APISkillUsageMetric} from '../../model/statistics/ApiMetrics';

const statisticsClient = StatisticsServiceClient.instance();

export class StatisticsActionCreator {

    public static ReceiveSkillUsageMetrics(metrics: Array<APISkillUsageMetric>): ReceiveSkillUsageMetricsAction {
        return {
            type: ActionType.ReceiveSkillUsageMetrics,
            metrics: metrics
        };
    }

    public static ReceiveRelativeSkillUsageMetrics(metrics: Array<APISkillUsageMetric>): ReceiveSkillUsageMetricsAction {
        return {
            type: ActionType.ReceiveRelativeSkillUsageMetrics,
            metrics: metrics
        };
    }

    public static ReceiveProfileMetrics(metrics: APIProfileSkillMetric): ReceiveProfileSkillMetrics {
        return {
            type: ActionType.ReceiveProfileSkillMetrics,
            metrics: metrics
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

    public static ReceiveConsultantClusterInfo(consultantClusterInfo: APIConsultantClusterInfo): ReceiveConsultantClusterInfoAction {
        return {
            type: ActionType.ReceiveConsultantClusterInfo,
            consultantClusterInfo: consultantClusterInfo
        };
    }

    public static ReceiveScatterSkills(scatterSkills: Immutable.List<APIScatterSkill>): ReceiveScatterSkillsAction {
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
        return function (dispatch: ThunkDispatch<any, any, any>) {
            statisticsClient.headStatisticsServiceAvailable()
                .then(() => dispatch(StatisticsActionCreator.StatisticsAvailable()))
                .catch(() => dispatch(StatisticsActionCreator.StatisticsNotAvailable()));
        };
    }

    public static AsyncRequestSkillUsages() {
        return function (dispatch: ThunkDispatch<any, any, any>) {
            statisticsClient.getSkillUsagesAbsolute()
                .then(metrics => dispatch(StatisticsActionCreator.ReceiveSkillUsageMetrics(metrics)))
                .then(() => dispatch(StatisticsActionCreator.StatisticsAvailable()))

                .catch((error: any) => console.error(error))
                .catch(() => dispatch(StatisticsActionCreator.AsyncCheckAvailability()));

            statisticsClient.getSkillUsageRelative()
                .then(metrics => dispatch(StatisticsActionCreator.ReceiveRelativeSkillUsageMetrics(metrics)))
                .then(() => dispatch(StatisticsActionCreator.StatisticsAvailable()))

                .catch((error: any) => console.error(error))
                .catch(() => dispatch(StatisticsActionCreator.AsyncCheckAvailability()));

            dispatch(StatisticsActionCreator.AsyncRequestScatterSkills());
        };
    }

    public static AsyncGetProfileStatistics(initials: string) {
        return function (dispatch: ThunkDispatch<any, any, any>) {
            statisticsClient.getProfileStatistics(initials)
                .then((metrics) => dispatch(StatisticsActionCreator.ReceiveProfileMetrics(metrics)))
                .then(() => dispatch(StatisticsActionCreator.StatisticsAvailable()))
                .catch((error: AxiosError) => console.error(error))
                .catch(() => dispatch(StatisticsActionCreator.AsyncCheckAvailability()));
        };
    }

    public static AsyncRequestConsultantClusterInfo(initials: string) {
        return function (dispatch: ThunkDispatch<any, any, any>) {
            statisticsClient.getConsultantClusterInfo(initials)
                .then((info) =>
                    dispatch(StatisticsActionCreator.ReceiveConsultantClusterInfo(info)))
                .then(() => dispatch(StatisticsActionCreator.StatisticsAvailable()))
                .catch((error: any) => console.error(error))
                .catch(() => dispatch(StatisticsActionCreator.AsyncCheckAvailability()));
        };
    }

    public static AsyncRequestScatterSkills() {
        return function (dispatch: ThunkDispatch<any, any, any>) {
            statisticsClient.getScatterSkills()
                .then((skills) => dispatch(StatisticsActionCreator.ReceiveScatterSkills(Immutable.List<APIScatterSkill>(skills))))
                .then(() => dispatch(StatisticsActionCreator.StatisticsAvailable()))
                .catch((error: any) => console.error(error))
                .catch(() => dispatch(StatisticsActionCreator.AsyncCheckAvailability()));
        };
    }

    public static AsyncRequestNameEntityUsageInfo(nameEntity: NameEntity, type: ProfileElementType) {
        return function (dispatch: ThunkDispatch<any, any, any>, getState: () => ApplicationState) {
            let state = getState();
            if (!state.statisticsReducer.nameEntityUsageInfo.has(nameEntity)) {
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
        return function (dispatch: ThunkDispatch<any, any, any>, getState: () => ApplicationState) {
            let state = getState();
            if (!state.statisticsReducer.skillUsageInfo.has(skillName)) {
                statisticsClient.getSkillUsageInfo(skillName)
                    .then((infos) => dispatch(StatisticsActionCreator.AddSkillUsageInfo(skillName,
                        infos.map(value => ConsultantInfo.fromAPI(value)))))
                    .catch((error: any) => console.error(error))
                    .catch(() => dispatch(StatisticsActionCreator.AsyncCheckAvailability()));
            }
        };
    }
}
