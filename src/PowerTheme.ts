import {Color} from './utils/ColorUtil';
import {createTheme, ThemeOptions} from '@material-ui/core/styles';

const newPowerTheme: ThemeOptions = {
    typography: {
        fontSize: 24,
        fontFamily: [
            'Roboto',
            'sans-serif',].join(','),
    },
    palette: {
        primary: {
            light: '#474b77',
            main: '#191E55',
            dark: '#11153b',
            contrastText: '#fff',
        },
        secondary: {
            light: '#6bebeb',
            main: '#46E6E6',
            dark: '#31a1a1',
        },
        error: {
            main: Color.HBT_2017_HIGHLIGHT.toCSSRGBString(),
        },
        text: {

            //disabled: Color.HBT_2017_GRAY.toCSSRGBAString(0.5),
        }
    },
    props: {
        MuiPaper: {
            square: true
        }
    },
    overrides: {
        MuiInputAdornment: {
            root: {
                height: 'auto'
            }
        },
        MuiTabs: {
            root: {
                color: '#fff',
                indicatorColor: '#46E6E6',
                backgroundColor: '#191E55'
            }
        },
        MuiTab: {
            root: {
                '&$selected': {
                    color: '#46E6E6'
                }
            }

        }
    }
};

export const POWER_MUI_THEME = createTheme(newPowerTheme as any);
