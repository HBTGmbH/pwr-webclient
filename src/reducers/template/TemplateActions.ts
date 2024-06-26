import {Template, TemplateSlice} from '../../model/view/Template';
import {AbstractAction} from '../BaseActions';
import {ActionType} from '../ActionType';

export interface SetTemplateAction extends AbstractAction {
    template: Template;
}

export interface RemoveTemplateAction extends AbstractAction {
    id: string;
}

export interface CreateTemplateAction extends AbstractAction {
    name: string,
    description: string,
    initials: string,
    path: string,
}

export interface ChangeTemplateAction extends AbstractAction {
    id: string,
    name: string,
    description: string,
    user: string,
}

export interface SetPreviewAction extends AbstractAction {
    templateId: string,
    filename: string,
    content: string,
    file: File,
}

export class TemplateActions {


    /**
     * speichert ein template - local
     * @param {Template} template
     * @returns {SetTemplateAction}
     * @constructor
     */
    public static SetTemplate(template: Template): SetTemplateAction {
        return {
            type: ActionType.SetTemplate,
            template: template,
        };
    }

    /**
     * entfernt ein template - local
     * @param {string} id
     * @returns {RemoveTemplateAction}
     * @constructor
     */
    public static RemoveTemplate(id: string): RemoveTemplateAction {
        return {
            type: ActionType.SetTemplate,
            id: id
        };
    }

    public static ClearTemplates(): AbstractAction {
        return {
            type: ActionType.ClearTemplates,
        };
    }

    public static CreateTemplate(name: string, description: string, initials: string, path: string): CreateTemplateAction {
        return {
            type: ActionType.CreateTemplate,
            name: name,
            description: description,
            initials: initials,
            path: path,
        };
    }

    public static ChangeTemplate(template: TemplateSlice): ChangeTemplateAction {
        return {
            type: ActionType.ChangeTemplate,
            id: template.id,
            name: template.name,
            description: template.description,
            user: template.user,
        };
    }

    public static TemplateRequestFailed(): AbstractAction {
        return {
            type: ActionType.TemplateRequestFailed,
        };
    }


    public static SetPreview(templateId: string, filename: string, content: string, file: File): SetPreviewAction {
        return {
            type: ActionType.SetPreview,
            templateId: templateId,
            filename: filename,
            content: content,
            file: file,
        };

    }
}
