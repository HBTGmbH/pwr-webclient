import {doop} from 'doop';
import * as Immutable from 'immutable';
import {SkillUsageMetric} from './SkillUsageMetric';
import {ProfileSkillMetrics} from './ProfileSkillMetrics';
import {ConsultantClusterInfo} from './ConsultantClusterInfo';
import {ScatterSkill} from './ScatterSkill';
import {ConsultantInfo} from '../ConsultantInfo';
import {NameEntity} from '../../reducers/profile-new/profile/model/NameEntity';

@doop
export class StatisticsStore {
    @doop
    public get skillUsages() {
        return doop<Immutable.List<SkillUsageMetric>, this>();
    };

    @doop
    public get relativeSkillUsages() {
        return doop<Immutable.List<SkillUsageMetric>, this>();
    };

    /**
     * The {@link ProfileSkillMetrics} that is currently active.
     * @returns {Doop<ProfileSkillMetrics, this>}
     */
    @doop
    public get activeProfileMetric() {
        return doop<ProfileSkillMetrics, this>();
    };

    /**
     * Defines if the service is available or not
     * @returns {Doop<boolean, StatisticsStore>}
     */
    @doop
    public get available() {
        return doop<boolean, this>();
    };

    @doop
    public get consultantClusterInfo() {
        return doop<ConsultantClusterInfo, this>();
    };

    @doop
    public get scatteredSkills() {
        return doop<Immutable.List<ScatterSkill>, this>();
    };

    /**
     * Information about usage of name entites.
     * @returns {Doop<Immutable.Map<NameEntity, ConsultantInfo>, this>}
     */
    @doop
    public get nameEntityUsageInfo() {
        return doop<Immutable.Map<NameEntity, Immutable.List<ConsultantInfo>>, this>();
    };

    @doop
    public get skillUsageInfo() {
        return doop<Immutable.Map<string, Immutable.List<ConsultantInfo>>, this>();
    };

    private constructor(skillUsages: Immutable.List<SkillUsageMetric>,
                        relativeSkillUsages: Immutable.List<SkillUsageMetric>,
                        activeProfileMetric: ProfileSkillMetrics,
                        available: boolean,
                        consultantClusterInfo: ConsultantClusterInfo,
                        scatteredSkills: Immutable.List<ScatterSkill>,
                        nameEntityUsageInfo: Immutable.Map<NameEntity, Immutable.List<ConsultantInfo>>,
                        skillUsageInfo: Immutable.Map<string, Immutable.List<ConsultantInfo>>
    ) {
        return this.skillUsages(skillUsages)
            .relativeSkillUsages(relativeSkillUsages)
            .activeProfileMetric(activeProfileMetric)
            .available(available)
            .consultantClusterInfo(consultantClusterInfo)
            .scatteredSkills(scatteredSkills)
            .nameEntityUsageInfo(nameEntityUsageInfo)
            .skillUsageInfo(skillUsageInfo);
    }

    public static createEmpty(): StatisticsStore {
        return new StatisticsStore(Immutable.List<SkillUsageMetric>(), Immutable.List<SkillUsageMetric>(), null,
            false, null, Immutable.List<ScatterSkill>(), Immutable.Map<NameEntity, Immutable.List<ConsultantInfo>>(),
            Immutable.Map<string, Immutable.List<ConsultantInfo>>());
    }
}
