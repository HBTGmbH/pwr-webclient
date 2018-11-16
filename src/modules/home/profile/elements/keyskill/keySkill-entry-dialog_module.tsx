import {connect} from 'react-redux';
import * as React from 'react';
import * as redux from 'redux';
import * as Immutable from 'immutable';
import {ProfileElementType} from '../../../../../Store';
import {NameEntity} from '../../../../../model/NameEntity';
import {KeySkillEntry} from '../../../../../model/KeySkillEntry';
import {NameEntityUtil} from '../../../../../utils/NameEntityUtil';
import {ProfileActionCreator} from '../../../../../reducers/profile/ProfileActionCreator';
import {ProfileStore} from '../../../../../model/ProfileStore';
import {isNullOrUndefined} from 'util';
import {Dialog} from '@material-ui/core';
import {PowerLocalize} from '../../../../../localization/PowerLocalizer';
import {ApplicationState} from '../../../../../reducers/reducerIndex';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import {PwrIconButton} from '../../../../general/pwr-icon-button';
import {PwrAutoComplete} from '../../../../general/pwr-auto-complete';

/**
 * Properties that are managed by react-redux.
 *
 * Each property defined here will also need a corresponding mapping in the {@link KeySkillDialog.mapStateToProps} method,
 * otherwise the component will not render and update correctly.
 */
interface KeySkillDialogProps {
    keySkills: Immutable.Map<string, NameEntity>;
}

/**
 * Local properties of this module.
 *
 * These properties are used to initialize the local state and to control everything that is solely used for the display layer.
 *
 * Data that is intended not only for display needs to be placed in the {@link KeySkillDialogProps} and will then be
 * managed by redux.
 */
interface KeySkillDialogLocalProps {
    open: boolean;
    keySkillEntry: KeySkillEntry;

    requestClose(): void;
}

/**
 * Local state of the module.
 *
 * All display-only state fields, such as bool flags that define if an element is visibile or not, belong here.
 */
interface KeySkillDialogLocalState {
    keySkillEntry: KeySkillEntry;
    autoCompleteValue: string;
}

/**
 * Defines mappings from local handlers to redux dispatches that invoke actions on the store.
 */
interface KeySkillDialogDispatch {
    saveEntry(entry: KeySkillEntry, nameEntity: NameEntity): void;
}

class KeySkillDialogModule extends React.Component<KeySkillDialogProps
    & KeySkillDialogLocalProps
    & KeySkillDialogDispatch, KeySkillDialogLocalState> {

    constructor(props: KeySkillDialogProps & KeySkillDialogLocalProps & KeySkillDialogDispatch) {
        super(props);
        this.state = {
            keySkillEntry: props.keySkillEntry,
            autoCompleteValue: NameEntityUtil.getNullTolerantName(props.keySkillEntry.nameEntityId(), props.keySkills)
        };
    }

    static mapStateToProps(state: ApplicationState, localProps: KeySkillDialogLocalProps): KeySkillDialogProps {
        return {
            keySkills: state.databaseReducer.keySkills()
        };
    }

    static mapDispatchToProps(dispatch: redux.Dispatch<ApplicationState>): KeySkillDialogDispatch {
        return {
            saveEntry: (entry, nameEntity) => dispatch(ProfileActionCreator.saveEntry(entry, nameEntity, ProfileElementType.KeySkill))
        };
    }

    private closeDialog = () => {
        this.props.requestClose();
    };

    private handleAutoCompleteInput = (value: string) => {
        this.setState({
            autoCompleteValue: value
        });
    };

    private saveAndExit = () => {
        let name: string = this.state.autoCompleteValue;
        let keySkill: NameEntity = ProfileStore.findNameEntityByName(name, this.props.keySkills);
        let keySkillEntry: KeySkillEntry = this.state.keySkillEntry;
        if (isNullOrUndefined(keySkill)) {
            keySkill = NameEntity.createNew(name);
        }
        keySkillEntry = keySkillEntry.nameEntityId(keySkill.id());
        this.props.saveEntry(keySkillEntry, keySkill);
        this.closeDialog();
    };


    private resetAndExit = () => {
        this.closeDialog();
    };

    render() {
        return (<Dialog
            open={this.props.open}
            onClose={this.closeDialog}
            title={PowerLocalize.get('KeySkillEntry.Dialog.Title')}
            fullWidth
            id="KeySkillEntry.Dialog"
            aria-labelledby="KeySkillEntry.Dialog.Title"
        >
            <DialogTitle id="KeySkillEntry.Dialog.Title">
                {PowerLocalize.get('KeySkillEntry.Dialog.Title')}
            </DialogTitle>
            <DialogContent>
                <div className="row">
                    <div className="col-md-11">
                        <PwrAutoComplete
                            fullWidth={true}
                            label={PowerLocalize.get('KeySkillEntry.Dialog.KeySkillName')}
                            id={'KeySkillEntry.Dialog.KeySkillName  ' + this.props.keySkillEntry.id()}
                            data={this.props.keySkills.map(NameEntityUtil.mapToName).toArray()}
                            searchTerm={this.state.autoCompleteValue}
                            onSearchChange={this.handleAutoCompleteInput}
                        />
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <PwrIconButton iconName={'save'} tooltip={PowerLocalize.get('Action.Save')} onClick={this.saveAndExit}/>
                <PwrIconButton iconName={'close'} tooltip={PowerLocalize.get('Action.Exit')}
                               onClick={this.resetAndExit}/>
            </DialogActions>
        </Dialog>);
    }
}

/**
 * @see KeySkillDialogModule
 * @author nt
 * @since 13.06.2017
 */
export const KeySkillDialog: React.ComponentClass<KeySkillDialogLocalProps> = connect(KeySkillDialogModule.mapStateToProps, KeySkillDialogModule.mapDispatchToProps)(KeySkillDialogModule);