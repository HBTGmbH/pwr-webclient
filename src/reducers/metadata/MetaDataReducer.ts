import {emptyMetaDataStore, MetaDataStore} from '../../model/metadata/MetaDataStore';
import {ActionType} from '../ActionType';
import {AddOrReplaceBuildInfoAction, AddOrReplaceClientInfoAction} from './MetaDataActions';
import {ClientBuildInfo} from '../../model/metadata/ClientBuildInfo';
import {AbstractAction} from '../BaseActions';

export class MetaDataReducer {

    public static reduce(store: MetaDataStore = emptyMetaDataStore(), action: AbstractAction): MetaDataStore {
        switch (action.type) {
            case ActionType.AddOrReplaceBuildInfo: {
                let act: AddOrReplaceBuildInfoAction = action as AddOrReplaceBuildInfoAction;
                return {
                    ...store,
                    buildInfoByService: store.buildInfoByService.set(act.service, act.buildInfo)
                }
            }
            case ActionType.AddOrReplaceClientInfo: {
                let act: AddOrReplaceClientInfoAction = action as AddOrReplaceClientInfoAction;
                return {
                    ...store,
                    clientBuildInfo: ClientBuildInfo.of(act.info)
                }
            }
        }
        return store;
    }

}
