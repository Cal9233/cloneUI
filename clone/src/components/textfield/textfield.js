import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

const BasicTextField = (props) => {
  const classes = useStyles();
  const {label} = props;
  return (
    <form className={classes.root} noValidate autoComplete="off">      
      <TextField label={label} variant="outlined" />
    </form>
  );
}

export default BasicTextField;