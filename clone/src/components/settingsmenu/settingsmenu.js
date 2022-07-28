import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Buttons from '../buttons/buttons';
import Api from "../../services/apiService";
import { useDispatch, useSelector } from "react-redux";
import {
    getSettingsData, postSettingsData, setAlert, setSettingsPath1, setSettingsPath2, setSettingsPath3,
    setSettingsModeAMP2, setSettingsPrefix1, setSettingsPrefix2, setAllowEditingRunsInProgress, setTab2DeleteButtonState, setTab2EditButtonState
} from "../actions/index";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { FormLabel } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

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


const SettingsMenu = (props) => {
    const classes = useStyles();
    const { isOpen, handleClose } = props;
    const [open, setOpen] = useState(false);
    const [label, setLabel] = useState('Close');
    const [allowEditingRuns, setAllowEditingRuns] = useState(false);
      
    const settings = useSelector(state => state.settings);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSettingsData());
    }, []);   
    
    const checkAllPathExists = (path1, path2, path3) => {
        if (path1 != undefined && path1 != null && path2 != undefined && path2 != null && path3 != undefined && path3 != null) {
            try {
                var msg = '';
                const api = new Api();
                var promise1 = api.checkFileExists(path1);
                var promise2 = api.checkDirExists(path2);
                var promise3 = api.checkFileExists(path3);

                Promise.all([promise1, promise2, promise3]).then((values) => {
                    if (values) {
                        if (values.length) {
                            values.forEach(val => {
                                if (val.data == false) {
                                    msg += `${val.config.data} doesn't exists. \r\n`;
                                }
                            });
                            if (msg != '') {
                                dispatch(setAlert(msg, ``, 'error'));
                            }
                            else {
                                handleClose(true);
                                setOpen(false);
                                if (label === 'Save') {
                                    setLabel('Close');
                                    handleSaveSettings();
                                }
                            }
                        }
                    }
                });

            }
            catch (e) {
                dispatch(setAlert(e.response != undefined ? e.response.data : e.stack, e.message, 'error'));
            }
        }
    }

    const handleSaveClick = (e) => {
        checkAllPathExists(settings.path1, settings.path2, settings.path3);
    };

    const handleCloseClick = (e) => {
        if (label === 'Close') {
            handleClose(true);
            setOpen(false);
        }
        else  {
            checkAllPathExists(settings.path1, settings.path2, settings.path3);
        }
    };

    const handlePath1Change = (e) => {
        setLabel('Save');        
        dispatch(setSettingsPath1(e.target.value));       
    };

    const handlePath2Change = (e) => {
        setLabel('Save');
        dispatch(setSettingsPath2(e.target.value));       
    };

    const handlePath3Change = (e) => {
        setLabel('Save');
        dispatch(setSettingsPath3(e.target.value));        
    };

    const handleModeAMPChange = (e) => {
        setLabel('Save');
        dispatch(setSettingsModeAMP2(e.target.checked));           
    };

    const handlePrefixSamplePlateChange = (e) => {
        setLabel('Save');
        dispatch(setSettingsPrefix1(e.target.value));       
    };

    const handlePrefixSeqTubeChange = (e) => {
        setLabel('Save');
        dispatch(setSettingsPrefix2(e.target.value));        
    };

    const handleSaveSettings = () => {
        dispatch(postSettingsData(settings));        
    };

    const handleAllowEditingRunsChange = (e) => {
        setAllowEditingRuns(e.target.checked);
        dispatch(setAllowEditingRunsInProgress(e.target.checked));
        dispatch(setTab2DeleteButtonState(!e.target.checked, false));
        dispatch(setTab2EditButtonState(!e.target.checked, false));
    }

    const handleNotSaveClick = () => {
        handleClose(true);
        setOpen(false);
        setLabel('Close');
        dispatch(setSettingsPath1(settings.path1_backup));
        dispatch(setSettingsPath2(settings.path2_backup));
        dispatch(setSettingsPath3(settings.path3_backup));
        dispatch(setSettingsModeAMP2(settings.modeAMP2_backup));
        dispatch(setSettingsPrefix1(settings.prefixSamplePlate_backup));
        dispatch(setSettingsPrefix2(settings.prefixSeqTube_backup));
    }

    return (
        <div className='row'>
            <div className='col-lg-12 col-md-12 col-sm-12'>
                <Modal
                    disableBackdropClick
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={isOpen}                    
                    onClose={(_, reason) => {                        
                        if (reason != 'escapeKeyDown') {
                            handleCloseClick();
                        }
                        else {
                            handleNotSaveClick();
                        }
                      }}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={isOpen}>
                        <div className='row'>
                            <div className='col-lg-12 col-md-12 col-sm-12'>
                                <Paper className={classes.paper} id="transition-modal-title">
                                    <div className='row'>
                                        <div className='col-lg-6 col-md-6 col-sm-6' style={{ marginTop: '10px' }}>
                                            <FormLabel className={classes.label}>Settings</FormLabel>
                                        </div>
                                        <div className='col-lg-6 col-md-6 col-sm-6 text-right'>
                                            <IconButton onClick={handleNotSaveClick}>
                                                <CloseIcon />
                                            </IconButton>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-lg-12 col-md-12 col-sm-12 text-left'>
                                            <label htmlFor="path1">Sample Sheet Parsing Script:</label>
                                            <div className="input-group mb-3">
                                                <input type="text" id='path1' className="form-control" onChange={handlePath1Change} value={settings.path1} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-lg-12 col-md-12 col-sm-12 text-left'>
                                            <label htmlFor="path2">Sample Sheet folder:</label>
                                            <div className="input-group mb-3">
                                                <input type="text" id='path2' className="form-control" onChange={handlePath2Change} value={settings.path2} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-lg-12 col-md-12 col-sm-12 text-left'>
                                            <label htmlFor="path3">Log file:</label>
                                            <div className="input-group mb-3">
                                                <input type="text" id='path3' className="form-control" onChange={handlePath3Change} value={settings.path3} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row' style={{ height: '35px' }}>
                                        <div className='col-lg-7 col-md-7 col-sm-7 text-left' style={{ verticalAlign: 'middle' }}>
                                            <label className="form-check-label" htmlFor="modeAMPChk">Use Sample Plate Barcode: </label>
                                        </div>
                                        <div className='col-lg-5 col-md-5 col-sm-5 text-left'>
                                            <input type="checkbox" className="form-check-input" id="modeAMP" checked={settings.modeAMP2} onChange={handleModeAMPChange} style={{ marginLeft: '2px' }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-lg-7 col-md-7 col-sm-7 text-left' style={{ verticalAlign: 'middle', marginTop: '5px' }}>
                                            <label htmlFor="prefixSamplePlate">Sample Plate Barcode prefix:</label>
                                        </div>
                                        <div className='col-lg-5 col-md-5 col-sm-5 text-left'>
                                            <div className="input-group mb-3">
                                                <input type="text" id='prefixSamplePlate' className="form-control" onChange={handlePrefixSamplePlateChange} value={settings.prefixSamplePlate} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-lg-7 col-md-7 col-sm-7 text-left' style={{ verticalAlign: 'middle', marginTop: '5px' }}>
                                            <label htmlFor="prefixSeqTube">Sequencing Tube Barcode prefix:</label>
                                        </div>
                                        <div className='col-lg-5 col-md-5 col-sm-5 text-left'>
                                            <div className="input-group mb-3">
                                                <input type="text" id='prefixSeqTube' className="form-control" onChange={handlePrefixSeqTubeChange} value={settings.prefixSeqTube} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row' style={{ height: '35px' }}>
                                        <div className='col-lg-7 col-md-7 col-sm-7 text-left' style={{ verticalAlign: 'middle' }}>
                                            <label className="form-check-label">Allow Editing Runs In Progress:</label>
                                        </div>
                                        <div className='col-lg-5 col-md-5 col-sm-5 text-left'>
                                            <input type="checkbox" className="form-check-input" id="allowEditingRuns" checked={allowEditingRuns} onChange={handleAllowEditingRunsChange} style={{ marginLeft: '2px' }} />
                                        </div>
                                    </div>
                                    <div className='col-lg-12 col-md-12 col-sm-12 text-center'>
                                        <Buttons label={label} click={handleSaveClick} />
                                    </div>
                                </Paper>
                            </div>
                        </div>
                    </Fade>
                </Modal>
            </div>
        </div>
    );
};

export default SettingsMenu;