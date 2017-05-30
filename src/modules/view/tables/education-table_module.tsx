import {connect} from 'react-redux';
import * as React from 'react';
import * as redux from 'redux';
import {ApplicationState, ProfileElementType} from '../../../Store';
import {Profile} from '../../../model/Profile';
import {EducationEntry} from '../../../model/EducationEntry';
import {NameEntity} from '../../../model/NameEntity';
import {
    Table, TableRow, TableBody, TableRowColumn, TableHeader,
    TableHeaderColumn
} from 'material-ui';
import {NameEntityUtil} from '../../../utils/NameEntityUtil';
import {PowerLocalize} from '../../../localization/PowerLocalizer';
import {formatToShortDisplay} from '../../../utils/DateUtil';
import {ProfileActionCreator} from '../../../reducers/profile/ProfileActionCreator';
import * as Immutable from 'immutable';
import {ViewElement} from '../../../model/viewprofile/ViewElement';
import {isNullOrUndefined} from 'util';

/**
 * Properties that are managed by react-redux.
 *
 * Each property defined here will also need a corresponding mapping in the {@link EducationTable.mapStateToProps} method,
 * otherwise the component will not render and update correctly.
 */
interface EducationTableProps {
    profile: Profile;
    educationEntryIds: Immutable.OrderedSet<string>;
    educationEntryList: Array<EducationEntry>;
    educations: Immutable.Map<string, NameEntity>;
}

/**
 * Local properties of this module.
 *
 * These properties are used to initialize the local state and to control everything that is solely used for the display layer.
 *
 * Data that is intended not only for display needs to be placed in the {@link EducationTableProps} and will then be
 * managed by redux.
 */
interface EducationTableLocalProps {

}

/**
 * Local state of the module.
 *
 * All display-only state fields, such as bool flags that define if an element is visibile or not, belong here.
 */
interface EducationTableLocalState {

}

/**
 * Defines mappings from local handlers to redux dispatches that invoke actions on the store.
 */
interface EducationTableDispatch {
    selectIds(ids: Immutable.OrderedSet<string>): void;
}

class EducationTableModule extends React.Component<
    EducationTableProps
    & EducationTableLocalProps
    & EducationTableDispatch, EducationTableLocalState> {

    static mapStateToProps(state: ApplicationState, localProps: EducationTableLocalProps): EducationTableProps {
        return {
            profile: state.databaseReducer.profile(),
            educationEntryIds: state.databaseReducer.viewProfiles().get(state.databaseReducer.activeViewProfileId()).educationEntryIds(),
            educationEntryList: state.databaseReducer.profile().educationEntries().toArray(),
            educations: state.databaseReducer.educations()
        };
    }

    static mapDispatchToProps(dispatch: redux.Dispatch<ApplicationState>): EducationTableDispatch {
        return {
            selectIds: (ids) => dispatch(ProfileActionCreator.SetSelectedIds(ProfileElementType.EducationEntry, ids))
        };
    }


    private isSelected = (entryId: string) => {
        return this.props.educationEntryIds.contains(entryId);
    };

    private renderTableRow = (entry: EducationEntry) => {
        console.log(entry.degree());
        return (
            <TableRow
                key={'EducationTable.EducationRow.' + entry.id()}
                selected={this.isSelected(entry.id())}
                onRowClick={() => console.log("Row clicked id=" + entry.id())}
            >
                <TableRowColumn>
                    {NameEntityUtil.getNullTolerantName(entry.nameEntityId(), this.props.educations)}
                </TableRowColumn>
                <TableRowColumn>
                    {formatToShortDisplay(entry.startDate())}
                </TableRowColumn>
                <TableRowColumn>
                    {formatToShortDisplay(entry.endDate())}
                </TableRowColumn>
                <TableRowColumn>
                    {isNullOrUndefined(entry.degree() || entry.degree() == "null") ? "keiner" : entry.degree()}
                </TableRowColumn>
            </TableRow>
        );
    };


    private handleRowSelection = (selectedRows: Array<number> | string) => {
        let views = Immutable.Set<string>();
        if(typeof(selectedRows) == 'string') {
            if(selectedRows == 'none') {
                views = Immutable.Set<string>();
            } else if(selectedRows == 'all') {
                // To not break up the order, only add potential new elements
                this.props.profile.educationEntries().forEach(entry => {
                    if(!views.contains(entry.id())) {
                        views = views.add(entry.id());
                    }
                })
            }
        } else {
            selectedRows.forEach(num => {
                let id = this.props.educationEntryList[num].id();
                if(!views.contains(id)) {
                    views = views.add(id);
                }
            })
        }
        this.props.selectIds(views);
    };

    render() {
        return (
            <div id="ViewTable.EducationTable">
                <Table multiSelectable={true}
                       onRowSelection={this.handleRowSelection}
                >
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn>{PowerLocalize.get('Sector.Singular')}</TableHeaderColumn>
                            <TableHeaderColumn>{PowerLocalize.get('Begin')}</TableHeaderColumn>
                            <TableHeaderColumn>{PowerLocalize.get('End')}</TableHeaderColumn>
                            <TableHeaderColumn>{PowerLocalize.get('AcademicDegree.Singular')}</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody deselectOnClickaway={false}>
                        {
                            this.props.educationEntryList.map(entry => this.renderTableRow(entry))
                        }
                    </TableBody>
                </Table>
            </div>
        );
    }
}

/**
 * @see EducationTableModule
 * @author nt
 * @since 29.05.2017
 */
export const EducationTable: React.ComponentClass<EducationTableLocalProps> = connect(EducationTableModule.mapStateToProps, EducationTableModule.mapDispatchToProps)(EducationTableModule);