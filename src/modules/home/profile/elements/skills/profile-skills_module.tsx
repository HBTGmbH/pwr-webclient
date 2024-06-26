import {connect} from 'react-redux';
import * as React from 'react';
import {ApplicationState} from '../../../../../reducers/reducerIndex';
import {newProfileSkill, ProfileSkill} from '../../../../../reducers/profile-new/profile/model/ProfileSkill';
import {PROFILE_SKILLS_BY_NAME} from '../../../../../utils/Comparators';
import {AddSkill} from './add-skill_module';
import {Grid, Theme, withTheme} from '@material-ui/core';
import {PwrFormSubCaption} from '../../../../general/pwr-typography';
import {ProfileDataAsyncActionCreator} from '../../../../../reducers/profile-new/profile/ProfileDataAsyncActionCreator';
import {PowerLocalize} from '../../../../../localization/PowerLocalizer';
import Typography from '@material-ui/core/Typography';
import {StarRating} from '../../../../star-rating_module.';
import Divider from '@material-ui/core/Divider';
import {PwrIconButton} from '../../../../general/pwr-icon-button';
import Button from '@material-ui/core/Button';
import {SkillInfo} from './skill-info_module';
import Badge from '@material-ui/core/Badge';
import {Alerts} from '../../../../../utils/Alerts';
import {ThunkDispatch} from 'redux-thunk';

interface ProfileSkillsProps {
    skills: Array<ProfileSkill>;
    initials: string;
}

interface ThemeProps {
    theme: Theme;
}

interface ProfileSkillsLocalProps {

}

interface ProfileSkillsLocalState {
    selectedSkill: ProfileSkill;
}

interface ProfileSkillsDispatch {
    saveSkill(initials: string, skill: ProfileSkill);
    deleteSkill(initials: string, skill: ProfileSkill);
}

class ProfileSkillsModule extends React.Component<ProfileSkillsProps & ThemeProps & ProfileSkillsLocalProps & ProfileSkillsDispatch, ProfileSkillsLocalState> {



    constructor(props: ProfileSkillsProps & ProfileSkillsLocalProps & ThemeProps & ProfileSkillsDispatch) {
        super(props);
        this.state = {
            selectedSkill: null
        };
    }

    static mapStateToProps(state: ApplicationState): ProfileSkillsProps {
        return {
            skills: state.profileStore.profile.skills.sort(PROFILE_SKILLS_BY_NAME),
            initials: state.profileStore.consultant.initials
        };
    }

    static mapDispatchToProps(dispatch: ThunkDispatch<any, any, any>): ProfileSkillsDispatch {
        return {
            deleteSkill: (initials, skill) => dispatch(ProfileDataAsyncActionCreator.deleteProfileSkill(initials, skill)),
            saveSkill: (initials, skill) => dispatch(ProfileDataAsyncActionCreator.saveProfileSkill(initials, skill)),
        };
    }

    private handleSelectSkill = (skill: ProfileSkill) => {
        this.setState({
            selectedSkill: skill
        });
    };

    private handleChangeRating = (newRating: number, skill: ProfileSkill) => {
        const skillToSave: ProfileSkill = {...skill, ...{rating: newRating}};
        this.props.saveSkill(this.props.initials, skillToSave);
    };

    private handleAddSkill = (name: string, rating: number) => {
        if (name === "") {
            Alerts.showError(PowerLocalize.get('Profile.Skills.AddSkillErrorCaption'))
        } else if (!this.props.skills.some(skill => skill.name === name)) {
            this.props.saveSkill(this.props.initials, newProfileSkill(name, rating, []));
        }
    };

    private ratingIsValid = (rating) => {
        return (!isNaN(rating) && rating >= 1 && rating <= 5)
    }

    private handleDeleteSkill = (skill: ProfileSkill) => {
        this.props.deleteSkill(this.props.initials, skill);
    };

    private getCurrentSkill = () => {
        return this.state.selectedSkill;
    };

    componentDidUpdate(prevProps: Readonly<ProfileSkillsProps & ThemeProps & ProfileSkillsLocalProps & ProfileSkillsDispatch>,
                       prevState: Readonly<ProfileSkillsLocalState>): void {
        if (prevProps.skills != this.props.skills) {
            if (prevState.selectedSkill != null) {
                const newSkill: ProfileSkill = this.props.skills.filter(skill => prevState.selectedSkill.name === skill.name)[0];
                this.setState({
                    selectedSkill: newSkill
                });
            }
        }
    }

    private toSkill = (skill: ProfileSkill) => {
        return <Grid key={skill.id} xs={12} sm={6} md={3} lg={3} xl={3} container item spacing={0}
                     alignItems={'center'} style={{marginBottom: '15px'}}>
            <Grid item container xs={2} sm={2} md={2} lg={2} xl={2} justify={'flex-end'}>
                <PwrIconButton style={{right: 0}} iconName='delete'
                               tooltip={PowerLocalize.get('Action.Delete')}
                               onClick={() => this.handleDeleteSkill(skill)}/>
            </Grid>
            <Grid xs={10} sm={10} md={10} lg={10} xl={10} item container spacing={0}>
                <Grid item className="pwr-profile-entry-name" xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Button onClick={() => this.handleSelectSkill(skill)} style={{textTransform: 'none'}}>
                        <Badge
                            color={'primary'}
                            badgeContent={skill.versions.length}
                            variant={'dot'}
                        >
                            <Typography className="pwr-profile-entry-name" variant={'subtitle1'}>
                                {skill.name}
                            </Typography>
                        </Badge>
                    </Button>

                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <StarRating rating={skill.rating}
                                onRatingChange={newRating => this.handleChangeRating(newRating, skill)}/>
                </Grid>
            </Grid>
        </Grid>;
    };

    private toSkillList = (skills: Array<ProfileSkill>, caption: String) => {
        return (<React.Fragment>
            <Grid item md={12} sm={12} xs={12} lg={12} xl={12}>
                <PwrFormSubCaption>{caption}</PwrFormSubCaption>
            </Grid>
            <Grid item md={12} sm={12} xs={12} lg={12} xl={12}>
                <Divider variant={'fullWidth'}
                         style={{height: '2px', backgroundColor: this.props.theme.palette.primary.dark}}/>
            </Grid>
            <Grid item md={12} sm={12} xs={12} lg={12} xl={12}>
                <div className="Pwr-Content-Container">
                    <Grid container spacing={1}>
                        {skills.map(s => this.toSkill(s))}
                    </Grid>
                </div>
            </Grid>
        </React.Fragment>);
    }

    private toSkillOverview = () => {
        let pendingSkills: Array<ProfileSkill> = this.props.skills.filter(s => !this.ratingIsValid(s.rating));
        let ratedCaption: String = PowerLocalize.get('Profile.Skills.MySkillsCaption');

        if (pendingSkills.length) {
            let ratedSkills: Array<ProfileSkill> = this.props.skills.filter(s => this.ratingIsValid(s.rating));
            return <div>
                {this.toSkillList(pendingSkills, PowerLocalize.get('Profile.Skills.UnassessedSkillsCaption'))}
                {this.toSkillList(ratedSkills, ratedCaption)}
            </div>
        }
        return this.toSkillList(this.props.skills, ratedCaption);
    }

    render() {
        return (<Grid container spacing={1}>
            <Grid item md={12} sm={12} xs={12} lg={12} xl={12}>
                <PwrFormSubCaption>{PowerLocalize.get('Profile.Skills.AddSkillCaption')}</PwrFormSubCaption>
            </Grid>
            <Grid item md={12} sm={12} xs={12} lg={12} xl={12}>
                <Divider variant={'fullWidth'}
                         style={{height: '2px', backgroundColor: this.props.theme.palette.primary.dark}}/>
            </Grid>
            <Grid item md={6} sm={12} xs={12} lg={6} xl={6}>
                <div className="Pwr-Content-Container">
                    <AddSkill onAddSkill={this.handleAddSkill}/>
                </div>
            </Grid>
            <Grid item md={6} sm={12} xs={12} lg={6} xl={6}>
                <div className="Pwr-Content-Container">
                    <SkillInfo selectedSkill={this.getCurrentSkill()} handleChangeRating={this.handleChangeRating}/>
                </div>
            </Grid>
            {this.toSkillOverview()}
        </Grid>);
    }
}

export const ProfileSkills = withTheme((connect(ProfileSkillsModule.mapStateToProps, ProfileSkillsModule.mapDispatchToProps)(ProfileSkillsModule)));
