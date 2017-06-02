import {
    APIEducationStep, APILanguageSkill, APIProfile, APIQualificationEntry, APISectorEntry,
    APITrainingEntry
} from '../APIProfile';

export interface APIViewEntry {
    id: number;
    selected: boolean;
}

export interface APIViewEducation extends APIViewEntry{
    educationEntry: APIEducationStep;
}

export interface APIViewLanguage extends APIViewEntry {
    languageSkill: APILanguageSkill;
}

export interface APIViewQualification extends APIViewEntry {
    qualificationEntry: APIQualificationEntry;
}

export interface APIViewSector extends APIViewEntry {
    sectorEntry: APISectorEntry;
}

export interface APIViewTraining extends APIViewEntry {
    trainingEntry: APITrainingEntry;
}

export interface APIViewProfile {
    id: number;
    name: string;
    description: string;
    profileSnapshot: APIProfile;
    educationViewEntries: Array<APIViewEducation>;
    languageViewEntries: Array<APIViewLanguage>;
    qualificationViewEntries: Array<APIViewQualification>;
    sectorViewEntries: Array<APIViewSector>;
    trainingViewEntries: Array<APIViewTraining>;
}