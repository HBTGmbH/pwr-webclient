///<reference path="../../../../../node_modules/immutable/dist/immutable.d.ts"/>
import * as React from 'react';
import {InternalDatabase} from '../../../../model/InternalDatabase';
import {
    AutoComplete,
    Card,
    CardActions,
    CardHeader,
    CardMedia,
    Dialog,
    IconButton,
    MenuItem,
    SelectField,
    TouchTapEvent
} from 'material-ui';
import {PowerLocalize} from '../../../../localization/PowerLocalizer';
import {NameEntity} from '../../../../model/NameEntity';
import * as Immutable from 'immutable';
import {LanguageSkill} from '../../../../model/LanguageSkill';


interface EducationEntryDialogLocalProps {

    languageSkill: LanguageSkill;

    languages: Immutable.Map<string, NameEntity>;

    languageLevels: Array<string>;

    open: boolean;

    /**
     * Invoked when the save button is pressed.
     * @param entry
     * @param nameEntity
     */
    onSave(skill: LanguageSkill, nameEntity: NameEntity): void;

    /**
     * Invoked when that thing is supposed to be closed.
     */
    onClose(): void;
}

/**
 * Local state of the module.
 *
 * All display-only state fields, such as bool flags that define if an element is visibile or not, belong here.
 */
interface EducationEntryDialogLocalState {
    languageAutoCompleteValue: string;
    languageSkill: LanguageSkill;
    nameEntity: NameEntity;
}



export class LanguageSkillDialog extends React.Component<EducationEntryDialogLocalProps, EducationEntryDialogLocalState> {

    constructor(props: EducationEntryDialogLocalProps) {
        super(props);
        this.state = {
            languageAutoCompleteValue: this.getLanguageName(),
            languageSkill: this.props.languageSkill,
            nameEntity: this.props.languages.get(this.props.languageSkill.languageId())
        };
    }

    private static renderSingleDropDownElement(languageLevel: string, idx: number) {
        return (<MenuItem value={languageLevel} primaryText={languageLevel} key={languageLevel}/>);
    }

    private getLanguageName = () => {
        let id: string = this.props.languageSkill.languageId();
        return id == null ? '' : this.props.languages.get(id).name;
    };


    private closeDialog = () => {
        this.props.onClose();
    };


    /**
     * Handles update of the auto complete components input field.
     * @param searchText the text that had been typed into the autocomplete
     * @param dataSource useless
     */
    private handleLanguageFieldInput = (searchText: string, dataSource: Array<string>) => {
        this.setState({languageAutoCompleteValue: searchText});
    };

    private handleLanguageFieldRequest = (chosenRequest: any, index: number) => {
        let language: NameEntity;
        if(index < 0) {
            language = InternalDatabase.getNameEntityByName(chosenRequest as string, this.props.languages);
            if(language == null) {
                language = NameEntity.createNew(chosenRequest as string);
            }
        } else {
            language = chosenRequest as NameEntity;
        }
        let languageSkill: LanguageSkill = this.state.languageSkill;
        languageSkill = languageSkill.languageId(language.id);
        this.setState({
            languageSkill: languageSkill,
            nameEntity: language
        });
    };

    private handleCloseButtonPress = (event: TouchTapEvent) => {
        this.closeDialog();
    };


    private handleSaveButtonPress = (event: TouchTapEvent) => {
        this.props.onSave(this.state.languageSkill, this.state.nameEntity);
        this.closeDialog();
    };

    private handleLevelChange = (event: TouchTapEvent, index: number, value: string) => {
        let skill: LanguageSkill = this.state.languageSkill;
        skill = skill.level(value);
        this.setState({
            languageSkill: skill
        })
    };


    render() {
        return (
            <Dialog
                open={this.props.open}
                modal={false}
                onRequestClose={this.closeDialog}
            >
                <Card>
                    <CardHeader
                        title={PowerLocalize.get('LanguageSkill.EditSkill.Title')}
                    />
                    <CardMedia>
                        <div className="row">
                            <div className="col-md-5 col-sm-6 col-md-offset-1 col-sm-offset-0">
                                <SelectField
                                    value={this.state.languageSkill.level()}
                                    onChange={this.handleLevelChange}
                                    floatingLabelText={PowerLocalize.get("LanguageLevel.Singular")}
                                >
                                    {
                                        this.props.languageLevels.map(LanguageSkillDialog.renderSingleDropDownElement)
                                    }
                                </SelectField>
                            </div>
                                <AutoComplete
                                    floatingLabelText={PowerLocalize.get("Language.Singular")}
                                    value={this.state.languageAutoCompleteValue}
                                    dataSourceConfig={{text:'name', value:'id'}}
                                    dataSource={this.props.languages.toArray()}
                                    onUpdateInput={this.handleLanguageFieldInput}
                                    onNewRequest={this.handleLanguageFieldRequest}
                                />
                        </div>
                    </CardMedia>
                    <CardActions>
                        <IconButton size={20} iconClassName="material-icons" onClick={this.handleSaveButtonPress} tooltip={PowerLocalize.get('Action.Save')}>save</IconButton>
                        <IconButton size={20} iconClassName="material-icons" onClick={this.handleCloseButtonPress} tooltip={PowerLocalize.get('Action.Exit')}>close</IconButton>
                    </CardActions>
                </Card>
            </Dialog>
        );
    }
}

