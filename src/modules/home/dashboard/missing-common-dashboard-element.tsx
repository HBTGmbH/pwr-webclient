import {connect} from 'react-redux';
import * as React from 'react';
import * as redux from 'redux';
import {ApplicationState} from '../../../reducers/reducerIndex';
import {isNullOrUndefined} from 'util';
import {Avatar, Button, Icon, Paper} from '@material-ui/core';
import {PowerLocalize} from '../../../localization/PowerLocalizer';
import {ProfileSkillMetrics} from '../../../model/statistics/ProfileSkillMetrics';
import {NavigationActionCreator} from '../../../reducers/navigation/NavigationActionCreator';
import {StatisticsActionCreator} from '../../../reducers/statistics/StatisticsActionCreator';
import {Paths} from '../../../Paths';
import {getImagePath} from '../../../API_CONFIG';
import {PwrRaisedButton} from '../../general/pwr-raised-button';
import OpenInNew from '@material-ui/icons/OpenInNew';
import {ThunkDispatch} from 'redux-thunk';

interface MissingCommonDashboardElementProps {
    profileSkillMetrics: ProfileSkillMetrics;
}

interface MissingCommonDashboardElementLocalProps {

}

interface MissingCommonDashboardElementLocalState {

}

interface MissingCommonDashboardElementDispatch {
    navigateTo(target: string): void;

    loadSkillStatistics(): void;
}

class MissingCommonDashboardElementModule extends React.Component<MissingCommonDashboardElementProps & MissingCommonDashboardElementLocalProps & MissingCommonDashboardElementDispatch, MissingCommonDashboardElementLocalState> {

    static mapStateToProps(state: ApplicationState, localProps: MissingCommonDashboardElementLocalProps): MissingCommonDashboardElementProps {
        return {
            profileSkillMetrics: state.statisticsReducer.activeProfileMetric(),
        };
    }

    static mapDispatchToProps(dispatch: ThunkDispatch<any, any, any>): MissingCommonDashboardElementDispatch {
        return {
            navigateTo: target => dispatch(NavigationActionCreator.AsyncNavigateTo(target)),
            loadSkillStatistics: () => dispatch(StatisticsActionCreator.AsyncRequestSkillUsages())
        };
    }

    private loadSkillStatistics = () => {
        // FIXME move this into the async action.
        this.props.loadSkillStatistics();
        this.props.navigateTo(Paths.USER_STATISTICS_SKILLS);
    };


    private renderMissingSkills = () => {
        if (this.props.profileSkillMetrics.missingSkills().size == 0) {
            return PowerLocalize.get('None');
        }
        let missingSkills: String = '';
        let prefix = '';
        this.props.profileSkillMetrics.missingSkills().forEach((com: string) => {
            missingSkills += prefix;
            missingSkills += com;
            prefix = ', ';
        });
        return missingSkills;
    };

    render() {
        if (isNullOrUndefined(this.props.profileSkillMetrics)) {
            return <div/>;
        } else {
            return (<Paper className="dashboard-element">
                <div className="vertical-align row">
                    <div className="col-md-3 col-sm-12 col-xs-12 vertical-align">
                        <Avatar sizes={'80'} src={getImagePath() + '/icon_chart.svg'}/>
                    </div>
                    <span className="col-md-6 col-xs-12 col-sm-12">
                        Standard-Skills, die diesem Profil fehlen: {this.renderMissingSkills()}
                    </span>
                    <div className="col-md-3 col-sm-12">
                        <PwrRaisedButton color={'primary'} icon={<OpenInNew/>}
                                         text={PowerLocalize.get('Action.ShowMore')}
                                         onClick={() => this.loadSkillStatistics()}/>
                    </div>
                </div>
            </Paper>);
        }
    }
}

/**
 * @see MissingCommonDashboardElementModule
 * @author nt
 * @since 27.09.2017
 */
export const MissingCommonDashboardElement = connect(MissingCommonDashboardElementModule.mapStateToProps, MissingCommonDashboardElementModule.mapDispatchToProps)(MissingCommonDashboardElementModule);
