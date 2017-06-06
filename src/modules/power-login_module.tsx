import {connect} from 'react-redux';
import * as React from 'react';
import {KeyboardEvent} from 'react';
import * as redux from 'redux';
import {ApplicationState} from '../Store';
import {FlatButton, Paper, RaisedButton, TextField} from 'material-ui';
import {ProfileAsyncActionCreator} from '../reducers/profile/ProfileAsyncActionCreator';
import {PowerLocalize} from '../localization/PowerLocalizer';
import {LoginStatus} from '../model/LoginStatus';
import {browserHistory} from 'react-router';
import {Paths} from '../index';
/**
 * Properties that are managed by react-redux.
 *
 * Each property defined here will also need a corresponding mapping in the {@link PowerLogin.mapStateToProps} method,
 * otherwise the component will not render and update correctly.
 */
interface PowerLoginProps {
    loginStatus: LoginStatus;
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
    isAdmin: boolean;
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
            isAdmin: false
        }
    }

    static mapStateToProps(state: ApplicationState, localProps: PowerLoginProps): PowerLoginProps {
        return {
            loginStatus: state.databaseReducer.loginStatus()
        }
    }

    static mapDispatchToProps(dispatch: redux.Dispatch<ApplicationState>): PowerLoginDispatch {
        return {
            logInUser: function(initials: string) {
                dispatch(ProfileAsyncActionCreator.logInUser(initials));
            }
        }
    }


    private handleInputFieldKeyPress = (event: KeyboardEvent<{}>) => {
        if(event.key == 'Enter') {
            this.props.logInUser(this.state.initials);
        }
    };

    private handleProgressButtonClick = () => {
        this.props.logInUser(this.state.initials);
    };

    private handleFieldValueChange = (irrelevantFormEvent: any, value: string) => {
        this.setState({
            initials: value
        })
    };



    private renderInputField = () => {
        return (<TextField
            floatingLabelText={PowerLocalize.get("Initials.Singular")}
            value={this.state.initials}
            onChange={this.handleFieldValueChange}
            onKeyPress={this.handleInputFieldKeyPress}
            errorText={this.props.loginStatus == LoginStatus.REJECTED ? PowerLocalize.get("UserLogin.LoginFailed") : null}
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
                            <h1>Profilauswahl</h1>
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
                            <RaisedButton onClick={this.handleProgressButtonClick} label="Weiter" primary={true}/>
                        </div>
                    </div>
                    <div className="row" style={{marginTop: "20px"}}>
                        <div className="col-md-offset-1">
                            <FlatButton label="Admin" onClick={() => browserHistory.push(Paths.ADMIN_LOGIN)}/>
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