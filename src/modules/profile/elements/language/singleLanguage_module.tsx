/**
 * Created by nt on 20.04.2017.
 */

import * as React from 'react';
import * as redux from 'redux';
import {ApplicationState} from '../../../../Store';
import {AutoComplete, MenuItem, SelectField, TouchTapEvent} from 'material-ui';
import {ProfileActionCreator} from '../../../../reducers/singleProfile/singleProfileActions';
import {connect} from 'react-redux';
import {PowerLocalize} from '../../../../localization/PowerLocalizer';
import {LanguageSkill} from '../../../../model/LanguageSkill';
import {Language} from '../../../../model/Language';
import * as Immutable from 'immutable';

interface SingleLanguageProps {
    languageSkill: LanguageSkill;

    languages: Immutable.Map<number, Language>;

    /**
     * Used to create the dropdown menu
     */
    possibleLanguageLevels: string[];

    possibleLanguageStrings: string[];
}

interface SingleLanguageLocalProps {
    /**
     * The ID of the language
     */
    id: number;
}

interface SingleLanguageDispatch {
    changeLangName: (newLangId: number, langSkillId: number) => void;
    changeLangLevel: (newLevel: string, langSkillId: number) => void;
}

interface SingleLanguageLocalState {
    nameAutoCompleteValue: string;

    backgroundColor: string;
}

class SingleLanguageModule extends React.Component<SingleLanguageLocalProps & SingleLanguageProps & SingleLanguageDispatch, SingleLanguageLocalState> {

    constructor(props: SingleLanguageLocalProps & SingleLanguageProps & SingleLanguageDispatch) {
        super(props);
        this.state = {
            nameAutoCompleteValue: props.languages.get(props.languageSkill.languageId).name,
            backgroundColor: "initial"
        }
    }

    private static renderSingleDropDownElement(languageLevel: string, idx: number) {
        return (<MenuItem value={languageLevel} primaryText={languageLevel} key={languageLevel}/>);
    }

    public static mapStateToProps(state: ApplicationState, props: SingleLanguageLocalProps) : SingleLanguageProps {
        return {
            languageSkill: state.databaseReducer.languageSkills.get(props.id),
            languages: state.databaseReducer.languages,
            possibleLanguageLevels: state.databaseReducer.languageLevels,
            possibleLanguageStrings: state.databaseReducer.languages.map((k, v) => k.name).toArray()// Only the name
        };
    }

    public static mapDispatchToProps(dispatch: redux.Dispatch<ApplicationState>) : SingleLanguageDispatch {
        return {
            changeLangName: function(newLangId: number, langSkillId: number): void {
                dispatch(ProfileActionCreator.changeLanguageSkillName(newLangId, langSkillId));
            },
            changeLangLevel: function(newLevel: string, langSkillId: number): void {
                dispatch(ProfileActionCreator.changeLanguageSkillLevel(newLevel, langSkillId));
            }
        };
    }

    private handleLanguageRequest = (value: string) => {
        // Make sure the language name exists in the list of allowed languages. .
        let exists: boolean = false;
        let lang : Language;
        this.props.languages.forEach((l, id) => {
            if(l.name === value) {
                exists = exists || true;
                lang = l;
            }
        });
        if(exists) {
            this.props.changeLangName(lang.id, this.props.id);
            this.setState({backgroundColor: 'initial'});
        } else {
            // If the language name does not exist, display an error.
            this.setState({backgroundColor: 'red'});
        }

    };

    /**
     *
     * @param value
     */
    private handleAutoCompleteChange = (value: string) => {
        this.setState({
            nameAutoCompleteValue: value
        })
    };

    private handleLevelChange = (event: TouchTapEvent, index: number, value: string) => {
        this.props.changeLangLevel(value, this.props.id);
    };

    render() {
        return(
        <tr>
            <td>
                <SelectField
                    value={this.props.languageSkill.level}
                    onChange={this.handleLevelChange}
                    style={{"width": "10em"}}
                >
                    {
                        this.props.possibleLanguageLevels.map(SingleLanguageModule.renderSingleDropDownElement)
                    }
                </SelectField>
            </td>
            <td>
                <AutoComplete
                    hintText={PowerLocalize.get("Language.Singular")}
                    value={this.state.nameAutoCompleteValue}
                    dataSource={this.props.possibleLanguageStrings}
                    onUpdateInput={this.handleAutoCompleteChange}
                    onNewRequest={this.handleLanguageRequest}
                    style={{"backgroundColor":this.state.backgroundColor}}
                />
            </td>
        </tr>
        );
    }
}

export const SingleLanguage: React.ComponentClass<SingleLanguageLocalProps> = connect(SingleLanguageModule.mapStateToProps, SingleLanguageModule.mapDispatchToProps)(SingleLanguageModule);