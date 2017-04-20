
import * as React from 'react';
import {AppBar} from 'material-ui';
import {ConsultantDashboard} from './consultant-dashboard_module';
import {connect} from 'react-redux';
import {PowerToolbar} from './power-toolbar_module';
import {Profile} from './profile/profile_module';
class PowerClientModule extends React.Component<{}, {}> {

    render() {
        return (
        <div>
            <PowerToolbar/>
            <Profile/>
        </div>
        );
    }
}


export const PowerClient: React.ComponentClass<{}> = connect()(PowerClientModule);