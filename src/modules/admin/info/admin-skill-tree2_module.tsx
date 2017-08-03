import {connect} from 'react-redux';
import * as React from 'react';
import * as redux from 'redux';
import * as Immutable from 'immutable';
import {ApplicationState} from '../../../Store';
import {SkillCategory} from '../../../model/skill/SkillCategory';
import {SkillActionCreator} from '../../../reducers/skill/SkillActionCreator';
import {SkillTree} from '../../general/skill/skill-tree_module';
import {Checkbox, FontIcon, Paper, Subheader} from 'material-ui';
import {InfoPaper} from '../../general/info-paper_module.';
import {PowerLocalize} from '../../../localization/PowerLocalizer';
import {LocalizationTable} from '../../general/skill/localization-table_module';
import {SkillServiceSkill} from '../../../model/skill/SkillServiceSkill';

interface AdminSkillTree2Props {
    root: SkillCategory;
    categoriesById: Immutable.Map<number, SkillCategory>;
    skillsById: Immutable.Map<number, SkillServiceSkill>;
}

interface AdminSkillTree2LocalProps {

}

interface AdminSkillTree2LocalState {
    selectedCategoryId: number;
    selectedSkillId: number;
}

interface AdminSkillTree2Dispatch {
    loadTree(): void;
    loadSkillsForCategory(categoryId: number): void;
    whitelistCategory(categoryId: number): void;
    blacklistCategory(categoryId: number): void;
    addLocalization(categoryId: number, language: string, qualifier: string): void;
    deleteLocalization(categoryId: number, language: string): void;
}

class AdminSkillTree2Module extends React.Component<
    AdminSkillTree2Props
    & AdminSkillTree2LocalProps
    & AdminSkillTree2Dispatch, AdminSkillTree2LocalState> {

    private readonly NO_ID = -99999;

    constructor(props: any) {
        super(props);
        this.state = {
            selectedCategoryId: this.NO_ID,
            selectedSkillId: this.NO_ID
        }
    }



    static mapStateToProps(state: ApplicationState, localProps: AdminSkillTree2LocalProps): AdminSkillTree2Props {
        return {
            root: state.skillReducer.skillTreeRoot(),
            categoriesById: state.skillReducer.categoriesById(),
            skillsById: state.skillReducer.skillsById()
        }
    }

    static mapDispatchToProps(dispatch: redux.Dispatch<ApplicationState>): AdminSkillTree2Dispatch {
        return {
            loadTree: () => dispatch(SkillActionCreator.AsyncLoadRootChildrenIntoTree()),
            loadSkillsForCategory: categoryId => {
                dispatch(SkillActionCreator.AsyncLoadChildrenIntoTree(categoryId, 2))
            },
            whitelistCategory: categoryId => dispatch(SkillActionCreator.AsyncWhitelistCategory(categoryId)),
            blacklistCategory: categoryId => dispatch(SkillActionCreator.AsyncBlacklistCategory(categoryId)),
            addLocalization: (categoryId, language, qualifier) => dispatch(SkillActionCreator.AsyncAddLocale(categoryId, language, qualifier)),
            deleteLocalization: (categoryId, language) => dispatch(SkillActionCreator.AsyncDeleteLocale(categoryId, language))
        }
    }

    public componentDidMount() {
        this.props.loadTree();
    }

    private handleCategorySelect = (categoryId: number) => {
        this.setState({
            selectedCategoryId: categoryId,
            selectedSkillId: this.NO_ID
        })
    };

    private handleSkillSelect = (skillId: number) => {
        this.setState({
            selectedCategoryId: this.NO_ID,
            selectedSkillId: skillId
        })
    };

    private handleCategoryBlacklistCheck = (event: any, isChecked: boolean) => {
        if(isChecked) {
            this.props.blacklistCategory(this.state.selectedCategoryId);
        } else {
            this.props.whitelistCategory(this.state.selectedCategoryId);
        }
    };

    private handleAddLocale = (language: string, qualifier: string) => {
        this.props.addLocalization(this.state.selectedCategoryId, language, qualifier);
    };

    private handleDeleteLocale = (language: string) => {
        this.props.deleteLocalization(this.state.selectedCategoryId, language);
    }

    private SkillInfo = () => {
        let selectedSkill = this.props.skillsById.get(this.state.selectedSkillId);

        return <div>
            <Subheader>{selectedSkill.qualifier()}</Subheader>
        </div>
    };

    private CategoryInfo = () => {
        let selectedCategory = this.props.categoriesById.get(this.state.selectedCategoryId);
        return <div>
            <Subheader>{selectedCategory.qualifier()}</Subheader>
            <Checkbox
                style={{marginLeft: "16px"}}
                label={PowerLocalize.get("AdminClient.Info.SkillTree.Category.IsBlacklisted")}
                checked={selectedCategory.blacklisted()}
                onCheck={this.handleCategoryBlacklistCheck}
            />
            <Subheader>{PowerLocalize.get("AdminClient.Info.SkillTree.Category.Localizations")}</Subheader>
            <LocalizationTable
                localizations={selectedCategory.qualifiers()}
                termToLocalize={selectedCategory.qualifier()}
                onLocaleAdd={this.handleAddLocale}
                onLocaleDelete={this.handleDeleteLocale}
            />
        </div>
    };

    private Info = () => {
        if(this.state.selectedCategoryId === this.NO_ID && this.state.selectedSkillId === this.NO_ID) {
            return <span/>
        } else if(this.state.selectedCategoryId === this.NO_ID) {
            return <this.SkillInfo/>
        } else {
            return <this.CategoryInfo/>
        }
    };



    render() {
        return (
        <div style={{marginTop: "56px"}}>
            <div className="row">
                <Paper className="col-md-8">
                    <SkillTree
                        root={this.props.root}
                        onLoadChildren={this.props.loadSkillsForCategory}
                        onCategorySelect={this.handleCategorySelect}
                        onSkillSelect={this.handleSkillSelect}
                        expandOnClick={false}
                    />
                </Paper>
                <div className="col-md-4">
                    <div className="sticky-top">
                        <InfoPaper minHeight="200px" sticky={false}>
                            <this.Info/>
                        </InfoPaper>
                        <div className="margin-5px"/>
                        <InfoPaper
                            minHeight="100px"
                            title={PowerLocalize.get("AdminClient.Info.SkillTree.Legend")}
                            sticky={false}
                            style={{paddingBottom: "16px"}}
                        >
                            <div style={{marginLeft: "8px"}}>
                                <FontIcon
                                    className="material-icons blacklisted-icon"
                                    style={{top: "6px", marginRight: "24px"}}
                                >
                                    warning
                                </FontIcon>
                                {PowerLocalize.get("AdminClient.Info.SkillTree.Category.IsBlacklisted")}
                            </div>
                            <div style={{marginLeft: "8px"}}>
                                <FontIcon
                                    className="material-icons"
                                    style={{top: "6px", marginRight: "24px"}}
                                >
                                    label
                                </FontIcon>
                                {PowerLocalize.get("AdminClient.Info.SkillTree.Legend.Category")}
                            </div>
                            <div style={{marginLeft: "8px"}}>
                                <FontIcon
                                    className="material-icons"
                                    style={{top: "6px", marginRight: "24px"}}
                                >
                                    label_outline
                                </FontIcon>
                                {PowerLocalize.get("AdminClient.Info.SkillTree.Legend.Skill")}
                            </div>
                        </InfoPaper>
                    </div>
                </div>
            </div>

        </div>);
    }
}

/**
 * @see AdminSkillTree2Module
 * @author nt
 * @since 17.07.2017
 */
export const AdminSkillTree2: React.ComponentClass<AdminSkillTree2LocalProps> = connect(AdminSkillTree2Module.mapStateToProps, AdminSkillTree2Module.mapDispatchToProps)(AdminSkillTree2Module);