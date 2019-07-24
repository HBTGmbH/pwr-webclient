import * as redux from 'redux';
import Dialog from '@material-ui/core/Dialog/Dialog';
import * as React from 'react';
import {ProfileTypeDataMapper} from '../../../reducers/profile-new/profile/ProfileTypeDataMapper';
import {PwrAutoComplete} from '../../general/pwr-auto-complete';
import {ProfileEntryType} from '../../../reducers/profile-new/profile/model/ProfileEntryType';
import {connect} from 'react-redux';
import {ApplicationState} from '../../../reducers/reducerIndex';
import {isNullOrUndefined} from 'util';
import {NameEntity} from '../../../reducers/profile-new/profile/model/NameEntity';
import {ProfileEntry} from '../../../reducers/profile-new/profile/model/ProfileEntry';
import Grid from '@material-ui/core/Grid/Grid';
import Select from '@material-ui/core/Select/Select';
import FormControl from '@material-ui/core/FormControl/FormControl';
import {LanguageLevel, toLanguageLevel} from '../../../reducers/profile-new/profile/model/LanguageLevel';
import {PowerLocalize} from '../../../localization/PowerLocalizer';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import {EducationDegree, toDegree} from '../../../reducers/profile-new/profile/model/EducationDegree';
import {PwrDatePicker} from '../../general/pwr-date-picker_module';
import {DatePickerType} from '../../../model/DatePickerType';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import Button from '@material-ui/core/Button/Button';
import {PwrDeleteConfirm} from '../../general/pwr-delete-confirm';

interface ProfileEntryDialogProps {
    suggestions: Array<string>;
    degrees: Array<EducationDegree>;

    langLevel: Array<LanguageLevel>;
    initials: string;
}

interface ProfileEntryDialogLocalProps {
    open: boolean;
    type: ProfileEntryType;
    entry: ProfileEntry;

    onClose(): void;
}

interface ProfileEntryDialogDispatch {
    updateEntity(initials: string, entry: ProfileEntry): void;

    deleteEntry(initials: string, id: number);
}

export interface ProfileEntryDialogState {
    searchText: string;
    startDate: Date;
    endDate: Date;
    degree: string;
    langLevel: LanguageLevel;
    deleteConfirm: boolean;
}

class ProfileEntryDialog_module extends React.Component<ProfileEntryDialogProps & ProfileEntryDialogLocalProps & ProfileEntryDialogDispatch, ProfileEntryDialogState> {


    constructor(props) {
        super(props);
        this.resetState(props);
    }

    private resetState = (props) => {
        this.state = {
            searchText: !isNullOrUndefined(props.entry) ? props.entry.nameEntity.name : '',
            startDate: !isNullOrUndefined(props.entry) && !isNullOrUndefined(props.entry['startDate']) ? props.entry['startDate'] : new Date(),
            endDate: !isNullOrUndefined(props.entry) && !isNullOrUndefined(props.entry['endDate']) ? props.entry['endDate'] : new Date(),
            degree: !isNullOrUndefined(props.entry) && !isNullOrUndefined(props.entry['degree']) ? props.entry['degree'] : EducationDegree.BACHELOR,
            langLevel: !isNullOrUndefined(props.entry) && !isNullOrUndefined(props.entry['level']) ? props.entry['level'] : LanguageLevel.BASIC,
            deleteConfirm: false,
        };
    };

    static mapStateToProps(state: ApplicationState, localProps: ProfileEntryDialogLocalProps): ProfileEntryDialogProps {
        const suggestionField = ProfileTypeDataMapper.getSuggestionField(localProps.type);
        const suggestionData: Array<NameEntity> = !isNullOrUndefined(suggestionField) && !isNullOrUndefined(state.suggestionStore) ? state.suggestionStore[suggestionField] : [];
        const suggestionNames = !isNullOrUndefined(suggestionData) ? suggestionData.map(e => e.name) : [];
        const degrees = [EducationDegree.BACHELOR, EducationDegree.MASTER, EducationDegree.DOKTOR, EducationDegree.DIPLOM];
        const langLevel = [LanguageLevel.BASIC, LanguageLevel.ADVANCED, LanguageLevel.BUSINESS_FLUENT, LanguageLevel.NATIVE];
        const initials = !isNullOrUndefined(state.profileStore.consultant) ? state.profileStore.consultant.initials : '';

        return {
            suggestions: suggestionNames,
            langLevel: langLevel,
            degrees: degrees,
            initials: initials
        };
    }

    static mapDispatchToProps(dispatch: redux.Dispatch<ApplicationState>, localProps: ProfileEntryDialogLocalProps): ProfileEntryDialogDispatch {
        return {
            updateEntity: ProfileTypeDataMapper.getUpdateFunction(localProps.type, dispatch),
            deleteEntry: ProfileTypeDataMapper.getDeleteFunction(localProps.type, dispatch)
        };
    }

    public componentDidUpdate(newProps: ProfileEntryDialogLocalProps) {
        if (this.props.entry != newProps.entry) {
            let date: Date;
            if (newProps.type == 'QUALIFICATION') {
                date = !isNullOrUndefined(this.props.entry) && !isNullOrUndefined(this.props.entry['date']) ? this.props.entry['date'] : new Date();
            } else {
                date = !isNullOrUndefined(this.props.entry) && !isNullOrUndefined(this.props.entry['startDate']) ? this.props.entry['startDate'] : new Date();
            }

            this.setState({
                searchText: !isNullOrUndefined(this.props.entry) ? this.props.entry.nameEntity.name : '',
                startDate: date,
                endDate: !isNullOrUndefined(this.props.entry) && !isNullOrUndefined(this.props.entry['endDate']) ? this.props.entry['endDate'] : new Date(),
                degree: !isNullOrUndefined(this.props.entry) && !isNullOrUndefined(this.props.entry['degree']) ? this.props.entry['degree'] : EducationDegree.BACHELOR,
                langLevel: !isNullOrUndefined(this.props.entry) && !isNullOrUndefined(this.props.entry['level']) ? this.props.entry['level'] : LanguageLevel.BASIC
            });
        }
    }

    private handleLangSelectChange = (event: React.ChangeEvent<{ name?: string; value: any }>) => {
        this.setState({
            langLevel: toLanguageLevel(event.target.value)
        });
    };

    private renderLangSelectElement = (level: LanguageLevel, id: number) => {
        return <MenuItem key={id} value={level}>
            {PowerLocalize.langLevelToLocalizedString(level)}
        </MenuItem>;
    };

    private handleDegreeSelectChange = (event: React.ChangeEvent<{ name?: string; value: any }>) => {
        this.setState({
            degree: toDegree(event.target.value)
        });
    };

    private renderDegreeSelectElement = (level: EducationDegree, id: number) => {
        return <MenuItem key={id} value={level}>
            {level}
        </MenuItem>;
    };

    private onStartDateChange = (date: Date) => {
        this.setState({
            startDate: date
        });
    };

    private onEndDateChange = (date: Date) => {
        this.setState({
            endDate: date
        });
    };
    private handleSave = () => {
        const entry = ProfileTypeDataMapper.makeEntry(this.props.type, this.state, this.props.entry);
        if (!isNullOrUndefined(entry)) {
            this.props.updateEntity(this.props.initials, entry);
        } else {
            console.error('Can\'t create ProfileEntry');
        }
        this.props.onClose();
    };

    private handleDelete = () => {
        this.props.deleteEntry(this.props.initials, this.props.entry.id);
        this.props.onClose();
    };

    render() {
        return (
            <Dialog open={this.props.open} onClose={this.props.onClose} fullWidth>
                <DialogTitle>
                    {ProfileTypeDataMapper.getHeaderText(this.props.type)}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={8}>
                        <Grid item md={12} xs={12}>
                            <PwrAutoComplete
                                fullWidth
                                label={ProfileTypeDataMapper.getHeaderText(this.props.type)}
                                id={'id'}
                                data={this.props.suggestions}
                                searchTerm={this.state.searchText}
                                onSearchChange={(value) => this.setState({searchText: value})}
                            />
                        </Grid>
                        {
                            //startDate
                            !(this.props.type == 'CAREER' || this.props.type == 'EDUCATION' || this.props.type == 'TRAINING' || this.props.type == 'QUALIFICATION') ? <></> :
                                <Grid item md={6} xs={12}>
                                    <PwrDatePicker onChange={this.onStartDateChange}
                                                   placeholderDate={this.state.startDate}
                                                   label={'Start'} type={DatePickerType.MONTH_YEAR}/>
                                </Grid>
                        }
                        {
                            //endDate
                            !(this.props.type == 'CAREER' || this.props.type == 'EDUCATION' || this.props.type == 'TRAINING') ? <></> :
                                <Grid item md={6} xs={12}>
                                    <PwrDatePicker onChange={this.onEndDateChange} placeholderDate={this.state.endDate}
                                                   label={'Ende'} type={DatePickerType.MONTH_YEAR}/>
                                </Grid>
                        }
                        {
                            //degree
                            !(this.props.type == 'EDUCATION') ? <></> :
                                <Grid item md={6} xs={12}>
                                    <FormControl>
                                        <Select
                                            value={this.state.degree}
                                            onChange={this.handleDegreeSelectChange}
                                        >
                                            {this.props.degrees.map(this.renderDegreeSelectElement)}
                                        </Select>
                                    </FormControl>
                                </Grid>
                        }
                        {
                            //lang level
                            !(this.props.type == 'LANGUAGE') ? <></> :
                                <Grid item md={6} xs={12}>
                                    <FormControl>
                                        <Select
                                            value={this.state.langLevel}
                                            onChange={this.handleLangSelectChange}
                                        >
                                            {this.props.langLevel.map(this.renderLangSelectElement)}
                                        </Select>
                                    </FormControl>
                                </Grid>
                        }
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <PwrDeleteConfirm onClose={() => this.setState({deleteConfirm: false})}
                                      infoText={isNullOrUndefined(this.props.entry) ? '' : 'Willst du \'' + this.props.entry.nameEntity.name + '\' wirklich löschen?'}
                                      header={'Löschen Bestätigen'}
                                      open={this.state.deleteConfirm}
                                      onConfirm={() => this.handleDelete()}/>
                    {isNullOrUndefined(this.props.entry) ? <></> :
                        <Button variant={'text'} onClick={() => this.setState({deleteConfirm: true})}>
                            Element Löschen
                        </Button>
                    }
                    <Button variant={'outlined'} onClick={this.handleSave}>
                        Speichern
                    </Button>
                    <Button variant={'outlined'} onClick={this.props.onClose}>
                        Abbrechen
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export const ProfileEntryDialog: React.ComponentClass<ProfileEntryDialogLocalProps> = connect(ProfileEntryDialog_module.mapStateToProps, ProfileEntryDialog_module.mapDispatchToProps)(ProfileEntryDialog_module);