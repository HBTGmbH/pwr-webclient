import {connect} from 'react-redux';
import * as React from 'react';
import * as redux from 'redux';
import {AddSkillStep} from '../../../../../model/skill/AddSkillStep';
import {
    AppBar,
    Button,
    CircularProgress,
    Dialog,
    Radio,
    RadioGroup,
    Step,
    StepLabel,
    Stepper,
    Toolbar
} from '@material-ui/core';
import {SkillActionCreator} from '../../../../../reducers/skill/SkillActionCreator';
import {StarRating} from '../../../../star-rating_module.';
import {SkillSearcher} from '../../../../general/skill-search_module';
import {UnCategorizedSkillChoice} from '../../../../../model/skill/UncategorizedSkillChoice';
import {LimitedTextField} from '../../../../general/limited-text-field-module';
import {PowerLocalize} from '../../../../../localization/PowerLocalizer';
import {ApplicationState} from '../../../../../reducers/reducerIndex';
import {isNullOrUndefined} from 'util';
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import Typography from '@material-ui/core/Typography/Typography';
import {PwrIconButton} from '../../../../general/pwr-icon-button';
import {PwrSpacer} from '../../../../general/pwr-spacer_module';
import {Save} from '@material-ui/icons';
import Fab from '@material-ui/core/Fab/Fab';


interface AddSkillDialogProps {
    addSkillStep: AddSkillStep
    skillName: string;
    skillRating: number;
    categoryString: string;
    currentChoice: UnCategorizedSkillChoice;
    skillComment: string;
    addSkillError: string | undefined | null;
    doneState: string;
    /**
     * Reason why no category could be found.
     */
    noCategoryReason: string;

}

interface AddSkillDialogLocalProps {
    onOpen?(): void;
}

interface AddSkillDialogLocalState {

}

interface AddSkillDialogDispatch {
    changeSkillName(name: string): void;

    changeSkillRating(rating: number): void;

    progress(): void;

    stepBackToSkillInfo(): void;

    changeSkillComment(comment: string): void;

    setCurrentChoice(choice: UnCategorizedSkillChoice): void;

    closeDialog(): void;
}

class AddSkillDialogModule extends React.Component<AddSkillDialogProps
    & AddSkillDialogLocalProps
    & AddSkillDialogDispatch, AddSkillDialogLocalState> {


    static mapStateToProps(state: ApplicationState, localProps: AddSkillDialogLocalProps): AddSkillDialogProps {
        return {
            addSkillStep: state.skillReducer.currentAddSkillStep(),
            skillName: state.skillReducer.currentSkillName(),
            skillRating: state.skillReducer.currentSkillRating(),
            categoryString: state.skillReducer.categorieHierarchiesBySkillName().get(state.skillReducer.currentSkillName()),
            currentChoice: state.skillReducer.currentChoice(),
            skillComment: state.skillReducer.skillComment(),
            addSkillError: state.skillReducer.addSkillError(),
            noCategoryReason: state.skillReducer.noCategoryReason(),
            doneState: state.skillReducer.doneState()
        };
    }

    static mapDispatchToProps(dispatch: redux.Dispatch<ApplicationState>): AddSkillDialogDispatch {
        return {
            changeSkillRating: rating => dispatch(SkillActionCreator.SetCurrentSkillRating(rating)),
            changeSkillName: name => dispatch(SkillActionCreator.SetCurrentSkillName(name)),
            progress: () => dispatch(SkillActionCreator.AsyncProgressAddSkill()),
            stepBackToSkillInfo: () => dispatch(SkillActionCreator.StepBackToSkillInfo()),
            changeSkillComment: (comment) => dispatch(SkillActionCreator.ChangeSkillComment(comment)),
            setCurrentChoice: choice => dispatch(SkillActionCreator.SetCurrentChoice(choice)),
            closeDialog: () => dispatch(SkillActionCreator.ResetAddSkillDialog())
        };
    }

    private handleOpen = () => {
        if (!isNullOrUndefined(this.props.onOpen)) {
            this.props.onOpen();
        }
        this.props.progress();
    };

    private mapStepIndex = () => {
        switch (this.props.addSkillStep) {
            case AddSkillStep.SKILL_INFO:
                return 0;
            case AddSkillStep.CATEGORY_REQUEST_PENDING:
            case AddSkillStep.SHOW_CATEGORY:
            case AddSkillStep.SHOW_EDITING_OPTIONS:
                return 1;
            case AddSkillStep.DONE:
                return 2;
            default:
                return -1;

        }
    };

    private renderSkillInfo = (): JSX.Element => {
        return <div className="row">
            <div className="col-md-6">
                <SkillSearcher
                    fullWidth={true}
                    onValueChange={this.props.changeSkillName}
                    resetOnRequest={false}
                    maxHeight={'400px'}
                    maxResults={100}
                    id="AddSkill.Searcher"
                    label={PowerLocalize.get('Action.SearchSkill')}
                />
            </div>
            <div className="col-md-6">
                <StarRating
                    rating={this.props.skillRating}
                    onRatingChange={this.props.changeSkillRating}
                />
                <Button
                    variant={'contained'}
                    onClick={this.props.progress}
                >
                    {PowerLocalize.get('AddSkillDialog.ButtonProceed')}
                </Button>
            </div>
        </div>;
    };

    private renderCategoryRequestPending = (): JSX.Element => {
        return (
            <div>
                <div className="vertical-align">
                    <CircularProgress
                        size={40}
                        //left={0}
                        //top={0}
                        style={{position: 'relative', marginBottom: '8px'}}
                        //loadingColor="#FF9800"
                        //status="loading"
                    />
                </div>
                <div className="vertical-align">
                    {PowerLocalize.get('AddSkillDialog.CategoryPending.Info')}
                </div>
            </div>);
    };

    private renderShowCategory = (): JSX.Element => {
        return <div>
            <div style={{textAlign: 'center', margin: '16px'}}>
                {PowerLocalize.get('AddSkillDialog.ShowCategory.Introduction.0')}<br/>
                <span className="highlighted-category">{this.props.categoryString}</span><br/>
                {PowerLocalize.get('AddSkillDialog.ShowCategory.Introduction.1')}<br/>
                {PowerLocalize.get('AddSkillDialog.ShowCategory.Introduction.2')}<br/>
                {PowerLocalize.get('AddSkillDialog.ShowCategory.Introduction.3')}
            </div>
            <div className="row">
                <div className="col-md-6">
                    <Button
                        variant={'contained'}
                        className="mui-margin"
                        onClick={this.props.progress}
                    >
                        {PowerLocalize.get('AddSkillDialog.ShowCategory.BtnValidCategory')}
                    </Button>
                </div>
                <div className="col-md-6">
                    <Button
                        variant={'contained'}
                        className="mui-margin"
                        color={'secondary'}
                        onClick={this.props.stepBackToSkillInfo}
                    >
                        {PowerLocalize.get('AddSkillDialog.ShowCategory.BtnInvalidCategory')}
                    </Button>
                </div>
            </div>

        </div>;
    };

    private renderShowEditingOptions = (): JSX.Element => {
        return <div>
            <span>{PowerLocalize.get('AddSkillDialog.EditOptions.Introduction')}</span><br/>
            {this.props.noCategoryReason}<br/>
            <span>{PowerLocalize.get('AddSkillDialog.EditOptions.ChoiceText')}</span>
            <div style={{width: '100%', height: '150px'}}>
                <RadioGroup
                    name="choice"
                    style={{margin: '20px'}}
                    value={this.props.currentChoice.toString()}
                    onChange={(event, value) => this.props.setCurrentChoice((value as any))}
                >
                    <FormControlLabel
                        value={UnCategorizedSkillChoice.PROCEED_WITH_COMMENT}
                        control={<Radio color="primary"/>}
                        label={PowerLocalize.get(UnCategorizedSkillChoice.PROCEED_WITH_COMMENT)}
                    />
                    <FormControlLabel
                        value={UnCategorizedSkillChoice.PROCEED_ANYWAY}
                        control={<Radio color="primary"/>}
                        label={PowerLocalize.get(UnCategorizedSkillChoice.PROCEED_ANYWAY)}
                    />

                </RadioGroup>
                {
                    this.props.currentChoice === UnCategorizedSkillChoice.PROCEED_WITH_COMMENT ?
                        <LimitedTextField
                            errorText={PowerLocalize.get('AddSkillDialog.Comment.ErrorTooLong')}
                            overrideErrorText={this.props.addSkillError}
                            id="AddSkillDialog.Comment"
                            fullWidth={true}
                            maxCharacters={255}
                            value={this.props.skillComment}
                            multiLine={true}
                            onChange={(e, v) => {
                                this.props.changeSkillComment(v);
                            }}
                        />
                        :
                        false
                }

            </div>
            <Button
                variant={'contained'}
                onClick={this.props.progress}
            >{PowerLocalize.get('AddSkillDialog.ButtonProceed')}</Button>
        </div>;
    };

    private renderDone = (): JSX.Element => {
        let btn;
        if (this.props.doneState === 'SKILL_EXISTS') {
            btn = <div>
                <div className="Aligner">
                    <Fab
                        autoFocus
                        color="primary"
                        onClick={this.props.progress}
                        style={{color: 'white', width: 70, height: 70, fontSize: '60px'}}
                        aria-label={PowerLocalize.get('AddSkillDialog.Save')}>
                        <Save fontSize="inherit"/>
                    </Fab>
                </div>
                <div className="Aligner">
                    Skill Already Exists
                </div>
            </div>;
        } else {
            btn = <Fab
                autoFocus
                color="primary"
                onClick={this.props.progress}
                style={{color: 'white', width: 70, height: 70, fontSize: '60px'}}
                aria-label={PowerLocalize.get('AddSkillDialog.Save')}>
                <Save fontSize="inherit"/>
            </Fab>;
        }

        return <div>
            <div className="Aligner">
                {PowerLocalize.get('Action.Save')}
            </div>
            <div className="Aligner">
                {btn}
            </div>
        </div>;
    };

    private renderStepContent = (): JSX.Element => {
        switch (this.props.addSkillStep) {
            case AddSkillStep.SKILL_INFO:
                return this.renderSkillInfo();
            case AddSkillStep.CATEGORY_REQUEST_PENDING:
                return this.renderCategoryRequestPending();
            case AddSkillStep.SHOW_CATEGORY:
                return this.renderShowCategory();
            case AddSkillStep.SHOW_EDITING_OPTIONS:
                return this.renderShowEditingOptions();
            case AddSkillStep.DONE:
                return this.renderDone();
            default:
                return <div/>;
        }
    };

    render() {
        return (
            <div>
                <Button
                    variant={'contained'}
                    onClick={this.handleOpen}
                >
                    {PowerLocalize.get('AddSkillDialog.Title')}
                </Button>
                <Dialog
                    open={this.props.addSkillStep !== AddSkillStep.NONE}
                    scroll={'paper'}
                    style={{width: '100%'}}
                    title={PowerLocalize.get('AddSkillDialog.Title')}
                    fullScreen
                >
                    <AppBar>
                        <Toolbar>
                            <Typography style={{color: 'white', flex: 1}}
                                        variant={'h6'}>{PowerLocalize.get('AddSkillDialog.Title')}</Typography>
                            <PwrIconButton onClick={this.props.closeDialog} tooltip={PowerLocalize.get('Action.Close')}
                                           iconName={'close'}/>
                        </Toolbar>
                    </AppBar>
                    <PwrSpacer double={true}/>
                    <PwrSpacer double={true}/>
                    <PwrSpacer double={true}/>
                    <DialogContent>
                        <Stepper activeStep={this.mapStepIndex()}>
                            <Step>
                                <StepLabel>{PowerLocalize.get('AddSkillDialog.Step.0')}</StepLabel>
                            </Step>
                            <Step>
                                <StepLabel>{PowerLocalize.get('AddSkillDialog.Step.1')}</StepLabel>
                            </Step>
                            <Step>
                                <StepLabel>{PowerLocalize.get('AddSkillDialog.Step.2')}</StepLabel>
                            </Step>
                        </Stepper>
                        <div style={{marginLeft: '24px'}}>
                            {this.renderStepContent()}
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <PwrIconButton onClick={this.props.closeDialog} tooltip={PowerLocalize.get('Action.Close')}
                                       iconName={'close'}/>
                    </DialogActions>
                </Dialog>
            </div>);
    }
}

/**
 * Allows adding skills in a dialog form. Comes with a button to open the dialog.
 * @see AddSkillDialogModule
 * @author nt
 * @since 21.07.2017
 */
export const AddSkillDialog: React.ComponentClass<AddSkillDialogLocalProps> = connect(AddSkillDialogModule.mapStateToProps, AddSkillDialogModule.mapDispatchToProps)(AddSkillDialogModule);