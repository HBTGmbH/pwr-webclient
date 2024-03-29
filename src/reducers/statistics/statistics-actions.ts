import {SkillUsageMetric} from '../../model/statistics/SkillUsageMetric';
import {ProfileSkillMetrics} from '../../model/statistics/ProfileSkillMetrics';
import {ConsultantClusterInfo} from '../../model/statistics/ConsultantClusterInfo';
import {ScatterSkill} from '../../model/statistics/ScatterSkill';
import {ActionType} from '../ActionType';
import {ConsultantInfo} from '../../model/ConsultantInfo';
import * as Immutable from 'immutable';
import {NameEntity} from '../profile-new/profile/model/NameEntity';
import {AbstractAction} from '../BaseActions';

export interface ReceiveSkillUsageMetricsAction extends AbstractAction {
    metrics: Array<SkillUsageMetric>;
}

export interface ReceiveProfileSkillMetrics extends AbstractAction {
    metrics: ProfileSkillMetrics;
}

export interface ReceiveConsultantClusterInfoAction extends AbstractAction {
    consultantClusterInfo: ConsultantClusterInfo;
}

export interface ReceiveScatterSkillsAction extends AbstractAction {
    scatterSkills: Immutable.List<ScatterSkill>;
}

export class AddNameEntityUsageInfoAction implements AbstractAction {
    type: ActionType;
    nameEntity: NameEntity;
    consultantInfos: Array<ConsultantInfo>;

    constructor(type: ActionType, nameEntity: NameEntity, consultantInfos: Array<ConsultantInfo>) {
        this.type = type;
        this.nameEntity = nameEntity;
        this.consultantInfos = consultantInfos;
    }
}

export interface AddSkillUsageInfoAction extends AbstractAction {
    type: ActionType;
    skillName: string;
    consultantInfos: Array<ConsultantInfo>;
}
