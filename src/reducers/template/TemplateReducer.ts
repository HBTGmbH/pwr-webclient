import {TemplateStore} from '../../model/view/TemplateStore';
import {ActionType} from '../ActionType';
import {TemplateActions} from './TemplateActions';
import {AbstractAction} from '../profile/database-actions';
import {isNullOrUndefined} from 'util';



export namespace TemplateReducer{

    import RemoveTemplateAction = TemplateActions.RemoveTemplateAction
    import SetTemplateAction = TemplateActions.SetTemplateAction;

    export function reduce(store: TemplateStore, action: AbstractAction){
        console.log("TemplateReducer called with action type " + ActionType[action.type]);

        if (isNullOrUndefined(store)) {
            return TemplateStore.empty();
        }

        switch (action.type) {
            case ActionType.SetTemplate: {
                let act: SetTemplateAction = action as SetTemplateAction;
                let templates = store.templates();
                templates = templates.set(act.template.id, act.template);
                return store.templates(templates);
            }
            case ActionType.RemoveTemplate: {
                let act: RemoveTemplateAction = action as RemoveTemplateAction;
                let templates = store.templates();
                templates = templates.remove(act.id);
                return store.templates(templates);
            }
            case ActionType.ClearTemplates:{
                return store.templates(store.templates().clear());
            }
        }
        return store;
    }
}