import * as React from 'react';
import {AutoComplete, DatePicker, IconButton, TextField, TouchTapEvent} from 'material-ui';
import {EducationEntry} from '../../../../model/EducationEntry';
import {Education} from '../../../../model/Education';
import {QualificationEntry} from '../../../../model/QualificationEntry';
import {Qualification} from '../../../../model/Qualification';
import * as Immutable from 'immutable';
import {PowerLocalize} from '../../../../localization/PowerLocalizer';


/**
 * Local properties of this module. These properties are used to initialize the local state and to control everything that
 * is solely used for the display layer.
 * Data that is intended not only for disply, but also for persistence operations has to be placed in the Props interface,
 * and is being managed by redux.
 */
interface QualificationEntryLocalProps {
    /**
     * The element that is rendered in this module.
     */
    qualificationEntry: QualificationEntry;

    /**
     * Array of possible educations by their ID.
     */
    qualifications: Immutable.Map<number, Qualification>;

    /**
     * Callback that is invoked when this modules DatePicker's value changes to a new date.
     * Also gives back the ID to of the {@link EducationEntry} given to this module.
     * @param newDate
     * @param id
     */
    onDateChange(newDate: Date, id: number): void;

    onQualificationChange(newQualificationId: number, entryId: number): void;

}

/**
 * Local state of this module. Everything that has a state, but is still view layer only. This includes modifiying colors,
 * flags that indicate if a component is displayed, etc..
 * There is no need for a non-local state, as redux will manage this part.
 */
interface QualificationEntryState {
    autoCompleteValue: string;
    autoCompleteDisabled: boolean;
}


export class SingleQualificationEntry extends React.Component<QualificationEntryLocalProps, QualificationEntryState> {

    private autoCompleteValues: Array<Qualification>;

    constructor(props: QualificationEntryLocalProps) {
        super(props);
        this.autoCompleteValues = props.qualifications.map((val, key) => val).toArray();
        this.state = {
            autoCompleteValue: props.qualifications.get(props.qualificationEntry.qualificationId).name,
            autoCompleteDisabled: true
        };
    }

    /**
     * Callback invokes when the DatePicker's value changes.
     * @param event is always null according to material-ui docs
     * @param date is the new date.
     */
    private handleDateChange = (event: any, date: Date) => {
        // Hello Callback \o/!
        this.props.onDateChange(date, this.props.qualificationEntry.id);
    };

    private handleAutoCompleteUpdateInput = (searchText: string) => {
        this.setState({autoCompleteValue: searchText});
    };

    private handleAutoCompleteRequest = (chosenRequest: string, index: number) => {
        if(index >= 0) {
            this.props.onQualificationChange(this.autoCompleteValues[index].id, this.props.qualificationEntry.id);
            this.setState({
                autoCompleteDisabled: true
            })
        } else {
            this.setState({
                autoCompleteValue: this.props.qualifications.get(this.props.qualificationEntry.qualificationId).name
            })
        }
    };

    private handleToggleEdit = (event: TouchTapEvent) => {
        this.setState({autoCompleteDisabled: !this.state.autoCompleteDisabled});
        if(!this.state.autoCompleteDisabled) {
            // Assure that there is no invalid data within the edit field.
            // This is a view-only ensurance, as only validate data will be passed to redux.
            // By using this, confusion on the users end is avoided
            this.setState({
                autoCompleteValue: this.props.qualifications.get(this.props.qualificationEntry.qualificationId).name
            })
        }
    };

    render() {
        return(
            <tr>
                <td>
                    <DatePicker
                        id={"Education.DatePicker." + this.props.qualificationEntry.id}
                        container="inline"
                        value={this.props.qualificationEntry.date}
                        onChange={this.handleDateChange}
                    />
                </td>
                <td>
                    <AutoComplete
                        id={"Qualification.Autocomplete." + this.props.qualificationEntry.id}
                        value={this.state.autoCompleteValue}
                        dataSourceConfig={{text:'name', value:'id'}}
                        dataSource={this.autoCompleteValues}
                        onUpdateInput={this.handleAutoCompleteUpdateInput}
                        onNewRequest={this.handleAutoCompleteRequest}
                        disabled={this.state.autoCompleteDisabled}
                    />
                    <IconButton iconClassName="material-icons" onClick={this.handleToggleEdit} tooltip={PowerLocalize.get('Action.Edit')}>edit</IconButton>
                </td>
            </tr>
        );
    }
}
