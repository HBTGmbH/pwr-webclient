import * as React from 'react';
import {ApplicationState} from '../../../reducers/reducerIndex';
import {connect} from 'react-redux';
import {ReportData} from '../../../model/view/ReportData';
import {ReportAsyncActionCreator} from '../../../reducers/report/ReportAsyncActionCreator';
import {Icon, Paper, Table} from '@material-ui/core';

import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Button from '@material-ui/core/Button';
import {Build, ErrorOutline} from '@material-ui/icons';
import {Template} from '../../../model/view/Template';
import {TemplateActionCreator} from '../../../reducers/template/TemplateActionCreator';
import {PowerLocalize} from '../../../localization/PowerLocalizer';
import {ThunkDispatch} from 'redux-thunk';

interface ReportHistoryLocalProps {
}

interface ReportHistoryDispatch {
    loadAllReportData(initials: string): void,

    loadAllTemplateData(): void,

    getReportFile(reportData: ReportData): void,

    deleteReportFile(id, cb): void
}

interface ReportHistoryProps {
    initials: string;
    reports: ReportData[];
    templates: Map<string, Template>;
}


interface ReportHistoryState {
    initials: string;
}

class ReportHistoryModule extends React.Component<ReportHistoryProps
    & ReportHistoryLocalProps
    & ReportHistoryDispatch, ReportHistoryState> {


    constructor(props: ReportHistoryProps & ReportHistoryLocalProps & ReportHistoryDispatch) {
        super(props);
    }

    static mapStateToProps(state: ApplicationState): ReportHistoryProps {
        const templates = state.templateSlice.templates != null ? state.templateSlice.templates : new Map<string, Template>();
        const reports = state.reportStore.reports != null ? state.reportStore.reports : [];
        const initials = state.profileStore.consultant.initials != null ? state.profileStore.consultant.initials : '';

        return {
            initials: initials,
            reports: reports,
            templates: templates
        } as ReportHistoryProps;
    }

    static mapDispatchToProps(dispatch: ThunkDispatch<any, any, any>): ReportHistoryDispatch {
        return {
            loadAllReportData: (initials: string) => dispatch(ReportAsyncActionCreator.loadAllReportData(initials)),
            loadAllTemplateData: () => dispatch(TemplateActionCreator.AsyncLoadAllFiles),
            getReportFile: (reportData: ReportData) => dispatch(ReportAsyncActionCreator.getReportFile(reportData)),
            deleteReportFile: (id, cb) => dispatch(ReportAsyncActionCreator.deleteReportFile(id, cb))
        };
    }

    componentDidMount() {
        this.loadAllData();
    };

    private loadAllData() {
        if (!this.props.templates || this.props.templates.size === 0) {
            this.loadAllTemplateData();
        }
        this.loadAllReportData();

    }

    private loadAllReportData = () => {
        if (this.props.initials != null && this.props.initials != '') { // TODO reload initials
            this.props.loadAllReportData(this.props.initials);
        }
    };

    private loadAllTemplateData = () => {
        this.props.loadAllTemplateData();
    };

    private ReportDeleteButton = (id: number) => {
        return <Button
            style={{marginLeft: '8px', marginTop: '5px', backgroundColor: '#ff8e01'}}
            variant={'contained'}
            className="mui-margin pwr-btn-error"
            onMouseDown={() => {
                this.deleteReport(id);
            }}
        >
            <Icon className="material-icons">delete</Icon>
            {PowerLocalize.get('Action.Delete')}
        </Button>;
    };

    private StatusDisplay = (reportData: ReportData) => {
        let body: JSX.Element;
        const status = reportData.reportStatus;
        const id = reportData.id;

        switch (status) {
            case 'DONE':
                body =
                    <Button
                        variant="contained"
                        color="primary" style={{marginLeft: '8px', marginTop: '5px'}}
                        onClick={() => this.downloadReport(reportData)}
                    >
                        <Icon className="material-icons">get_app</Icon>
                        {PowerLocalize.get('Action.Download')}
                    </Button>;
                break;
            case 'ERROR':
                body = <ErrorOutline color="secondary"/>;
                break;
            case 'RUNNING':
                body = <Build color="secondary"/>;
                break;
            default:
                body = <span>{status}</span>;
                break;
        }
        return <div>
            {body}
            {this.ReportDeleteButton(id)}
        </div>;
    };

    downloadReport = (reportData: ReportData) => {
        return this.props.getReportFile(reportData);
    };

    downloadReportURL = (reportData: ReportData) => {
        return this.props.getReportFile(reportData);
    };

    deleteReport = (id: number) => {
        this.props.deleteReportFile(id.toString(), this.loadAllReportData);
    };

    getTemplateName = (idx: string): string => {
        const templates = this.props.templates;
        if (!templates) {
            return PowerLocalize.get('Report.UnknownTemplate');
        }
        const template = templates.get(idx);
        if (!template) {
            return PowerLocalize.get('Report.UnknownTemplate');
        }
        return template.name;
    };

    render() {
        return (
            <div>
                <Paper className="mui-margin">
                    <Button
                        variant="contained"
                        color="secondary" style={{marginLeft: '8px', marginTop: '5px'}}
                        onMouseDown={() => {
                            this.loadAllData();
                        }}
                    >
                        <Icon className="material-icons">autorenew</Icon>
                        {PowerLocalize.get('Action.Update')}
                    </Button>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow key={-1}>
                                <TableCell>{PowerLocalize.get('Overview.ViewProfiles.Title')}</TableCell>
                                <TableCell align="left">{PowerLocalize.get('Report.Template')}</TableCell>
                                <TableCell align="left">{PowerLocalize.get('Report.CreateDate')}</TableCell>
                                <TableCell align="left">{PowerLocalize.get('Report.Status')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.props.reports.map((value, index) =>
                                    <TableRow key={index}>
                                        <TableCell>{value.viewProfileName}</TableCell>
                                        <TableCell align="left">{this.getTemplateName(value.templateId)}</TableCell>
                                        <TableCell align="left">{<>value.createDate</>}</TableCell>
                                        <TableCell
                                            align="left">{this.StatusDisplay(value)}</TableCell>
                                    </TableRow>)
                            }
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        );
    }

}

export const ReportHistory = connect(ReportHistoryModule.mapStateToProps, ReportHistoryModule.mapDispatchToProps)(ReportHistoryModule);

