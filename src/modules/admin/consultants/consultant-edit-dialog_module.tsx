import {connect} from 'react-redux';
import * as React from 'react';
import {ConsultantInfo} from '../../../model/ConsultantInfo';
import {Dialog, DialogActions} from '@material-ui/core';
import {PowerLocalize} from '../../../localization/PowerLocalizer';
import {AdminActionCreator} from '../../../reducers/admin/AdminActionCreator';
import {ConsultantEditFields} from './consultant-edit-fields_module.';
import {ApplicationState} from '../../../reducers/reducerIndex';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import {PwrIconButton} from '../../general/pwr-icon-button';
import {ThunkDispatch} from 'redux-thunk';

/**
 * Properties that are managed by react-redux.
 *
 * Each property defined here will also need a corresponding mapping in the {@link ConsultantEditDialog.mapStateToProps} method,
 * otherwise the component will not render and update correctly.
 */
interface ConsultantEditDialogProps {
    consultantInfo: ConsultantInfo;

}

/**
 * Local properties of this module.
 *
 * These properties are used to initialize the local state and to control everything that is solely used for the display layer.
 *
 * Data that is intended not only for display needs to be placed in the {@link ConsultantEditDialogProps} and will then be
 * managed by redux.
 */
interface ConsultantEditDialogLocalProps {
    initials: string;
    show: boolean;

    onClose(): void;
}

/**
 * Local state of the module.
 *
 * All display-only state fields, such as bool flags that define if an element is visibile or not, belong here.
 */
interface ConsultantEditDialogLocalState {
    editDisabled: boolean;
    consultantInfo: ConsultantInfo;

}

/**
 * Defines mappings from local handlers to redux dispatches that invoke actions on the store.
 */
interface ConsultantEditDialogDispatch {
    redirectToUser(initials: string): void;

    updateConsultant(info: ConsultantInfo): void;

    deleteConsultant(initials: string): void;
}

class ConsultantEditDialogModule extends React.Component<ConsultantEditDialogProps
    & ConsultantEditDialogLocalProps
    & ConsultantEditDialogDispatch, ConsultantEditDialogLocalState> {


    constructor(props: ConsultantEditDialogProps & ConsultantEditDialogLocalProps & ConsultantEditDialogDispatch) {
        super(props);
        this.state = {
            editDisabled: false,
            consultantInfo: props.consultantInfo,
        };
    }


    static mapStateToProps(state: ApplicationState, localProps: ConsultantEditDialogLocalProps): ConsultantEditDialogProps {
        return {
            consultantInfo: state.adminReducer.consultantsByInitials.get(localProps.initials)
        };
    }

    static mapDispatchToProps(dispatch: ThunkDispatch<any, any, any>): ConsultantEditDialogDispatch {
        return {
            redirectToUser: initials => dispatch(AdminActionCreator.AsyncRedirectToUser(initials)),
            updateConsultant: (info) => dispatch(AdminActionCreator.AsyncUpdateConsultant(info)),
            deleteConsultant: (initials => dispatch(AdminActionCreator.AsyncDeleteConsultant(initials)))
        };
    }

    private setFirstName = (val: string) => {
        this.setState({
            consultantInfo: this.state.consultantInfo.setFirstName(val)
        });
    };

    private setLastName = (val: string) => {
        this.setState({
            consultantInfo: this.state.consultantInfo.setLastName(val)
        });
    };

    private setActive = (val: boolean) => {
        this.setState({
            consultantInfo: this.state.consultantInfo.setActive(val)
        });
    };

    private setProfilePictureId = (profilePictureId: string) => {
        this.setState({
            consultantInfo: this.state.consultantInfo.setProfilePictureId(profilePictureId)
        });
    };

    private setTitle = (val: string) => {
        this.setState({
            consultantInfo: this.state.consultantInfo.setTitle(val)
        });
    };

    private setBirthDate = (val: Date) => {
        this.setState({
            consultantInfo: this.state.consultantInfo.setBirthDate(val)
        });
    };

    private closeDialog = () => {
        this.props.onClose();
    };

    private resetAndClose = () => {
        this.setState({
            consultantInfo: this.props.consultantInfo
        });
        this.closeDialog();
    };

    private saveAndClose = () => {
        this.closeDialog();
        this.props.updateConsultant(this.state.consultantInfo);
    };

    private deleteConsultant = () => {
        this.props.deleteConsultant(this.state.consultantInfo.initials());
        this.closeDialog();
    };


    render() {
        let dialogActions = [
            <PwrIconButton key="save" iconName={'save'} tooltip={PowerLocalize.get('Action.Save')}
                           onClick={this.saveAndClose}/>,
            <PwrIconButton key="edit" iconName={'edit'} tooltip={PowerLocalize.get('ConsultantTile.EditProfile')}
                           onClick={() => this.props.redirectToUser(this.props.initials)}/>,
            <PwrIconButton key="close" iconName={'close'} tooltip={PowerLocalize.get('Action.Exit')}
                           onClick={this.resetAndClose}/>
        ]
        if (!this.props.consultantInfo.active()) {
            const deleteButton = <PwrIconButton key="delete" iconName={'delete'} tooltip={PowerLocalize.get('Action.Delete')}
                                                onClick={this.deleteConsultant}/>;
            dialogActions = [deleteButton, ...dialogActions]
        }

        return (<div>
            <Dialog
                scroll="paper"
                id={'ConsultantTile.EditConsultant.Dialog'}
                open={this.props.show}
                onClose={this.closeDialog}
            >
                <DialogTitle
                    id="ConsultantTile.EditConsultant.Dialog.Title">{PowerLocalize.get('ConsultantTile.EditConsultant')}
                </DialogTitle>
                <DialogContent dividers={true} style={{width: '400px', 'overflowX': 'hidden'}}>
                    <ConsultantEditFields
                        firstName={this.state.consultantInfo.firstName()}
                        lastName={this.state.consultantInfo.lastName()}
                        title={this.state.consultantInfo.title()}
                        birthDate={this.state.consultantInfo.birthDate()}
                        active={this.state.consultantInfo.active()}
                        profilePictureId={this.state.consultantInfo.profilePictureId()}
                        onFirstNameChange={this.setFirstName}
                        onLastNameChange={this.setLastName}
                        onTitleChange={this.setTitle}
                        onBirthDateChange={this.setBirthDate}
                        onActiveChange={this.setActive}
                        onProfilePictureIdChange={this.setProfilePictureId}
                    />
                </DialogContent>
                <DialogActions>
                    {dialogActions}
                </DialogActions>
            </Dialog>
        </div>);
    }
}

/**
 * @see ConsultantEditDialogModule
 * @author nt
 * @since 08.06.2017
 */
export const ConsultantEditDialog = connect(ConsultantEditDialogModule.mapStateToProps, ConsultantEditDialogModule.mapDispatchToProps)(ConsultantEditDialogModule);
