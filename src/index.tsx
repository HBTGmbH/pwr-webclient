import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './index.css';
import './../node_modules/react-toggle/style.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {ApplicationState, store} from './reducers/reducerIndex';
import {Provider} from 'react-redux';
import {PowerClient} from './modules/home/power-client_module';
import {PowerLocalize} from './localization/PowerLocalizer';
import {ProfileAsyncActionCreator} from './reducers/profile/ProfileAsyncActionCreator';
import {PowerLogin} from './modules/power-login_module';
import {browserHistory, Route, Router} from 'react-router';
import {PowerOverview} from './modules/home/power-overview_module';
import {ConsultantProfile} from './modules/home/profile/profile_module';
import {NotificationInbox} from './modules/admin/notification/notification-inbox_module';
import {AdminClient} from './modules/admin/admin-client_module';
import {NotificationTrashbox} from './modules/admin/notification/notification-trashbox_module';
import {AdminLogin} from './modules/admin/admin-login_module';
import HTML5Backend from 'react-dnd-html5-backend';
import {DragDropContext} from 'react-dnd';

import {ConsultantGrid} from './modules/admin/consultants/consultant-grid_module';
import {SkillStatistics} from './modules/home/statistics/skill-statistics_module';
import {ProfileNetwork} from './modules/admin/statistics/profile-network_module';
import {StatisticsActionCreator} from './reducers/statistics/StatisticsActionCreator';
import {ProfileNetworkGraph} from './modules/general/statistics/profile-network_module';
import {ClusterResult} from './modules/home/statistics/cluster-result_module';
import {ConsultantSkillSearch} from './modules/general/search/consultant-skill-search_module.';
import {getMuiTheme, spacing} from 'material-ui/styles';
import {
    cyan500,
    darkBlack,
    deepOrange500,
    fullBlack,
    grey100,
    grey300,
    grey500,
    indigo50,
    indigo500,
    indigo800,
    white
} from 'material-ui/styles/colors';
import {fade} from 'material-ui/utils/colorManipulator';
import {Paths} from './Paths';
import {AdminSkillTree2} from './modules/admin/info/admin-skill-tree2_module';
import {AdminProfileOverview} from './modules/admin/info/admin-profile-overview_module.';
import {ConfirmNavDialog} from './modules/navigation/confirm-nav-dialog_module';
import {ViewProfileOverview} from './modules/home/view/view-profile-overview_module';
import injectTapEventPlugin = require('react-tap-event-plugin');

// For material ui tap touch support
injectTapEventPlugin();

const paths = new Paths();
paths.restorePath();

PowerLocalize.setLocale(navigator.language);
store.dispatch(ProfileAsyncActionCreator.requestQualifications());
store.dispatch(ProfileAsyncActionCreator.requestLanguages());
store.dispatch(ProfileAsyncActionCreator.requestEducations());
store.dispatch(ProfileAsyncActionCreator.requestTrainings());
store.dispatch(ProfileAsyncActionCreator.requestSectors());
store.dispatch(ProfileAsyncActionCreator.requestCompanies());
store.dispatch(ProfileAsyncActionCreator.requestProjectRoles());
store.dispatch(StatisticsActionCreator.AsyncCheckAvailability());


// Prevents navigation
const pageLeavePreventer = (ev: any) => {
    let state: ApplicationState = store.getState() as ApplicationState;
    let changes = state.databaseReducer.profile().changesMade();
    console.log("Changes", changes);
    return changes > 0 ? "DoNotLeave" : null;
};

/**
 * Register a listener that is called before the page is closed.
 */
window.onbeforeunload = pageLeavePreventer;





@DragDropContext(HTML5Backend)
class MyRouter extends React.Component<any, any> {
    render() {
        return (<Router history={browserHistory}>
            <Route path={Paths.APP_ROOT} component={PowerLogin}/>
            <Route path={Paths.ADMIN_LOGIN} component={AdminLogin}/>
            <Route path={Paths.USER_BASE} component={PowerClient}>
                <Route path={Paths.USER_HOME} component={PowerOverview}/>
                <Route path={Paths.USER_PROFILE} component={ConsultantProfile}/>
                <Route path={Paths.USER_STATISTICS_NETWORK} component={ProfileNetworkGraph}/>
                <Route path={Paths.USER_STATISTICS_CLUSTERINFO} component={ClusterResult}/>
                <Route path={Paths.USER_STATISTICS_SKILLS} component={SkillStatistics}/>
                <Route path={Paths.USER_SEARCH}  component={ConsultantSkillSearch}/>
                <Route path={Paths.USER_VIEW_PROFILE}  component={ViewProfileOverview}/>
            </Route>
            <Route path={Paths.ADMIN_BASE} component={AdminClient}>
                <Route path={Paths.ADMIN_INBOX} component={NotificationInbox} />
                <Route path={Paths.ADMIN_CONSULTANTS} component={ConsultantGrid} />
                <Route path={Paths.ADMIN_TRASHBOX} component={NotificationTrashbox} />
                <Route path={Paths.ADMIN_STATISTICS_SKILL} component={SkillStatistics} />
                <Route path={Paths.ADMIN_STATISTICS_NETWORK} component={ProfileNetwork} />
                <Route path={Paths.ADMIN_INFO_SKILLTREE} component={AdminSkillTree2} />
                <Route path={Paths.ADMIN_INFO_NAME_ENTITY} component={AdminProfileOverview} />
            </Route>
        </Router>);
    }
}

const powerTheme = {
    spacing: spacing,
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary1Color: indigo500,
        primary2Color: indigo800,
        primary3Color: indigo50,
        accent1Color: deepOrange500,
        accent2Color: grey100,
        accent3Color: grey500,
        textColor: darkBlack,
        alternateTextColor: white,
        canvasColor: white,
        borderColor: grey300,
        disabledColor: fade(darkBlack, 0.3),
        pickerHeaderColor: cyan500,
        clockCircleColor: fade(darkBlack, 0.07),
        shadowColor: fullBlack,
    },
};

export const POWER_MUI_THEME = getMuiTheme(powerTheme);


let App = (
    <MuiThemeProvider muiTheme={POWER_MUI_THEME}>
        <Provider store={store}>
            <div>
                <ConfirmNavDialog/>
                <MyRouter/>
            </div>
        </Provider>
    </MuiThemeProvider>
);


ReactDOM.render(
    App,
  document.getElementById('root')
);
