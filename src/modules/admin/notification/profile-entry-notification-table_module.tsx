import * as React from 'react';
import {Table, TableBody, TableHead, TableCell, TableRow} from '@material-ui/core';
import {PowerLocalize} from '../../../localization/PowerLocalizer';
import {ProfileEntryNotification} from '../../../model/admin/ProfileEntryNotification';
import {NameEntityUtil} from '../../../utils/NameEntityUtil';
import {formatToMailDisplay} from '../../../utils/DateUtil';
import {NotificationDialog} from './notification-dialog_module';
import {StringUtils} from '../../../utils/StringUtil';
import formatString = StringUtils.formatString;
import Checkbox from '@material-ui/core/Checkbox/Checkbox';

// TODO Tabelle prüfen

interface ProfileEntryNotificationTableLocalProps {
    profileEntryNotifications: Immutable.List<ProfileEntryNotification>;
    selectedRows: Array<number>;
    onRowSelection(rows: Array<number>): void;
}

interface ProfileEntryNotificationTableLocalState {
    notificationDialogOpen: boolean;
    selectedNotification: number;
}


export class ProfileEntryNotificationTable extends React.Component<ProfileEntryNotificationTableLocalProps, ProfileEntryNotificationTableLocalState> {

    constructor(props: any) {
        super(props);
        this.state = {
            notificationDialogOpen: false,
            selectedNotification: -1
        }
    }

    private mapRow = (notification: ProfileEntryNotification, key: number) => {
        return (
            <TableRow
                key={"NotificationInbox.TableRow.Not." + notification.adminNotification().id()}
                selected={this.props.selectedRows.indexOf(key) != -1}
            >
                <TableCell>{notification.adminNotification().initials()}</TableCell>
                <TableCell
                    className="cursor-pointer"
                >
                    {formatString(
                        PowerLocalize.get("NotificationInbox.NameEntityNotification.SubjectTextTemplate"),
                        notification.nameEntity().name(),
                        NameEntityUtil.typeToLocalizedType(notification.nameEntity()))
                    }
                </TableCell>
                <TableCell>{formatToMailDisplay(notification.adminNotification().occurrence())}</TableCell>
            </TableRow>
        )
    };

    private showNotificationDialog = (index: number) => {
        this.setState({
            notificationDialogOpen: true,
            selectedNotification: index
        })
    };

    private handleCellClick = (rowNum: number, colNum: number) => {
        // Ignore the checkboxes.
        if(colNum >= 0) {
            this.showNotificationDialog(rowNum);
        }
    };

    private hideNotificationDialog = () => {
        this.setState({
            notificationDialogOpen: false
        })
    };

    private handleRowSelection = (rows: string | Array<number>) => {
        let selectedIndexes: Array<number> = [];
        if(rows === "all") {
            this.props.profileEntryNotifications.forEach((value, key) => selectedIndexes.push(key));
        } else if(rows === "none") {
            selectedIndexes = [];
        } else {
            selectedIndexes = rows as Array<number>;
        }
        this.props.onRowSelection(selectedIndexes);
    };

    render() {
        return (
        <div>
            <NotificationDialog
                index={this.state.selectedNotification}
                open={this.state.notificationDialogOpen}
                onClose={this.hideNotificationDialog}
            />
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell padding={"checkbox"}>
                            <Checkbox indeterminate={numSelected > 0 && numSelected < rowCount}
                                      checked={numSelected === rowCount}
                                      onChange={onSelectAllClick}
                            />


                        </TableCell>
                        <TableCell>{PowerLocalize.get('Initials.Singular')}</TableCell>
                        <TableCell>{PowerLocalize.get('Subject.Singular')}</TableCell>
                        <TableCell>{PowerLocalize.get('Date.Singular')}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody deselectOnClickaway={false}
                >
                    {
                        this.props.profileEntryNotifications.map(this.mapRow).toArray()
                    }
                </TableBody>
            </Table>
        </div>);
    }
}