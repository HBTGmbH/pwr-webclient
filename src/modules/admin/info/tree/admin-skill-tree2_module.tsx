import {connect} from 'react-redux';
import * as React from 'react';
import * as Immutable from 'immutable';
import {SkillCategory} from '../../../../model/skill/SkillCategory';
import {SkillActionCreator} from '../../../../reducers/skill/SkillActionCreator';
import {SkillTree} from '../../../general/skill/skill-tree_module';
import {Button, Checkbox, FormControlLabel, Icon, ListSubheader, Paper, TextField} from '@material-ui/core';
import {InfoPaper} from '../../../general/info-paper_module.';
import {PowerLocalize} from '../../../../localization/PowerLocalizer';
import {LocalizationTable} from '../../../general/skill/localization-table_module';
import {SkillServiceSkill} from '../../../../model/skill/SkillServiceSkill';
import {CategoryDeleteConfirmation} from '../../../general/skill/category-delete-confirmation_module';
import {SkillTreeNode} from '../../../../model/skill/SkillTreeNode';
import {CategorySearcher} from '../category-searcher_module';
import {SetValueDialog} from '../../../general/set-value-dialog_module';
import {ApplicationState} from '../../../../reducers/reducerIndex';
import {SkillStore} from '../../../../model/skill/SkillStore';
import {AdminActionCreator} from '../../../../reducers/admin/AdminActionCreator';
import Add from '@material-ui/icons/Add';
import Delete from '@material-ui/icons/Delete';
import {PwrSkillVersionInfo} from '../../../general/pwr-skill-version-info_module';
import {ThunkDispatch} from 'redux-thunk';

interface AdminSkillTree2Props {
    root: SkillTreeNode;
    skillStore: SkillStore;
    categoriesById: Immutable.Map<number, SkillCategory>;
    skillsById: Immutable.Map<number, SkillServiceSkill>;
    filterNonCustomSkills: boolean;
}

interface AdminSkillTree2LocalState {
    selectedCategoryId: number;
    selectedSkillId: number;
    categoryNameOpen: boolean;
    skillNameOpen: boolean;
    deleteConfirmationOpen: boolean;
    categorySearcherOpen: boolean;
    moveCategorySearcher: boolean;

    newVersionText: string;

}

interface AdminSkillTree2Dispatch {
    loadTree(): void;

    whitelistCategory(categoryId: number): void;

    blacklistCategory(categoryId: number): void;

    setIsDisplayCategory(categoryId: number, isDisplay: boolean): void;

    addLocalization(categoryId: number, language: string, qualifier: string): void;

    deleteLocalization(categoryId: number, language: string): void;

    addSkillLocalization(skillId: number, language: string, qualifier: string): void;

    deleteSkillLocalization(skillId: number, language: string): void;

    createCategory(parentId: number, qualifier: string): void;

    deleteCategory(categoryId: number): void;

    moveCategory(newCategoryId: number, selectedCategoryId: number): void;

    moveSkill(newCategory: number, oldCategory: number, skillId: number): void;

    createSkill(qualifier: string, categoryId: number): void;

    deleteSkill(skillId: number): void;

    toggleOpen(categoryId: number): void;

    filter(searchTerm: string): void;

    changeFilterNonCustomSkills(doFiltering: boolean): void;
}


class AdminSkillTree2Module extends React.Component<AdminSkillTree2Props & AdminSkillTree2Dispatch, AdminSkillTree2LocalState> {

    private readonly NO_ID = -99999;

    constructor(props: any) {
        super(props);
        this.state = {
            selectedCategoryId: this.NO_ID,
            selectedSkillId: this.NO_ID,
            categoryNameOpen: false,
            deleteConfirmationOpen: false,
            categorySearcherOpen: false,
            skillNameOpen: false,
            moveCategorySearcher: false,
            newVersionText: '',
        };
    }

    static mapStateToProps(state: ApplicationState): AdminSkillTree2Props {
        return {
            skillStore: state.skillReducer,
            root: state.skillReducer.skillTreeRoot,
            categoriesById: state.skillReducer.categoriesById,
            skillsById: state.skillReducer.skillsById,
            filterNonCustomSkills: state.skillReducer.filterNonCustomSkills
        };
    };

    static mapDispatchToProps(dispatch: ThunkDispatch<any, any, any>): AdminSkillTree2Dispatch {
        return {
            loadTree: () => dispatch(SkillActionCreator.AsyncLoadTree()),
            whitelistCategory: categoryId => dispatch(SkillActionCreator.AsyncWhitelistCategory(categoryId)),
            blacklistCategory: categoryId => dispatch(SkillActionCreator.AsyncBlacklistCategory(categoryId)),
            addLocalization: (categoryId, language, qualifier) => dispatch(SkillActionCreator.AsyncAddLocale(categoryId, language, qualifier)),
            deleteLocalization: (categoryId, language) => dispatch(SkillActionCreator.AsyncDeleteLocale(categoryId, language)),
            createCategory: (parentId, qualifier) => dispatch(SkillActionCreator.AsyncCreateCategory(qualifier, parentId)),
            deleteCategory: categoryId => dispatch(SkillActionCreator.AsyncDeleteCategory(categoryId)),
            moveCategory: (newCategoryId, selectedCategoryId) => dispatch(SkillActionCreator.AsyncMoveCategory(newCategoryId, selectedCategoryId)),
            moveSkill: (newCategory, oldCategory, skillId) => dispatch(SkillActionCreator.AsyncMoveSkill(skillId, newCategory, oldCategory)),
            createSkill: (qualifier, categoryId) => dispatch(SkillActionCreator.AsyncCreateSkill(qualifier, categoryId)),
            deleteSkill: skillId => dispatch(SkillActionCreator.AsyncDeleteSkill(skillId)),
            addSkillLocalization: (skillId, language, qualifier) => dispatch(SkillActionCreator.AsyncAddSkillLocale(skillId, language, qualifier)),
            deleteSkillLocalization: (skillId, language) => dispatch(SkillActionCreator.AsyncDeleteSkillLocale(skillId, language)),
            setIsDisplayCategory: (categoryId, isDisplay) => dispatch(SkillActionCreator.AsyncSetIsDisplay(categoryId, isDisplay)),
            toggleOpen: (categoryId) => dispatch(SkillActionCreator.SetTreeChildrenOpen(categoryId)),
            filter: (searchTerm) => dispatch(SkillActionCreator.FilterTree(searchTerm)),
            changeFilterNonCustomSkills: (doFiltering => dispatch(AdminActionCreator.SetFilterNonCustomSkills(doFiltering))),
        };
    };

    public componentDidMount() {
        this.props.loadTree();
    };

    private handleCategorySelect = (categoryId: number) => {
        this.setState({
            selectedCategoryId: categoryId,
            selectedSkillId: this.NO_ID
        });
    };

    private handleSkillSelect = (skillId: number) => {
        this.setState({
            selectedCategoryId: this.NO_ID,
            selectedSkillId: skillId
        });
    };

    private handleCategoryBlacklistCheck = (event: any, isChecked: boolean) => {
        if (isChecked) {
            this.props.blacklistCategory(this.state.selectedCategoryId);
        } else {
            this.props.whitelistCategory(this.state.selectedCategoryId);
        }
    };

    private handleCategoryIsDisplayCheck = (event: any, isChecked: boolean) => {
        this.props.setIsDisplayCategory(this.state.selectedCategoryId, isChecked);
    };

    private handleAddCategoryLocale = (language: string, qualifier: string) => {
        this.props.addLocalization(this.state.selectedCategoryId, language, qualifier);
    };

    private handleDeleteCategoryLocale = (language: string) => {
        this.props.deleteLocalization(this.state.selectedCategoryId, language);
    };

    private handleAddSkillLocale = (language: string, qualifier: string) => {
        this.props.addSkillLocalization(this.state.selectedSkillId, language, qualifier);
    };

    private handleDeleteSkillLocale = (language: string) => {
        this.props.deleteSkillLocalization(this.state.selectedSkillId, language);
    };


    private openNameDialog = () => {
        this.setState({
            categoryNameOpen: true
        });
    };

    private closeNameDialog = () => {
        this.setState({
            categoryNameOpen: false
        });
    };

    private openDeleteConfirmation = () => {
        this.setState({
            deleteConfirmationOpen: true
        });
    };

    private closeDeleteConfirmation = () => {
        this.setState({
            deleteConfirmationOpen: false
        });
    };

    private openSkillNameDialog = () => {
        this.setState({
            skillNameOpen: true
        });
    };

    private closeSkillNameDialog = () => {
        this.setState({
            skillNameOpen: false
        });
    };

    private handleCreateCategory = (categoryName: string) => {
        let selectedCategory = this.props.categoriesById.get(this.state.selectedCategoryId);
        this.props.createCategory(selectedCategory.id, categoryName);
        this.closeNameDialog();
    };

    private handleCreateSkill = (skillName: string) => {
        let selectedCategory = this.props.categoriesById.get(this.state.selectedCategoryId);
        this.props.createSkill(skillName, selectedCategory.id);
        this.closeSkillNameDialog();
    };

    private handleDeleteSelectedCategory = () => {
        let selectedCategory = this.props.categoriesById.get(this.state.selectedCategoryId);
        this.props.deleteCategory(selectedCategory.id);
        this.setState({
            selectedCategoryId: this.NO_ID,
            deleteConfirmationOpen: false
        });
    };

    private invokeMoveSelectedCategory = (newCategoryId: number) => {
        let selectedCategory = this.getSelectedCategory();
        this.props.moveCategory(newCategoryId, selectedCategory.id);
        this.closeCategorySearcher();
    };

    private handleCheckFilterNonCustom = (event: any, isInputChecked: boolean) => {
        this.props.changeFilterNonCustomSkills(isInputChecked);
    };

    private openCategorySearcher = () => {
        this.setState({
            categorySearcherOpen: true
        });
    };

    private closeCategorySearcher = () => {
        this.setState({
            categorySearcherOpen: false,
            moveCategorySearcher: false,
        });
    };

    private getSelectedCategory = () => {
        return this.props.categoriesById.get(this.state.selectedCategoryId);
    };

    private getSelectedSkill = () => {
        return this.props.skillsById.get(this.state.selectedSkillId);
    };

    private invokeMoveSelectedSkill = (newCategoryId: number) => {
        let selectedSkill = this.getSelectedSkill();
        this.props.moveSkill(newCategoryId, selectedSkill.categoryId(), selectedSkill.id());
        this.closeCategorySearcher();
    };

    private SkillInfo = () => {
        let selectedSkill = this.getSelectedSkill();
        return <div>

            <ListSubheader>Versionen</ListSubheader>
            <PwrSkillVersionInfo skillName={selectedSkill.qualifier()}/>
            <ListSubheader>{selectedSkill.qualifier()}</ListSubheader>
            <LocalizationTable
                localizations={selectedSkill.qualifiers()}
                termToLocalize={selectedSkill.qualifier()}
                onLocaleDelete={this.handleDeleteSkillLocale}
                onLocaleAdd={this.handleAddSkillLocale}
            />
            <Button
                style={{margin: '4px'}}
                variant={'contained'}
                className="mui-margin"
                color={'primary'}
                onClick={this.openCategorySearcher}
            >
                <Icon className="material-icons">change_history</Icon>
                {PowerLocalize.get('Action.ChangeCategory')}
            </Button>

            <CategorySearcher
                skillStore={this.props.skillStore}
                open={this.state.categorySearcherOpen}
                categories={this.props.categoriesById.toArray()}
                onClose={this.closeCategorySearcher}
                onSelectCategory={this.invokeMoveSelectedSkill}
            />
            {
                selectedSkill.isCustom() ?
                    <Button
                        style={{margin: '4px'}}
                        variant={'contained'}
                        className="mui-margin"
                        color={'secondary'}
                        onClick={() => this.props.deleteSkill(selectedSkill.id())}
                    >
                        {PowerLocalize.get('Action.DeleteSkill')}
                        <Icon className="material-icons">delete</Icon>
                    </Button>
                    : false
            }
        </div>;
    };

    private CategoryInfo = () => {
        let selectedCategory = this.props.categoriesById.get(this.state.selectedCategoryId);
        return <div>
            <CategoryDeleteConfirmation
                category={selectedCategory}
                open={this.state.deleteConfirmationOpen}
                onDeclineDelete={this.closeDeleteConfirmation}
                onAcceptDelete={this.handleDeleteSelectedCategory}
            />
            <CategorySearcher
                skillStore={this.props.skillStore}
                open={this.state.moveCategorySearcher}
                categories={this.props.categoriesById.toArray().filter((value, index) => value.id !== selectedCategory.id)}
                onClose={this.closeCategorySearcher}
                onSelectCategory={this.invokeMoveSelectedCategory}
            />
            <ListSubheader>{selectedCategory.qualifier}</ListSubheader>
            <FormControlLabel
                control={
                    <Checkbox
                        style={{marginLeft: '16px'}}
                        checked={selectedCategory.blacklisted}
                        onChange={this.handleCategoryBlacklistCheck}
                        color={'primary'}
                    />}
                label={PowerLocalize.get('AdminClient.Info.SkillTree.Category.IsBlacklisted')}
            />

            <FormControlLabel
                control={
                    <Checkbox
                        style={{marginLeft: '16px'}}
                        checked={selectedCategory.isDisplay}
                        onChange={this.handleCategoryIsDisplayCheck}
                        color={'primary'}
                    />}
                label={PowerLocalize.get('AdminClient.Info.SkillTree.Category.IsDisplay')}
            />
            <ListSubheader>{PowerLocalize.get('AdminClient.Info.SkillTree.Category.Localizations')}</ListSubheader>
            <LocalizationTable
                localizations={selectedCategory.qualifiers}
                termToLocalize={selectedCategory.qualifier}
                onLocaleAdd={this.handleAddCategoryLocale}
                onLocaleDelete={this.handleDeleteCategoryLocale}
            />
            <Button
                style={{margin: '4px'}}
                variant={'contained'}
                className="mui-margin"
                size={'small'}
                color={'primary'}
                onClick={this.openNameDialog}
            >
                {PowerLocalize.get('Action.AddCategory')}
                <Add/>
            </Button>

            <Button
                style={{margin: '4px'}}
                variant={'contained'}
                size={'small'}
                className="mui-margin"
                color={'primary'}
                onClick={this.openSkillNameDialog}
            >
                {PowerLocalize.get('Action.AddSkillToCategory')}
                <Add/>
            </Button>{
            selectedCategory.isCustom ?
                <Button
                    style={{margin: '4px'}}
                    variant={'contained'}
                    className="mui-margin"
                    color={'primary'}
                    size={'small'}
                    onClick={this.openDeleteConfirmation}
                >
                    <Delete/>
                    {PowerLocalize.get('Action.DeleteCategory')}
                </Button>
                : null
        }
        </div>;
    };

    private Info = () => {
        if (this.state.selectedCategoryId === this.NO_ID && this.state.selectedSkillId === this.NO_ID) {
            return <></>;
        } else if (this.state.selectedCategoryId === this.NO_ID) {
            return <this.SkillInfo/>;
        } else {
            return <this.CategoryInfo/>;
        }
    };

    render() {
        return (
            <div>
                <SetValueDialog
                    open={this.state.categoryNameOpen}
                    label={PowerLocalize.get('AdminClient.Info.SkillTree.NewCategory.Name')}
                    onClose={this.closeNameDialog}
                    onOk={this.handleCreateCategory}
                />
                <SetValueDialog
                    open={this.state.skillNameOpen}
                    label={PowerLocalize.get('AdminClient.Info.SkillTree.NewSkill.Name')}
                    onClose={this.closeSkillNameDialog}
                    onOk={this.handleCreateSkill}
                />
                <div className="row ">
                    <Paper className="col-md-8">
                        <TextField
                            label={PowerLocalize.get('Action.Search')}
                            onChange={(e: any) => {
                                this.props.filter(e.target.value);
                            }}
                        />
                        <FormControlLabel
                            style={{marginLeft: '5px'}}
                            control={
                                <Checkbox
                                    onChange={this.handleCheckFilterNonCustom}
                                    checked={this.props.filterNonCustomSkills}
                                    color={'primary'}
                                />
                            }
                            label={PowerLocalize.get('AdminClient.Info.SkillTree.Filter.OnlyCustom')}
                        />


                        <SkillTree
                            root={this.props.root}
                            onCategorySelect={this.handleCategorySelect}
                            onNestedListToggle={this.props.toggleOpen}
                            onSkillSelect={this.handleSkillSelect}
                            categoriesById={this.props.categoriesById}
                            skillsById={this.props.skillsById}
                            selectedSkillId={this.state.selectedSkillId}
                            selectedCategoryId={this.state.selectedCategoryId}
                        />
                    </Paper>
                    <div className="col-md-4">
                        <div id="skill-tree-info-panel">
                            <InfoPaper minHeight="200px">
                                <this.Info/>
                            </InfoPaper>
                            <div className="margin-5px"/>
                            <InfoPaper
                                minHeight="100px"
                                title={PowerLocalize.get('AdminClient.Info.SkillTree.Legend')}
                                style={{paddingBottom: '16px'}}
                            >
                                <div style={{marginLeft: '8px'}}>
                                    <Icon
                                        className="material-icons blacklisted-icon"
                                        style={{top: '6px', marginRight: '24px'}}
                                    >
                                        warning
                                    </Icon>
                                    {PowerLocalize.get('AdminClient.Info.SkillTree.Category.IsBlacklisted')}
                                </div>
                                <div style={{marginLeft: '8px'}}>
                                    <Icon
                                        className="material-icons"
                                        style={{top: '6px', marginRight: '24px'}}
                                    >
                                        label
                                    </Icon>
                                    {PowerLocalize.get('AdminClient.Info.SkillTree.Legend.Category')}
                                </div>
                                <div style={{marginLeft: '8px'}}>
                                    <Icon
                                        className="material-icons"
                                        style={{top: '6px', marginRight: '24px'}}
                                    >
                                        label_outline
                                    </Icon>
                                    {PowerLocalize.get('AdminClient.Info.SkillTree.Legend.Skill')}
                                </div>
                                <div style={{marginLeft: '8px'}}>
                                    <Icon
                                        className="material-icons"
                                        style={{top: '6px', marginRight: '24px'}}
                                    >
                                        extension
                                    </Icon>
                                    {PowerLocalize.get('AdminClient.Info.SkillTree.Legend.OwnItem')}
                                </div>
                                <div style={{marginLeft: '8px'}}>
                                    <Icon
                                        className="material-icons"
                                        style={{top: '6px', marginRight: '24px'}}
                                    >
                                        airplay
                                    </Icon>
                                    {PowerLocalize.get('AdminClient.Info.SkillTree.Legend.IsDisplay')}
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
export const AdminSkillTree2 = connect(AdminSkillTree2Module.mapStateToProps, AdminSkillTree2Module.mapDispatchToProps)(AdminSkillTree2Module);
