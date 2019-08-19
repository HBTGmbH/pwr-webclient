import {ApplicationState} from '../../../reducers/reducerIndex';
import * as redux from 'redux';
import {connect} from 'react-redux';
import * as React from 'react';
import {isNullOrUndefined} from 'util';
import Typography from '@material-ui/core/Typography/Typography';
import Grid from '@material-ui/core/Grid/Grid';
import {ProfileEntryType} from '../../../reducers/profile-new/profile/model/ProfileEntryType';
import {ProfileTypeDataMapper} from '../../../reducers/profile-new/profile/ProfileTypeDataMapper';
import {NameEntity} from '../../../reducers/profile-new/profile/model/NameEntity';
import {PwrIconButton} from '../../general/pwr-icon-button';
import Divider from '@material-ui/core/Divider/Divider';
import {ProfileEntryDialog} from './profile-entry-edit_module';
import {ProfileEntry} from '../../../reducers/profile-new/profile/model/ProfileEntry';
import {PowerLocalize} from '../../../localization/PowerLocalizer';
import {Theme, withTheme} from '@material-ui/core';

interface ProfileEntryProps {
    allEntries: Array<ProfileEntry>;
    suggestions: Array<string>;
    initials: string;
}

interface ProfileEntryLocalProps {
    type: ProfileEntryType;
    theme: Theme;
    renderSingleElementInfo(entry: ProfileEntry, id: number): JSX.Element;
}

interface ProfileEntryDispatch {
    updateEntity(initials: string, entry: ProfileEntry): void;

    deleteEntry(initials: string, id: number);
}

interface ProfileEntryState {
    editId: number;
    selectEntry: ProfileEntry;
    deleteConfirm: boolean;
    searchText: string;
    addNew: boolean;
    open: boolean;
}

class ProfileEntryModule extends React.Component<ProfileEntryProps & ProfileEntryLocalProps & ProfileEntryDispatch, ProfileEntryState> {
    constructor(props) {
        super(props);
        this.resetState();
    }

    private resetState() {

        this.state = {
            editId: -1,
            selectEntry: null,
            deleteConfirm: false,
            searchText: '',
            addNew: false,
            open: false,
        };
    }

    private setDefaultState = () => {
        this.setState({
            editId: -1,
            selectEntry: null,
            deleteConfirm: false,
            searchText: '',
            addNew: false,
            open: false,
        });
    };

    static mapStateToProps(state: ApplicationState, localProps: ProfileEntryLocalProps): ProfileEntryProps {
        const profileField = ProfileTypeDataMapper.getProfileField(localProps.type);
        const entries = (!isNullOrUndefined(profileField) && !isNullOrUndefined(state.profileStore.profile)) ? state.profileStore.profile[profileField] : [];
        const suggestionField = ProfileTypeDataMapper.getSuggestionField(localProps.type);
        const suggestionData: Array<NameEntity> = !isNullOrUndefined(suggestionField) && !isNullOrUndefined(state.suggestionStore) ? state.suggestionStore[suggestionField] : [];
        const suggestionNames = !isNullOrUndefined(suggestionData) ? suggestionData.map(e => e.name) : [];
        const initials = !isNullOrUndefined(state.profileStore.consultant) ? state.profileStore.consultant.initials : '';
        return {
            allEntries: entries,
            suggestions: suggestionNames,
            initials: initials,
        };
    }

    static mapDispatchToProps(dispatch: redux.Dispatch<ApplicationState>, localProps: ProfileEntryLocalProps): ProfileEntryDispatch {
        return {
            updateEntity: ProfileTypeDataMapper.getUpdateFunction(localProps.type, dispatch),
            deleteEntry: ProfileTypeDataMapper.getDeleteFunction(localProps.type, dispatch)
        };
    }

    private handleNewButton = () => {
        this.setState({
            selectEntry: null,
            open: true,
        });
    };

    private handleUpdateButton = () => {
        this.props.updateEntity(this.props.initials, null);
    };

    private handleDeleteButton = (initials: string, id: number) => {
        this.props.deleteEntry(initials, id);
    };

    private handleEditButton = (entry: ProfileEntry) => {
        this.setState({
            open: true,
            selectEntry: entry
        });
    };

    private handleDialogOnClose = () => {
        this.setDefaultState();
    };

    private renderSingleElement = (entry: ProfileEntry, id: number) => {
        return (
            <Grid key={id} item container alignItems={'flex-end'} spacing={0} className="cursor-pointer"
                  onClick={event => this.handleEditButton(entry)}
            >
                <Grid item className="pwr-profile-entry-name" xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Typography className="pwr-profile-entry-name" variant={'subheading'}>{entry.nameEntity.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    {
                        this.props.renderSingleElementInfo(entry, id)
                    }
                </Grid>
            </Grid>
        );
    };

    private renderEmptyElement = () => {
        return <Grid item container alignItems={'flex-end'} spacing={0}>
            <Grid item className="pwr-profile-entry-name" xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography className="pwr-profile-entry-name" variant={'subheading'}>{PowerLocalize.get('Profile.Entries.NotAvailable')}</Typography>
            </Grid>
        </Grid>
    };

    render() {
        return (
            <div className="pwr-profile-entry-container">
                <ProfileEntryDialog open={this.state.open} onClose={this.handleDialogOnClose} type={this.props.type}
                                    entry={this.state.selectEntry}/>
                <Grid container spacing={0} alignItems={'center'}>
                    <Grid item md={9}>
                        <Typography variant={'subtitle1'}>
                            {PowerLocalize.get(`ProfileEntryType.${this.props.type}.Header`)}
                        </Typography>
                    </Grid>
                    <Grid item md={3}>
                        <PwrIconButton iconName={'add'} tooltip={PowerLocalize.get('Action.Add')}
                                       onClick={this.handleNewButton}/>
                    </Grid>
                    <Grid item md={12} sm={12} xs={12} lg={12} xl={12} >
                        <Divider variant={'fullWidth'} style={{height: "2px", backgroundColor: this.props.theme.palette.primary.dark}}/>
                    </Grid>
                    <Grid item container spacing={8}  md={12} sm={12}>
                        {
                            !isNullOrUndefined(this.props.allEntries) && this.props.allEntries.length > 0 ?
                                this.props.allEntries.map(this.renderSingleElement) :
                                this.renderEmptyElement()
                        }
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export const ProfileEntryElement = withTheme() (connect(ProfileEntryModule.mapStateToProps, ProfileEntryModule.mapDispatchToProps)(ProfileEntryModule));
