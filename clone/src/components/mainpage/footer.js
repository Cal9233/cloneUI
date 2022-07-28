import React, { useState } from 'react';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import Buttons from '../buttons/buttons';
import Container from '@material-ui/core/Container';
import { useDispatch, useSelector } from "react-redux";
/*import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';*/

const Footer = (props) => {
    const { comments, commentsChange, methods,  isSearchMode, handleEditClick, handleCancelClick, handleDeleteClick, isCommentsDisabled } = props;
    
    const isTab1SaveDisabled = useSelector(state => state.buttons.tab1.saveButton.isDisabled);
    const isTab1CancelDisabled = useSelector(state => state.buttons.tab1.cancelButton.isDisabled);   
    const isTab2EditDisabled = useSelector(state => state.buttons.tab2.editButton.isDisabled);
    const isTab2SaveDisabled = useSelector(state => state.buttons.tab2.saveButton.isDisabled);
    const isTabCancelDisabled = useSelector(state => state.buttons.tab2.cancelButton.isDisabled);
    const isTab2DeleteDisabled = useSelector(state => state.buttons.tab2.deleteButton.isDisabled);    

    const useStyles = makeStyles((theme) => ({
        root: {
            marginTop: 20,
            marginBottom: 30
        },
        stickToBottom: {
            //position: 'fixed',
            bottom: 30,
            width: '95%',
            //marginLeft: '12px'
        }
    }));

    const classes = useStyles();

    const handleCommentsChange = (data) => {
        commentsChange(data.target.value);
    };

    return (
        <div className={classes.stickToBottom}>
            <div className='col-lg-12 col-md-12 col-sm-12 text-left' style={isSearchMode ? { marginLeft: 2 } : { marginLeft: 30, marginTop: 10 }}>
                <label htmlFor="comments">Comments (Optional):</label>
                <div className="input-group mb-3" style={{ maxWidth: '100%' }} >
                    <textarea style={isSearchMode ? { height: '127px', maxWidth: '100%' } : { height: '130px' }} disabled={isCommentsDisabled} ref={methods.register()} name="comments" id='comments' className="form-control" onChange={handleCommentsChange} value={comments} />
                </div>
            </div>
            <div className='row'>
                {isSearchMode ?
                    <div className='col-lg-12 col-md-12 col-sm-12' style={{ marginLeft: 8, marginTop: 2 }}>
                        <div className="input-group mb-3">
                            <React.Fragment>
                                <Buttons disabled={isTab2EditDisabled} label='Edit' isSubmitType={false} click={handleEditClick} />
                                <Buttons disabled={isTab2SaveDisabled} label='Save' isSubmitType={true} />
                                <Buttons disabled={isTabCancelDisabled} label='Cancel' isSubmitType={false} click={handleCancelClick}  />
                                <Buttons disabled={isTab2DeleteDisabled} label='Delete' isSubmitType={false} click={handleDeleteClick} />
                            </React.Fragment>
                        </div>
                    </div>
                    :
                    <div className='col-lg-7' style={{ marginLeft: 35, marginTop: 10 }}>
                        <div className="input-group mb-3">
                            <React.Fragment>
                                <Buttons disabled={isTab1SaveDisabled} label='Save' isSubmitType={true} />
                                <Buttons disabled={isTab1CancelDisabled} label='Cancel' isSubmitType={false} click={handleCancelClick}/>
                            </React.Fragment>
                        </div>
                    </div>
                }               
            </div>
        </div>
    );
};

export default Footer;