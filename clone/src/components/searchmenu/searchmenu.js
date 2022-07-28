import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Buttons from '../buttons/buttons';
import Api from "../../services/apiService";
import ReactDataGrid from 'react-data-grid';
import Select from "react-select";
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import RadioButton from '../buttons/radiobutton';
import SearchIn from '../buttons/searchin';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { FormLabel } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { searchData } from "../../services/apiServiceFetch";
import {
    setFilterSearchIn, setFilterFilterBy, setFilterSearchText, setFilterDateFrom, setFilterDateTo, setFilterMultiSearchValue, runSearch, setIsLoading, setAlert,
    hideForm2Fields, setTab2ClearButtonState, highlightSample, setAllFieldsDisabled, setTab2DeleteButtonState
} from "../actions/index";
import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    paper: {
        width: 700,
        //height: 800,
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    label: {
        fontSize: 'large',
        color: '#008196',
        marginBottom: '15px'
    },
}));


const SearchMenu = (props) => {
    const classes = useStyles();
    const { isOpen, handleClose } = props;
    const [rows, setRows] = useState([]);
    const [selectedIndexes, setSelectedIndexes] = useState([-1]);

    const filters = useSelector(state => state.filters);
    const rowsData = useSelector(state => state.filterByRowData);
    const dispatch = useDispatch();

    const state = useSelector(state => state);

    useEffect(() => {
        var filterOut = rowsData.filter(f => f.Id != 8 && f.Id != 9 && f.Id != 10 && f.Id != 11);
        setRows(filters.searchIn == 0 ? filterOut : rowsData);
        dispatch(setFilterFilterBy(-1, 'text', false));
        dispatch(setFilterSearchIn(0));
        dispatch(setFilterSearchText(''));
        dispatch(setFilterDateFrom(''));
        dispatch(setFilterDateTo(''));
        dispatch(setFilterMultiSearchValue('0'));
        dispatch(setAllFieldsDisabled(true));
    }, []);

    useEffect(() => {  
        var filterOut = rowsData.filter(f => f.Id != 8 && f.Id != 9 && f.Id != 10 && f.Id != 11);      
        setRows(filters.searchIn != 0 ? rowsData : filterOut);        
    }, [filters.searchIn]);

    useEffect(() => {  
        dispatch(setFilterSearchText(''));      
    }, [filters.filterBy]);

    useEffect(() => {
        dispatch(setFilterFilterBy(-1, 'text', false));
        dispatch(setFilterSearchIn(0));
        dispatch(setFilterSearchText(''));
        dispatch(setFilterDateFrom(''));
        dispatch(setFilterDateTo(''));
        dispatch(setFilterMultiSearchValue('0'));
        dispatch(setAllFieldsDisabled(true));
    }, [isOpen]);

    const columns = [{ key: 'Name', name: 'Filter By:', editable: false, sortable: false }];

    const methods = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {},
        resolver: undefined,
        context: undefined,
        criteriaMode: "firstError",
        shouldFocusError: true,
        shouldUnregister: true,
    });

    const onSubmit = () => {
        if (filters.filterBy === -1) {
            var dt = { 'searchIn': filters.searchIn, 'filterBy': filters.filterBy, 'multiSearch': filters.isMultiSearchEnabled, 'multiSearchOptionValue': filters.multiSearchValue };
            submitData(dt);
        }
        else if (filters.searchIn == 0 && filters.filterByFieldType === 'date') {
            var dt = { 'dateFrom': filters.dateFrom, 'dateTo': filters.dateTo, 'searchIn': filters.searchIn, 'filterBy': filters.filterBy, 'multiSearch': filters.isMultiSearchEnabled, 'multiSearchOptionValue': filters.multiSearchValue };
            submitData(dt);
        }
        else {
            var dt = filters.filterByFieldType === 'text' ? { 'searchText': filters.searchText, 'searchIn': filters.searchIn, 'filterBy': filters.filterBy, 'multiSearch': filters.isMultiSearchEnabled, 'multiSearchOptionValue': filters.multiSearchValue } :
                { 'dateFrom': filters.dateFrom, 'dateTo': filters.dateTo, 'searchIn': filters.searchIn, 'filterBy': filters.filterBy, 'multiSearch': filters.isMultiSearchEnabled, 'multiSearchOptionValue': filters.multiSearchValue };
            submitData(dt);
        }
    };

    const submitData = (data) => {
        if (data) {
            try {
                dispatch(setIsLoading(true));
                searchData(data)
                    .then(r => r.json())
                    .then((data) => {
                        dispatch(setIsLoading(false));
                        if (data.length) {
                            if (data != undefined) {
                                data.map(m => {
                                    if (m.Sequencing_Recipe_Inactive_Since != null)
                                        m.Sequencing_Recipe_Name = `${m.Sequencing_Recipe_Name}_${new Date(m.Sequencing_Recipe_Name).toLocaleDateString()}_${new Date(m.Sequencing_Recipe_Inactive_Since).toLocaleTimeString()}`;
                                    if (m.Analysis_Recipe_Inactive_Since != null)
                                        m.Analysis_Recipe_Name = `${m.Analysis_Recipe_Name}_${new Date(m.Analysis_Recipe_Inactive_Since).toLocaleDateString()}_${new Date(m.Analysis_Recipe_Inactive_Since).toLocaleTimeString()}`;
                                });
                            }
                            dispatch(runSearch(data));
                            if (filters.filterBy == 3)
                                dispatch(highlightSample(filters.searchText));
                            handleClose();
                            dispatch(hideForm2Fields(false));
                            dispatch(setTab2ClearButtonState(false, false));
                            dispatch(setTab2DeleteButtonState(data[0].AMP_Run_Start != null ? true : false, false));
                            //dispatch(setTab2DeleteButtonState(state.record.isRecordOld ? true : false, false));
                            dispatch(setAllFieldsDisabled(true));
                        }
                        else {
                            if (filters.filterBy != -1) {
                                var msg = `${rows.find(f => f.Id === filters.filterBy) != undefined ? rows.find(f => f.Id === filters.filterBy).Name : ''} ${filters.filterByFieldType === 'text' ? '=' : 'from'} '${filters.filterByFieldType === 'text' ? filters.searchText : `${filters.dateFrom} to ${filters.dateTo}`}' in ${searchInOptions.find(f => f.value === filters.searchIn) != undefined ? searchInOptions.find(f => f.value === filters.searchIn).label : ''} Records`;
                                dispatch(setAlert(msg, 'Not Found', 'warning'));
                            }
                            else {
                                dispatch(setAlert('No Records Found', 'Not Found', 'warning'));
                            }
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        dispatch(setIsLoading(false));
                        dispatch(setAlert(err.response != undefined ? err.response.data : err.stack, err.message, 'error'));
                    });
            }
            catch (err) {
                console.log(err);
                dispatch(setIsLoading(false));
                dispatch(setAlert(err.response != undefined ? err.response.data : err.stack, err.message, 'error'));
            }
        }
    };

    const onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        setRows(state => {
            for (let i = fromRow; i <= toRow; i++) {
                rows[i] = { ...rows[i], ...updated };
            }
            return { rows };
        });
    };

    const handleSearchTextChange = e => {
        dispatch(setFilterSearchText(e.target.value));
    };

    const searchInOptions = [{ 'value': 0, 'label': 'New' }, { 'value': 1, 'label': 'Old' }, { 'value': 2, 'label': 'All' }];

    const handleSearchInChange = (e) => {
        //setSelecteSearchIn(e.value);
        dispatch(setFilterSearchIn(parseInt(e)));
    };

    const handleDateFromChange = e => {
        dispatch(setFilterDateFrom(e.target.value));
    }

    const handleDateToChange = e => {
        dispatch(setFilterDateTo(e.target.value));
    }

    const onRowClick = (rowIdx, row) => {
        setSelectedIndexes([]);
        setSelectedIndexes(rowIdx);
        dispatch(setFilterFilterBy(row.Id, row.fieldType, row.multiSearch));
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
                    onClose={handleClose}
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
                                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                                        <div className='row'>
                                            <div className='col-lg-6 col-md-6 col-sm-6' style={{ marginTop: '15px' }}>
                                                <FormLabel className={classes.label}>Search Records</FormLabel>
                                            </div>
                                            <div className='col-lg-6 col-md-6 col-sm-6 text-right'>
                                                <IconButton onClick={handleClose}>
                                                    <CloseIcon />
                                                </IconButton>
                                            </div>
                                        </div>
                                        <Card variant="outlined">
                                            <CardContent id="transition-modal-description">
                                                <div className='row'>
                                                    <div className='col-lg-12'>
                                                       <div className='row'>
                                                       <div className='col-lg-1'>
                                                            <FormLabel component="legend" style={{color: '#008196', marginTop: '14px'}}>Type:</FormLabel>                                                            
                                                        </div>      
                                                        <div className='col-lg-11'>                                                        
                                                            <SearchIn options={searchInOptions} handleSearchInChange={handleSearchInChange} value={searchInOptions.filter(option => option.value === filters.searchIn)}/>
                                                        </div>  
                                                        </div>                                                 
                                                    </div>
                                                </div>
                                                <div className='row'>
                                                    <div className='col-lg-5 col-md-5 col-sm-5'>
                                                        <ReactDataGrid
                                                            columns={columns}
                                                            rowGetter={i => rows[i]}
                                                            rowsCount={rows.length}
                                                            minHeight={457}
                                                            enableCellSelect={true}
                                                            onGridRowsUpdated={onGridRowsUpdated}
                                                            enableRowSelect='single'
                                                            onRowClick={onRowClick}
                                                            rowSelection={{
                                                                showCheckbox: false,
                                                                selectBy: {
                                                                    indexes: selectedIndexes
                                                                }
                                                            }}
                                                            //rowRenderer={RowRenderer}
                                                            enableCellAutoFocus={true}
                                                        />
                                                    </div>
                                                    <div className='col-lg-1 col-md-1 col-sm-1'></div>
                                                    <div className='col-lg-5 col-md-5 col-sm-5'>
                                                        {filters.filterByFieldType === 'text' ?
                                                            <div className='row'>
                                                                {filters.filterBy != -1 &&
                                                                    <div className='col-lg-12 col-md-12 col-sm-12' style={{ marginTop: '100px' }}>
                                                                        <label htmlFor='searchText'>Text</label>
                                                                        <div className="input-group mb-3" >
                                                                            <input type='text' id='searchText' className="form-control" onChange={handleSearchTextChange} value={filters.searchText} />
                                                                        </div>
                                                                    </div>
                                                                }
                                                                {filters.isMultiSearchEnabled &&
                                                                    <div className='col-lg-12 col-md-12 col-sm-12' style={{ marginTop: '10px' }}>
                                                                        <div className="input-group mb-3" >
                                                                            <RadioButton />
                                                                        </div>
                                                                    </div>
                                                                }
                                                            </div>
                                                            :
                                                            <div className='row'>
                                                                {filters.searchIn != 0 &&
                                                                    <div className='col-lg-12 col-md-12 col-sm-12' style={{ marginTop: '100px' }}>
                                                                        <label htmlFor='searchText'>Time</label>
                                                                        <div className="input-group mb-3" >
                                                                            <TextField
                                                                                fullWidth={true}
                                                                                id="dateFrom"
                                                                                label="From:"
                                                                                type="date"
                                                                                //defaultValue={new Date().toISOString().slice(0, 10)}
                                                                                className={classes.textField}
                                                                                InputLabelProps={{
                                                                                    shrink: true,
                                                                                }}
                                                                                onChange={handleDateFromChange}
                                                                                value={filters.dateFrom}
                                                                            //required 
                                                                            //ref={methods.register({ required: selectedSearchIn != 0, name: 'dateFrom' })}
                                                                            />
                                                                        </div>
                                                                        <div className="input-group mb-3" style={{ marginTop: '50px' }}>
                                                                            <TextField
                                                                                fullWidth={true}
                                                                                id="dateTo"
                                                                                label="To:"
                                                                                type="date"
                                                                                //defaultValue={new Date().toISOString().slice(0, 10)}
                                                                                className={classes.textField}
                                                                                InputLabelProps={{
                                                                                    shrink: true,
                                                                                }}
                                                                                onChange={handleDateToChange}
                                                                                value={filters.dateTo}
                                                                            //required 
                                                                            //ref={methods.register({ required: selectedSearchIn != 0, name: 'dateTo'   })}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                }
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                                <div className='row' style={{ marginTop: 20 }}>
                                                    <div className='col-lg-6 col-md-6 col-sm-6 text-right'>
                                                        <Buttons label={'Ok'} isSubmitType={true} width='150px' />
                                                    </div>
                                                    <div className='col-lg-6 col-md-6 col-sm-6 text-left'>
                                                        <Buttons label={'Cancel'} click={handleClose} width='150px' />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </form>
                                </Paper>
                            </div>
                        </div>
                    </Fade>
                </Modal>
            </div>
        </div>
    );
};

export default SearchMenu;