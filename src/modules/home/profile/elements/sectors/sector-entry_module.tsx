import {SectorEntry} from '../../../../../model/SectorEntry';
import * as Immutable from 'immutable';
import * as React from 'react';
import {IconButton} from '@material-ui/core';
import {PowerLocalize} from '../../../../../localization/PowerLocalizer';
import {NameEntity} from '../../../../../model/NameEntity';
import {SectorEntryDialog} from './sector-entry-dialog_module';
import {NameEntityUtil} from '../../../../../utils/NameEntityUtil';

interface SingleSectorLocalProps {
    sectors: Immutable.Map<string, NameEntity>;
    sectorEntry: SectorEntry;

    /**
     * Invoked when the user invokes a deletion of the sector entry.
     * @param sectorEntryId the id of the {@link SectorEntry} associated with this {@link SingleSectorModule}
     */
    onSectorDelete(sectorEntryId: string): void;

    onSave(sectorEntry: SectorEntry, sector: NameEntity): void;
}

interface SingleSectorState {
    dialogOpen: boolean;
}

export class SingleSectorModule extends React.Component<SingleSectorLocalProps, SingleSectorState> {



    constructor(props: SingleSectorLocalProps) {
        super(props);
        this.state = {
            dialogOpen: props.sectorEntry.isNew()
        };
    }

    private closeDialog = () => {
        this.setState({
            dialogOpen: false
        });
    };

    private openDialog = () => {
        this.setState({
            dialogOpen: true
        });
    };

    private getSectorName = () => {
        return NameEntityUtil.getNullTolerantName(this.props.sectorEntry.sectorId(), this.props.sectors);
    };

    private handleEditButtonClick = () => {
        this.openDialog();
    };

    private handleDeleteButtonClick = () => {
        this.props.onSectorDelete(this.props.sectorEntry.id());
    };

    private handleSaveRequest = (sectorEntry: SectorEntry, sector: NameEntity) => {
        this.props.onSave(sectorEntry, sector);
        this.closeDialog();
    };

    private handleCloseRequest = () => {
        this.closeDialog();
    };

    render() {
        return(
            <tr>
                <td>
                    <IconButton className="material-icons icon-size-20" onClick={this.handleEditButtonClick} tooltip={PowerLocalize.get('Action.Edit')}>edit</IconButton>
                    <IconButton className="material-icons icon-size-20" onClick={this.handleDeleteButtonClick} tooltip={PowerLocalize.get('Action.Delete')}>delete</IconButton>
                    <SectorEntryDialog
                        open={this.state.dialogOpen}
                        sectorEntry={this.props.sectorEntry}
                        sectors={this.props.sectors}
                        onSave={this.handleSaveRequest}
                        onClose={this.handleCloseRequest}
                    />
                </td>
                <td>
                    <div className="fittingContainer" onClick={this.openDialog}>
                        {this.getSectorName()}
                    </div>
                </td>
            </tr>);
    }
}