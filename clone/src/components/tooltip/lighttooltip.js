import React from 'react';
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from '@material-ui/core/styles';

const LightTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: 'white',
        color: 'black',
        boxShadow: theme.shadows[5],
        fontSize: theme.typography.pxToRem(12),
        maxWidth: 420,
        height: 50,
        border: '1px solid black',
        display: 'flex',
        alignItems: 'center',
        disableFocusListener: true,
        disableHoverListener: true,
        disableTouchListener: true
    },
}))(Tooltip);

export default LightTooltip;