import * as React from 'react';
import {Button, Dialog, Icon, TextField} from '@material-ui/core';
import {ViewProfile} from '../../../model/view/ViewProfile';
import {LimitedTextField} from '../../general/limited-text-field-module';
import {PowerLocalize} from '../../../localization/PowerLocalizer';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import ListSubheader from '@material-ui/core/ListSubheader/ListSubheader';
import Fab from '@material-ui/core/Fab/Fab';
import {PROFILE_DESCRIPTION_LENGTH} from '../../../model/PwrConstants';


interface ViewProfileDialogProps {
    open: boolean;
    viewProfile?: ViewProfile;
    type?: 'edit' | 'new';

    onClose(): void;

    onSave?(name: string, description: string, charsPerLine: number): void;
}

interface ViewProfileDialogState {
    name: string;
    description: string;
    charsPerLine: number;
    locale: string;
}

export class ViewProfileDialog extends React.Component<ViewProfileDialogProps, ViewProfileDialogState> {

    public static defaultProps: Partial<ViewProfileDialogProps> = {
        type: 'edit'
    };

    constructor(props: ViewProfileDialogProps) {
        super(props);
        this.resetState(props);
    }

    private resetState = (props: ViewProfileDialogProps) => {
        this.state = {
            name: !(props.viewProfile) || !(props.viewProfile.viewProfileInfo.name) ? '' : props.viewProfile.viewProfileInfo.name,
            description: !(props.viewProfile) || !(props.viewProfile.viewProfileInfo.viewDescription) ? '' : props.viewProfile.viewProfileInfo.viewDescription,
            charsPerLine: !(props.viewProfile) || !(props.viewProfile.viewProfileInfo.charsPerLine) ? 45 : props.viewProfile.viewProfileInfo.charsPerLine,
            locale: !(props.viewProfile) || !(props.viewProfile.locale) ? 'deu' : props.viewProfile.locale
        };
    };

    private setField = (field: string, value: any) => {
        let obj = {};
        obj[field] = value;
        this.setState(obj);
    };

    private changeName = (e: any, name: string) => {
        this.setField('name', name);
    };

    private changeDescription = (e: any, description: string) => {
        this.setField('description', description);
    };

    private changeCharsPerLine = (charsPerLine: number) => {
        this.setField('charsPerLine', charsPerLine);
    };

    private changeLocale = (e: any, locale: string) => {
        this.setField('locale', locale);
    };

    private closeAndReset = () => {
        this.resetState(this.props);
        this.props.onClose();
    };

    private closeAndSave = () => {
        if (!!(this.props.onSave)) {
            this.props.onSave(this.state.name, this.state.description, this.state.charsPerLine);
        }
    };

    private renderActions = () => {
        let actions = [];
        let label: string;
        let icon: string;
        if (this.props.type === 'edit') {
            label = PowerLocalize.get('Action.Save');
            icon = 'save';
        } else {
            label = PowerLocalize.get('Action.Create');
            icon = 'add';
        }
        actions.push(
            <Button
                variant={'text'}
                color={'primary'}
                onClick={this.closeAndSave}
                key={'CloseAndSafe'}
            >
                {label}
                <Icon className="material-icons">{icon}</Icon>
            </Button>);
        actions.push(
            <Button
                variant={'text'}
                onClick={this.props.onClose}
                key={'Close'}
            >
                <Icon className="material-icons">close</Icon>
                {PowerLocalize.get('Action.Close')}
            </Button>);
        return actions;
    };

    private renderTitle = () => {
        if (this.props.type === 'edit') {
            return PowerLocalize.get('ViewProfileDialog.Title.Edit');
        } else {
            return PowerLocalize.get('ViewProfileDialog.Title.Create');
        }
    };

    render() {
        return <Dialog
            title={this.renderTitle()}
            open={this.props.open}
            onClose={this.closeAndReset}
            fullWidth
        >
            <DialogTitle>{this.renderTitle()}</DialogTitle>
            <DialogContent>
                <LimitedTextField onChange={this.changeName}
                                  maxCharacters={250}
                                  value={this.state.name}
                                  fullWidth={true}
                                  label={PowerLocalize.get('ViewProfileDialog.Name')}
                />
                <LimitedTextField onChange={this.changeDescription}
                                  maxCharacters={PROFILE_DESCRIPTION_LENGTH}
                                  value={this.state.description}
                                  fullWidth={true}
                                  multiLine={true}
                                  label={PowerLocalize.get('ViewProfileDialog.Description')}
                />
                <TextField onChange={() => this.changeLocale}
                           value={this.state.locale}
                           label={PowerLocalize.get('ViewProfileDialog.Locale')}
                           disabled={this.props.type === 'edit'}
                />
                <div>
                    <ListSubheader>Chars per Line</ListSubheader>
                    <Fab
                        style={{width: '40px', height: '40px', padding: '0', marginRight: '15px'}}
                        color={'primary'}
                        onClick={() => this.changeCharsPerLine((this.state.charsPerLine > 0) ? (this.state.charsPerLine - 1) : 0)}
                    >
                        <RemoveIcon/>

                    </Fab>
                    {this.state.charsPerLine}
                    <Fab
                        style={{width: '40px', height: '40px', padding: '0', marginLeft: '15px'}}
                        color={'primary'}
                        onClick={() => this.changeCharsPerLine((this.state.charsPerLine < 100) ? (this.state.charsPerLine + 1) : 100)}
                    >
                        <AddIcon/>
                    </Fab>
                </div>
            </DialogContent>
            <DialogActions>
                {this.renderActions()}
            </DialogActions>
        </Dialog>;
    }
}
