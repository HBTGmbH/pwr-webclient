import {connect} from 'react-redux';
import * as React from 'react';
import {KeyboardEvent} from 'react';
import * as redux from 'redux';
import {ApplicationState} from '../Store';
import {Paper, RaisedButton, TextField} from 'material-ui';
import {ProfileAsyncActionCreator} from '../reducers/singleProfile/ProfileAsyncActionCreator';
import {PowerLocalize} from '../localization/PowerLocalizer';
/**
 * Properties that are managed by react-redux.
 *
 * Each property defined here will also need a corresponding mapping in the {@link PowerLogin.mapStateToProps} method,
 * otherwise the component will not render and update correctly.
 */
interface PowerLoginProps {

}

/**
 * Local properties of this module.
 *
 * These properties are used to initialize the local state and to control everything that is solely used for the display layer.
 *
 * Data that is intended not only for display needs to be placed in the {@link PowerLoginProps} and will then be
 * managed by redux.
 */
interface PowerLoginLocalProps {

}

/**
 * Local state of the module.
 *
 * All display-only state fields, such as bool flags that define if an element is visibile or not, belong here.
 */
interface PowerLoginLocalState {
    initials: string;
    password: string;
    status: LoginStatus;
}

enum LoginStatus {
    INITIALS,
    PASSWORD,
    SUCCESS,
    REJECTED
}

/**
 * Defines mappings from local handlers to redux dispatches that invoke actions on the store.
 */
interface PowerLoginDispatch {
    logInUser(initials: string): void;
}

class PowerLoginModule extends React.Component<
    PowerLoginProps
    & PowerLoginProps
    & PowerLoginDispatch, PowerLoginLocalState> {

    constructor(props:PowerLoginProps& PowerLoginProps& PowerLoginDispatch) {
        super(props);
        this.state = {
            initials: "",
            password: "",
            status: LoginStatus.INITIALS
        }
    }

    static mapStateToProps(state: ApplicationState, localProps: PowerLoginProps): PowerLoginProps {
        return {}
    }

    static mapDispatchToProps(dispatch: redux.Dispatch<ApplicationState>): PowerLoginDispatch {
        return {
            logInUser: function(initials: string) {
                dispatch(ProfileAsyncActionCreator.logInUser(initials));
            }
        }
    }

    private handlePasswordKeyPress = (event: KeyboardEvent<{}>) => {
        if(event.key === 'Enter') {
            this.setState({
                status: LoginStatus.SUCCESS
            });

        }
    };

    private progressState = () => {
        switch(this.state.status) {
            case LoginStatus.PASSWORD: {
                this.setState({
                    status: LoginStatus.SUCCESS
                });
                this.props.logInUser(this.state.initials);
                break;
            }
            case LoginStatus.INITIALS: {
                this.setState({
                    status: LoginStatus.PASSWORD,
                });
                break;
            }
            default:
                break;

        }
    };

    private handleInputFieldKeyPress = (event: KeyboardEvent<{}>) => {
        if(event.key == 'Enter') {
            this.progressState();
        }

    };

    private handleProgressButtonClick = () => {
        this.progressState();
    };

    private handleFieldValueChange = (irrelevantFormEvent: any, value: string) => {
        if(this.state.status === LoginStatus.PASSWORD) {
            this.setState({
                password: value
            });
        } else if(this.state.status === LoginStatus.INITIALS) {
            this.setState({
                initials: value
            })
        }
    };

    private getInputFieldValue = () => {
        if(this.state.status === LoginStatus.INITIALS) {
            return this.state.initials;
        } else if(this.state.status === LoginStatus.PASSWORD) {
            return this.state.password;
        }
        return "";
    };

    private getInputFieldFloatingLabelText = () => {
        if(this.state.status === LoginStatus.INITIALS) {
            return PowerLocalize.get("Initials.Singular");
        } else if(this.state.status === LoginStatus.PASSWORD) {
            return PowerLocalize.get("Password.Singular");
        }
        return "";
    }

    private renderInputField = () => {
        return (<TextField
            floatingLabelText={this.getInputFieldFloatingLabelText()}
            value={this.getInputFieldValue()}
            onChange={this.handleFieldValueChange}
            onKeyPress={this.handleInputFieldKeyPress}
            type={this.state.status === LoginStatus.PASSWORD ? "password" :""}
        />)
    };

    render() {
        return (
        <div className="row">
            <div className="col-md-4 col-md-offset-4">
                <Paper style={{height: "400px"}}>
                    <br/>
                    <div className="row">
                        <div className="col-md-4 col-md-offset-1">
                            <img className="img-responsive" src="/img/logo_hbt.png"/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-offset-1">
                            <h1>Anmeldung</h1>
                            <h4>Weiter zu HBT Power</h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-offset-1">
                            {this.renderInputField()}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-offset-1">
                            <RaisedButton label="Weiter" primary={true}/>
                        </div>
                    </div>

                </Paper>
            </div>
        </div>);
    }
}

/**
 * @see PowerLoginModule
 * @author nt
 * @since 11.05.2017
 */
export const PowerLogin: React.ComponentClass<PowerLoginLocalProps> = connect(PowerLoginModule.mapStateToProps, PowerLoginModule.mapDispatchToProps)(PowerLoginModule);