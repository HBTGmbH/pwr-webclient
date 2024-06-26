import * as React from 'react';
import {ViewCareer} from '../../../../model/view/ViewCareer';
import {ViewSector} from '../../../../model/view/ViewSector';
import {ViewEducation} from '../../../../model/view/ViewEducation';
import {ViewKeySkill} from '../../../../model/view/ViewKeySkill';
import {ViewLanguage} from '../../../../model/view/ViewLanguage';
import {ViewQualification} from '../../../../model/view/ViewQualification';
import {ViewTraining} from '../../../../model/view/ViewTraining';
import {ViewProjectRole} from '../../../../model/view/ViewProjectRole';
import {ComparableEntryButton} from './comprable-entry-button_module';
import {SortableEntryType} from '../../../../model/view/NameComparableType';
import {formatToShortDisplay} from '../../../../utils/DateUtil';
import {PowerLocalize} from '../../../../localization/PowerLocalizer';

export class EntryRenderers {
    public static renderCareer(entry: ViewCareer) {
        let res: Array<JSX.Element> = [];
        res.push(<td key={'ViewCareer_' + entry.name}>{entry.name}</td>);
        res.push(<td key={'ViewCareer_' + entry.startDate + '_s_date'}>{formatToShortDisplay(entry.startDate)}</td>);
        res.push(<td key={'ViewCareer_' + entry.endDate + '_s_date'}>{formatToShortDisplay(entry.endDate)}</td>);
        return res;
    }

    public static renderSector(entry: ViewSector) {
        let res: Array<JSX.Element> = [];
        res.push(<td key={'ViewSector_' + entry.name}>{entry.name}</td>);
        return res;
    }

    public static renderEducation(entry: ViewEducation) {
        let res: Array<JSX.Element> = [];
        res.push(<td key={'ViewEducation_' + entry.name}>{entry.name}</td>);
        res.push(<td key={'ViewEducation_' + entry.startDate + '_s_date'}>{formatToShortDisplay(entry.startDate)}</td>);
        res.push(<td key={'ViewEducation_' + entry.endDate + '_e_date'}>{formatToShortDisplay(entry.endDate)}</td>);
        res.push(<td key={'ViewEducation_' + entry.degree + '_degree'}>{entry.degree}</td>);
        return res;
    }

    public static renderKeySkill(entry: ViewKeySkill) {
        let res: Array<JSX.Element> = [];
        res.push(<td key={'ViewKeySkill_' + entry.name}>{entry.name}</td>);
        return res;
    }

    public static renderLanguage(entry: ViewLanguage) {
        let res: Array<JSX.Element> = [];
        res.push(<td key={'ViewLanguage_' + entry.name}>{entry.name}</td>);
        res.push(<td key={'ViewLanguage_' + entry.name + '_lvl'}>{entry.level}</td>);
        return res;
    }

    public static renderQualification(entry: ViewQualification) {
        let res: Array<JSX.Element> = [];
        res.push(<td key={'Qualification_' + entry.name}>{entry.name}</td>);
        res.push(<td key={'Qualification_' + entry.name + '_date'}>{formatToShortDisplay(entry.date)}</td>);
        return res;
    }

    public static renderTraining(entry: ViewTraining) {
        let res: Array<JSX.Element> = [];
        res.push(<td key={'Training_' + entry.name}>{entry.name}</td>);
        res.push(<td key={'Training_' + entry.name + '_s_date'}>{formatToShortDisplay(entry.startDate)}</td>);
        res.push(<td key={'Training_' + entry.name + '_e_date'}>{formatToShortDisplay(entry.endDate)}</td>);
        return res;
    }

    public static renderProjectRole(entry: ViewProjectRole) {
        let res: Array<JSX.Element> = [];
        res.push(<td key={'ViewProjectRole_' + entry.name}>{entry.name}</td>);
        return res;
    }

    public static renderNameButton(entryType: SortableEntryType, viewProfileId: string) {
        return <ComparableEntryButton
            sortableEntryType={entryType}
            sortableEntryField="name"
            label={PowerLocalize.get('ViewEntryField.Name')}
            viewProfileId={viewProfileId}
        />;
    }

    public static renderStartDate(entryType: SortableEntryType, viewProfileId: string) {
        return <ComparableEntryButton
            sortableEntryType={entryType}
            sortableEntryField="start-date"
            label={PowerLocalize.get('ViewEntryField.StartDate')}
            viewProfileId={viewProfileId}
        />;
    }

    public static renderEndDate(entryType: SortableEntryType, viewProfileId: string) {
        return <ComparableEntryButton
            sortableEntryType={entryType}
            sortableEntryField="end-date"
            label={PowerLocalize.get('ViewEntryField.EndDate')}
            viewProfileId={viewProfileId}
        />;
    }
}
