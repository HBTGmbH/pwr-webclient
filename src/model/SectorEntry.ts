import {APISectorEntry} from './APIProfile';
import {Sector} from './Sector';
import * as Immutable from 'immutable';
import {NEW_ENTITY_PREFIX, UNDEFINED_ID} from './PwrConstants';

export class SectorEntry {
    public readonly id: string;
    public readonly sectorId: string;
    public readonly isNew: boolean;


    private static CURRENT_ID: number = 0;

    /**
     * Constructor is left private to disallow any manual constructing, enforcing fallback
     * to the factory methods.
     * @param id
     * @param localId
     * @param sectorId
     */
    private constructor(id: string, sectorId: string, isNew: boolean) {
        this.id = id;
        this.sectorId = sectorId;
        this.isNew = isNew;

    }

    static create(apiSectorEntry: APISectorEntry): SectorEntry {
        return new SectorEntry(
            String(apiSectorEntry.id),
            String(apiSectorEntry.sector.id),
            false)
    }

    static createNew(): SectorEntry {
        return new SectorEntry(NEW_ENTITY_PREFIX + String(SectorEntry.CURRENT_ID++), UNDEFINED_ID, true);
    }

    public changeSectorId(newSectorId: string): SectorEntry {
        return new SectorEntry(this.id, newSectorId, this.isNew);
    }

    public toAPISectorEntry(sectors: Immutable.Map<string, Sector>): APISectorEntry {
        return {
            id: this.isNew ? null : Number.parseInt(this.id),
            sector: this.sectorId == UNDEFINED_ID ? null : sectors.get(this.sectorId).toAPISector()
        };
    }

}