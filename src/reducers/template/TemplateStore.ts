import {doop} from 'doop';
import * as Immutable from 'immutable';
import {Template} from '../../model/view/Template';
import {ReportPreviewFile} from '../../model/view/ReportPreviewFile';


@doop
export class TemplateStore {
    @doop
    public get templates() {
        return doop<Immutable.Map<string, Template>, this>();
    };

    @doop
    public get previews() {
        return doop<Immutable.Map<string, ReportPreviewFile>, this>();
    };

    private constructor() {
        return this;
    }

    public static empty(): TemplateStore {
        return new TemplateStore().templates(Immutable.Map<string, Template>()).previews(Immutable.Map<string, ReportPreviewFile>());
    }
}
