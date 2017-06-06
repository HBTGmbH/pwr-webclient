import {connect} from 'react-redux';
import * as React from 'react';
import * as redux from 'redux';
import {NameEntity} from '../../../../model/NameEntity';
import {ApplicationState, ProfileElementType} from '../../../../Store';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui';
import {NameEntityUtil} from '../../../../utils/NameEntityUtil';
import {PowerLocalize} from '../../../../localization/PowerLocalizer';
import * as Immutable from 'immutable';
import {ViewElement} from '../../../../model/viewprofile/ViewElement';
import {ViewProfile} from '../../../../model/viewprofile/ViewProfile';
import {ConnectedAscDescButton} from './connected-asc-desc-button_module';
import {ProfileAsyncActionCreator} from '../../../../reducers/profile/ProfileAsyncActionCreator';
import {formatToShortDisplay} from '../../../../utils/DateUtil';


/**
 * Properties that are managed by react-redux.
 *
 * Each property defined here will also need a corresponding mapping in the {@link TrainingTable.mapStateToProps} method,
 * otherwise the component will not render and update correctly.
 */
interface TrainingTableProps {
    viewProfile: ViewProfile;
    trainings: Immutable.Map<string, NameEntity>;
}

/**
 * Local properties of this module.
 *
 * These properties are used to initialize the local state and to control everything that is solely used for the display layer.
 *
 * Data that is intended not only for display needs to be placed in the {@link TrainingTableProps} and will then be
 * managed by redux.
 */
interface TrainingTableLocalProps {
    viewProfileId: string;
}

/**
 * Local state of the module.
 *
 * All display-only state fields, such as bool flags that define if an element is visibile or not, belong here.
 */
interface TrainingTableLocalState {

}

/**
 * Defines mappings from local handlers to redux dispatches that invoke actions on the store.
 */
interface TrainingTableDispatch {
    filterTable(indexes: Array<number>|string, viewProfileId: string, lookup: Immutable.List<ViewElement>): void;
}

class TrainingTableModule extends React.Component<
    TrainingTableProps
    & TrainingTableLocalProps
    & TrainingTableDispatch, TrainingTableLocalState> {

    static mapStateToProps(state: ApplicationState, localProps: TrainingTableLocalProps): TrainingTableProps {
        return {
            viewProfile: state.databaseReducer.viewProfiles().get(localProps.viewProfileId),
            trainings: state.databaseReducer.trainings()
        };
    }

    static mapDispatchToProps(dispatch: redux.Dispatch<ApplicationState>): TrainingTableDispatch {
        return {
            filterTable: (indexes, viewProfileId, lookup) => {
                dispatch(ProfileAsyncActionCreator.filterView(ProfileElementType.TrainingEntry, viewProfileId, indexes, lookup))
            }
        };
    }


    private isSelected = (index: number) => {
        return this.props.viewProfile.viewTrainingEntries().get(index).enabled();
    };

    private getEntry = (viewElement: ViewElement) => {
        return this.props.viewProfile.profile().trainingEntries().get(viewElement.elementId());
    };

    private renderTableRow = (viewElement: ViewElement, index: number) => {
        let entry = this.getEntry(viewElement);
        return (
            <TableRow
                key={'EducationTable.EducationRow.' + index}
                selected={this.isSelected(index)}
            >
                <TableRowColumn>
                    {NameEntityUtil.getNullTolerantName(entry.trainingId(), this.props.trainings)}
                </TableRowColumn>
                <TableRowColumn>
                    {formatToShortDisplay(entry.startDate())}
                </TableRowColumn>
                <TableRowColumn>
                    {formatToShortDisplay(entry.endDate())}
                </TableRowColumn>
            </TableRow>
        );
    };

    private handleRowSelection = (selectedRows: Array<number> | string) => {
        this.props.filterTable(selectedRows, this.props.viewProfileId, this.props.viewProfile.viewTrainingEntries() );
    };


    render() {
        return (
            <div id="ViewTable.TrainingTable">
                <Table multiSelectable={true}
                       onRowSelection={this.handleRowSelection}
                >
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn>
                                <ConnectedAscDescButton
                                    label={PowerLocalize.get('Training.Singular')}
                                    viewProfileId={this.props.viewProfileId}
                                    entryField="NAME"
                                    elementType={ProfileElementType.TrainingEntry}
                                />
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                <ConnectedAscDescButton
                                    label={PowerLocalize.get('Begin')}
                                    viewProfileId={this.props.viewProfileId}
                                    entryField="DATE_START"
                                    elementType={ProfileElementType.TrainingEntry}
                                />
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                <ConnectedAscDescButton
                                    label={PowerLocalize.get('END')}
                                    viewProfileId={this.props.viewProfileId}
                                    entryField="DATE_END"
                                    elementType={ProfileElementType.TrainingEntry}
                                />
                            </TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody deselectOnClickaway={false}>
                        {
                            this.props.viewProfile.viewTrainingEntries().map(this.renderTableRow)
                        }
                    </TableBody>
                </Table>
            </div>
        );
    }
}

/**
 * @see TrainingTableModule
 * @author nt
 * @since 29.05.2017
 */
export const TrainingTable: React.ComponentClass<TrainingTableLocalProps> = connect(TrainingTableModule.mapStateToProps, TrainingTableModule.mapDispatchToProps)(TrainingTableModule);