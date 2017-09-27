import {connect} from 'react-redux';
import * as React from 'react';
import * as redux from 'redux';
import {ApplicationState} from '../../../reducers/reducerIndex';
import {Avatar, FontIcon, Paper, RaisedButton} from 'material-ui';
import {getProfileImageLocation} from '../../../API_CONFIG';
import {PowerLocalize} from '../../../localization/PowerLocalizer';
import {NavigationActionCreator} from '../../../reducers/navigation/NavigationActionCreator';
import {Paths} from '../../../Paths';
import {ProfileAsyncActionCreator} from '../../../reducers/profile/ProfileAsyncActionCreator';

interface BaseDataDashboardElementProps {
    initials: string;
    lastEdited: Date;
}

interface BaseDataDashboardElementLocalProps {

}

interface BaseDataDashboardElementLocalState {

}

interface BaseDataDashboardElementDispatch {
    requestSingleProfile(initials: string): void;
    navigateTo(target: string): void;
}

class BaseDataDashboardElementModule extends React.Component<BaseDataDashboardElementProps & BaseDataDashboardElementLocalProps & BaseDataDashboardElementDispatch, BaseDataDashboardElementLocalState> {

    static mapStateToProps(state: ApplicationState, localProps: BaseDataDashboardElementLocalProps): BaseDataDashboardElementProps {
        return {
            initials: state.databaseReducer.loggedInUser().initials(),
            lastEdited: state.databaseReducer.profile().lastEdited()
        }
    }

    static mapDispatchToProps(dispatch: redux.Dispatch<ApplicationState>): BaseDataDashboardElementDispatch {
        return {
            requestSingleProfile: function(initials: string) {
                dispatch(ProfileAsyncActionCreator.requestSingleProfile(initials));
            },
            navigateTo: target => dispatch(NavigationActionCreator.AsyncNavigateTo(target)),
        }
    }

    private handleEditButtonClick = () => {
        this.props.requestSingleProfile(this.props.initials);
        this.props.navigateTo(Paths.USER_PROFILE);
    };

    render() {
        return (<Paper className="dashboard-element">
            <div className="vertical-align row">
                <div className="col-md-3 col-sm-12 col-xs-12 vertical-align">
                    <Avatar  size={80} src={getProfileImageLocation(this.props.initials)} />
                </div>
                <span className="col-md-3 col-sm-6" style={{fontSize: "16px", fontWeight: "bold", marginTop: "8px"}}>{PowerLocalize.get("Overview.Base.BaseData")}</span>
                <span className="col-md-3 col-sm-6" style={{marginTop: "8px"}}>{PowerLocalize.get("Overview.Base.LastEdited")} : {this.props.lastEdited.toLocaleString()} </span>
                <div className="col-md-3 col-sm-12">
                    <RaisedButton
                        style={{marginTop: "8px"}}
                        label={PowerLocalize.get('Action.Edit')}
                        labelPosition="before"
                        primary={true}
                        icon={ <FontIcon className="material-icons">edit</FontIcon>}
                        onClick={this.handleEditButtonClick}
                    />
                </div>
            </div>
        </Paper>);
    }
}

/**
 * @see BaseDataDashboardElementModule
 * @author nt
 * @since 27.09.2017
 */
export const BaseDataDashboardElement: React.ComponentClass<BaseDataDashboardElementLocalProps> = connect(BaseDataDashboardElementModule.mapStateToProps, BaseDataDashboardElementModule.mapDispatchToProps)(BaseDataDashboardElementModule);