import React, { useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import logo from '../../assets/LOGO1.png';
import { makeStyles } from '@material-ui/core/styles';
import CopyrightIcon from '@material-ui/icons/Copyright';
import { useDispatch, useSelector } from "react-redux";
import { getVersionData } from "../actions/index";

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    }
});


const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

const About = (props) => {
    const { handleClose, isOpen } = props;

    const state = useSelector(state => state);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getVersionData());
    }, []);

    const useStyles = makeStyles((theme) => ({
        dialog: {
            height: '400px',
            position: 'relative'
        },
        footer: {
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '14px',
            lineHeight: '16px',
            color: '#CCCCCC',
            position: 'absolute',
            bottom: '15px',
            //left: 328
        },
        logo: {
            position: 'absolute',
            width: '305px',
            height: '146px',
            left: '40px',
            top: '60px'
        },
        label1: {
            position: 'absolute',
            //width: '111px',
            //height: '61px',
            left: '7px',
            top: '55px',
        }
        ,
        label2: {
            position: 'absolute',
            //width: '111px',
            //height: '61px',
            left: 0,
            top: '160px',
        },
        button: {
            background: 'linear-gradient(113.96deg, #189AB4 0%, #006096 100%)',
            //border: '0.5px solid #CCCCCC',
            boxSizing: 'border-box',
            borderRadius: '4px',
            color: 'white',
            width: 100
        }
    }));

    const classes = useStyles();

    return (
        <div className='row'>
            <div className='col-lg-12 col-md-12 col-sm-12'>
                <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={isOpen} classes={{ paper: classes.dialog }} fullWidth={true} maxWidth={'md'} style={{ minHeight: 400 }}>
                    <DialogTitle id="customized-dialog-title" onClose={handleClose} style={{ marginLeft: 28 }}>
                        About Sample Registration
                </DialogTitle>
                    <DialogContent dividers>
                        <div className='row'>
                            <div className='col-lg-6 col-md-6 col-sm-6'>
                                <Typography gutterBottom className={classes.logo}>
                                    <img src={logo} />
                                </Typography>
                            </div>
                            <div className='col-lg-6 col-md-6 col-sm-6 text-left'>
                                <div className={classes.label1}>
                                    <Typography gutterBottom>
                                        Version: <strong>{state.version}</strong>
                                    </Typography>
                                    <Typography gutterBottom style={{ marginTop: 25 }}>
                                        <a href='#'>License</a>
                                    </Typography>
                                </div>
                                <div className={classes.label2}>
                                    <DialogActions>
                                        <Button className={classes.button} autoFocus onClick={handleClose} color="primary">
                                            Ok
                                    </Button>
                                    </DialogActions>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className={`col-lg-11 col-md-11 col-sm-11 text-center ${classes.footer}`}>
                                <span>Copyright <CopyrightIcon fontSize="small" /> {new Date().getFullYear()} ULTIMA GENOMICS All rights reserved</span>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );

}

export default About;