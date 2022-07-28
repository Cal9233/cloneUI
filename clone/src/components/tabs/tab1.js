import React, { Fragment, useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { makeStyles, withStyles } from '@material-ui/core/styles';
//import Api from "../../services/apiService";
import { getSequencingRecipeList, getAnalysisRecipeList, getSamplePairs, getRunsBySamplePlate, getRunsBySeqTube, getLibraryIndexesByLibraryPool, postLibraryAllData } from "../../services/apiServiceFetch";
import config from '../../utils/config';
import Footer from '../mainpage/footer';
import SampleSheet from '../samplesheet/samplesheet';
import Recipes from '../recipes/recipes';
import scan from '../../assets/scan.png';
import { disableTab, setTab1SaveButtonState, setTab1CancelButtonState, setIsLoading, setAlert, checkPrefix1, checkPrefix2, getSettingsData, setAllFieldsDisabled, setTableData, setTableDataTab1, setTableColumns, setTableColumnsTab1 } from "../actions/index";
import { useDispatch, useSelector } from "react-redux";
import LightTooltip from "../tooltip/lighttooltip";
import Alert from '@material-ui/lab/Alert';
import SampleSheetTable from '../samplesheet/samplesheettable';
import SampleSheetDropDown from '../samplesheetdropdown/samplesheetdropdown';

const Tab1 = props => {
    const { loading, isSearchMode } = props;

    const [prefix1Error, setPrefix1Error] = useState(false);
    const [prefix2Error, setPrefix2Error] = useState(false);
    const [numericValidationError, setNumericValidationError] = useState(false);
    const [analysisRecipe, setAnalysisRecipe] = useState('');
    const [sequencingRecipe, setSequencingRecipe] = useState('');
    const [libraryPool, setLibraryPool] = useState('');
    const [importedLibraryPool, setImportedLibraryPool] = useState(null);
    const [samplePlateId, setSamplePlateId] = useState('');
    const [seqTubeId, setSeqTubeId] = useState('');
    const [libraryData, setLibraryData] = useState([]);
    const [libraryDataGlobal, setLibraryDataGlobal] = useState([]);
    const [preAmpReagents, setPreAmpReagents] = useState('');
    const [isFound, setIsFound] = useState(false);
    const [comments, setComments] = useState('');
    const [libraryPoolLabel, setLibraryPoolLabel] = useState('Library Pool:');

    const state = useSelector(state => state);
    const prefix1 = useSelector(state => state.settings.isPrefixedSamplePlateCorrectly);
    const prefix2 = useSelector(state => state.settings.isPrefixedSeqTubeCorrectly);
    const isSeqTubeBarcodeValidated = useSelector(state => state.settings.isSeqTubeBarcodeValidated);
    const dispatch = useDispatch();

    useEffect(() => {
        setSamplePlateId("");
        setSeqTubeId("");
    }, [state.settings.modeAMP2]);    

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
        arrow: {
            color: theme.palette.common.white
        }
    }));

    const classes = useStyles();

    const checkRunExistsByLibPoolId = async (id) => {
        if (id != null && id != undefined && id != '') {
            try {
                dispatch(setIsLoading(true));
                dispatch(setTableDataTab1([]));
                setLibraryDataGlobal([]);
                dispatch(setTableColumnsTab1([]));
                dispatch(setTab1CancelButtonState(false, false));
                var api_token;
                var api_url;
                if (process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'development') {
                    api_token = config.JWT.api_token;
                }
                else api_token = config.JWT.api_token_prod;
                if (process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'development') {
                    api_url = config.API_URL_DEV;
                }
                else api_url = config.API_URL_PROD;

                await fetch(`${api_url}/runs/libpool/${id}`, {
                    method: 'GET',
                    mode: 'cors',
                    withCredentials: true,
                    //credentials: 'include',
                    headers: {
                        'Authorization': api_token,
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'http://localhost:1000'
                    }
                })
                    .then(r => r.json())
                    .then(async data => {
                        if (data.length >= 1) {
                            dispatch(setIsLoading(false));
                            dispatch(setAlert(`Library Pool ${id} already exists`, `Already exists `, 'warning'));
                        }
                        else {
                            var url;
                            if (process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'development') {
                                url = config.API_URL_USER_PLUGIN_DEV;
                            }
                            else url = config.API_URL_USER_PLUGIN_TEST;
                            await fetch(`${url}/data/${id}`, {
                                method: 'GET',
                                mode: 'cors',
                                withCredentials: true,
                                //credentials: 'include',
                                headers: {
                                    'Authorization': api_token,
                                    'Content-Type': 'application/json',
                                    'Access-Control-Allow-Origin': 'http://localhost:1000'
                                }
                            })
                                .then(r => r.json())
                                .then(data => {
                                    if (data.Message === undefined) {
                                        dispatch(setIsLoading(false));
                                        if (data != undefined && data != '') {
                                            var data = JSON.parse(data);
                                            if (data.Item1 != undefined && data.Item1.length) {
                                                //data.Item1 = data.Item1.map(({Item4, ...keepAttrs}) => keepAttrs);   
                                                data.Item1.map((m, i) => {                                                                                                  
                                                    if (m.Item4) {
                                                        m.Item4.map(item => {
                                                            data.Item1[i] = {...data.Item1[i], ...{[item.Item1] : item.Item2}};
                                                        });
                                                    }
                                                   
                                                });                                                
                                                data.Item1 = data.Item1.map(({Item4, ...keepAttrs}) => keepAttrs);
                                                const organize = ({ Item1, Item2, Item3, ...object }) => ({ Item1, Item2, Item3, ...object, });
                                                data.Item1 = data.Item1.map(m => organize(m));                                               
                                            }
                                            dispatch(setTab1SaveButtonState(false, false));

                                            dispatch(setAllFieldsDisabled(false));

                                            //setLibraryData(data.Item1);                                           
                                           /* if (data.Item1 != undefined) {
                                                data.Item1 = data.Item1.map(item => {
                                                    Object.defineProperty(item, 'Index', Object.getOwnPropertyDescriptor(item, 'Item2'));
                                                    delete item['Item2'];
                                                    Object.defineProperty(item, 'Sample', Object.getOwnPropertyDescriptor(item, 'Item1'));
                                                    delete item['Item1'];
                                                    Object.defineProperty(item, 'Sequence', Object.getOwnPropertyDescriptor(item, 'Item3'));
                                                    delete item['Item3'];
                                                    return item;
                                                })
                                            }        */                                    
                                            dispatch(setTableDataTab1(data.Item1));
                                            setLibraryDataGlobal(data.Item2);                                           

                                            setIsFound(true);

                                            dispatch(disableTab(false, true));

                                            if (state.settings.modeAMP2 == false) {
                                                const nextInput = document.querySelector(
                                                    `input[id=SeqTubeId]`
                                                );
                                                if (nextInput !== null) {
                                                    if (nextInput.value == '')
                                                        nextInput.focus();
                                                };
                                            }
                                            else if (state.settings.modeAMP2) {
                                                const nextInput = document.querySelector(
                                                    `input[id=samplePlateId]`
                                                );
                                                const nextInputST = document.querySelector(
                                                    `input[id=SeqTubeId]`
                                                );
                                                if (nextInput !== null && nextInputST != null) {
                                                    if (nextInput.value == '')
                                                        nextInput.focus();
                                                    else nextInputST.focus();
                                                };
                                            }
                                        }
                                        else {
                                            dispatch(setIsLoading(false));
                                            dispatch(setAlert(`Library Pool = ${id}`, 'Not Found', 'warning'));
                                            clearAllFieldsExceptLibPool();
                                            //setIsAllFieldsDisabled(true);
                                            dispatch(setAllFieldsDisabled(true));
                                            setIsFound(false);
                                            dispatch(disableTab(false, false));
                                            dispatch(setTab1SaveButtonState(true, false));
                                        }
                                    }
                                    else {
                                        dispatch(setIsLoading(false));
                                        //setLibraryData([]);
                                        dispatch(setTableDataTab1([]));
                                        dispatch(setTableColumnsTab1([]));
                                        setLibraryDataGlobal([]);
                                        setIsFound(false);
                                        dispatch(setAlert(data.Message, 'Error', 'error'));
                                        dispatch(disableTab(false, false));
                                    }
                                }).catch((err) => {
                                    console.log(err);
                                    dispatch(setIsLoading(false));
                                    //setLibraryData([]);
                                    dispatch(setTableDataTab1([]));
                                    dispatch(setTableColumnsTab1([]));
                                    setLibraryDataGlobal([]);
                                    setIsFound(false);
                                    dispatch(setAlert(err.response != undefined ? err.response.data : err.stack, err.message, 'error'));
                                    dispatch(disableTab(false, false));
                                });
                        }

                    }).catch(err => {
                        console.log(err);
                        dispatch(setIsLoading(false));
                        handleCancelClick();
                        dispatch(setAlert(err.response != undefined ? err.response.data : err.stack, err.message, 'error'));
                    });
            }
            catch (e) {
                console.log(e);
                dispatch(setIsLoading(false));
                handleCancelClick();
            }
        }
        else {
            dispatch(setIsLoading(false));
            handleCancelClick();
        }
    };

    const checkRunExistsBySamplePlateIdAndSeqTubeId = (samplePlate, seqTube) => {
        try {
            if (samplePlate != null && samplePlate != undefined && samplePlate != '') {
                dispatch(setIsLoading(true));
                //dispatch(setTableDataTab1([]));
                //dispatch(setTableColumnsTab1([]));
                setLibraryDataGlobal([]);
                getRunsBySamplePlate(samplePlate)
                    .then((data) => {
                        dispatch(setIsLoading(false));
                        if (data != undefined) {
                            if (data.length >= 1) {
                                dispatch(setAlert(`Sample Plate ${samplePlate} already exists`, 'Already exists', 'warning'));
                                var nextInput = document.querySelector(
                                    `input[id=samplePlateId]`
                                );
                                if (nextInput !== null) {
                                    nextInput.focus();
                                };
                                setSamplePlateId('');
                            }
                            else {
                                if (!state.settings.modeAMP2 && seqTube != null && seqTube != undefined && seqTube != '') {
                                    getRunsBySeqTube(seqTube)
                                        .then((data) => {
                                            dispatch(setIsLoading(false));
                                            if (data != undefined) {
                                                if (data.length >= 1) {
                                                    dispatch(setAlert(`Sequencing Tube ${seqTube} already exists`, 'Already exists', 'warning'));
                                                    var nextInput = document.querySelector(
                                                        `input[id=SeqTubeId]`
                                                    );
                                                    if (nextInput !== null) {
                                                        nextInput.focus();
                                                    };
                                                    setSeqTubeId('');
                                                }
                                                else {
                                                    var dt = { libraryPool, samplePlateId, seqTubeId, preAmpReagents, comments, sequencingRecipe, analysisRecipe, libraryData: state.table.data_tab1, libraryDataGlobal };
                                                    submitData(dt);
                                                }
                                            }
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                            dispatch(setIsLoading(false));
                                            handleCancelClick();
                                            dispatch(setAlert(err.response != undefined ? err.response.data : err.stack, err.message, 'error'));
                                        });
                                }
                                else {
                                    var dt = { libraryPool, samplePlateId, preAmpReagents, comments, sequencingRecipe, analysisRecipe, libraryData: state.table.data_tab1, libraryDataGlobal };
                                    submitData(dt);
                                }
                            }
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        dispatch(setIsLoading(false));
                        handleCancelClick();
                        dispatch(setAlert(err.response != undefined ? err.response.data : err.stack, err.message, 'error'));
                    });
            }
        }
        catch (e) {
            console.log(e);
            dispatch(setIsLoading(false));
            handleCancelClick();
        }
    };

    const checkRunExistsBySeqTubeId = (id) => {
        if (id != null && id != undefined && id != '') {
            try {
                dispatch(setIsLoading(true));
                //dispatch(setTableDataTab1([]));
               // setLibraryDataGlobal([]);
                //dispatch(setTableColumnsTab1([]));
                getRunsBySeqTube(id)
                    .then((data) => {
                        dispatch(setIsLoading(false));
                        if (data != undefined) {
                            if (data.length >= 1) {
                                dispatch(setAlert(`Sequencing Tube ${id} already exists`, 'Already exists', 'warning'));
                                var nextInput = document.querySelector(
                                    `input[id=SeqTubeId]`
                                );
                                if (nextInput !== null) {
                                    nextInput.focus();
                                };
                                setSeqTubeId('');
                            }
                            else {
                                var dt = { libraryPool, /*samplePlateId,*/ seqTubeId, preAmpReagents, comments, sequencingRecipe, analysisRecipe, libraryData: state.table.data_tab1, libraryDataGlobal };
                                submitData(dt);
                            }
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        dispatch(setIsLoading(false));
                        handleCancelClick();
                        dispatch(setAlert(err.response != undefined ? err.response.data : err.stack, err.message, 'error'));
                    });
            }
            catch (e) {
                console.log(e);
                handleCancelClick();
                dispatch(setIsLoading(false));
            }
        }
        else {
            handleCancelClick();
            dispatch(setIsLoading(false));
        }
    };

    const onSubmit = () => {
        if (state.settings.modeAMP2 && prefix1 && libraryPool === importedLibraryPool) {
            if ((libraryPool == '' || samplePlateId == '' || sequencingRecipe == '' || analysisRecipe == '')) {
                dispatch(setAlert(`please fill mandatory fields`, 'Values are required ', 'warning'));
            }
            else {
                if (samplePlateId != '') {
                    checkRunExistsBySamplePlateIdAndSeqTubeId(samplePlateId, seqTubeId);
                }
            }
        }
        else if (!state.settings.modeAMP2 && prefix2 && libraryPool === importedLibraryPool) {
            if (libraryPool == '' || seqTubeId == '' || sequencingRecipe == '' || analysisRecipe == '') {
                dispatch(setAlert(`please fill mandatory fields`, 'Values are required ', 'warning'));
            }
            else {
                if (seqTubeId != '') {
                    checkRunExistsBySeqTubeId(seqTubeId);
                }
            }
        }
        else if (libraryPool != importedLibraryPool) {
            dispatch(setAlert(`Please re-import the Sample Sheet`, 'Warning', 'warning'));
            var nextInput = document.querySelector(
                `input[id=libraryPoolId]`
            );
            if (nextInput !== null) {
                nextInput.focus();
            };
        }

        /*if (prefix1 == undefined && prefix2 == undefined) {
            if (state.settings.modeAMP2) {                
                if ((libraryPool == '' || samplePlateId == '' || sequencingRecipe == '' || analysisRecipe == '')) {
                    dispatch(setAlert(`please fill mandatory fields`, 'Values are required ', 'warning'));
                }
                else {
                    if (samplePlateId != '') {
                        checkRunExistsBySamplePlateIdAndSeqTubeId(samplePlateId, seqTubeId);
                    }
                }
            }
            else {
                if (libraryPool == '' || seqTubeId == '' || sequencingRecipe == '' || analysisRecipe == '') {
                    dispatch(setAlert(`please fill mandatory fields`, 'Values are required ', 'warning'));
                }
                else {
                    if (seqTubeId != '') {
                        checkRunExistsBySeqTubeId(seqTubeId);
                    }
                }
            }
        }
        else {
            if (!state.settings.modeAMP2 && prefix1 == undefined || state.settings.modeAMP2 && prefix2 == undefined) {
                if (state.settings.modeAMP2) {                    
                    if ((libraryPool == '' || samplePlateId == '' || sequencingRecipe == '' || analysisRecipe == '')) {
                        dispatch(setAlert(`please fill mandatory fields`, 'Values are required ', 'warning'));
                    }
                    else {
                        if (samplePlateId != '') {
                            checkRunExistsBySamplePlateIdAndSeqTubeId(samplePlateId, seqTubeId);
                        }
                    }
                }
                else {
                    if (libraryPool == '' || seqTubeId == '' || sequencingRecipe == '' || analysisRecipe == '') {
                        dispatch(setAlert(`please fill mandatory fields`, 'Values are required ', 'warning'));
                    }
                    else {
                        if (seqTubeId != '') {
                            checkRunExistsBySeqTubeId(seqTubeId);
                        }
                    }
                }
            }
        }   */
    };

    const submitData = (data) => {
        if (data) {
            const id = data.libraryPool;
            if (id != null && id != undefined && id != '') {
                try {
                    dispatch(setIsLoading(true));
                    postLibraryAllData(data)
                        .then((response) => {
                            if (response.status === 200) {
                                dispatch(setIsLoading(false));
                                clearAllFields();
                                dispatch(setAlert("Saved successfully", 'Success', 'success'));
                                handleCancelClick();
                                var nextInput = document.querySelector(
                                    `input[id=libraryPoolId]`
                                );
                                if (nextInput !== null) {
                                    nextInput.focus();
                                };
                                dispatch(disableTab(false, false));
                                setImportedLibraryPool(null);
                            }
                            else {
                                dispatch(setIsLoading(false));
                                dispatch(setAlert(response.statusText, response.status, 'error'));
                                dispatch(disableTab(false, false));
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                            dispatch(setIsLoading(false));
                            dispatch(setAlert(err.response != undefined ? err.response.data : err.stack, err.message, 'error'));
                            dispatch(disableTab(false, false));
                            setImportedLibraryPool(null);
                        });
                }
                catch (e) {
                    console.log(e);
                    dispatch(setIsLoading(false));
                    dispatch(disableTab(false, false));
                    setImportedLibraryPool(null);
                }
            }
            else {
                dispatch(setIsLoading(false));
                dispatch(disableTab(false, false));
                setImportedLibraryPool(null);
            }
        }
    };

    const clearAllFieldsExceptLibPool = () => {
        //setLibraryData([]);
        dispatch(setTableDataTab1([]));
        setLibraryDataGlobal([]);
        setSamplePlateId('');
        setSeqTubeId('');
        setPreAmpReagents('');
        setAnalysisRecipe('');
        setSequencingRecipe('');
        setComments('');
    };

    const clearAllFields = () => {
        //setLibraryData([]);
        dispatch(setTableDataTab1([]));
        setLibraryDataGlobal([]);
        setLibraryPool('');
        setSamplePlateId('');
        setSeqTubeId('');
        setPreAmpReagents('');
        setAnalysisRecipe('');
        setSequencingRecipe('');
        setComments('');
    };

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

    const handleLibraryPoolChange = (data) => {
        setLibraryPool(data.target.value);
    };

    const handleLibraryPoolKeyDown = e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            checkRunExistsByLibPoolId(libraryPool);
            setImportedLibraryPool(libraryPool);
        }
        else if (e.key === 'Escape') {
            setLibraryPool('');
            setImportedLibraryPool(null);
        }
    }

    const handleSamplePlateIdChange = (data) => {
        var inputVal = data.target.value;
        if (inputVal != undefined) {
            var prefix = state.settings.prefixSamplePlate;
            if (prefix != undefined && prefix != '') {
                var isPrefixed = inputVal.startsWith(prefix);
                if (isPrefixed) {
                    setSamplePlateId(inputVal);
                    dispatch(checkPrefix1(true));
                    setPrefix1Error(false);
                }
                else {
                    setSamplePlateId(inputVal);
                    dispatch(checkPrefix1(false));
                    setPrefix1Error(true);
                }

            }
            else setSamplePlateId(inputVal);
        }
    };

    const handleSeqTubeIdChange = (data) => {
        var inputVal = data.target.value;
        if (inputVal != undefined) {
            var prefix = state.settings.prefixSeqTube;
            if (prefix != undefined && prefix != '') {
                var isPrefixed = inputVal.startsWith(prefix);
                if (isPrefixed) {
                    var str = inputVal.replace(state.settings.prefixSeqTube, '');
                    if (!isNumeric(str)) {
                        setPrefix2Error(false);
                        setSeqTubeId(inputVal);
                        setNumericValidationError(true);
                    }
                    else {
                        setSeqTubeId(inputVal);
                        dispatch(checkPrefix2(true));
                        setPrefix2Error(false);
                        setNumericValidationError(false);
                    }
                }
                else {
                    setSeqTubeId(inputVal);
                    dispatch(checkPrefix2(false));
                    setPrefix2Error(true);
                }
            }
            else {
                if (state.settings.isSeqTubeBarcodeValidated == true || state.settings.isSeqTubeBarcodeValidated == undefined) {
                    if (!isNumeric(inputVal)) {
                        setNumericValidationError(true);
                    }
                    else {
                        setNumericValidationError(false);
                        setSeqTubeId(inputVal);
                    }
                }
                else {
                    setNumericValidationError(false);
                    setSeqTubeId(inputVal);
                }
            }
        }
    };

    const handlePreAmpReagentsChange = (val) => {
        setPreAmpReagents(val);
    };

    const handleCommentsChange = (val) => {
        setComments(val);
    };

    const handleSequencingRecipeSelect = (val) => {
        setSequencingRecipe(val);
    };

    const handleAnalysisRecipeSelect = (val) => {
        setAnalysisRecipe(val);
    };

    const handleSampleLabelChange = (val) => {
        //setLibraryData(val);
        dispatch(setTableDataTab1(val));
    };

    const handleCancelClick = () => {
        dispatch(setIsLoading(false));
        clearAllFields();
        //setIsTab2Disabled(false);
        dispatch(disableTab(false, false));

        //setIsSearchByLibPoolEnabled(true);
        //setIsAllFieldsDisabled(true);
        dispatch(setAllFieldsDisabled(true));
        dispatch(setTab1CancelButtonState(true, false));
        //setIsCancelDisabled(true);
        //setIsSaveDisabled(true);
        dispatch(setTab1SaveButtonState(true, false));
        //setLoading(false);
        setPrefix1Error(false);
        setPrefix2Error(false);
        setNumericValidationError(false);
        dispatch(checkPrefix1(true));
        dispatch(checkPrefix2(true));
        setIsFound(false);
    }

    function checkSamplePlateIsDisabled() {
        if (state.fields.isAllFieldsDisabled) {
            return true;
        }
        else {
            if (state.settings.modeAMP2) {
                return false;
            }
            return true;
        }
    }

    const getLibraryPoolStyle = () => {
        if (importedLibraryPool != null) {
            if (libraryPool != importedLibraryPool && ((state.table.data_tab1.Item1 && state.table.data_tab1.Item1.length > 0) || (state.table.data_tab1.Item2 && state.table.data_tab1.Item2.length > 0))) {
                return { border: '2px solid red', borderRadius: '5px' };
            }
            else {
                return { borderRadius: '5px' };
            }
        }
    }

    const getSamplePlateStyle = () => {
        var isDisabled = checkSamplePlateIsDisabled();
        if (!isDisabled) {
            if (prefix1 == true)
                return { borderRadius: '5px' }
            else if (prefix1 == false && prefix1 != undefined)
                return { border: '2px solid red', borderRadius: '5px' };
        }
    }

    const getSeqTubeStyle = () => {
        if (!state.fields.isAllFieldsDisabled) {
            if (prefix2 == true && !numericValidationError)
                return { borderRadius: '5px' }
            else if (!state.settings.modeAMP2 && prefix2 == false && prefix2 != undefined && !numericValidationError)
                return { border: '2px solid red', borderRadius: '5px' };
            else if (!state.settings.modeAMP2 && numericValidationError)
                return { border: '2px solid red', borderRadius: '5px' };
        }
    }

    const isNumeric = str => {
        if (typeof str != "string") return false;
        return !isNaN(str) && !isNaN(parseFloat(str));
    }

    const validateLibraryPool = () => {
        if (importedLibraryPool != null) {
            if (libraryPool != importedLibraryPool && ((state.table.data_tab1.Item1 && state.table.data_tab1.Item1.length > 0) || (state.table.data_tab1.Item2 && state.table.data_tab1.Item2.length > 0))) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    const validateSamplePlate = str => {
        var prefix = state.settings.prefixSamplePlate;
        if (prefix != undefined && prefix != '') {
            var isPrefixed = str.startsWith(prefix);
            if (isPrefixed) {
                return str.startsWith(prefix);
            }
            else return false;
        }
        else return true;
    }

    const validateSeqTube = str => {
        var prefix = state.settings.prefixSeqTube;
        if (prefix != undefined && prefix != '') {
            var isPrefixed = str.startsWith(prefix);
            if (isPrefixed) {
                var input = str.replace(prefix, '');
                return isSeqTubeBarcodeValidated ? isNumeric(input) : str.startsWith(prefix);
            }
            return str.startsWith(prefix);
        }
        else if (isSeqTubeBarcodeValidated)
            return isNumeric(str);
        else return true;
    }

    const validateSeqTubeBarcode = () => {
        if (prefix2Error && state.settings.prefixSeqTube != '') {
            return `Sequencer Tube Barcode must starts from ${state.settings.prefixSeqTube}`;
        }
        else if (numericValidationError) {
            return `Sequencer Tube Barcode must be all-numeric`;
        }
        else return '';
    }

    return (
        <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className='row'>
                <div className='col-lg-3 col-md-5 col-sm-5'>
                    <div className='row'>
                        <div className='col-lg-11 col-md-11 col-sm-11 text-left' id='LibPoolDiv' style={{ marginTop: '5px', marginLeft: '32px' }}>
                            <label className={classes.label} htmlFor="libraryPool">{libraryPoolLabel}</label>
                            <div className="input-group mb-3">
                                <LightTooltip arrow open={validateLibraryPool()} title={validateLibraryPool() ? `Press Enter to Load Sample Sheet again` : ''}>
                                    <input type='text' required ref={methods.register({ required: true })} name="LibraryPoolId" id='libraryPoolId' key='libraryPool'
                                        onKeyDown={handleLibraryPoolKeyDown} className="form-control" onChange={handleLibraryPoolChange} value={libraryPool} style={{ borderRadius: '5px' }} onBlur={(e) => {
                                            if (libraryPool != '' && importedLibraryPool != libraryPool && ((state.table.data_tab1.Item1 && state.table.data_tab1.Item1.length > 0) || (state.table.data_tab1.Item2 && state.table.data_tab1.Item2.length > 0))) {
                                                setLibraryPoolLabel('Library Pool (Press Enter to Load Sample Sheet again):');
                                            }
                                        }}
                                        ref={methods.register()} style={getLibraryPoolStyle()}
                                    />
                                </LightTooltip>
                                <img src={scan} alt="scan" className={classes.scan} />
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-lg-11 col-md-11 col-sm-11 text-left' id='SamplePlateDiv' style={{ marginLeft: '32px' }}>
                            <label htmlFor="samplePlateId">Sample Plate:</label>
                            <div className="input-group mb-3">
                                <LightTooltip arrow open={prefix1Error || validateSamplePlate(samplePlateId)} title={prefix1Error ? `Sample Plate must starts from ${state.settings.prefixSamplePlate}` : ''}>
                                    <input type='text' required ref={methods.register({ required: !state['settings']['modeAMP2'], validate: validateSamplePlate })} name="SamplePlateId"
                                        disabled={state.settings.modeAMP2 ? !state.fields.isAllFieldsDisabled ? false : true : true} id='samplePlateId' key='samplePlateId' className="form-control"
                                        onChange={handleSamplePlateIdChange} value={samplePlateId} style={getSamplePlateStyle()} ref={methods.register()}
                                    />
                                </LightTooltip>
                                <img src={scan} alt="scan" className={classes.scan} />
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-lg-11 col-md-11 col-sm-11 text-left' id='SeqTubeDiv' style={{ marginLeft: '32px' }}>
                            <label htmlFor="SeqTubeId">Sequencer Tube:</label>
                            <div className="input-group mb-3">
                                <LightTooltip arrow open={prefix2Error || numericValidationError || methods.errors.SeqTubeId && methods.errors.SeqTubeId.type === "validate" || validateSeqTube(seqTubeId)} title={validateSeqTubeBarcode()}>
                                    <input type='text' disabled={state.fields.isAllFieldsDisabled} required ref={methods.register({ required: true, validate: validateSeqTube })} name="SeqTubeId" id='SeqTubeId'
                                        disabled={state.settings.modeAMP2 ? state.fields.isAllFieldsDisabled ? true : true : !state.fields.isAllFieldsDisabled ? false : true}
                                        key='SeqTubeId' className="form-control" onChange={handleSeqTubeIdChange} value={seqTubeId == null ? '' : seqTubeId} style={getSeqTubeStyle()}
                                        ref={methods.register()}
                                    />
                                </LightTooltip>
                                <img src={scan} alt="scan" className={classes.scan} />
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-lg-11 col-md-11 col-sm-11' style={{ marginLeft: '32px' }}>
                            <Recipes preAmpReagents={preAmpReagents} preAmpReagentsChange={handlePreAmpReagentsChange} isPreAmpDisabled={state.fields.isAllFieldsDisabled ? true : false}
                                isAnalysisRecipeDisabled={state.fields.isAllFieldsDisabled ? true : false} isSequencingRecipeDisabled={state.fields.isAllFieldsDisabled ? true : false}
                                methods={methods} sequencingRecipe={sequencingRecipe} analysisRecipe={analysisRecipe} onSequencingRecipeSelect={handleSequencingRecipeSelect}
                                onAnalysisRecipeSelect={handleAnalysisRecipeSelect}
                            />
                        </div>
                    </div>
                </div>
                <div className='col-lg-9'>
                    <div className='row'>
                        <div className='col-lg-12' style={{marginTop: 37}}>
                            {isFound ? <SampleSheetTable isFound={isFound} libraryDataGlobal={libraryDataGlobal} isEditable={false} sampleLabelChange={handleSampleLabelChange} /> : <div className='col-lg-5'></div>}
                        </div>
                    </div>
                    {(libraryDataGlobal != undefined) &&
                        <div className='row'>
                            <div className='col-lg-12' style={{ marginTop: libraryDataGlobal != undefined && libraryDataGlobal.length > 0 ? 0 : 0, maxWidth: '95.5%' }}>
                                {isFound ? <SampleSheetDropDown rows={libraryDataGlobal} setRows={setLibraryDataGlobal} /> : <div className='col-lg-5'></div>}
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div className='row'>
                <Footer handleCancelClick={handleCancelClick} isSearchMode={isSearchMode} isCommentsDisabled={state.fields.isAllFieldsDisabled} methods={methods} loading={loading} commentsChange={handleCommentsChange} comments={comments} />
            </div>
        </form>
    )

}

export default Tab1;