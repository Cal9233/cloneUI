import React, { useState } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';

const SearchIn = (props) => {

    const useStyles = makeStyles(theme => ({
        radio: {
            '&$checked': {
                color: '#4B8DF8'
            }
        },
        checked: {}
    }));

    const classes = useStyles();

    const { handleSearchInChange } = props;

    const [selectedOption, setSelectedOption] = useState('0');

    const handleSearchOptionsChange = e => {
        setSelectedOption(e.target.value);
        handleSearchInChange(e.target.value);
    };

    return (
        <FormControl component="fieldset">
            <RadioGroup row aria-label="searchInOptions" name="searchInOptions" value={selectedOption} onChange={handleSearchOptionsChange}>
                <FormControlLabel value={'0'} control={<Radio classes={{root: classes.radio, checked: classes.checked}} />} label="New" />
                <FormControlLabel value={'1'} control={<Radio classes={{root: classes.radio, checked: classes.checked}} />} label="Old" />
                <FormControlLabel value={'2'} control={<Radio classes={{root: classes.radio, checked: classes.checked}} />} label="All" />
            </RadioGroup>
        </FormControl>
    );
};

export default SearchIn;
