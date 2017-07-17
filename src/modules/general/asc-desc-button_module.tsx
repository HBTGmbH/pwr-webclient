import * as React from 'react';
import {FlatButton, FontIcon} from 'material-ui';

interface AscDescButtonProps {
    initial?: 'ASC'|'DESC';
    label?: string;
    onAscDescChange?(state: 'ASC'|'DESC'): void;
}

interface AscDescButtonState {
    currState: 'ASC'|'DESC';
    currentIconName: string;
}

export class AscDescButton extends React.Component<AscDescButtonProps, AscDescButtonState> {

    private readonly ascName: string = 'ic_keyboard_arrow_up';
    private readonly descName: string = 'ic_keyboard_arrow_down';

    public static defaultProps: Partial<AscDescButtonProps> = {
        initial: 'ASC',
        label: "",
        onAscDescChange: () => {}
    };


    constructor(props: AscDescButtonProps) {
        super(props);
        this.state = {
            currState: props.initial,
            currentIconName: props.initial == 'ASC' ? this.ascName : this.descName
        };
    }

    private handleButtonPress = () => {
        let newState: 'ASC' | 'DESC' = 'ASC';
        let newIcon: string = this.ascName;
        if(this.state.currState == 'ASC') {
            newState = 'DESC';
            newIcon = this.descName;
        }
        this.setState({
            currState: newState,
            currentIconName: newIcon
        });
        this.props.onAscDescChange(this.state.currState);
    };

    /**
     *
     * @returns {any}
     */
    render() {
        return (
            <FlatButton
                onClick={this.handleButtonPress}
                label={this.props.label}
                labelPosition="before"
                icon={<FontIcon className="material-icons">{this.state.currentIconName}</FontIcon>}
            />)
    }
}
