import {NameEntity} from '../model/NameEntity';
import {isNullOrUndefined} from 'util';
import {PowerLocalize} from '../localization/PowerLocalizer';
import {ProfileElementType} from '../Store';
import * as Immutable from 'immutable';

export class NameEntityUtil {

    /**
     * Null tolerant accessor to a {@link NameEntity#name}
     * @param id
     * @param lookup
     * @returns {string}
     */
    public static getNullTolerantName(id: string, lookup: Immutable.Map<string, NameEntity>) {
        let res: string = '';
        if (!isNullOrUndefined(id)) {
            let name: NameEntity = lookup.get(id);
            if (!isNullOrUndefined(name) && !isNullOrUndefined(name.name())) {
                res = name.name();
            }
        }
        return res;
    }

    /**
     * Mapping function that maps a {@link NameEntity} to the string represeting
     * {@link NameEntity#name}
     * @param nameEntity
     * @returns {string}
     */
    public static mapToName(nameEntity: NameEntity) {
        return nameEntity.name();
    }

    public static typeToLocalizedType(nameEntity: NameEntity): string {
        return PowerLocalize.get('NameEntityType.' + nameEntity.type());
    }

    public static getProfileElementTypeValues() {
        let members = [];
        for (let i: number = 0; true; i++) {
            if (ProfileElementType[i] === undefined) break;
            members.push(ProfileElementType[i]);
        }
        return members;
    }

    public static getProfileElementTypes() {
        const res = Object.keys(ProfileElementType).map(key => Number(key)).filter(key => !isNaN(key));
        return res;
    }

    public static typeToViewAPIString(profileElementType: ProfileElementType) {
        switch (profileElementType) {
            case ProfileElementType.LanguageEntry:
                return 'LANGUAGE';
            case ProfileElementType.TrainingEntry:
                return 'TRAINING';
            case ProfileElementType.QualificationEntry:
                return 'QUALIFICATION';
            case ProfileElementType.SectorEntry:
                return 'SECTOR';
            case ProfileElementType.EducationEntry:
                return 'EDUCATION';
            case ProfileElementType.Project:
                return 'PROJECT';
            case ProfileElementType.CareerEntry:
                return 'CAREER';
            case ProfileElementType.KeySkill:
                return 'KEY_SKILL';
            case ProfileElementType.SkillEntry:
                return 'SKILL';
            case ProfileElementType.Company:
                return 'COMPANY';
            case ProfileElementType.ProjectRole:
                return 'PROJECT_ROLE';
        }
    }
}
