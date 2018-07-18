import {connect} from 'react-redux';
import * as redux from 'redux';
import * as React from 'react';
import {Table, TableBody, TableHead, TableCell, TableRow} from '@material-ui/core';
import {PowerLocalize} from '../../../localization/PowerLocalizer';
import {SkillNotification} from '../../../model/admin/SkillNotification';
import * as Immutable from 'immutable';
import {formatToMailDisplay} from '../../../utils/DateUtil';
import {SkillNotificationDialog} from './skill-notification-dialog_module';
import {AdminActionCreator} from '../../../reducers/admin/AdminActionCreator';
import {StringUtils} from '../../../utils/StringUtil';
import {ApplicationState} from '../../../reducers/reducerIndex';
import formatString = StringUtils.formatString;
import Checkbox from '@material-ui/core/Checkbox/Checkbox';
import FormGroup from '@material-ui/core/FormGroup/FormGroup';

// TODO Tabelle prüfen

interface SkillNotificationTableProps {

}

interface SkillNotificationTableLocalProps {
    skillNotifications: Immutable.List<SkillNotification>;
    selectedRows: Array<number>;
    onRowSelection(rows: Array<number>): void;
}

interface SkillNotificationTableLocalState {

}

interface SkillNotificationTableDispatch {
    onDialogOpen(id: number): void;
}

class SkillNotificationTableModule extends React.Component<
    SkillNotificationTableProps
    & SkillNotificationTableLocalProps
    & SkillNotificationTableDispatch, SkillNotificationTableLocalState> {

    static mapStateToProps(state: ApplicationState, localProps: SkillNotificationTableLocalProps): SkillNotificationTableProps {
        return {

        }
    }

    static mapDispatchToProps(dispatch: redux.Dispatch<ApplicationState>): SkillNotificationTableDispatch {
        return {
            onDialogOpen: id => dispatch(AdminActionCreator.AsyncOpenSkillNotificationDialog(id)),
        }
    }
// TODO check function of RowSelect -mp
    private handleRowSelection = (rows: string | Array<number>) => {
        let selectedIndexes: Array<number> = [];
        if(rows === "all") {
            this.props.skillNotifications.forEach((value, key) => selectedIndexes.push(key));
        } else if(rows === "none") {
            selectedIndexes = [];
        } else {
            selectedIndexes = rows as Array<number>;
        }
        this.props.onRowSelection(selectedIndexes);
    };

    private mapRow = (notification: SkillNotification, key: number) => {
        return (
            <TableRow
                hover
                key={"NotificationInbox.TableRow.Not." + notification.adminNotification().id()}
                selected={this.props.selectedRows.indexOf(key) !== -1}
                onClick={event => this.handleRowSelection}
                style={{backgroundColor:'white'}}
            >
                <TableCell padding={"checkbox"}>
                    <FormGroup>
                        <Checkbox checked={this.props.selectedRows.indexOf(key) !== -1}/>
                    </FormGroup>
                </TableCell>
                <TableCell>{notification.adminNotification().initials()}</TableCell>
                <TableCell
                    className="cursor-pointer"
                >
                    {formatString(PowerLocalize.get("NotificationInbox.SkillNotification.SubjectTextTemplate"),
                        notification.skill().name())
                    }
                </TableCell>
                <TableCell>{formatToMailDisplay(notification.adminNotification().occurrence())}</TableCell>
            </TableRow>
        )
    };


    private handleCellClick = (rowNum: number, colNum: number) => {
        // Ignore the checkboxes.
        if(colNum >= 0) {
            let id = this.props.skillNotifications.get(rowNum).adminNotification().id();
            this.props.onDialogOpen(id);
        }
    };


    render() {
        return ( <div>
            <SkillNotificationDialog/>
            <Table>
                <TableHead>
                    <TableRow style={{backgroundColor:'white'}}>
                        <TableCell padding={'checkbox'}>
                            <FormGroup>
                                <Checkbox />
                            </FormGroup>
                        </TableCell>
                        <TableCell>{PowerLocalize.get('Initials.Singular')}</TableCell>
                        <TableCell>{PowerLocalize.get('Subject.Singular')}</TableCell>
                        <TableCell>{PowerLocalize.get('Date.Singular')}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        this.props.skillNotifications.map(this.mapRow).toArray()
                    }
                </TableBody>
            </Table>
        </div>);
    }
}

/**
 * @see SkillNotificationTableModule
 * @author nt
 * @since 27.07.2017
 */
export const SkillNotificationTable: React.ComponentClass<SkillNotificationTableLocalProps> = connect(SkillNotificationTableModule.mapStateToProps, SkillNotificationTableModule.mapDispatchToProps)(SkillNotificationTableModule);