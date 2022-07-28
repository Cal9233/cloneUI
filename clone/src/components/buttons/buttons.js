import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      //marginLeft: 'auto',
    },
  },
  button: {
    background: 'linear-gradient(113.96deg, #189AB4 0%, #006096 100%)',
    //border: '0.5px solid #CCCCCC',
    boxSizing: 'border-box',
    borderRadius: '4px',
    color: 'white'
  }
}));

const theme = createTheme({
  palette: {
    action: {
      //disabledBackground: 'light silver',
      //disabled: 'set color of text here'
    }
  }
});

const Buttons = (props) => {
  const classes = useStyles();
  const { label, click, isSubmitType, disabled, width } = props;
  return (
    <div className={classes.root}>
      <ThemeProvider theme={theme}>
        {isSubmitType ?
          disabled ?
            <Button variant="contained" type="submit" disabled={disabled} /*style={{ width: `${width != undefined ? width : '100px'}` }}*/>
              {label}
            </Button> :
            <Button variant="contained" className={classes.button} type="submit" disabled={disabled} /*style={{ width: `${width != undefined ? width : '100px'}` }}*/>
              {label}
            </Button> :
            disabled ?
            <Button variant="contained" onClick={click} disabled={disabled} /*style={{ width: `${width != undefined ? width : '100px'}` }}*/>
            {label}
          </Button> :
          <Button variant="contained" className={classes.button} onClick={click} disabled={disabled} /*style={{ width: `${width != undefined ? width : '100px'}` }}*/>
            {label}
          </Button>
        }
      </ThemeProvider>
    </div>
  );
};

export default Buttons;
