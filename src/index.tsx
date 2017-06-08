import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './index.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import reducerApp from './reducers/reducerIndex';
import {applyMiddleware, createStore} from 'redux';
import {Provider} from 'react-redux';

import thunkMiddleware from 'redux-thunk';
import {PowerClient} from './modules/home/power-client_module';
import {PowerLocalize} from './localization/PowerLocalizer';
import {ProfileAsyncActionCreator} from './reducers/profile/ProfileAsyncActionCreator';
import injectTapEventPlugin = require('react-tap-event-plugin');
import {PowerLogin} from './modules/power-login_module';
import {Route, Router} from 'react-router';
import { browserHistory } from 'react-router'
import {PowerOverview} from './modules/home/power-overview_module';
import {ConsultantProfile} from './modules/home/profile/profile_module';
import {ViewProfileCard} from './modules/home/view/view-profile_module';
import {NotificationInbox} from './modules/admin/notification-inbox_module';
import {AdminClient} from './modules/admin/admin-client_module';
import {NotificationTrashbox} from './modules/admin/notification-trashbox_module';
import {AdminLogin} from './modules/admin/admin-login_module';
import HTML5Backend from 'react-dnd-html5-backend';
import {DragDropContext} from 'react-dnd';
import {COOKIE_INITIALS_EXPIRATION_TIME, COOKIE_INITIALS_NAME} from './model/PwrConstants';
import {isNullOrUndefined} from 'util';
import {ProfileActionCreator} from './reducers/profile/ProfileActionCreator';
import * as Cookies from 'js-cookie';
import {ConsultantGrid} from './modules/admin/consultants/consultant-grid_module';

injectTapEventPlugin();



let store = createStore(
    reducerApp,
    applyMiddleware(
        thunkMiddleware
    )
);

PowerLocalize.setLocale(navigator.language);
store.dispatch(ProfileAsyncActionCreator.requestQualifications());
store.dispatch(ProfileAsyncActionCreator.requestLanguages());
store.dispatch(ProfileAsyncActionCreator.requestEducations());
store.dispatch(ProfileAsyncActionCreator.requestCareers());
store.dispatch(ProfileAsyncActionCreator.requestSectors());
store.dispatch(ProfileAsyncActionCreator.requestCompanies());
store.dispatch(ProfileAsyncActionCreator.requestProjectRoles());

const storedInitials = Cookies.get(COOKIE_INITIALS_NAME);
if(!isNullOrUndefined(storedInitials)) {
    console.info("Cookie detected. Performing auto Log-In.");
    // renew the cookie to hold another fixed period of time.
    Cookies.set(COOKIE_INITIALS_NAME, storedInitials, {expires: COOKIE_INITIALS_EXPIRATION_TIME});
    store.dispatch(ProfileAsyncActionCreator.logInUser(storedInitials));
} else {
    browserHistory.push('/');
}

export class Paths {
    public static readonly ADMIN_INBOX = "/admin/home/inbox";
    public static readonly ADMIN_TRASHBOX = "/admin/home/trashbox";
    public static readonly ADMIN_CONSULTANTS = "/admin/home/consultants";
    public static readonly ADMIN_LOGIN = "/login";
}

@DragDropContext(HTML5Backend)
class MyRouter extends React.Component<any, any> {
    render() {
        return (<Router history={browserHistory}>
            <Route path="/" component={PowerLogin}/>
            <Route path={Paths.ADMIN_LOGIN} component={AdminLogin}/>
            <Route path="/app" component={PowerClient}>
                <Route path="/app/home" component={PowerOverview}/>
                <Route path="/app/" component={ConsultantProfile}/>
                <Route path="/app/profile" component={ConsultantProfile}/>
                <Route path="/app/view" component={ViewProfileCard}/>
            </Route>
            <Route path="/admin" component={AdminClient}>
                <Route path={Paths.ADMIN_INBOX} component={NotificationInbox} />
                <Route path={Paths.ADMIN_CONSULTANTS} component={ConsultantGrid} />
                <Route path={Paths.ADMIN_TRASHBOX} component={NotificationTrashbox} />
            </Route>
        </Router>)
    }
}


let Routes = (
    <MuiThemeProvider>
        <Provider store={store}>
            <MyRouter/>
        </Provider>
    </MuiThemeProvider>
);


ReactDOM.render(
    Routes,
  document.getElementById('root')
);
