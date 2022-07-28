import React, {useState} from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { setFilterMultiSearchValue } from "../actions/index";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';

const RadioButton = (props) => {
    const useStyles = makeStyles(theme => ({
        radio: {
            '&$checked': {
                color: '#4B8DF8'
            }
        },
        checked: {}
    }));

    const classes = useStyles();

    const multiSearchValue = useSelector(state => state.filters.multiSearchValue);
    const dispatch = useDispatch();

    const handleSearchOptionsChange = e => {
        dispatch(setFilterMultiSearchValue(e.target.value));        
    };
     
    return (
        <FormControl component="fieldset">
            <FormLabel component="legend" style={{color: '#008196'}}>Search:</FormLabel>
            <RadioGroup aria-label="searchOptions" name="searchOptions" value={multiSearchValue} onChange={handleSearchOptionsChange}>
                <FormControlLabel value={'0'} control={<Radio classes={{root: classes.radio, checked: classes.checked}} />} label="Words" />
                <FormControlLabel value={'1'} control={<Radio classes={{root: classes.radio, checked: classes.checked}} />} label="Exact match" />
                <FormControlLabel value={'2'} control={<Radio classes={{root: classes.radio, checked: classes.checked}} />} label="Fragment" />
            </RadioGroup>
        </FormControl>
    );
};

export default RadioButton;
