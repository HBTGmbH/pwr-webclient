import * as React from 'react';
import axios, {AxiosResponse} from 'axios';
import {getSearchSkill} from '../../API_CONFIG';
import {isNullOrUndefined} from 'util';
import {PwrAutoComplete} from './pwr-auto-complete';


interface SkillSearcherProps {
    label?: string;
    maxResults?: number;
    maxHeight?: number | string;
    id: string;
    value?: string;
    initialValue?: string;
    resetOnRequest?: boolean;
    fullWidth?: boolean;

    onNewRequest?(request: string): void;

    /**
     * Fired everytime the value changes(User input) and returns the value the user typed in.
     * @param value
     */
    onValueChange?(value: string): void;
}

interface SkillSearcherState {
    searchText: string;
    skills: Array<string>
}

/**
 * Performs skill-searches against an API and displayes the suggestions the API provides, instead
 * of doing the skill-searching on a local dump of all available skills (>70.000)
 */
export class SkillSearcher extends React.Component<SkillSearcherProps, SkillSearcherState> {


    constructor(props: SkillSearcherProps) {
        super(props);
        this.state = {
            searchText: !isNullOrUndefined(props.initialValue) ? props.initialValue : '',
            skills: []
        };

    }

    public componentWillReceiveProps(props: SkillSearcherProps) {
        if (!isNullOrUndefined(props.value) && this.props.value !== props.value) {
            this.requestSkills(props.value);
        }
    }

    public static defaultProps: Partial<SkillSearcherProps> = {
        label: '',
        maxResults: 10,
        maxHeight: null,
        onNewRequest: request => {
        },
        onValueChange: val => {
        },
        resetOnRequest: true
    };

    private requestSkills = (searchText: string) => {
        this.props.onValueChange(searchText);
        this.setState({
            searchText: searchText
        });
        if (!isNullOrUndefined(searchText) && searchText.trim().length > 0) {
            let reqParams = {
                maxResults: this.props.maxResults,
                searchterm: searchText
            };
            console.log('Searching for text', searchText);
            axios.get(getSearchSkill(), {params: reqParams}).then((response: AxiosResponse) => {
                if (response.status === 200) {
                    this.setState({
                        skills: response.data
                    });
                } else if (response.status === 204) {
                    this.setState({
                        skills: []
                    });
                }
            }).catch((error: any) => {
                console.error((error));
            });
        }
    };

    private handleRequest = (request: string) => {
        this.props.onValueChange(request);
        this.setState({
            searchText: this.props.resetOnRequest ? '' : request
        });
        this.props.onNewRequest(request);
    };

    render() {
        return <PwrAutoComplete
            fullWidth={this.props.fullWidth}
            label={this.props.label}
            id={this.props.id}
            data={this.state.skills}
            searchTerm={this.state.searchText}
            onSearchChange={this.requestSkills}
        />;
    }
}