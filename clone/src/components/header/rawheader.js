import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
//import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProfileMenu from '../profilemenu/profilemenu';
import logo from '../../assets/logo.svg';
import './rawheader.css';
import Upload from '../upload/upload';

const user = <FontAwesomeIcon icon={faBars} style={{ width: "32px", height: "32px" }} />;

const RawHeader = props => {
    const { username, onSettingsClick, onAboutClick } = props;

    return (
        <Navbar className="justify-content-between">
            <Navbar.Brand className="brand" href="#" style={{ marginBottom: 15, height: 50, borderBottom: '0px solid white !important' }}>
                <img src={logo} alt="Ultimagen" style={{ maxHeight: 60 }} />
            </Navbar.Brand>
            <Nav style={{ width: 150 }}>
                <Nav.Link>
                    <ProfileMenu onSettingsClick={onSettingsClick} onAboutClick={onAboutClick} />
                </Nav.Link>
            </Nav>
        </Navbar>
    );
}


export default RawHeader;