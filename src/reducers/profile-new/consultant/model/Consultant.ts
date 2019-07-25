import {Profile} from '../../profile/model/Profile';

export interface Consultant {
    initials: string;
    firstName: string;
    lastName: string;
    title: string;
    profileId: number;
    birthDate: Date;
    active: boolean;
}

export function newConsultant(initials: string, firstName: string, lastName: string, title: string, profile: Profile, birthDate: Date, active: boolean): Consultant {
    return {
        initials: initials,
        firstName: firstName,
        lastName: lastName,
        title: title,
        profileId: profile.id,
        birthDate: birthDate,
        active: active
    };
}