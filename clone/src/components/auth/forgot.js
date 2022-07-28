import React from "react";
import API from '../../services/apiService';
import { Button, ButtonGroup } from 'react-bootstrap';
import { useHistory } from "react-router-dom";

const Forgot = props => {
    const [email, setEmail] = React.useState('');
    let history = useHistory();

    const handleInputChange = e => {
        setEmail(e.target.value);       
    };

    const handleCancel = e => {
        e.preventDefault();
        history.push("/");
    };

    const handleSave = e => {
        e.preventDefault();
        const body = { 'email': email };
        API.forgot(body);
    };

    return (
        <React.Fragment>
            <div className="submit-form">
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        required
                        value={email}
                        onChange={handleInputChange}
                        name="email"
                    />
                </div>

                <div className='text-center'>
                    <ButtonGroup aria-label="GridButtons" style={{ margin: 20 }}>
                        <button variant="secondary" style={{ margin: 10 }} onClick={handleSave} className="main-button">Reset Password</button>
                        <button variant="secondary" style={{ margin: 10 }} onClick={handleCancel} className="main-button">Cancel</button>
                    </ButtonGroup>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Forgot;