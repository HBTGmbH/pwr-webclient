import {doop} from 'doop';
import {APINameEntity, APIProject} from './APIProfile';
import * as Immutable from 'immutable';
import {NameEntity} from './NameEntity';
import {NEW_ENTITY_PREFIX} from './PwrConstants';

@doop
export class Project {

    @doop
    public get id() {
        return doop<string, this>();
    }
    @doop
    public get name() {
        return doop<string, this>();
    }


    @doop
    public get startDate() {
        return doop<Date, this>();
    }

    @doop
    public get endDate() {
        return doop<Date, this>();
    }

    @doop
    public get description() {
        return doop<string, this>();
    }

    @doop
    public get endCustomerId() {
        return doop<string, this>();
    }

    @doop
    public get brokerId() {
        return doop<string, this>();
    }

    @doop
    public get roleIds() {
        return doop<Immutable.List<string>, this>();
    }

    @doop
    public get isNew() {
        return doop<boolean, this>();
    }

    private static CURRENT_ID: number = 0;

    private constructor(id: string, name: string, endCustomerId: string, startDate: Date, endDate: Date,
                        description: string, brokerId: string, roleIds: Immutable.List<string>, isNew: boolean) {
        this.id(id)
            .name(name)
            .endCustomerId(endCustomerId)
            .startDate(startDate)
            .endDate(endDate)
            .description(description)
            .brokerId(brokerId)
            .roleIds(roleIds).
            isNew(isNew);
    }

    private rolesToAPI(roles: Immutable.Map<string, NameEntity>): Array<APINameEntity> {
        let res: Array<APINameEntity> = [];
        this.roleIds().forEach(id => {
            res.push(roles.get(id).toAPI());
        });
        return res;
    }

    public toAPI(companies: Immutable.Map<string, NameEntity>, roles: Immutable.Map<string, NameEntity>): APIProject {
        return {
            id: this.isNew() ? null : Number(this.id()),
            description: this.description(),
            name: this.name(),
            endDate: this.endDate(),
            startDate: this.startDate(),
            broker: companies.get(this.brokerId()).toAPI(),
            client: companies.get(this.endCustomerId()).toAPI(),
            projectRole: this.rolesToAPI(roles),
        }
    }

    private static parseRoles(project: APIProject): Immutable.List<string> {
        let res: Immutable.List<string> = Immutable.List<string>();
        project.projectRole.forEach(p => {
            res = res.push(String(p.id));
        });
        return res;
    }

    public static createNew(): Project {
        return new Project(
            String(NEW_ENTITY_PREFIX + (Project.CURRENT_ID++)),
            "",
            null,
            new Date(),
            new Date(),
            "",
            null,
            Immutable.List<string>(),
            true);
    }

    public static fromAPI(project: APIProject): Project {
        return new Project(
            String(project.id),
            project.name,
            String(project.client.id),
            new Date(project.startDate),
            new Date(project.endDate),
            project.description,
            String(project.broker.id),
            Project.parseRoles(project),
            false
        )
    }


}