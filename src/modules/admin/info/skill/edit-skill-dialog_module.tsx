import {connect} from 'react-redux';
import * as React from 'react';
import * as redux from 'redux';
import {ApplicationState} from '../../../../reducers/reducerIndex';
import {Dialog, FlatButton, RaisedButton, Step, StepLabel, Stepper} from 'material-ui';
import {ConsultantInfo} from '../../../../model/ConsultantInfo';
import {SkillSearcher} from '../../../general/skill-search_module';
import {AdminActionCreator} from '../../../../reducers/admin/AdminActionCreator';
import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {postCategorizeSkill} from '../../../../API_CONFIG';
import {APISkillCategory} from '../../../../model/skill/SkillCategory';
import {SkillReducer} from '../../../../reducers/skill/SkillReducer';
import {PowerLocalize} from '../../../../localization/PowerLocalizer';

interface EditSkillDialogProps {
}

interface EditSkillDialogLocalProps {
    open: boolean;
    skillToEdit: string;
    skillInfo: Immutable.List<ConsultantInfo>;
    onRequestClose(): void;

}

interface EditSkillDialogLocalState {
    stepIndex: number;
    newSkillName: string;
    skillHierarchy: string;

}

interface EditSkillDialogDispatch {
    changeSkillName(oldName: string, newName: string): void;
}

class EditSkillDialogModule extends React.Component<EditSkillDialogProps & EditSkillDialogLocalProps & EditSkillDialogDispatch, EditSkillDialogLocalState> {

    public constructor(props: EditSkillDialogProps & EditSkillDialogLocalProps & EditSkillDialogDispatch) {
        super(props);
        this.state = EditSkillDialogModule.emptyState();
    }

    static emptyState(): EditSkillDialogLocalState {
        return {
            stepIndex: 0,
            newSkillName: "",
            skillHierarchy: ""
        }
    }

    static mapStateToProps(state: ApplicationState, localProps: EditSkillDialogLocalProps): EditSkillDialogProps {
        return {
        };
    }

    static mapDispatchToProps(dispatch: redux.Dispatch<ApplicationState>): EditSkillDialogDispatch {
        return {
            changeSkillName: ((oldName, newName) => dispatch(AdminActionCreator.AsyncChangeSkillName(oldName, newName)))
        };
    }

    public componentWillReceiveProps(newProps: EditSkillDialogProps & EditSkillDialogLocalProps & EditSkillDialogDispatch) {
        if (newProps.open !== this.props.open) {
            this.setState(EditSkillDialogModule.emptyState())
        }
    }

    private stepForth = () => {
        let newIndex = this.state.stepIndex + 1;
        if (newIndex === 2 && !this.state.skillHierarchy) {
            this.loadSkillHierarchy();
        }
        if (newIndex === 3) {
            this.props.changeSkillName(this.props.skillToEdit, this.state.newSkillName);
            this.props.onRequestClose();
        }
        this.setState({
            stepIndex: newIndex
        });
    };

    private changeNewSkillName = (value: string ) => {
        this.setState({
            newSkillName: value
        })
    };

    private stepBack = () => {
        let stepIndex = this.state.stepIndex - 1;
        if (stepIndex < 0) {
            stepIndex = 0;
        }
        this.setState({
            stepIndex: stepIndex
        });
    };
    private loadSkillHierarchy = () => {
        let config: AxiosRequestConfig = {params: {qualifier: this.state.newSkillName}}
        axios.post(postCategorizeSkill(), null, config).then((response: AxiosResponse) => {
            let apiCategory: APISkillCategory = response.data;
            let hierarchy = SkillReducer.buildHierarchy(apiCategory);
            hierarchy = this.state.newSkillName + " => " + hierarchy;
            this.setState({skillHierarchy: hierarchy });
        }).catch( error => {
            console.error(error);
            console.log(error.response);
            this.setState({skillHierarchy: "Not available." });
        });
    };

    private getStepContent = (index: number) => {
        if (index === 0) {
            return <div>
                <p>
                    {PowerLocalize.getFormatted("AdminClient.Infos.UsedSkills.Edit.Content1", this.props.skillToEdit)}
                </p>
                <p>
                    {this.props.skillInfo.map(value => value.getFullName()).join(", ")}
                </p>
            </div>
        } else if (index === 1) {
            return <div>
                <p>
                    {PowerLocalize.getFormatted("AdminClient.Infos.UsedSkills.Edit.Content2", this.props.skillToEdit)}
                </p>
                <SkillSearcher
                    id="EditSkillDialog.SkillSearcher"
                    floatingLabelText={PowerLocalize.getFormatted("AdminClient.Infos.UsedSkills.Edit.NewSkillLabel")}
                    initialValue={this.state.newSkillName}
                    value={this.state.newSkillName}
                    onValueChange={this.changeNewSkillName}
                    onNewRequest={this.changeNewSkillName}
                    resetOnRequest={false}
                />
            </div>
        } else if (index === 2) {
            let hierarchy = this.state.skillHierarchy;
            if (hierarchy && hierarchy !== "") {
                return <div>
                    <p>
                        {PowerLocalize.get("AdminClient.Infos.UsedSkills.Edit.Content3_1")}
                    </p>
                    <p>
                        <span className="highlighted-category">{hierarchy}</span>
                    </p>
                    <p>
                        {PowerLocalize.get("AdminClient.Infos.UsedSkills.Edit.Content3_2")}<br/>
                        <span className="warning-note">{PowerLocalize.get("AdminClient.Infos.UsedSkills.Edit.Content3_note")}</span>
                    </p>
                </div>
            } else {
                return <div>
                    Currently retrieving category information...
                </div>
            }
        }
        return <div>This should not be visible. Call a developer.</div>
    };


    render() {
        if(!this.props.skillInfo || !this.props.skillToEdit) {
            return <div/>
        }
        return (<Dialog title={PowerLocalize.getFormatted("AdminClient.Infos.UsedSkills.Edit.Title", this.props.skillToEdit)}
                        autoScrollBodyContent={true}
            open={this.props.open}
            onRequestClose={this.props.onRequestClose}>
                <Stepper activeStep={this.state.stepIndex}>
                    <Step>
                        <StepLabel>{PowerLocalize.get("AdminClient.Infos.UsedSkills.Edit.Step1")}</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>{PowerLocalize.get("AdminClient.Infos.UsedSkills.Edit.Step2")}</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>{PowerLocalize.get("AdminClient.Infos.UsedSkills.Edit.Step3")}</StepLabel>
                    </Step>
                </Stepper>
                <div>
                    <div>
                        {this.getStepContent(this.state.stepIndex)}
                        <div style={{marginTop: 12}}>
                            <FlatButton
                                className="mui-margin"
                                label={PowerLocalize.get("Action.Back")}
                                disabled={this.state.stepIndex === 0}
                                onClick={this.stepBack}
                            />
                            <RaisedButton
                                className="mui-margin"
                                label={this.state.stepIndex === 2 ? PowerLocalize.get("Action.Finish") : PowerLocalize.get("Action.Next")}
                                primary={true}
                                onClick={this.stepForth}
                            />
                        </div>
                    </div>
                </div>
        </Dialog>);
    }
}

/**
 * @see EditSkillDialogModule
 * @author nt
 * @since 03.02.2018
 */
export const EditSkillDialog: React.ComponentClass<EditSkillDialogLocalProps> = connect(EditSkillDialogModule.mapStateToProps, EditSkillDialogModule.mapDispatchToProps)(EditSkillDialogModule);