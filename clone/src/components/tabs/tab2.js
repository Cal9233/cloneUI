import React, { Fragment, useState, useEffect, useRef } from 'react';
import { useForm } from "react-hook-form";
import { makeStyles } from '@material-ui/core/styles';
import Buttons from '../buttons/buttons';
import { deleteRun, getRunsByLibPool, getSequencingRecipeList, getAnalysisRecipeList, getSamplePairs, getRunsBySamplePlate, getRunsBySeqTube, getLibraryIndexesByLibraryPool, postLibraryAllData, putLibraryAllData, validateSampleSheet } from "../../services/apiServiceFetch";
import config from '../../utils/config';
import Footer from '../mainpage/footer';
import Recipes from '../recipes/recipes';
import scan from '../../assets/scan.png';
import DataGrid from '../datagrid/datagrid';
import Select from "react-select";
import AlertDialog from '../alert/alertdialog';
import { disableTab } from "../actions/index";
import { useDispatch, useSelector } from "react-redux";
import {
    runSearch, setIsLoading, setAlert, setTab2SearchButtonState, setTab2ClearButtonState, setTab2EditButtonState, setTab2SaveButtonState, setTab2CancelButtonState,
    setTab2DeleteButtonState, hideForm2Fields, setFilterFilterBy, setFilterSearchIn, setFilterSearchText, setFieldsState, checkPrefix1, checkPrefix2, setAllFieldsDisabled,
    setRecordIsOld, getSequencingRecipesActiveNotUsed, getAnalysisRecipesActiveNotUsed, getSequencingRecipesAllWithTs, getAnalysisRecipesAllWithTs, setRecordStateData,
    setIsPrefixSamplePlateCorrect, setIsPrefixSeqTubeCorrect, setIsReadOnlyMode, resetDefaultColumnName, setTableData, setTableColumns, saveTableState
} from "../actions/index";
import LightTooltip from "../tooltip/lighttooltip";
import SampleSheetTable from '../samplesheet/samplesheettable';
import SampleSheetDropDown from '../samplesheetdropdown/samplesheetdropdown';

const Tab2 = props => {
    const { loading, isSearchMode, handleSearchClickMenu } = props;

    const [prefix1Error, setPrefix1Error] = useState(false);
    const [prefix2Error, setPrefix2Error] = useState(false);
    const [ampRunStart, setAmpRunStart] = useState('');
    const [seqRunStart, setSeqRunStart] = useState('');
    const [numericValidationError, setNumericValidationError] = useState(false);
    const [analysisRecipes, setAnalysisRecipes] = useState([]);
    const [sequencingRecipes, setSequencingRecipes] = useState([]);
    const [analysisRecipe, setAnalysisRecipe] = useState('');
    const [isAnalysisRecipeModified, setIsAnalysisRecipeModified] = useState(false);
    const [sequencingRecipe, setSequencingRecipe] = useState('');
    const [isSequencingRecipeModified, setIsSequencingRecipeModified] = useState(false);
    const [libraryPool, setLibraryPool] = useState('');
    const [isLibraryPoolModified, setIsLibraryPoolModified] = useState(false);
    const [samplePlateId, setSamplePlateId] = useState('');
    const [isSamplePlateIdModified, setIsSamplePlateIdModified] = useState(false);
    const [seqTubeId, setSeqTubeId] = useState('');
    const [isSeqTubeIdModified, setIsSeqTubeIdModified] = useState(false);
    //const [libraryData, setLibraryData] = useState([]);
    const [libraryDataGlobal, setLibraryDataGlobal] = useState([]);
    const [isLibraryDataModified, setIsLibraryDataModified] = useState(false);
    const [preAmpReagents, setPreAmpReagents] = useState('');
    const [isPreAmpReagentsModified, setIsPreAmpReagentsModified] = useState(false);
    const [isFound, setIsFound] = useState(true);
    const [isUpdateSamplesButtonHidden, setIsUpdateSamplesButtonHidden] = useState(true);
    const [isPreAMPDisabled, setIsPreAMPDisabled] = useState(true);
    const [comments, setComments] = useState('');
    const [isCommentsModified, setIsCommentsModified] = useState(false);
    const [selectedDisplayBy, setSelectedDisplayBy] = useState(0);
    const [isGridRowsEditable, setIsGridRowsEditable] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteDialogMsg, setDeleteDialogMsg] = useState(null);
    const [sampleIdPrimaryKey, setSampleIdPrimaryKey] = useState(null);
    const [isSampleSheetReImported, setIsSampleSheetReImported] = useState(true);
    const [selectedIndexes, setSelectedIndexes] = useState([0]);
    const [libraryPoolLabel, setLibraryPoolLabel] = useState('Library Pool:');
    const [importedLibraryPool, setImportedLibraryPool] = useState(null);    

    const state = useSelector(state => state);
    const SearchDataFound = useSelector(state => state.SearchDataFound);
    const searchIn = useSelector(state => state.filters.searchIn);
    const isTab2SearchButtonDisabled = useSelector(state => state.buttons.tab2.searchButton.isDisabled);
    const isTab2ClearButtonDisabled = useSelector(state => state.buttons.tab2.clearButton.isDisabled);
    const isTab2FormFieldsHidden = useSelector(state => state.fields.isTab2FormFieldsHidden);
    const prefix1 = useSelector(state => state.settings.isPrefixedSamplePlateCorrectly);
    const prefix2 = useSelector(state => state.settings.isPrefixedSeqTubeCorrectly);
    const isSeqTubeBarcodeValidated = useSelector(state => state.settings.isSeqTubeBarcodeValidated);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setAllFieldsDisabled(true));
    }, []);

    useEffect(() => {
        /*if (state.settings.modeAMP2 == false && samplePlateId == '' && samplePlateId == undefined)
            setSamplePlateId("");
        if (state.settings.modeAMP2 && seqTubeId == '' && seqTubeId == undefined)
            setSeqTubeId("");*/

        setPrefix1Error(false);
        dispatch(setIsPrefixSamplePlateCorrect(true));
        getSeqTubeStyle();
        setPrefix2Error(false);
        dispatch(setIsPrefixSeqTubeCorrect(true));
        getSamplePlateStyle();
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
        displayBy: {
            display: 'flex',
            //marginTop: 15
        },
    }));

    const classes = useStyles();

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

    const onSubmit = async () => {        
        dispatch(resetDefaultColumnName());
        var isSeqTubeDisabled = state.fields.isAllFieldsDisabled ? true : !state.settings.modeAMP2 ? seqRunStart != null && state.record.isRecordOld ? true : false : true;
        var isSamplePlateDsbl = isSamplePlateDisabled();
        var isPrefix1Valid = state.settings.modeAMP2 ? isSamplePlateDsbl ? true : validateSamplePlate(samplePlateId) : true;
        var isPrefix2Valid = state.settings.modeAMP2 ? true : isSeqTubeDisabled ? true : validateSeqTube(seqTubeId);
        var isNumericValidationError = state.settings.modeAMP2 ? isSeqTubeDisabled ? false : true : isSeqTubeDisabled ? false : !validateSeqTube(seqTubeId);

        if (isPrefix1Valid && isPrefix2Valid && !isNumericValidationError /*&& !isSeqTubeDisabled*/) {
            if (!isLibraryDataModified && libraryPool === importedLibraryPool/*&& isSampleSheetReImported*/) {
                if (state.settings.modeAMP2) {
                    if ((libraryPool == '' || samplePlateId == '' /*|| seqTubeId == ''*/ || sequencingRecipe == '' || analysisRecipe == '' || state.table.data.length == 0)) {
                        dispatch(setAlert(`Please fill mandatory fields`, 'Values are required: ', 'warning'));
                    }
                    else {
                        checkRunExistsBySamplePlateIdAndSeqTubeId(state.record.data.samplePlateId != samplePlateId ? samplePlateId : '', state.record.data.seqTubeId != seqTubeId ? seqTubeId : '');  
                    }
                }
                else {
                    if ((libraryPool == '' || seqTubeId == '' || sequencingRecipe == '' || analysisRecipe == '' || state.table.data.length == 0)) {
                        dispatch(setAlert(`Please fill mandatory fields`, 'Values are required: ', 'warning'));
                    }
                    else {
                        if (seqTubeId != '') {
                            var currSeqTube = state.record.data.seqTubeId == seqTubeId ? '' : seqTubeId;
                            if (currSeqTube == '') {
                                dispatch(setIsLoading(true));
                                var response = await validateSampleSheet(state.table.data);
                                var isSampleSheetValid = response.data;
                                if (isSampleSheetValid === '') {
                                    var data = { libraryPool, seqTubeId, preAmpReagents, comments, sequencingRecipe, analysisRecipe, libraryData: state.table.data, libraryDataGlobal };
                                    putData(data);
                                    dispatch(setTab2EditButtonState(false, false));
                                    dispatch(setTab2CancelButtonState(true, false));
                                    dispatch(setTab2SaveButtonState(true, false));
                                }
                                else {
                                    dispatch(setIsLoading(false));
                                    dispatch(setAlert(isSampleSheetValid, "Sample Sheet not valid", 'error'));
                                }
                            }
                            else checkRunExistsBySeqTubeId(currSeqTube);
                        }
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
        }
        else {
            if (!isPrefix1Valid) {
                dispatch(checkPrefix1(false));
                setIsSamplePlateIdModified(true);
                setPrefix1Error(true);
            }
            if (!isPrefix2Valid) {
                if (!isNumeric(seqTubeId)) {
                    setIsSeqTubeIdModified(true);
                    setNumericValidationError(true);
                    dispatch(checkPrefix2(false));
                }
                else {
                    dispatch(checkPrefix2(false));
                    setIsSeqTubeIdModified(true);
                    setPrefix2Error(true);
                }
            }
        }
    };

    const searchDataByLibId = async (id) => {
        if (id) {
            if (id != null && id != undefined && id != '') {
                try {
                    var url;
                    if (process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'development') {
                        url = config.API_URL_USER_PLUGIN_DEV;
                    }
                    else url = config.API_URL_USER_PLUGIN_TEST;
                    await fetch(`${url}/data/${id}`)
                        .then(r => r.json())
                        .then(data => {
                            if (data != undefined && data != '') {
                                var data = JSON.parse(data);
                                setIsPreAMPDisabled(false);
                                dispatch(setTab2EditButtonState(true, false));
                                dispatch(setTab2SearchButtonState(false, false));
                                dispatch(setTab2DeleteButtonState(searchIn == 1 ? true : false, false));
                                dispatch(setAllFieldsDisabled(true));

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
                                /*if (data.Item1 != undefined) {
                                    data.Item1 = data.Item1.map(item => {
                                        Object.defineProperty(item, 'Index', Object.getOwnPropertyDescriptor(item, 'Item2'));
                                        delete item['Item2'];
                                        Object.defineProperty(item, 'Sample', Object.getOwnPropertyDescriptor(item, 'Item1'));
                                        delete item['Item1'];
                                        Object.defineProperty(item, 'Sequence', Object.getOwnPropertyDescriptor(item, 'Item3'));
                                        delete item['Item3'];
                                        return item;
                                    })
                                }      */
                                dispatch(setTableData(data.Item1));

                                //dispatch(setTableData(data));
                                //setLibraryData(data);
                                setIsFound(true);
                                dispatch(setAllFieldsDisabled(false));
                            }
                            else {
                                dispatch(setAlert(`Library Pool = ${id}`, 'Not Found: ', 'warning'));
                                //setLibraryData([]);
                                dispatch(setTableData([]));
                                setIsFound(false);
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                            dispatch(setIsLoading(false));
                            dispatch(setAlert(err.response != undefined ? err.response.data : err.stack, err.message, 'error'));
                            //setLibraryData([]);
                            dispatch(setTableData([]));
                            setIsFound(false);
                            dispatch(setTab2EditButtonState(false, false));
                        });
                }
                catch (err) {
                    console.log(err);
                    dispatch(setIsLoading(false));
                    dispatch(setAlert(err.response != undefined ? err.response.data : err.stack, err.message, 'error'));
                    setIsFound(false);
                    dispatch(setTab2EditButtonState(false, false));
                }
            }
            else {
                dispatch(setIsLoading(false));
                //setLibraryData([]);
                dispatch(setTableData([]));
            }
        }
    };

    const updateRecordState = (data) => {
        setLibraryPool(data.libraryPool);
        //if (state.settings.modeAMP2)
        setSamplePlateId(data.samplePlateId);
        //if (!state.settings.modeAMP2)
        setSeqTubeId(data.seqTubeId);
        setPreAmpReagents(data.preAmpReagents);
        setComments(data.comments);
        setSequencingRecipe(data.sequencingRecipe.Id == undefined ? { Id: data.sequencingRecipe } : data.sequencingRecipe);
        setAnalysisRecipe(data.analysisRecipe.Id == undefined ? { Id: data.analysisRecipe } : data.analysisRecipe);
        //setLibraryData(data.libraryData);
        dispatch(setTableData(data.libraryData));
        setLibraryDataGlobal(data.libraryDataGlobal);
    }

    const putData = async data => {
        dispatch(setIsLoading(true));
        var response = await validateSampleSheet(state.table.data);
        var isSampleSheetValid = response.data;
        if (isSampleSheetValid === '') {
            if (data) {
                const id = data.libraryPool;
                if (id != null && id != undefined && id != '') {
                    try {
                        dispatch(setIsReadOnlyMode(true));
                        dispatch(setIsLoading(true));
                        putLibraryAllData(data)
                            .then((response) => {
                                console.log("api response tab: ", response);
                                if (response.status === 200) {
                                    dispatch(setIsLoading(false));
                                    //clearAllFields();
                                    dispatch(hideForm2Fields(false));
                                    dispatch(setIsLoading(false));
                                    dispatch(setTab2DeleteButtonState(searchIn == 1 ? true : false));
                                    dispatch(disableTab(false, false));
                                    setIsUpdateSamplesButtonHidden(true);
                                    dispatch(setTab2ClearButtonState(false, false));
                                    dispatch(setTab2SearchButtonState(false, false));
                                    var data = state.settings.modeAMP2 ? { libraryPool, samplePlateId, seqTubeId, preAmpReagents, comments, sequencingRecipe, analysisRecipe, libraryData: state.table.data, libraryDataGlobal } :
                                        { libraryPool, samplePlateId, seqTubeId, preAmpReagents, comments, sequencingRecipe, analysisRecipe, libraryData: state.table.data, libraryDataGlobal };

                                    updateRecordState(data);

                                    dispatch(setTab2EditButtonState(false, false));
                                    dispatch(setTab2CancelButtonState(true, false));
                                    dispatch(setTab2SaveButtonState(true, false));
                                    dispatch(setAllFieldsDisabled(true));
                                    dispatch(setAlert('Saved successfully', 'Success', 'success'));

                                    dispatch(setIsPrefixSamplePlateCorrect(true));
                                    dispatch(setIsPrefixSeqTubeCorrect(true));

                                    setImportedLibraryPool(libraryPool);
                                    setLibraryPoolLabel('Library Pool:');

                                    var oldSearchRec = SearchDataFound.find(f => f.RunsId == sampleIdPrimaryKey);
                                    if (oldSearchRec) {
                                        oldSearchRec.Library_Pool = libraryPool;
                                        //if (state.settings.modeAMP2 === false)
                                        oldSearchRec.Sample_Plate = samplePlateId;
                                        // if (state.settings.modeAMP2 === true)
                                        oldSearchRec.Sample_Tube = seqTubeId
                                        //oldSearchRec.Sample_Tube = seqTubeId;
                                        oldSearchRec.Pre_AMP_Reagents = preAmpReagents;
                                        oldSearchRec.Comments = comments;
                                        var srId = sequencingRecipe.Id != undefined ? sequencingRecipe.Id : sequencingRecipe;
                                        var searchResultSR = state.sequencingRecipes.find(f => f.Id == srId);
                                        oldSearchRec.Sequencing_Recipe_Id = searchResultSR != undefined ? searchResultSR.Id : '';
                                        var arId = analysisRecipe.Id != undefined ? analysisRecipe.Id : analysisRecipe;
                                        var searchResultAR = state.analysisRecipes.find(f => f.Id == arId);
                                        oldSearchRec.Analysis_Recipe_Id = searchResultAR != undefined ? searchResultAR.Id : '';
                                        oldSearchRec.Index_Id = state.table.data.map(m => m.Item2);
                                        oldSearchRec.Sample = state.table.data.map(m => m.Item1);
                                        oldSearchRec.Index_Sequence = state.table.data.map(m => m.Item3);

                                        var newAttributes = state.table.data.map(({Item1, Item2, Item3, ...keepAttrs}) => keepAttrs);
                                        oldSearchRec.Custom_Attribute_Names = newAttributes.map(m => Object.keys(m).join(','));
                                        oldSearchRec.Custom_Attribute_Values = newAttributes.map(m => Object.values(m).join(','));

                                        oldSearchRec.Name = libraryDataGlobal.map(m => m.Item1);
                                        oldSearchRec.Value = libraryDataGlobal.map(m => m.Item2);
                                    }

                                    handleRowSelect(oldSearchRec);
                                }
                                else {
                                    dispatch(setIsLoading(false));
                                    dispatch(setAlert(response.statusText, response.status, 'error'));
                                    dispatch(disableTab(false, false));

                                    setImportedLibraryPool(libraryPool);
                                    setLibraryPoolLabel('Library Pool:');
                                }
                            })
                            .catch((err) => {
                                console.log(err);
                                dispatch(setIsLoading(false));
                                dispatch(setAlert(err.response != undefined ? err.response.data : err.stack, err.message, 'error'));
                                handleCancelClick();
                                setImportedLibraryPool(libraryPool);
                                setLibraryPoolLabel('Library Pool:');
                            });
                    }
                    catch (e) {
                        console.log(e);
                        dispatch(setIsLoading(false));
                        handleCancelClick();
                        setImportedLibraryPool(libraryPool);
                        setLibraryPoolLabel('Library Pool:');
                    }
                }
                else {
                    dispatch(setIsLoading(false));
                    handleCancelClick();
                }
            }
        }
        else {
            dispatch(setIsLoading(false));
            dispatch(setAlert(isSampleSheetValid, "Sample Sheet not valid", 'error'));
        }
    };   

    const checkRunExistsBySamplePlateIdAndSeqTubeId = (samplePlate, seqTube) => {
        try {
            if (samplePlate == '' && seqTube == '') {
                var data = { libraryPool, samplePlateId, seqTubeId, preAmpReagents, comments, sequencingRecipe, analysisRecipe, libraryData: state.table.data, libraryDataGlobal };
                putData(data);
            }
            else if (samplePlate != '' && seqTube == '') {
                dispatch(setIsLoading(true));
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
                            }
                            else {
                                //var data = state.settings.modeAMP2 ? { libraryPool, samplePlateId, preAmpReagents, comments, sequencingRecipe, analysisRecipe, libraryData: state.table.data, libraryDataGlobal } :
                                //    { libraryPool, samplePlateId, seqTubeId, preAmpReagents, comments, sequencingRecipe, analysisRecipe, libraryData: state.table.data, libraryDataGlobal };
                                var data = { libraryPool, samplePlateId, seqTubeId, preAmpReagents, comments, sequencingRecipe, analysisRecipe, libraryData: state.table.data, libraryDataGlobal };
                                putData(data);
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
            else if (samplePlate == '' && seqTube != '') {
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
                            }
                            else {
                                var data = { libraryPool, samplePlateId, seqTubeId, preAmpReagents, comments, sequencingRecipe, analysisRecipe, libraryData: state.table.data, libraryDataGlobal };
                                putData(data);
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
                dispatch(setIsLoading(true));
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
                                if (seqTube != '') {
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
                                                    var data = { libraryPool, samplePlateId, seqTubeId, preAmpReagents, comments, sequencingRecipe, analysisRecipe, libraryData: state.table.data, libraryDataGlobal };
                                                    putData(data);
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
                                    var data = { libraryPool, samplePlateId, seqTubeId, preAmpReagents, comments, sequencingRecipe, analysisRecipe, libraryData: state.table.data, libraryDataGlobal };
                                    putData(data);
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
        try {
            dispatch(setIsLoading(true));
            getRunsBySeqTube(id)
                .then((data) => {
                    dispatch(setIsLoading(false));
                    if (data != undefined) {
                        if (data.length >= 1) {
                            dispatch(setAlert(`Sequencer Tube ${id} already exists`, 'Already exists', 'warning'));
                            var nextInput = document.querySelector(
                                `input[id=SeqTubeId]`
                            );
                            if (nextInput !== null) {
                                nextInput.focus();
                            };
                            setSeqTubeId('');
                        }
                        else {
                            var data = { libraryPool, seqTubeId, preAmpReagents, comments, sequencingRecipe, analysisRecipe, libraryData: state.table.data, libraryDataGlobal };
                            putData(data);
                            dispatch(setTab2EditButtonState(false, false));
                            dispatch(setTab2CancelButtonState(true, false));
                            dispatch(setTab2SaveButtonState(true, false));
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
            dispatch(setIsLoading(false));
            handleCancelClick();
        }
    };

    const deleteSample = (id) => {
        if (id != null && id != undefined && id != '') {
            try {
                dispatch(setIsLoading(true));

                deleteRun(id)
                    .then((response) => {
                        dispatch(setIsLoading(false));
                        if (response != undefined) {
                            if (SearchDataFound != undefined && SearchDataFound.length) {
                                var newRecs = SearchDataFound.filter(function (obj) {
                                    return obj.RunsId != sampleIdPrimaryKey;
                                });
                                if (newRecs.length == 0) {
                                    clearAllFields();
                                    dispatch(hideForm2Fields(true));
                                    restoreDefaultButtonsState();
                                    dispatch(setTab2ClearButtonState(true, false));
                                    dispatch(runSearch([]));
                                }
                                else {
                                    setSelectedIndexes([0]);
                                    dispatch(runSearch(newRecs));
                                }
                            }
                            dispatch(setAlert("Deleted successfully", 'Success ', 'success'));
                            setIsDeleteDialogOpen(false);
                            dispatch(setTab2EditButtonState(false, false));
                            dispatch(setTab2SaveButtonState(true, false));
                            dispatch(setTab2CancelButtonState(true, false));
                            dispatch(setTab2DeleteButtonState(false, false));
                            setIsGridRowsEditable(false);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        dispatch(setIsLoading(false));
                        dispatch(setAlert(err.response != undefined ? err.response.data : err.stack, err.message, 'error'));
                    });
            }
            catch (e) {
                console.log(e);
                dispatch(setIsLoading(false));
            }
        }
        else {
            dispatch(setIsLoading(false));
        }
    };

    const clearAllFields = () => {
        //setLibraryData([]);
        dispatch(setTableData([]));
        setLibraryDataGlobal([]);
        setLibraryPool('');
        setSamplePlateId('');
        setSeqTubeId('');
        setPreAmpReagents('');
        setAnalysisRecipe('');
        setSequencingRecipe('');
        setComments('');
    };

    const restoreDefaultButtonsState = () => {
        dispatch(setTab2EditButtonState(false, false));
        dispatch(setTab2SaveButtonState(true, false));
        dispatch(setTab2CancelButtonState(true, false));
        dispatch(setTab2SearchButtonState(false, false));
        dispatch(setTab2ClearButtonState(false, false));
    }

    const restorePrevFieldsStateRedux = (data) => {
        setLibraryPool(data.libraryPool);
        setSamplePlateId(data.samplePlateId);
        setSeqTubeId(data.seqTubeId);
        setPreAmpReagents(data.preAmpReagents);
        setComments(data.comments);
        setSequencingRecipe(data.sequencingRecipe);
        setAnalysisRecipe(data.analysisRecipe);
        //setLibraryData(data.libraryData);
        dispatch(setTableData(state.saved.table_state.data));
        dispatch(setTableColumns(state.saved.table_state.columns));
        setLibraryDataGlobal(data.libraryDataGlobal);        
    }

    const handleLibraryPoolChange = (data) => {
        if (!state.record.isReadOnly) {
            setLibraryPool(data.target.value);
            dispatch(setTab2CancelButtonState(false, false));
            setIsLibraryPoolModified(true);
        }
    };

    const handleSamplePlateIdChange = (data) => {
        var inputVal = data.target.value;
        if (inputVal != undefined) {
            var prefix = state.settings.prefixSamplePlate;
            if (prefix != undefined && prefix != '') {
                //validateSamplePlate(inputVal);
                //checkSamplePlatePrefix(inputVal, prefix);
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
                if (!isSamplePlateIdModified) {
                    setIsSamplePlateIdModified(true);
                }
            }
            else setSamplePlateId(inputVal);
        }
    };

    const handleSeqTubeIdChange = (data) => {
        var inputVal = data.target.value;
        if (inputVal != undefined) {
            setIsSeqTubeIdModified(true);
            var prefix = state.settings.prefixSeqTube;
            if (prefix != undefined && prefix != '') {
                //validateSeqTube(inputVal);

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
                    if (!isSeqTubeIdModified) {
                        setIsSeqTubeIdModified(true);
                    }
                }
                else {
                    setSeqTubeId(inputVal);
                    dispatch(checkPrefix2(false));
                    setPrefix2Error(true);
                }
                if (!isSeqTubeIdModified) {
                    setIsSeqTubeIdModified(true);
                }
            }
            else {
                if (isSeqTubeBarcodeValidated) {
                    if (!isNumeric(inputVal)) {
                        setNumericValidationError(true);
                        setSeqTubeId(inputVal);
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
        if (!state.record.isReadOnly) {
            dispatch(setTab2CancelButtonState(false, false));
            setPreAmpReagents(val);
            setIsPreAmpReagentsModified(true)
        }
    };

    const handleCommentsChange = (val) => {
        if (!state.record.isReadOnly) {
            dispatch(setTab2CancelButtonState(false, false));
            setComments(val);
            setIsCommentsModified(true);
        }
    };

    const handleSequencingRecipeSelect = (val) => {
        if (!state.record.isReadOnly) {
            dispatch(setTab2CancelButtonState(false, false));
            setSequencingRecipe(val);
            setIsSequencingRecipeModified(true);
        }
    };

    const handleAnalysisRecipeSelect = (val) => {
        if (!state.record.isReadOnly) {
            dispatch(setTab2CancelButtonState(false, false));
            setAnalysisRecipe(val);
            setIsAnalysisRecipeModified(true);
        }
    };

    const handleDisplayByChange = (e) => {
        setSelectedDisplayBy(e.value);
    };

    const handleRowSelect = (data) => {
        if (data != undefined) {
            if (state.record.isReadOnly) {
                dispatch(resetDefaultColumnName());
                dispatch(setTableColumns([]));
                setSampleIdPrimaryKey(data.RunsId);

                dispatch(hideForm2Fields(false));
                dispatch(setTab2SearchButtonState(false, false));

                dispatch(setAllFieldsDisabled(true));

                if ((data['AMP_Run_Start'] === null && data['Sequencer_Run_Start'] != null) || (data['Sequencer_Run_Start'] === null && data['AMP_Run_Start'] != null) || (data['AMP_Run_Start'] != null && data['Sequencer_Run_Start'] != null)) {
                    dispatch(setRecordIsOld(true));
                    if (!state.settings.allowEditingRunsInProgress) {
                        dispatch(setTab2DeleteButtonState(true, false));
                        dispatch(setTab2EditButtonState(true, false));
                    }
                    else {
                        dispatch(setTab2DeleteButtonState(false, false));
                        dispatch(setTab2EditButtonState(false, false));
                    }
                }
                else {
                    dispatch(setRecordIsOld(false));
                    dispatch(setTab2DeleteButtonState(false, false));
                    dispatch(setTab2EditButtonState(false, false));
                }

                //dispatch(setTab2EditButtonState(false, false));
                //dispatch(setTab2EditButtonState(data['AMP_Run_Start'] == null || data['SequencerRun_Start'] == null ? true : false, false));
                //dispatch(setTab2DeleteButtonState(state.record.isRecordOld ? true : false, false));


                dispatch(setFieldsState(data));

                setAmpRunStart(data.AMP_Run_Start);
                setSeqRunStart(data.Sequencer_Run_Start);
                setLibraryPool(data.Library_Pool);
                setSamplePlateId(data.Sample_Plate != null ? data.Sample_Plate : '');
                setSeqTubeId(data.Sample_Tube != null ? data.Sample_Tube : '');
                setPreAmpReagents(data['Pre_AMP_Reagents']);
                setAnalysisRecipe({ 'Id': data.Analysis_Recipe_Id != null ? data.Analysis_Recipe_Id.Id == undefined ? data.Analysis_Recipe_Id : data.Analysis_Recipe_Id.Id : '', /*'Type': data.Analysis_Recipe_Type */ 'Name': data.Analysis_Recipe_Name });
                setSequencingRecipe({ 'Id': data.Sequencing_Recipe_Id != null ? data.Sequencing_Recipe_Id.Id == undefined ? data.Sequencing_Recipe_Id : data.Sequencing_Recipe_Id.Id : '', /*'Type': data.Sequencing_Recipe_Type */ 'Name': data.Sequencing_Recipe_Name });
                setComments(data.Comments);
                //var libData = data.map(item => ({ 'Item2': item.Index_Id, 'Item1': item.Sample, 'Item3': item.Index_Sequence }));            
                var libData = data.Index_Id != undefined ? data.Index_Id.map((item, i) => ({ 'Item2': item, 'Item1': data.Sample[i], 'Item3': data.Index_Sequence[i] })) :
                    [{ 'Item2': data['Index_Id'], 'Item1': data['Sample'], 'Item3': data['Index_Sequence'] }];
               
                if (libData != undefined && libData.length) {
                    libData.forEach((item, i) => {
                        if (data.Custom_Attribute_Names != null && data.Custom_Attribute_Names != undefined && data.Custom_Attribute_Names.length) {
                            if (data.Custom_Attribute_Names[i] != undefined && data.Custom_Attribute_Names[i] != null && Array.isArray(data.Custom_Attribute_Names[i].split(',')) && data.Custom_Attribute_Values[i] != undefined && data.Custom_Attribute_Values[i] != null && Array.isArray(data.Custom_Attribute_Values[i].split(','))) {
                                var customAttrNames = data.Custom_Attribute_Names[i].split(',');
                                var customAttrValues = data.Custom_Attribute_Values[i].split(',');
                                if (customAttrNames != undefined && customAttrValues != undefined && customAttrNames.length === customAttrValues.length) {
                                    customAttrNames.forEach((element, j) => {
                                        item[element] = customAttrValues[j];                                   
                                    }); 
                                }
                            }
                            else {
                                item[data.Custom_Attribute_Names[i]] = data.Custom_Attribute_Values[i]; 
                            }                                                                                   
                        }                        
                    });
                }

                if (libData.length > 1) {
                    //setLibraryData(libData);
                    /*libData = libData.map(item => {
                        Object.defineProperty(item, 'Index', Object.getOwnPropertyDescriptor(item, 'Item2'));
                        delete item['Item2'];
                        Object.defineProperty(item, 'Sample', Object.getOwnPropertyDescriptor(item, 'Item1'));
                        delete item['Item1'];
                        Object.defineProperty(item, 'Sequence', Object.getOwnPropertyDescriptor(item, 'Item3'));
                        delete item['Item3'];
                        return item;
                    })  */
                    dispatch(setTableData(libData));
                }
                else if (libData.length == 1 && libData[0]['Item2'] == null && libData[0]['Item1'] == null && libData[0]['Item3'] == null) {
                   //setLibraryData([]);
                   dispatch(setTableData([]));
                }
                //else setLibraryData(libData);
                else dispatch(setTableData(libData));

                var libDataGlobal = data.Name != undefined && data.Value != undefined && data.Name != null && data.Value != null && data.Name.length === data.Value.length ? data.Name.filter(f => f != null && f != undefined).map((item, i) => ({ 'Item1': item, 'Item2': data.Value[i] })) : [];
                setLibraryDataGlobal(libDataGlobal);

                setImportedLibraryPool(data.Library_Pool);                
            }
        }
    }

    const handleEditClick = () => { 
        dispatch(saveTableState(state.table));      
        setIsSeqTubeIdModified(false);
        setIsSamplePlateIdModified(false);
        var data = { libraryPool, samplePlateId, seqTubeId, preAmpReagents, comments, sequencingRecipe, analysisRecipe, libraryData: state.table.data, libraryDataGlobal };        
        dispatch(setRecordStateData(data));        

        //dispatch(getSequencingRecipesAllWithTs());
        dispatch(getSequencingRecipesActiveNotUsed());
        //dispatch(getAnalysisRecipesAllWithTs());
        dispatch(getAnalysisRecipesActiveNotUsed());
        if (ampRunStart != '' && ampRunStart != undefined && state.settings.allowEditingRunsInProgress) {
            dispatch(setAllFieldsDisabled(false));
        }
        else if (ampRunStart == null) {
            dispatch(setAllFieldsDisabled(false));
        }
        else dispatch(setAllFieldsDisabled(true));

        dispatch(checkPrefix1(false));
        dispatch(checkPrefix2(false));

        dispatch(setIsReadOnlyMode(false));

        dispatch(setTab2EditButtonState(true, false));
        dispatch(setTab2SaveButtonState(false, false));
        dispatch(setTab2DeleteButtonState(true, false));
        setIsGridRowsEditable(true);
        dispatch(setTab2CancelButtonState(false, false));
        dispatch(disableTab(true, false));

        var nextInput = document.querySelectorAll(
            `div[class=rdg-cell-action-button]`
        );
        if (nextInput !== null) {
            nextInput.forEach(m => {
                m.firstChild.className = 'fa fa-edit';
            });
        };
        dispatch(setTab2SearchButtonState(true, false));
        dispatch(setTab2ClearButtonState(true, false));
        dispatch(checkPrefix1(false));
        dispatch(checkPrefix2(false));

        setLibraryDataGlobal([...libraryDataGlobal]);
    }

    const handleCancelClick = () => {
        dispatch(resetDefaultColumnName());        
        setPrefix1Error(false);
        setPrefix2Error(false);
        setNumericValidationError(false);

        restorePrevFieldsStateRedux(state.record.data);

        dispatch(checkPrefix1(true));
        dispatch(checkPrefix2(true));
        setIsSeqTubeIdModified(false);
        setIsSamplePlateIdModified(false);
        dispatch(setAllFieldsDisabled(true));
        dispatch(setIsLoading(false));
        restoreDefaultButtonsState();
        dispatch(setIsReadOnlyMode(true));

        if (state.settings.allowEditingRunsInProgress) {
            dispatch(setTab2DeleteButtonState(state.record.isRecordOld ? false : true, false));
            dispatch(setTab2EditButtonState(state.record.isRecordOld ? false : true, false));
        }
        else {
            dispatch(setTab2DeleteButtonState(state.record.isRecordOld ? true : false, false));
            dispatch(setTab2EditButtonState(state.record.isRecordOld ? true : false, false));
        }

        dispatch(disableTab(false, false));
        setIsUpdateSamplesButtonHidden(true);
        setIsGridRowsEditable(false);
        setIsFound(true);

        setImportedLibraryPool(libraryPool);
        
        setLibraryDataGlobal([...libraryDataGlobal]);
    }

    const handleDeleteClick = () => {
        setIsDeleteDialogOpen(true);
        setDeleteDialogMsg(`You are trying to delete Sample with ${libraryPool != '' ? `Library Pool=${libraryPool}` : ''}, ${samplePlateId != '' ? `Sample Plate=${samplePlateId}` : ''},
         ${seqTubeId != '' ? `Sequencing Tube=${seqTubeId}` : ''}. It will be deleted completely... `);
    }

    const handleDeleteClickOk = () => {
        deleteSample(libraryPool);
    }

    const handleDeleteClickCancel = () => {
        setIsDeleteDialogOpen(false);
        setDeleteDialogMsg(null);
    }

    const handleClearClick = () => {
        dispatch(hideForm2Fields(true));
        dispatch(runSearch([]));
        dispatch(setFilterFilterBy(-1, 'text', false));
        dispatch(setFilterSearchIn(0));
        dispatch(setFilterSearchText(''));

        clearAllFields();
        setIsGridRowsEditable(false);
        restoreDefaultButtonsState();
        dispatch(setIsReadOnlyMode(true));
        dispatch(setTab2ClearButtonState(true, false));
    }

    const handleLibraryPoolKeyDown = e => {
        if (e.key === 'Enter' && !state.record.isReadOnly) {
            e.preventDefault();
            searchDataByLibId(libraryPool);
            setIsLibraryDataModified(false);
            setIsSampleSheetReImported(true);
            setImportedLibraryPool(libraryPool);
        }
        else setIsSampleSheetReImported(false);
    }

    const handleBlur = (e) => {
        setIsLibraryDataModified(true);
        setIsSampleSheetReImported(false);
    };

    const getSamplePlateStyle = () => {
        if (prefix1 == true)
            return { borderRadius: '5px' }
        else if (prefix1 == false && prefix1 != undefined)
            return { border: '2px solid red', borderRadius: '5px' };
    }

    const getSeqTubeStyle = () => {
        if (isSeqTubeIdModified) {
            if (prefix2 == true && !numericValidationError)
                return { borderRadius: '5px' }
            else if (numericValidationError && state.settings.prefixSeqTube == '')
                return { border: '2px solid red', borderRadius: '5px' };
            else if (prefix2 == false && prefix2 != undefined && state.settings.prefixSeqTube != '')
                return { border: '2px solid red', borderRadius: '5px' };
            else return { borderRadius: '5px' };
        }
    }

    const isNumeric = str => {
        if (typeof str != "string") return false;        
        return !isNaN(str) && !isNaN(parseFloat(str));
    }

    const validateSamplePlate = str => {
        //  if (isSamplePlateIdModified) {
        var prefix = state.settings.prefixSamplePlate;
        if (prefix != undefined && prefix != '' && str != undefined) {
            var isPrefixed = str.startsWith(prefix);
            if (isPrefixed) {
                return str.startsWith(prefix);
            }
            else return false;
        }
        else return true;
        //   }
    }

    const validateSeqTube = str => {
        //  if (isSeqTubeIdModified) {
        var prefix = state.settings.prefixSeqTube;
        if (prefix != undefined && prefix != '' && str != undefined) {
            var isPrefixed = str.startsWith(prefix);
            if (isPrefixed) {
                var input = str.replace(prefix, '');
                return isSeqTubeBarcodeValidated ? isNumeric(input) : str.startsWith(prefix);
            }
            return str.startsWith(prefix);
        }
        else if (isSeqTubeBarcodeValidated) {
            var result = isNumeric(str);
            //setNumericValidationError(result);
            //if (result == false)
            //    setNumericValidationError(false);
            return result;
        }
        else return true;
        //   }       
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

    const isSamplePlateDisabled = () => {
        if (!state.fields.isAllFieldsDisabled && state.settings.modeAMP2 && !state.settings.allowEditingRunsInProgress)
            return false;
        else if (!state.fields.isAllFieldsDisabled && !state.record.isRecordOld && state.settings.modeAMP2)
            return false;
        else if (!state.fields.isAllFieldsDisabled && state.record.isRecordOld && !state.settings.modeAMP2)
            return true;
        if (!state.fields.isAllFieldsDisabled && !state.record.isRecordOld && !state.settings.modeAMP2)
            return true;
        else return true;
    }

    const DisplayByOptions = [{ 'value': 0, 'label': 'Library Pools', 'dbName': 'Library_Pool' }, { 'value': 1, 'label': 'Sample Plates', 'dbName': 'Sample_Plate' }, { 'value': 2, 'label': 'Sequencer Tubes', 'dbName': 'Sample_Tube' }];

    const DisplayBySelect = () => {
        return (
            <Select
                isDisabled={false}
                options={DisplayByOptions}
                onChange={handleDisplayByChange}
                value={DisplayByOptions.filter(option => {
                    return option.value === selectedDisplayBy;
                })}
                isSearchable={false}
            />
        );
    }

    const validateLibraryPool = () => {
        if (importedLibraryPool != null) {
            if (libraryPool != importedLibraryPool) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    const getLibraryPoolStyle = () => {
        if (importedLibraryPool != null) {
            if (libraryPool != importedLibraryPool) {
                return { border: '2px solid red', borderRadius: '5px' };
            }
            else {
                return { borderRadius: '5px' };
            }
        }
    }

    return (
        <div className='row'>
            <div className='col-lg-3 col-md-4 col-sm-12'>
                <div className='row' >
                    <div className='col-lg-11 col-md-11 col-sm-11 text-left' style={{ marginTop: '20px', marginLeft: 30 }}>
                        <label className={classes.label} htmlFor="displayByDrpBox">Display:</label>
                        <DisplayBySelect id='displayByDrpBox' />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-lg-11 col-md-11 col-sm-11 text-left' style={{ marginTop: '20px', marginLeft: 30, width: '100%' }}>
                        <DataGrid selectedIndexes={selectedIndexes} setSelectedIndexes={setSelectedIndexes} data={SearchDataFound} displayBy={DisplayByOptions[selectedDisplayBy]} handleRowSelect={handleRowSelect} />
                    </div>
                </div>
                <div className='row' style={{ marginTop: 20, marginLeft: 20 }}>
                    <div className="input-group mb-3">
                        <Buttons disabled={isTab2SearchButtonDisabled} label='Search' isSubmitType={false} click={handleSearchClickMenu} />
                        <Buttons disabled={isTab2ClearButtonDisabled} label='Clear' isSubmitType={false} click={handleClearClick} />
                    </div>
                </div>
            </div>
            <div className='col-lg-9 col-md-8 col-sm-12'>
                <AlertDialog handleDeleteClickOk={handleDeleteClickOk} handleDeleteClickCancel={handleDeleteClickCancel} isDeleteDialogOpen={isDeleteDialogOpen} deleteDialogMsg={deleteDialogMsg} />
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <div className='row' style={{display: 'flex', marginTop: '15px'}}>
                        <div className='col-lg-4 col-md-4 col-sm-12'>
                            <div className='row'>
                                {!isTab2FormFieldsHidden &&
                                    <Fragment>
                                        <div className='col-lg-11 text-left' style={{ marginTop: 5 }}>
                                            <label className={classes.label} htmlFor="libraryPool">{libraryPoolLabel}</label>
                                            <div className="input-group mb-3">
                                                <LightTooltip arrow open={validateLibraryPool()} title={validateLibraryPool() ? `Press Enter to Load Sample Sheet again` : ''}>
                                                    <input type='text' onBlur={handleBlur} required name="LibraryPoolId" onKeyDown={handleLibraryPoolKeyDown} ref={methods.register({ required: true })}
                                                        id='libraryPoolId' key='libraryPool' className="form-control" onChange={handleLibraryPoolChange} value={libraryPool} style={{ borderRadius: '5px', }}
                                                        disabled={state.fields.isAllFieldsDisabled ? true : state.record.isRecordOld ? true : false} ref={methods.register()}
                                                        onBlur={(e) => {
                                                            if (libraryPool != '' && importedLibraryPool != libraryPool) {
                                                                setLibraryPoolLabel('Library Pool (Press Enter to Load Sample Sheet again):');
                                                            }
                                                        }}
                                                        style={getLibraryPoolStyle()}
                                                    />
                                                </LightTooltip>
                                                <img src={scan} className={classes.scan} alt="scan" />
                                            </div>
                                        </div>
                                    </Fragment>
                                }
                            </div>
                            <div className='row'>
                                {!isTab2FormFieldsHidden &&
                                    <div className='col-lg-11 text-left'>
                                        <label htmlFor="samplePlateId">Sample Plate:</label>
                                        <div className="input-group mb-3">
                                            <LightTooltip arrow open={prefix1Error || validateSamplePlate(samplePlateId)} title={prefix1Error ? `Sample Plate must starts from ${state.settings.prefixSamplePlate}` : ''}>
                                                <input type='text' required name="SamplePlateId" ref={methods.register({ required: !state.settings.modeAMP2, validate: validateSamplePlate })}
                                                    disabled={isSamplePlateDisabled()} id='samplePlateId' key='samplePlateId' className="form-control" onChange={handleSamplePlateIdChange}
                                                    value={samplePlateId} style={isSamplePlateIdModified ? getSamplePlateStyle() : {}} ref={methods.register()}
                                                />
                                            </LightTooltip>
                                            <img src={scan} alt="scan" className={classes.scan} />
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className='row'>
                                {!isTab2FormFieldsHidden &&
                                    <div className='col-lg-11 text-left'>
                                        <label htmlFor="SeqTubeId">Sequencer Tube:</label>
                                        <div className="input-group mb-3">
                                            <LightTooltip arrow open={prefix2Error || numericValidationError || methods.errors.SeqTubeId && methods.errors.SeqTubeId.type === "validate" || validateSeqTube(seqTubeId)} title={validateSeqTubeBarcode()}>
                                                <input type='text' required name="SeqTubeId" ref={methods.register({ required: !state.settings.modeAMP2, validate: validateSeqTube })} id='SeqTubeId' key='SeqTubeId'
                                                    className="form-control" onChange={handleSeqTubeIdChange} value={seqTubeId == null ? '' : seqTubeId} style={isSeqTubeIdModified ? getSeqTubeStyle() : {}}
                                                    disabled={state.fields.isAllFieldsDisabled ? true : !state.settings.modeAMP2 ? !seqRunStart ? false : true : true} ref={methods.register()}
                                                />
                                            </LightTooltip>
                                            <img src={scan} alt="scan" className={classes.scan} />
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className='row'>
                                {!isTab2FormFieldsHidden &&
                                    <div className='col-lg-11 text-left'>
                                        <Recipes preAmpReagents={preAmpReagents} preAmpReagentsChange={handlePreAmpReagentsChange} methods={methods} sequencingRecipe={sequencingRecipe}
                                            analysisRecipe={analysisRecipe} sequencingRecipes={sequencingRecipes} analysisRecipes={analysisRecipes} onSequencingRecipeSelect={handleSequencingRecipeSelect}
                                            onAnalysisRecipeSelect={handleAnalysisRecipeSelect} isDisabled={state.fields.isAllFieldsDisabled ? true : state.record.isRecordOld ? true : false}
                                            isPreAmpDisabled={state.fields.isAllFieldsDisabled ? true : false} isAnalysisRecipeDisabled={state.fields.isAllFieldsDisabled ? true : false}
                                            isSequencingRecipeDisabled={state.fields.isAllFieldsDisabled ? true : seqRunStart != null && state.record.isRecordOld ? true : false}
                                        />
                                    </div>
                                }
                            </div>
                        </div>
                        <div className='col-lg-8 col-md-8 col-sm-12'>
                            <div className='row'>
                                <div className='col-lg-11' style={{marginTop: 37}}>
                                    {!isTab2FormFieldsHidden && <SampleSheetTable isFound={false} libraryDataGlobal={libraryDataGlobal} isEditable={state.fields.isAllFieldsDisabled ? false : seqRunStart == null && ampRunStart == null && state.record.isRecordOld ? false : true} />}
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-lg-11' style={{ marginTop: libraryDataGlobal != undefined && libraryDataGlobal.length > 0 ? 0 : 0 }}>
                                    {!isTab2FormFieldsHidden && <SampleSheetDropDown rows={libraryDataGlobal} setRows={setLibraryDataGlobal} isEditable={state.fields.isAllFieldsDisabled ? false : seqRunStart == null && ampRunStart == null && state.record.isRecordOld ? false : true} />}
                                </div>
                            </div>
                        </div>
                    </div>
                    {!isTab2FormFieldsHidden &&
                        <div className='row' style={{ marginBottom: 2, marginTop: 8 }}>
                            <Footer handleEditClick={handleEditClick} handleCancelClick={handleCancelClick} handleDeleteClick={handleDeleteClick} handleSearchClickMenu={handleSearchClickMenu}
                                isSearchMode={isSearchMode} isCommentsHidden={isTab2FormFieldsHidden} methods={methods} loading={loading}
                                commentsChange={handleCommentsChange} comments={comments} isCommentsDisabled={state.fields.isAllFieldsDisabled ? true : false}
                            />
                        </div>
                    }
                </form>
            </div>
        </div>

    )

}

export default Tab2;