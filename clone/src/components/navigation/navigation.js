import React, { Fragment, useState, useEffect, useRef } from 'react';
import './navigation.css';
import { makeStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router } from 'react-router-dom';
import RawHeader from '../header/rawheader';
import SettingsMenu from '../settingsmenu/settingsmenu';
import SearchMenu from '../searchmenu/searchmenu';
import Container from '@material-ui/core/Container';
import Spinner from '../spinner/spinner';
import Notification from '../notification/notification';
import Paper from '@material-ui/core/Paper';
import Tab1 from '../tabs/tab1';
import Tab2 from '../tabs/tab2';
import { Tabs, Tab } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import About from '../about/about';
import { setActiveTab } from "../actions/index";
import Upload from '../upload/upload';

const Navigation = props => {
    const [open, setOpen] = useState(false);
    const [openAbout, setOpenAbout] = useState(false);    
    const [tabValue, setTabValue] = React.useState(1);
    const [searchMenuOpen, setSearchMenuOpen] = useState(false);

    const error = useSelector(state => state.error);
    const isLoading = useSelector(state => state.isLoading);
    const isTab1Disabled = useSelector(state => state.tabs.isTab1Disabled);
    const isTab2Disabled = useSelector(state => state.tabs.isTab2Disabled); 

    const username = useSelector(state => state.user);
    const state = useSelector(state => state);

    const dispatch = useDispatch();

    const useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
            marginTop: 15
        },
        label: {
            marginLeft: 5,
            textAlign: 'left !important'
        },
        scan: {
            position: 'absolute',
            right: '2%',
            top: '18%'
        },
        divider: {
            marginTop: 10,
            marginBottom: 10
        },
        paper: {
            marginBottom: '20px'
        },
    }));

    const classes = useStyles();

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpenAbout = () => {
        setOpenAbout(true);
    };

    const handleCloseAbout = () => {
        setOpenAbout(false);
    };

    const onTabSelect = key => {
        setTabValue(key);
        dispatch(setActiveTab(key));

    }

    const handleSearchMenuClose = () => {
        setSearchMenuOpen(false);
    };

    const handleSearchMenuOpen = () => {
        setSearchMenuOpen(true);
    }

    return (
        <div className='col-lg-12'>
            <Router forceRefresh={false}>
                <Fragment>
                    <Container maxWidth="xl" style={{ marginBottom: '10px', marginTop: '5px' }}>
                        <Paper elevation={1} >
                            <RawHeader username={`${username.first_name} ${username.last_name}`} onSettingsClick={handleOpen} onAboutClick={handleOpenAbout} />
                            <SettingsMenu isOpen={open} handleOpen={handleOpen} handleClose={handleClose} />
                            <SearchMenu isOpen={searchMenuOpen} handleOpen={handleSearchMenuOpen} handleClose={handleSearchMenuClose} />
                            <About isOpen={openAbout} handleOpen={handleOpenAbout} handleClose={handleCloseAbout} />
                            <Upload />
                            {isLoading ? <Spinner /> : <div style={{ height: 5 }}></div>}
                        </Paper>
                    </Container>
                    <Container maxWidth="xl">
                        <Fragment>
                            <Notification />
                            <Tabs
                                className="myClass"
                                id="controlled-tab"
                                activeKey={tabValue}
                                onSelect={onTabSelect}
                            >
                                <Tab eventKey="1" title="New Samples" disabled={isTab1Disabled}>
                                    <Paper elevation={3} className={classes.paper}>
                                        <Tab1 key='tab1' isSearchMode={false} />
                                    </Paper>
                                </Tab>
                                <Tab eventKey="2" title="View/Edit Records" disabled={isTab2Disabled}>
                                    <Paper elevation={3} className={classes.paper}>
                                        <Tab2 key='tab2' handleSearchClickMenu={handleSearchMenuOpen} isSearchMode={true} />
                                    </Paper>
                                </Tab>
                            </Tabs>
                        </Fragment>
                    </Container>
                </Fragment>
            </Router>
        </div>
    )
}

export default Navigation;