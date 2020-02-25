import {connect} from 'react-redux';
import * as React from 'react';
import {KeyboardEvent} from 'react';
import * as redux from 'redux';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup/FormGroup';
import {LoginStatus} from '../model/LoginStatus';
import {ApplicationState} from '../reducers/reducerIndex';
import {PowerLocalize} from '../localization/PowerLocalizer';
import {getImagePath} from '../API_CONFIG';
import {Paths} from '../Paths';
import {LoginActionCreator} from '../reducers/login/LoginActionCreator';


/**
 * Properties that are managed by react-redux.
 *
 * Each property defined here will also need a corresponding mapping in the {@link LoginModule.mapStateToProps} method,
 * otherwise the component will not render and update correctly.
 */
interface LoginProps {
    loginState: LoginStatus;
    username: string;
    password: string;
}

/**
 * Local properties of this module.
 *
 * These properties are used to initialize the local state and to control everything that is solely used for the display layer.
 *
 * Data that is intended not only for display needs to be placed in the {@link LoginProps} and will then be
 * managed by redux.
 */
interface LoginLocalProps {

}

/**
 * Local state of the module.
 *
 * All display-only state fields, such as bool flags that define if an element is visibile or not, belong here.
 */
interface LoginLocalState {
    rememberLogin: boolean;
}

/**
 * Defines mappings from local handlers to redux dispatches that invoke actions on the store.
 */
interface LoginDispatch {
    changeUsername(val: string): void;

    changePassword(val: string): void;

    attemptLogIn(username: string, pass: string, rememberLogin: boolean): void;

    changeLoginStatus(status: LoginStatus): void;
}

class userLoginModule extends React.Component<LoginProps
    & LoginLocalProps
    & LoginDispatch, LoginLocalState> {

    constructor(props: LoginProps & LoginLocalProps & LoginDispatch) {
        super(props);
        this.state = {
            rememberLogin: false
        };
    }

    static mapStateToProps(state: ApplicationState, localProps: LoginLocalProps): LoginProps {
        return {
            loginState: state.loginReducer.loginStatus(),
            username: state.loginReducer.loginName(),
            password: state.loginReducer.loginPass()
        };
    }

    static mapDispatchToProps(dispatch: redux.Dispatch<ApplicationState>): LoginDispatch {
        return {
            changePassword: (val) => dispatch(LoginActionCreator.ChangePassword(val)),
            changeUsername: (val) => dispatch(LoginActionCreator.ChangeUsername(val)),
            attemptLogIn: (username, pass, rememberLogin) => {
                dispatch(LoginActionCreator.AsyncValidateAuthentication(username, pass, rememberLogin));
            },
            changeLoginStatus: status2 => {
                dispatch(LoginActionCreator.ChangeLoginStatus(status2));
            }
        };
    }

    private handleAttemptLogIn = () => {
        this.props.attemptLogIn(this.props.username, this.props.password, this.state.rememberLogin);
    };

    private handleInputFieldKeyPress = (event: KeyboardEvent<{}>) => {
        if (event.key == 'Enter') {
            this.handleAttemptLogIn();
        }
    };

    private getErrorText = () => {
        if (this.props.loginState === LoginStatus.REJECTED) {
            return PowerLocalize.get('Profile.Login.Rejected');
        } else if (this.props.loginState === LoginStatus.UNAVAILABLE) {
            return PowerLocalize.get('Prfoile.Login.Unavailable');
        } else {
            return null;
        }
    };

    private handleRememberCheckboxCheck = (event: object, isInputChecked: boolean) => {
        this.setState({
            rememberLogin: isInputChecked
        });
    };

    render() {
        return (
            <div className="fittingContainer vertical-align">
                <Paper style={{padding: '30px'}}>
                    <div className="fittingContainer">
                        <div className="vertical-align">
                            <img className="logo-medium" src={getImagePath() + '/HBT002_Logo_pos.png'}/>
                        </div>
                        <div className="vertical-align">
                            <h1>{PowerLocalize.get('Profile.Login.Title')}</h1>
                        </div>
                        <div className="vertical-align">
                            <h4>{PowerLocalize.get('Profile.Login.SubTitle')}</h4>
                        </div>
                        <div style={{marginTop: '40px'}}>
                            <div className="vertical-align">
                                <TextField
                                    error={(this.getErrorText() !== null)}
                                    className="fullWidth"
                                    label={PowerLocalize.get('Username.Singular')}
                                    value={'' + this.props.username}
                                    onChange={(evt) => this.props.changeUsername(evt.target.value)}
                                    onKeyPress={this.handleInputFieldKeyPress}
                                />
                            </div>
                            <div className="vertical-align">
                                <TextField
                                    error={(this.getErrorText() !== null)}
                                    className="fullWidth"
                                    label={PowerLocalize.get('Password.Singular')}
                                    helperText={this.getErrorText()}
                                    value={'' + this.props.password}
                                    onChange={(evt) => this.props.changePassword(evt.target.value)}
                                    type="password"
                                    onKeyPress={this.handleInputFieldKeyPress}
                                />
                            </div>
                            <div className="vertical-align" style={{marginTop: '10px', marginBottom: '10px'}}>
                                <FormGroup>
                                    <FormControlLabel control={
                                        <Checkbox
                                            checked={this.state.rememberLogin}
                                            onChange={this.handleRememberCheckboxCheck}
                                            color={'primary'}
                                        />
                                    }
                                                      label={PowerLocalize.get('Profile.Login.Remember')}
                                    />
                                </FormGroup>
                            </div>
                            <div className="vertical-align"
                                 style={{marginTop: '5px', marginBottom: '15px', height: '30px'}}>
                                {
                                    this.state.rememberLogin ?
                                        <div>
                                            <span
                                                className="warning-note">Remember Login is a development feature only!</span><br/>
                                            <span className="warning-note">Your Credentials will be stored in local storage!</span><br/>
                                            <span className="warning-note">Your Credentials will be vulnerable to cross site attacks!</span>
                                        </div>
                                        :
                                        <span> </span>
                                }
                            </div>
                            <div className={'vertical-align'}
                                 style={{marginTop: '5px', marginBottom: '15px', height: '30px'}}>
                                {
                                    this.getErrorText() !== null ? <span style={{paddingTop: '10px'}}
                                                                         className={'warning-note'}>{this.getErrorText()}</span> :
                                        <span> </span>
                                }
                            </div>
                            <div className="vertical-align">
                                <Button variant={'contained'} style={{float: 'left', marginRight: '5px'}}
                                        onClick={this.handleAttemptLogIn}
                                        color={'primary'}>{PowerLocalize.get('Action.Login')}</Button>
                                <Button variant={'text'} style={{float: 'right', marginRight: '5px'}}
                                        href={Paths.APP_ROOT}
                                >{'Zurück'}</Button>
                            </div>
                        </div>
                    </div>
                </Paper>
            </div>);
    }
}

/**
 * @see LoginModule
 * @author nt
 * @since 01.06.2017
 */
export const LoginModule: React.ComponentClass<LoginLocalProps> = connect(userLoginModule.mapStateToProps, userLoginModule.mapDispatchToProps)(userLoginModule);
