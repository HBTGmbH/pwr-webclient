import {connect} from 'react-redux';
import * as React from 'react';
import * as redux from 'redux';
import {ApplicationState} from '../../../reducers/reducerIndex';
import {ViewProfile} from '../../../model/view/ViewProfile';
import {ViewProfileActionCreator} from '../../../reducers/view/ViewProfileActionCreator';
import {ViewSkill} from '../../../model/view/ViewSkill';
import {ViewProfileEntries} from './entries/view-profile-entries_module';
import {Card, CardText, CardTitle, Subheader} from 'material-ui';
import {EntryRenderers} from './entries/EntryRenderers';
import {SortableEntryType} from '../../../model/view/NameComparableType';
import {ViewCategory} from '../../../model/view/ViewCategory';
import {ComparableNestedEntryButton} from './entries/comparable-nested-entry-button_module';
import {EditViewSkillDialog} from './entries/edit-view-skill-dialog_module';
import {isNullOrUndefined} from 'util';

interface ViewProfileSkillOverviewProps {
    viewProfile: ViewProfile;
}

interface ViewProfileSkillOverviewLocalProps {
    viewProfileId: string;
}

interface ViewProfileSkillOverviewLocalState {
    editSkillOpen: boolean;
    editSkill: ViewSkill;
}

interface ViewProfileSkillOverviewDispatch {
    moveEntry(id: string, type: string, sourceIndex: number, targetIndex: number): void;
    toggleEntry(id: string, type: string, index: number, isEnabled: boolean): void;
    toggleSkill(id: string, skillName: string, isEnabled: boolean): void;
    setDisplayCategory(id: string, skillName: string, newDisplayCategoryName: string): void;
    moveNestedEntry(id: string, container: 'PROJECT' | 'DISPLAY_CATEGORY', containerIndex: number, type: string, sourceIndex: number, targetIndex: number): void;
}

class ViewProfileSkillOverviewModule extends React.Component<
    ViewProfileSkillOverviewProps
    & ViewProfileSkillOverviewLocalProps
    & ViewProfileSkillOverviewDispatch, ViewProfileSkillOverviewLocalState> {

    constructor(props: any) {
        super(props);
        this.state = {
            editSkillOpen: false,
            editSkill: null
        };
    }

    static mapStateToProps(state: ApplicationState, localProps: ViewProfileSkillOverviewLocalProps): ViewProfileSkillOverviewProps {
        return {
            viewProfile: state.viewProfileSlice.viewProfiles().get(localProps.viewProfileId)
        };
    }

    static mapDispatchToProps(dispatch: redux.Dispatch<ApplicationState>): ViewProfileSkillOverviewDispatch {
        return {
            moveEntry: (id, type, sourceIndex, targetIndex) => dispatch(ViewProfileActionCreator.AsyncMoveEntry(id, type, sourceIndex, targetIndex)),
            toggleEntry: (id, type, index, isEnabled) => {dispatch(ViewProfileActionCreator.AsyncToggleEntry(id, type, index, isEnabled));},
            moveNestedEntry: (id, container, containerIndex, type, sourceIndex, targetIndex) => {
                dispatch(ViewProfileActionCreator.AsyncMoveNestedEntry(id, container, containerIndex, type, sourceIndex, targetIndex));
            },
            toggleSkill: (id, skillName, isEnabled) => dispatch(ViewProfileActionCreator.AsyncToggleSkill(id, skillName, isEnabled)),
            setDisplayCategory: (id, skillName, newDisplayCategoryName) => dispatch(ViewProfileActionCreator.AsyncSetDisplayCategory(id, skillName, newDisplayCategoryName))
        };
    }

    private editSkill = (skill: ViewSkill) => {
        this.setState({
            editSkillOpen: true,
            editSkill: skill
        })
    };

    private closeEditSkillDialog = () => {
        this.setState({
            editSkillOpen: false,
            editSkill: null
        })
    };

    private handleChangeDisplayCategory = (skillName: string, newDisplayCategoryName: string) => {
        this.props.setDisplayCategory(this.props.viewProfile.id, skillName, newDisplayCategoryName);
        this.closeEditSkillDialog();
    };

    private handleNestedMove = (container: 'PROJECT' | 'DISPLAY_CATEGORY', containerIndex: number, type: string, sourceIndex: number, targetIndex: number) => {
        this.props.moveNestedEntry(this.props.viewProfileId, container, containerIndex, type, sourceIndex, targetIndex);
    };

    private handleSkillToggle = (skills: Array<ViewSkill>, index: number, isEnabled: boolean) => {
        let skill = skills[index];
        this.props.toggleSkill(this.props.viewProfileId, skill.name, isEnabled);
    };

    private handleMove = (type: string, sourceIndex: number, targetIndex: number) => {
        this.props.moveEntry(this.props.viewProfileId, type, sourceIndex, targetIndex);
    };

    private handleToggle = (type: string, index: number, isEnabled: boolean) => {
        this.props.toggleEntry(this.props.viewProfileId, type, index, isEnabled);
    };

    private renderSkill = (entry: ViewSkill) => {
        let res: Array<JSX.Element> = [];
        res.push(
            <td key={'ViewSkill_' + entry.name}
                     className="cursor-pointer"
                     onClick={() => this.editSkill(entry)}
            >
                {entry.name}
            </td>);
        res.push(<td key={'ViewSkill_' + entry.name + '_rating'}>{entry.rating}</td>);
        return res;
    };

    private renderDisplayCategory = (entry: ViewCategory, entryIndex: number) => {
        let res: Array<JSX.Element> = [];
        res.push(
            <td key={'ViewCategory_' + entry.name}>
                <Card>
                    <CardTitle
                        title={entry.name}
                        actAsExpander={true}
                        subtitle={entry.displaySkills.length + ' Skills'}
                    />
                    <CardText
                        expandable={true}
                    >
                        <Subheader>Skills</Subheader>
                        <ViewProfileEntries
                            movableEntryType="SKILL"
                            toggleableEntryType="SKILL"
                            renderEntry={this.renderSkill}
                            headers={[<ComparableNestedEntryButton
                                container="DISPLAY_CATEGORY"
                                sortableEntryType={SortableEntryType.SKILL}
                                sortableEntryField="name"
                                viewProfileId={this.props.viewProfileId}
                                label="Name"
                                containerIndex={entryIndex}/>,
                                <ComparableNestedEntryButton
                                    container="DISPLAY_CATEGORY"
                                    sortableEntryType={SortableEntryType.SKILL}
                                    sortableEntryField="rating"
                                    viewProfileId={this.props.viewProfileId}
                                    label="Rating"
                                    containerIndex={entryIndex}
                                />
                                ]}
                            entries={entry.displaySkills}
                            onMove={(type, sourceIndex, targetIndex) => this.handleNestedMove('DISPLAY_CATEGORY', entryIndex, type, sourceIndex, targetIndex)}
                            onToggle={(type, index, isEnabled) => this.handleSkillToggle(entry.displaySkills, index, isEnabled)}
                        />
                    </CardText>
                </Card>
            </td>);
        return res;
    };

    render() {
        return (<div className="row">
            {
                !isNullOrUndefined(this.state.editSkill) ?
                    <EditViewSkillDialog
                        skill={this.state.editSkill}
                        open={this.state.editSkillOpen}
                        onRequestClose={this.closeEditSkillDialog}
                        viewProfile={this.props.viewProfile}
                        onSetDisplayCategory={this.handleChangeDisplayCategory}
                    />
                    :
                    null
            }

            <div className="col-md-12 fullWidth">
                <ViewProfileEntries
                    movableEntryType="DISPLAY_CATEGORY"
                    toggleableEntryType="DISPLAY_CATEGORY"
                    renderEntry={this.renderDisplayCategory}
                    headers={[<span>
                        {EntryRenderers.renderNameButton(SortableEntryType.DISPLAY_CATEGORY, this.props.viewProfileId)}
                            </span>]}
                    entries={this.props.viewProfile.displayCategories}
                    onMove={this.handleMove}
                    onToggle={this.handleToggle}
                />
            </div>
        </div>);
    }
}

/**
 * @see ViewProfileSkillOverviewModule
 * @author nt
 * @since 12.09.2017
 */
export const ViewProfileSkillOverview: React.ComponentClass<ViewProfileSkillOverviewLocalProps> = connect(ViewProfileSkillOverviewModule.mapStateToProps, ViewProfileSkillOverviewModule.mapDispatchToProps)(ViewProfileSkillOverviewModule);