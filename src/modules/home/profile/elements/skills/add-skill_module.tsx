import * as React from 'react';
import {KeyboardEvent} from 'react';
import {connect} from 'react-redux';
import {ApplicationState} from '../../../../../reducers/reducerIndex';
import {StarRating} from '../../../../star-rating_module.';
import Button from '@material-ui/core/Button/Button';
import Typography from '@material-ui/core/Typography/Typography';
import * as Immutable from 'immutable';
import {SkillActionCreator} from '../../../../../reducers/skill/SkillActionCreator';
import {SkillSearcher} from '../../../../general/skill-search_module';
import ArrowRight from '@material-ui/icons/ArrowRight';
import ArrowLeft from '@material-ui/icons/ArrowLeft';
import Stepper from '@material-ui/core/Stepper/Stepper';
import Step from '@material-ui/core/Step/Step';
import StepLabel from '@material-ui/core/StepLabel/StepLabel';
import StepContent from '@material-ui/core/StepContent/StepContent';
import HelpOutline from '@material-ui/icons/HelpOutline';
import {PowerLocalize} from '../../../../../localization/PowerLocalizer';
import {SkillServiceClient} from '../../../../../clients/SkillServiceClient';
import {ThunkDispatch} from 'redux-thunk';

interface AddSkill_ModuleProps {
    histories: Immutable.Map<string, string>;
}

interface AddSkill_ModuleLocalProps {
    onAddSkill(name: string, rating: number): void;
}

interface AddSkill_ModuleDispatch {
    requestSkillHierarchy(name: string): void;
}

interface AddSkill_ModuleState {
    skills: Array<string>;
    skillRating: number;
    skillName: string;
    progressState: number;
    showHelp: boolean;

}

export class AddSkill_Module extends React.Component<AddSkill_ModuleProps & AddSkill_ModuleLocalProps & AddSkill_ModuleDispatch, AddSkill_ModuleState> {


    constructor(props: AddSkill_ModuleProps & AddSkill_ModuleLocalProps & AddSkill_ModuleDispatch) {
        super(props);
        this.state = {
            skills: [],
            skillRating: 1,
            skillName: '',
            progressState: 0,
            showHelp: false,
        };

    }

    public static mapStateToProps(state: ApplicationState): AddSkill_ModuleProps {
        return {
            histories: state.skillReducer.categorieHierarchiesBySkillName,
        };
    }

    static mapDispatchToProps(dispatch: ThunkDispatch<any, any, any>): AddSkill_ModuleDispatch {
        return {
            requestSkillHierarchy: (name: string) => dispatch(SkillActionCreator.AsyncRequestSkillHierarchy(name))
        };
    }

    private handleOnChange = (data: string) => {
        if (this.state.skillName !== data) {
            this.setState({
                progressState: 0 // Back to the start
            });
        }
        this.setState({
            skillName: data
        });
        if (!!(data) && data.trim().length > 0) {
            SkillServiceClient.instance().getSearchSkill(data)
                .then(skills => this.setState({skills}))
                .catch((error: any) => console.error((error)));
            this.requestSkillHierarchy(data);
        }
    };


    private requestSkillHierarchy = (skillName) => {
        this.props.requestSkillHierarchy(skillName);
    };

    private handleRatingChange = (value: number) => {
        this.setState({
            skillRating: value,
        });
    };

    private resetState = () => {
        this.focusTextField();
        this.setState({
            skillRating: 1,
            skillName: '',
            progressState: 0,
            showHelp: false,
        });
    };

    private onAddSkill = () => {
        this.props.onAddSkill(this.state.skillName, this.state.skillRating);
        this.resetState();
    };

    private focusTextField = () => {
        document.getElementById('testName_inputField').focus();
    };

    private handleKeyPress = (event: KeyboardEvent) => {
        if (this.state.progressState === 0 && event.key === 'Enter' && !!(this.state.skillName)) {
            if (!this.props.histories.has(this.state.skillName)) {
                this.requestSkillHierarchy(this.state.skillName);
            }
            this.setState({progressState: 1});
            // TODO remove focus from Textfield
            document.getElementById('addSkillMain').focus();
        } else if (this.state.progressState === 1) {
            if (event.keyCode === 37) {
                let val: number = this.state.skillRating === 1 ? 1 : (this.state.skillRating - 1);
                this.handleRatingChange(val);
                //console.debug('leftArrow');
            } else if (event.keyCode === 39) {
                let val: number = this.state.skillRating === 5 ? 5 : (this.state.skillRating + 1);
                this.handleRatingChange(val);
                //console.debug('leftArrow');
            } else if (event.key === 'Enter') {
                this.onAddSkill();
            }
        }
        if (event.key === 'Escape') {
            this.resetState();
        }
    };

    private toggleShowHelp = () => {
        this.setState({
            showHelp: !this.state.showHelp,
        });
    };

    private skillHierarchy(): string {
        if (this.props.histories.has(this.state.skillName)) {
            return PowerLocalize.getFormatted('Profile.Skills.CategoryTemplate', this.props.histories.get(this.state.skillName));
        }
        return PowerLocalize.get('Profile.Skills.CategoryNotFound');
    }

    render() {
        return <div
            onKeyDown={this.handleKeyPress}
            id={'addSkillMain'}
            className={'col-md-12 row'}
        >
            <div
                id={'helpStepper'}
                className={'col-md-8'}
            >
                <Button onClick={this.toggleShowHelp}><HelpOutline/></Button>
                {!this.state.showHelp ? <></> :
                    <Stepper activeStep={this.state.progressState}>
                        <Step key={'Step0'}>
                            <StepLabel>Text eingeben</StepLabel>
                            <StepContent>
                                Nach einem Skill suchen und mit Enter bestätigen
                            </StepContent>
                        </Step>
                        <Step key={'Step1'}>
                            <StepLabel>Level anpassen</StepLabel>
                            <StepContent>
                                Kategorie überprüfen. <br/>
                                Mit den Pfeiltasten links/rechts das Level einstellen und mit Enter bestätigen
                            </StepContent>
                        </Step>

                    </Stepper>}

            </div>
            <div
                style={{minHeight: '49px'}}
                id={'skillSearcher'}
                className={'col-md-12'}
            >
                <div id={'addSkillTextField'} onClick={() => this.setState({progressState: 0})} className={'col-md-4'}>
                    <SkillSearcher
                        id={'testName'}
                        label={'Skill'}
                        resetOnRequest={false}
                        value={this.state.skillName}
                        onValueChange={this.handleOnChange}
                    />
                </div>
                <div id={'addSkillRatingSelect'} className={'col-md-6'}>
                    {this.state.progressState === 1 ? <ArrowLeft/> : <></>}
                    <StarRating rating={this.state.skillRating} onRatingChange={this.handleRatingChange}/>
                    {this.state.progressState === 1 ? <ArrowRight/> : <></>}
                </div>
                <Button variant={'contained'} onClick={this.onAddSkill} className={'col-md-2'}>
                    {this.state.progressState === 1 ? 'Enter' : 'Bestätigen'}
                </Button>
            </div>
            <div
                className={'col-md-12'}
            >
                <Typography>{this.skillHierarchy()}</Typography>
            </div>
        </div>;
    }
}


export const AddSkill: React.ComponentClass<AddSkill_ModuleLocalProps> =
    connect(AddSkill_Module.mapStateToProps, AddSkill_Module.mapDispatchToProps)(AddSkill_Module) as any;
