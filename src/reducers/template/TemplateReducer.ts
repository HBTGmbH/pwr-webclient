import {emptyTemplateStore, TemplateStore} from './TemplateStore';
import {ActionType} from '../ActionType';
import {RemoveTemplateAction, SetPreviewAction, SetTemplateAction} from './TemplateActions';
import {ReportPreviewFile} from '../../model/view/ReportPreviewFile';
import {AbstractAction} from '../BaseActions';


export class TemplateReducer {

    public static reduce(store: TemplateStore = emptyTemplateStore(), action: AbstractAction): TemplateStore {
        switch (action.type) {
            case ActionType.SetTemplate: {
                let act: SetTemplateAction = action as SetTemplateAction;
                let templates = store.templates;
                templates = templates.set(act.template.id, act.template);
                return {
                    ...store,
                    templates
                }
            }
            case ActionType.RemoveTemplate: {
                let act: RemoveTemplateAction = action as RemoveTemplateAction;
                let templates = store.templates;
                templates = templates.remove(act.id);
                return {
                    ...store,
                    templates
                }
            }
            case ActionType.ClearTemplates: {
                return {
                    ...store,
                    templates: store.templates.clear()
                }
            }
            case ActionType.TemplateRequestFailed: {
                console.error('TemplateRequestFailed');
                return store;
            }
            case ActionType.SetPreview : {
                let act: SetPreviewAction = action as SetPreviewAction;
                let temp: ReportPreviewFile = new ReportPreviewFile();
                temp.templateId = act.templateId;
                temp.filename = act.filename;
                temp.content = act.content;
                temp.file = act.file;
                temp.id = '111';

                let previews = store.previews;
                previews.set(act.templateId, new ReportPreviewFile(temp));
                return {
                    ...store,
                    previews,
                }
            }
        }
        return store;
    }
}
