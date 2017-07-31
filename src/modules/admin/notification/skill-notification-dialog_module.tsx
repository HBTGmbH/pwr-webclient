import {connect} from 'react-redux';
import * as React from 'react';
import * as redux from 'redux';
import {ApplicationState} from '../../../Store';
import {
    Dialog,
    FlatButton,
    IconButton,
    RadioButton,
    RadioButtonGroup,
    RaisedButton,
    RefreshIndicator
} from 'material-ui';

import {SkillNotificationEditStatus} from '../../../model/admin/SkillNotificationEditStatus';
import {AdminActionCreator} from '../../../reducers/admin/AdminActionCreator';
import {SkillNotification} from '../../../model/admin/SkillNotification';
import {isNullOrUndefined} from 'util';
import {SkillNotificationAction} from '../../../model/admin/SkillNotificationAction';
import {Step, StepLabel, Stepper} from 'material-ui/Stepper';
import {SkillSearcher} from '../../general/skill-search_module';

interface SkillNotificationModuleProps {
    status: SkillNotificationEditStatus;
    notification: SkillNotification;
    hierarchy: string;
    error: string;
    skillNotificationSelectedAction: SkillNotificationAction;
    newSkillName: string;
    skillEdited: boolean;
}

interface SkillNotificationModuleLocalProps {

}

interface SkillNotificationModuleLocalState {

}

interface SkillNotificationModuleDispatch {
    closeAndReset(): void;
    setSkillNotificationAction(action: SkillNotificationAction): void;
    categorizeSkill(name: string): void;
    progressFromActionSelection(): void;
    changeNewSkillName(name: string): void;
    invokeSkillNotificationEditAction(): void;
}

class SkillNotificationModuleModule extends React.Component<
    SkillNotificationModuleProps
    & SkillNotificationModuleLocalProps
    & SkillNotificationModuleDispatch, SkillNotificationModuleLocalState> {

    static mapStateToProps(state: ApplicationState, localProps: SkillNotificationModuleLocalProps): SkillNotificationModuleProps {
        let hierarchy = '';
        if(!isNullOrUndefined(state.adminReducer.selectedSkillNotification())) {
            hierarchy = state.skillReducer.categorieHierarchiesBySkillName().get(state.adminReducer.selectedSkillNotification().newName())
        }
        let newSkillName = '';
        if(!isNullOrUndefined(state.adminReducer.selectedSkillNotification())) {
            newSkillName = state.adminReducer.selectedSkillNotification().newName();
        }
        return {
            status: state.adminReducer.skillNotificationEditStatus(),
            notification: state.adminReducer.selectedSkillNotification(),
            hierarchy: hierarchy,
            error: state.adminReducer.skillNotificationError(),
            skillNotificationSelectedAction: state.adminReducer.skillNotificationSelectedAction(),
            newSkillName: newSkillName,
            skillEdited: state.adminReducer.isSkillNameEdited()
        };
    }

    static mapDispatchToProps(dispatch: redux.Dispatch<ApplicationState>): SkillNotificationModuleDispatch {
        return {
            closeAndReset: () => dispatch(AdminActionCreator.CloseAndResetSkillNotificationDlg()),
            setSkillNotificationAction: action => dispatch(AdminActionCreator.SetSkillNotificationAction(action)),
            categorizeSkill: skillName => dispatch(AdminActionCreator.AsyncCategorizeSkill(skillName)),
            progressFromActionSelection: () => dispatch(AdminActionCreator.AsyncProgressFromActionSelection()),
            changeNewSkillName: (name) => dispatch(AdminActionCreator.SetNewSkillName(name)),
            invokeSkillNotificationEditAction: () => dispatch(AdminActionCreator.AsyncNotificationInvokeSkillEdit())
        };
    }

    private renderPending = () => {
        return <div>
            <div className="vertical-align">
                <RefreshIndicator
                    size={40}
                    left={0}
                    top={0}
                    style={{position: 'relative', marginBottom: '8px'}}
                    loadingColor="#FF9800"
                    status="loading"
                />
            </div>
            <div className="vertical-align">
                Fetching information for skill '{this.props.notification.skill().name()}'
            </div>
        </div>;
    };

    private SkillInfo = () => {
        return <div>
            <p>
                The previously unknown skill <strong>{this.props.notification.skill().name()}</strong> was added to the profile
                of <strong>{this.props.notification.adminNotification().initials()}</strong>.
            </p>
            {
                this.props.skillEdited ? <p>The new skill name will be <strong>{this.props.newSkillName}</strong></p> : false
            }
        </div>;
    };

    private NotificationActions = () => {
        return <div>
            <p>
                Please choose one of the action below to resolve the notification.
            </p>
            <RadioButtonGroup
                name="notificationAction"
                valueSelected={this.props.skillNotificationSelectedAction}
                onChange={(event: any, value: string /* not really a string, it likes to think it is one */) => {this.props.setSkillNotificationAction(value as any);}}
            >
            <RadioButton
                value={SkillNotificationAction.ACTION_OK}
                label="Accept Skill"
            />
            <RadioButton
                value={SkillNotificationAction.ACTION_EDIT}
                label="Edit Skill"
            />
            <RadioButton
                value={SkillNotificationAction.ACTION_DELETE}
                label="Delete Skill"
            />
            </RadioButtonGroup>
        </div>
    }

    private renderInfo = () => {
        return <div>
            <this.SkillInfo/>
            <p>
                The skill has the following category:
                <span className="highlighted-category"> {this.props.hierarchy}</span>
            </p>
            <this.NotificationActions/>
        </div>;
    };

    private renderInfoCategoryPending = () => {
        return <div>
            <this.SkillInfo/>
            <RefreshIndicator
                size={40}
                left={0}
                top={0}
                style={{position: 'relative', marginBottom: '8px'}}
                loadingColor="#FF9800"
                status="loading"
            />
            <p>
                Categorization pending...
            </p>
        </div>;
    };

    private renderInfoNoCategory = () => {
        return <div>
            <this.SkillInfo/>
            <p>
                This skill was not yet categorized.
                <FlatButton
                    label="Categorize now."
                    secondary={true}
                    onClick={() => this.props.categorizeSkill(this.props.notification.skill().name())}
                />
            </p>
            <this.NotificationActions/>
        </div>;
    };

    private renderInfoCategoryError = () => {
        console.log("Reason:", this.props.error);
        return <div>
            <this.SkillInfo/>
            <p>
                Categorization failed. Reason: <span className="error-text">{this.props.error}</span>
            </p>
            <this.NotificationActions/>
        </div>;
    };

    private renderError = () => {
        return <div className="error-text">
            An error occurred: {this.props.error}
        </div>;
    };

    private renderSuccess = () => {
        return <div style={{textAlign: 'center'}}>
            Success<br/>
            <IconButton
                iconClassName="material-icons"
                iconStyle={{color: 'green'}}
                size={80}
            >
                check_circle
            </IconButton>
        </div>;
    };

    private renderEdit = () => {
        return <div className="vcenter">
            <p>
                The skill name may now be changed. This change affects all non-view profiles.
            </p>
            <SkillSearcher
                id="SkillNotificationDialog.SkillSearcher"
                initialValue={this.props.newSkillName}
                value={this.props.newSkillName}
                onValueChange={this.props.changeNewSkillName}
                onNewRequest={this.props.changeNewSkillName}
            />
            <p>
                Consider validating the skill category after change; If you are sure the changed skill is correct, this is not necessary.
            </p>
        </div>
    }

    private renderContent() {
        switch(this.props.status) {
            case SkillNotificationEditStatus.FETCHING_DATA:
                return this.renderPending();
            case SkillNotificationEditStatus.DISPLAY_INFO_CATEGORY:
                return this.renderInfo();
            case SkillNotificationEditStatus.DISPLAY_INFO_NO_CATEGORY:
                return this.renderInfoNoCategory();
            case SkillNotificationEditStatus.DISPLAY_INFO_CATEGORY_PENDING:
                return this.renderInfoCategoryPending();
            case SkillNotificationEditStatus.DISPLAY_INFO_CATEGORY_ERROR:
                return this.renderInfoCategoryError();
            case SkillNotificationEditStatus.DISPLAY_EDIT_DIALOG:
                return this.renderEdit();
            case SkillNotificationEditStatus.DISPLAY_ERROR:
                return this.renderError();
            case SkillNotificationEditStatus.DISPLAY_SUCCESS:
                return this.renderSuccess();
            default:
                return <div/>;
        }
    }

    private renderStepper = () => {
        let index = 0;
        let displayLastStepper = false;
        switch(this.props.status) {
            case SkillNotificationEditStatus.FETCHING_DATA:
                index = 0;
            case SkillNotificationEditStatus.DISPLAY_INFO_NO_CATEGORY:
            case SkillNotificationEditStatus.DISPLAY_INFO_CATEGORY_PENDING:
            case SkillNotificationEditStatus.DISPLAY_INFO_CATEGORY:
            case SkillNotificationEditStatus.DISPLAY_INFO_CATEGORY_ERROR:
                index = 1;
                break;
            case SkillNotificationEditStatus.DISPLAY_EDIT_DIALOG:
                index = 2;
                break;
            case SkillNotificationEditStatus.DISPLAY_ERROR:
            case SkillNotificationEditStatus.DISPLAY_SUCCESS:
            default:
                break;
        }
        if(this.props.skillNotificationSelectedAction === SkillNotificationAction.ACTION_EDIT) {
            displayLastStepper = true;
        }
        let steps = [
            <Step>
                <StepLabel>Information Resolving</StepLabel>
            </Step>,
            <Step>
                <StepLabel>Information</StepLabel>
            </Step>
        ];
        if(displayLastStepper) steps.push(<Step>
            <StepLabel>Edit Skill</StepLabel>
        </Step>);

        return (<Stepper activeStep={index}>
            {steps}
        </Stepper>);
    };

    private renderController = () => {
        switch(this.props.status) {
            case SkillNotificationEditStatus.DISPLAY_INFO_CATEGORY_PENDING:
                return (<RaisedButton
                    secondary={true}
                    label="Categorize"
                    onClick={() => this.props.categorizeSkill(this.props.notification.skill().name())}
                    disabled={true}
                />);
            case SkillNotificationEditStatus.DISPLAY_INFO_NO_CATEGORY:
            case SkillNotificationEditStatus.DISPLAY_INFO_CATEGORY:
            case SkillNotificationEditStatus.DISPLAY_INFO_CATEGORY_ERROR:
                let label = this.props.skillNotificationSelectedAction === SkillNotificationAction.ACTION_EDIT ? "Continue" : "Finish";
                return (<RaisedButton
                    label={label}
                    secondary={true}
                    onClick={this.props.progressFromActionSelection}
                />);
            case SkillNotificationEditStatus.DISPLAY_EDIT_DIALOG:
                return (
                    <div>
                        <RaisedButton
                            label="Validate"
                            primary={true}

                            onClick={() => this.props.categorizeSkill(this.props.notification.newName())}
                        />
                        <RaisedButton
                            label="Finish"
                            secondary={true}
                            style={{marginLeft: "8px"}}
                            onClick={this.props.invokeSkillNotificationEditAction}
                        />
                    </div>
                );
            case SkillNotificationEditStatus.DISPLAY_ERROR:
            case SkillNotificationEditStatus.DISPLAY_SUCCESS:
            case SkillNotificationEditStatus.FETCHING_DATA:
            default:
                return <div/>
        }
    };

    render() {
        return (<Dialog
            open={this.props.status !== SkillNotificationEditStatus.CLOSED && !isNullOrUndefined(this.props.notification)}
            actions={[<FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.props.closeAndReset}
            />]}
        >
            {this.renderContent()}
            {this.renderStepper()}
            {this.renderController()}
        </Dialog>);
    }
}

/**
 * @see SkillNotificationModuleModule
 * @author nt
 * @since 27.07.2017
 */
export const SkillNotificationDialog: React.ComponentClass<SkillNotificationModuleLocalProps> = connect(SkillNotificationModuleModule.mapStateToProps, SkillNotificationModuleModule.mapDispatchToProps)(SkillNotificationModuleModule);