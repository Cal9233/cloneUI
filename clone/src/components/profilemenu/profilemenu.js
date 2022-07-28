import React, { useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import MenuIcon from '@material-ui/icons/Menu';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import BuildIcon from '@material-ui/icons/Build';
import InfoIcon from '@material-ui/icons/Info';
import Divider from '@material-ui/core/Divider';
import useOnClickOutside from '../../utils/hooks/useOnClickOutside';
import { toggleUploadMenu } from "../actions/index";
import { useDispatch, useSelector } from "react-redux";
import { logOutCurrentUser, resetState } from '../actions/index';

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    customWidth: {
        '& div': {
            // this is just an example, you can use vw, etc.
            width: '150px',
        }
    }
}));

const ProfileMenu = (props) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { onSettingsClick, onAboutClick } = props;

    const dispatch = useDispatch();

    const ref = useRef();
    useOnClickOutside(ref, () => handleMenuClose());

    const current_user = useSelector(state => state.user);    
    const userGroups = current_user.roles != undefined ? current_user.roles.map(m => m.name) : undefined;

    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuSettings = (event) => {
        onSettingsClick(event);
        setAnchorEl(null);
    };

    const handleMenuAbout = (event) => {
        onAboutClick(event);
        setAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMenuLogOut = () => {       
        dispatch(logOutCurrentUser());
        dispatch(resetState());
        setAnchorEl(null);
    };   
    
    const handleMenuUpload = (event) => {
        dispatch(toggleUploadMenu(true));
        setAnchorEl(null);
    };  

 
    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
        PaperProps={{  
            style: {  
              width: 185,  
            },  
         }} 
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            className={classes.customWidth}
        >
            <MenuItem style={{ minWidth: '150px' }} onClick={handleMenuSettings}><BuildIcon style={{ marginRight: 10, fontSize: 'medium' }} /> Settings</MenuItem>
            <MenuItem style={{ minWidth: '150px' }} onClick={handleMenuAbout}><InfoIcon style={{ marginRight: 10, fontSize: 'medium' }} /> About</MenuItem>
            {userGroups != undefined && userGroups.includes("Uploaders") && <MenuItem style={{ minWidth: '150px' }} onClick={handleMenuUpload}><CloudUploadIcon style={{ marginRight: 10, fontSize: 'medium' }} /> Upload</MenuItem>}
            <Divider />
            <MenuItem style={{ minWidth: '150px',marginTop: 8, marginRight: 10, fontSize: 'medium'  }} onClick={handleMenuLogOut}><MeetingRoomIcon style={{ marginRight: 10, fontSize: 'medium' }} /> Log Out</MenuItem>
        </Menu>
    );
    

    return (
        <div className={classes.grow}>
            <IconButton
                ref={ref}
                edge="end"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
            >
                {Boolean(anchorEl) ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>
            {renderMenu}           
        </div>
    );
}

export default ProfileMenu;