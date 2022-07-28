import React from 'react';

const Header = props => {
    const {headerName, setHeaderName} = props;
    return <input type='text' value={headerName} onChange={setHeaderName} />;
}

export default Header;