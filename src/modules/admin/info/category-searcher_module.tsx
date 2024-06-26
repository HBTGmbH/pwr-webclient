import * as React from 'react';
import {SkillCategory} from '../../../model/skill/SkillCategory';
import {Dialog, DialogContent, DialogTitle, List, ListItem, TextField} from '@material-ui/core';
import {PowerLocalize} from '../../../localization/PowerLocalizer';
import {Comparators} from '../../../utils/Comparators';
import {getInverseCategoryHierarchy, SkillStore} from '../../../model/skill/SkillStore';
import {StringUtils} from '../../../utils/StringUtil';


interface CategorySearcherProps {
    categories: Array<SkillCategory>;
    open: boolean;

    onClose(): void;

    onSelectCategory(categoryId: number): void;

    skillStore: SkillStore;
}

interface CategorySearcherLocalState {
    selectedCategoryId: number;
    filterText: string;
}


export class CategorySearcher extends React.Component<CategorySearcherProps, CategorySearcherLocalState> {

    constructor(props: CategorySearcherProps) {
        super(props);
        this.state = {
            selectedCategoryId: -1,
            filterText: ''
        };
    }

    componentDidUpdate(oldProps: CategorySearcherProps) {
        if (oldProps.open === false && this.props.open === true) {
            this.setState({
                selectedCategoryId: -1,
                filterText: ''
            });
        }
    }

    private mapListItem = (category: SkillCategory) => {
        return <ListItem
            button
            key={category.id}
            onClick={() => this.handleSelect(category.id)}
            className={this.state.selectedCategoryId === category.id ? 'pwr-selected-list-item ' : ''}
        >
            <div>
                <span style={{fontWeight: 'bold'}}>{category.qualifier}</span><br/>
                <span style={{
                    fontSize: '10px',
                    fontStyle: 'italic'
                }}>{getInverseCategoryHierarchy(category.id, this.props.skillStore)}</span>
            </div>
        </ListItem>;
    };

    private handleSelect = (categoryID: number) => {
        this.setState({
            selectedCategoryId: categoryID
        });
        this.props.onSelectCategory(categoryID);
    };

    private handleFilterTextChange = (event: any) => {
        this.setState({
            filterText: event.target.value
        });
    };


    private renderCategories = () => {
        let categories = this.props.categories;
        if (this.state.filterText !== '') {
            categories = categories.filter(category => StringUtils.filterFuzzy(this.state.filterText, category.qualifier));
        }
        categories.sort(Comparators.compareCategories);
        return categories.map(this.mapListItem);
    };

    render() {
        return (<Dialog
            fullWidth={true}
            open={this.props.open}
            onClose={this.props.onClose}
            aria-labelledby="category-search-dlg-title"
        >
            <DialogTitle id="category-search-dlg-title">Kategorie Suchen</DialogTitle>
            <DialogContent>
                <TextField
                    label={PowerLocalize.get('Action.Search')}
                    value={this.state.filterText}
                    onChange={this.handleFilterTextChange}
                />
                <List style={{maxHeight: '400px', overflow: 'auto'}}>
                    {this.renderCategories()}
                </List>
            </DialogContent>
        </Dialog>);
    }
}
