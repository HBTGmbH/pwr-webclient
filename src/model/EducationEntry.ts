import {Education} from './Education';
import {APIEducationStep} from './APIProfile';
import * as Immutable from 'immutable';

/**
 * For notes about immutability, {@see CareerElement}
 */
export class EducationEntry {
    /**
     * DO NOT CHANGE THIS.NEVER.
     */
    readonly id: number;
    readonly date: Date;
    readonly educationId: number;

    constructor(id: number, date: Date, educationId: number) {
        this.id = id;
        this.date = date;
        this.educationId = educationId;
    }

    public changeDate(newDate: Date): EducationEntry {
        return new EducationEntry(this.id, newDate, this.educationId);
    }

    /**
     * Non-mutating function that changes the {@link EducationEntry.educationId} by returning a copy with
     * the new id set.
     * @param newId
     * @returns {EducationEntry}
     */
    public changeEducationId(newId: number): EducationEntry {
        return new EducationEntry(this.id, this.date, newId);
    }


    /**
     * Creates a new {@link EducationEntry} from the {@link APIEducationStep}. The date represented as string
     * is parsed as to a {@link Date} object.
     * @param apiEducation
     * @returns {EducationEntry}
     */
    public static create(apiEducation: APIEducationStep): EducationEntry {
        return new EducationEntry(
            Number(apiEducation.id),
            new Date(apiEducation.date),
            Number(apiEducation.education.id));
    }

    public static createEmpty(educationId: number) {
        return new EducationEntry(null, new Date(), educationId);
    }

    public toAPIEducationEntry(educations: Immutable.Map<number, Education>): APIEducationStep {
        return {
            id: this.id,
            date: this.date.toDateString(),
            education: {
                id: this.educationId,
                name: educations.get(this.educationId).name
            }
        }
    }
}