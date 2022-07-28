import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AlertDialog = props => {
    const { isDeleteDialogOpen, handleDeleteClickOk, handleDeleteClickCancel, deleteDialogMsg } = props;

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
            color: 'white',
            width: 150
        }
    }));

    const classes = useStyles();

    return (
        <div>
            <Dialog
                open={isDeleteDialogOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleDeleteClickCancel}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{"Are you sure?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {deleteDialogMsg}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <div className='text-center' style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
                        <Button onClick={handleDeleteClickOk} variant="contained" className={classes.button} style={{marginRight: 15}}>
                            Delete
                        </Button>
                        <Button onClick={handleDeleteClickCancel} variant="contained" className={classes.button}>
                            Cancel
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AlertDialog;