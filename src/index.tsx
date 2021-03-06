import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './index.css';
import {ApplicationState, store} from './reducers/reducerIndex';
import {StatisticsActionCreator} from './reducers/statistics/StatisticsActionCreator';
import {Paths} from './Paths';
import {AppWrapper} from './app-wrapper-module';
import {storeHasUnsavedChanges} from './utils/PwrStoreUtils';

export function registerPageLeavePrevention() {
    // Prevents navigation
    const pageLeavePreventer = (ev: any) => {
        let state: ApplicationState = store.getState() as ApplicationState;
        return storeHasUnsavedChanges(store.getState()) ? 'DoNotLeave' : null;
    };

    /**
     * Register a listener that is called before the page is closed.
     */
    window.onbeforeunload = pageLeavePreventer;
}

registerPageLeavePrevention();
new Paths().restorePath();
// Workaround because typing for thunk is terrible
store.dispatch(StatisticsActionCreator.AsyncCheckAvailability() as any);
ReactDOM.render(
    (<AppWrapper/>),
    document.getElementById('root')
);

