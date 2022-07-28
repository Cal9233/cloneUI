import React from 'react';
import { toggleUploadMenu, uploadSampleSheet, setAlert } from "../actions/index";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Buttons from '../buttons/buttons';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { FormLabel } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

const Upload = props => {
    const [selectedFile, setSelectedFile] = React.useState(null);

    const isUploadMenuOpen = useSelector(state => state.menu.isUploadMenuOpen);    

    const dispatch = useDispatch();

    const useStyles = makeStyles((theme) => ({
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        paper: {
            width: 500,
            backgroundColor: theme.palette.background.paper,
            border: '1px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
        label: {
            fontSize: 'large',
            color: '#008196',
            marginBottom: '15px'
        },
    }));

    const classes = useStyles();

    const handleCloseClick = () => {
        dispatch(toggleUploadMenu(false));
    };

    const handleUploadClick = () => {
        if (selectedFile === null) {
            dispatch(setAlert(`Please select Sample Sheet to upload`, `No file(-s) selected `, 'warning'));
        }
        else dispatch(uploadSampleSheet(selectedFile));
    };

    const onFileUploadChange = e => {        
        if (e.target.files[0] != null) {
            setSelectedFile(e.target.files[0]);
        }
        else {            
            dispatch(setAlert(`Please select Sample Sheet to upload`, `No file(-s) selected `, 'warning'));
        }
    };

    return (
        <React.Fragment>
            {isUploadMenuOpen &&
                <div className='row'>
                    <div className='col-lg-12 col-md-12 col-sm-12'>
                        <Modal
                            disableBackdropClick
                            aria-labelledby="transition-modal-title"
                            aria-describedby="transition-modal-description"
                            className={classes.modal}
                            open={isUploadMenuOpen}
                            onClose={handleCloseClick}
                            closeAfterTransition
                            BackdropComponent={Backdrop}
                            BackdropProps={{
                                timeout: 500,
                            }}
                        >
                            <Fade in={isUploadMenuOpen}>
                                <div className='row'>
                                    <div className='col-lg-12 col-md-12 col-sm-12'>
                                        <Paper className={classes.paper} id="transition-modal-title">
                                            <div className='row'>
                                                <div className='col-lg-6 col-md-6 col-sm-6' style={{ marginTop: '10px' }}>
                                                    <FormLabel className={classes.label}>Upload Sample Sheet</FormLabel>
                                                </div>
                                                <div className='col-lg-6 col-md-6 col-sm-6 text-right'>
                                                    <IconButton onClick={handleCloseClick}>
                                                        <CloseIcon />
                                                    </IconButton>
                                                </div>
                                            </div>
                                            <form encType="multipart/form-data" method="post">
                                                <div className='row'>
                                                    <div className='col-lg-12 col-md-12 col-sm-12 text-left'>
                                                        <div className="input-group mb-3">
                                                            <input type="file" id='file' name='file' className="form-control" onChange={e => onFileUploadChange(e)} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-lg-12 col-md-12 col-sm-12 text-center'>
                                                    <Buttons label={"Upload"} click={handleUploadClick} />
                                                </div>
                                            </form>
                                        </Paper>
                                    </div>
                                </div>
                            </Fade>
                        </Modal>
                    </div>
                </div>
            }
        </React.Fragment>
    );
}


export default Upload;