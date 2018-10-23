import * as React from 'react';
import {EducationEntry} from '../../../../../model/EducationEntry';
import * as Immutable from 'immutable';
import {PowerLocalize} from '../../../../../localization/PowerLocalizer';
import {formatToYear} from '../../../../../utils/DateUtil';
import {NameEntity} from '../../../../../model/NameEntity';
import {EducationEntryDialogModule} from './education-entry-dialog_module';
import {NameEntityUtil} from '../../../../../utils/NameEntityUtil';
import {PwrIconButton} from '../../../../general/pwr-icon-button';


/**
 * Local properties of this module. These properties are used to initialize the local state and to control everything that
 * is solely used for the display layer.
 * Data that is intended not only for disply, but also for persistence operations has to be placed in the Props interface,
 * and is being managed by redux.
 */
interface EducationEntryLocalProps {
    /**
     * The element that is rendered in this module.
     */
    educationEntry: EducationEntry;

    /**
     * All possible educations by their ids.
     */
    educations: Immutable.Map<string, NameEntity>;

    degrees: Immutable.List<string>;

    /**
     * Invoked when the {@link EducationEntry} associated with this module is supposed to be deleted.
     * @param id {@link EducationEntry.id} of the entry that is supposed to be deleted.
     */
    onDelete(id: string): void;

    onSave(entry: EducationEntry, nameEntity: NameEntity): void;

}

/**
 * Local state of this module. Everything that has a state, but is still view layer only. This includes modifiying colors,
 * flags that indicate if a component is displayed, etc..
 * There is no need for a non-local state, as redux will manage this part.
 */
interface EducationEntryState {
    dialogOpen: boolean;
}


export class SingleEducationElement extends React.Component<EducationEntryLocalProps, EducationEntryState> {

    constructor(props: EducationEntryLocalProps) {
        super(props);
        this.state = {
            dialogOpen: props.educationEntry.isNew()
        }
    }


    private getEducationEntryName = () => {
        return NameEntityUtil.getNullTolerantName(this.props.educationEntry.nameEntityId(), this.props.educations);
    };



    private handleFieldTouchClick = () => {
        this.setState({
            dialogOpen: true
        });
    };

    private handleEditButtonPress = () => {
        this.setState({
            dialogOpen: true
        });
    };

    private closeDialog = () => {
        this.setState({
            dialogOpen: false
        });
    };

    private handleSaveRequest = (entry: EducationEntry, name: NameEntity) => {
        this.closeDialog();
        this.props.onSave(entry, name);
    };

    private handleDeleteButtonPress = () => {
        this.props.onDelete(this.props.educationEntry.id());
    };



    render() {
        return(
            <tr>
                <td>
                    <PwrIconButton iconName={"edit"} tooltip={PowerLocalize.get('Action.Edit')} onClick={this.handleEditButtonPress}/>
                    <PwrIconButton iconName={"delete"} tooltip={PowerLocalize.get('Action.Delete')} onClick={this.handleDeleteButtonPress}/>

                    <EducationEntryDialogModule
                        open={this.state.dialogOpen}
                        educationEntry={this.props.educationEntry}
                        educations={this.props.educations}
                        degrees={this.props.degrees}
                        onClose={this.closeDialog}
                        onSave={this.handleSaveRequest}
                    />
                </td>
                <td>
                    <div className="fittingContainer" onClick={this.handleFieldTouchClick}>
                        {formatToYear(this.props.educationEntry.startDate())}
                    </div>
                </td>
                <td>
                    <div className="fittingContainer" onClick={this.handleFieldTouchClick}>
                    {formatToYear(this.props.educationEntry.endDate())}
                    </div>
                </td>
                <td>
                    <div className="fittingContainer" onClick={this.handleFieldTouchClick}>
                    {this.props.educationEntry.hasNoDegree() ? "---": this.props.educationEntry.degree()}
                    </div>
                </td>
                <td>
                    <div className="fittingContainer" onClick={this.handleFieldTouchClick}>
                    {this.getEducationEntryName()}
                    </div>
                </td>
            </tr>
        );
    }
}
