import {
    getSequencingRecipeList, getAnalysisRecipeList, getSamplePairs, getRunsBySamplePlate, getRunsBySeqTube,
    getLibraryIndexesByLibraryPool, postLibraryAllData, getSettings, postSettings, searchData, getVersion, getSequencingRecipeListActiveNotUsed, 
    getAnalysisRecipeListActiveNotUsed, uploadSampleSheetFile
} from "../../services/apiServiceFetch";
import {
    LOAD_SEQUENCING_RECIPES, LOAD_ANALYSIS_RECIPES, SET_SETTINGS, POST_SETTINGS, IS_LOADING, SET_ALERT, CLEAR_ALERT, DISABLE_TAB, SET_FILTER_SEARCH_IN, SET_FILTER_FILTER_BY,
    SET_FILTER_SEARCH_TEXT, SET_FILTER_MULTI_SEARCH_VALUE, SEARCHED_DATA, SET_TAB1_SAVE_BUTTON_STATE, SET_TAB1_CANCEL_BUTTON_STATE,
    SET_TAB2_SEARCH_BUTTON_STATE, SET_TAB2_CLEAR_BUTTON_STATE, SET_TAB2_EDIT_BUTTON_STATE, SET_TAB2_SAVE_BUTTON_STATE, SET_TAB2_CANCEL_BUTTON_STATE, SET_TAB2_DELETE_BUTTON_STATE,
    HIDE_FORM2_FIELDS, SET_FILTER_DATE_FROM, SET_FILTER_DATE_TO, SET_FORM_FIELDS_STATE, SET_FILTER_HIGHLIGHTED_SAMPLE, CHECK_PREFIX1, CHECK_PREFIX2, SET_SETTINGS_PATH1,
    SET_SETTINGS_PATH2, SET_SETTINGS_PATH3, SET_SETTINGS_MODEAMP2, SET_SETTINGS_PREFIXSAMPLEPLATE, SET_SETTINGS_PREFIXSEQTUBE, SET_SETTINGS_IS_SEQ_TUBE_BARCODE_VALIDATED, GET_VERSION, SET_ALL_FIELDS_DISABLED, SET_RECORD_IS_OLD,
    SET_ALLOW_EDITING_RUNS_IN_ROGRESS, SET_ACTIVE_TAB, SET_RECORD_STATE_DATA, TOGGLE_UPLOAD_MENU, SET_USER, SET_SETTINGS_PREFIXSAMPLEPLATE_IS_CORRECT, SET_SETTINGS_PREFIXSEQTUBE_IS_CORRECT, SET_READ_ONLY_MODE,
    TABLE_ADD_ROW,TABLE_UPDATE_COLUMN_HEADER, TABLE_UPDATE_COLUMN_TYPE, TABLE_ADD_COLUMN_LEFT, TABLE_SET_TABLE_COLUMNS, TABLE_SET_TABLE_DATA,TABLE_ADD_OPTION_TO_COLUMN, TABLE_UPDATE_CELL, TABLE_DELETE_COLUMN,
    TABLE_ADD_COLUMN_RIGHT, TABLE_STATE_RESET, TABLE_SET_DEFAULT_COLUMN_NAME, TABLE_RESET_DEFAULT_COLUMN_NAME, TABLE_SAVE_STATE, SET_ISAUTHENTICATED, LOGOUT_CURRENT_USER, RESET_STATE, TABLE_SET_TABLE_COLUMNS_TAB1, TABLE_SET_TABLE_DATA_TAB1, SETTINGS_BACKUP_PATH1, SETTINGS_BACKUP_PATH2, SETTINGS_BACKUP_PATH3, SETTINGS_BACKUP_MODE_AMP2, SETTINGS_BACKUP_PREFIX_SAMPLE_PLATE, SETTINGS_BACKUP_PREFIX_SEQ_TUBE   

} from "../constants/action-types";

import AuthAPI from '../auth/api';

export const getSequencingRecipesAll = () => {
    return async dispatch => {
        const json = await getSequencingRecipeList();       
        dispatch({ type: LOAD_SEQUENCING_RECIPES, payload: json });
    };
}

export const getAnalysisRecipesAll = () => {
    return async dispatch => {
        const json = await getAnalysisRecipeList();        
        dispatch({ type: LOAD_ANALYSIS_RECIPES, payload: json });
    };
}

export const getSequencingRecipesAllWithTs = () => {
    return async dispatch => {
        const json = await getSequencingRecipeList();    
        if (json != undefined) {
            json.map(m => {
                if (m.Inactive_Since != null)
                    m.Name = `${m.Name}_${new Date(m.Inactive_Since).toLocaleDateString()}_${new Date(m.Inactive_Since).toLocaleTimeString()}`;
            });
        }   
        dispatch({ type: LOAD_SEQUENCING_RECIPES, payload: json });
    };
}

export const getAnalysisRecipesAllWithTs = () => {
    return async dispatch => {
        const json = await getAnalysisRecipeList();
        if (json != undefined) {
            json.map(m => {
                if (m.Inactive_Since != null)
                    m.Name = `${m.Name}_${new Date(m.Inactive_Since).toLocaleDateString()}_${new Date(m.Inactive_Since).toLocaleTimeString()}`;
            });
        }
        dispatch({ type: LOAD_ANALYSIS_RECIPES, payload: json });
    };
}

export const getSequencingRecipesActiveNotUsed = () => {
    return async dispatch => {
        //const json = await getSequencingRecipeList();
        const json = await getSequencingRecipeListActiveNotUsed();
        dispatch({ type: LOAD_SEQUENCING_RECIPES, payload: json });
    };
}

export const getAnalysisRecipesActiveNotUsed = () => {
    return async dispatch => {
        //const json = await getAnalysisRecipeList();
        const json = await getAnalysisRecipeListActiveNotUsed();
        dispatch({ type: LOAD_ANALYSIS_RECIPES, payload: json });
    };
}


export const getSettingsData = () => {
    return async dispatch => {
        dispatch({ type: IS_LOADING, payload: true });
        await getSettings()
            .then(response => {
                if (!response.ok) throw Error(response.statusText);
                return response.json();
            })
            .then(json => {
                dispatch({ type: IS_LOADING, payload: false });                
                json.forEach(val => {
                    if (val.paramname === 'Path1') {
                        dispatch({ type: SET_SETTINGS_PATH1, payload: unescape(val.value) });
                        dispatch({ type: SETTINGS_BACKUP_PATH1, payload: unescape(val.value) });
                    }  

                    if (val.paramname === 'Path2') {
                        dispatch({ type: SET_SETTINGS_PATH2, payload: unescape(val.value) }); 
                        dispatch({ type: SETTINGS_BACKUP_PATH2, payload: unescape(val.value) });
                    } 

                    if (val.paramname === 'Path3') {
                        dispatch({ type: SET_SETTINGS_PATH3, payload: unescape(val.value) });
                        dispatch({ type: SETTINGS_BACKUP_PATH3, payload: unescape(val.value) });
                    }
                                            
                    if (val.paramname === 'modeAMP2') {
                        dispatch({ type: SET_SETTINGS_MODEAMP2, payload: val.value == 'true' ? true : false });
                        dispatch({ type: SETTINGS_BACKUP_MODE_AMP2, payload: val.value == 'true' ? true : false });
                    }
                        
                    if (val.paramname === 'Prefix1') {
                        dispatch({ type: SET_SETTINGS_PREFIXSAMPLEPLATE, payload: unescape(val.value) }); 
                        dispatch({ type: SETTINGS_BACKUP_PREFIX_SAMPLE_PLATE, payload: unescape(val.value) });
                    }
                        
                    if (val.paramname === 'Prefix2') {
                        dispatch({ type: SET_SETTINGS_PREFIXSEQTUBE, payload: unescape(val.value) });
                        dispatch({ type: SETTINGS_BACKUP_PREFIX_SEQ_TUBE, payload: unescape(val.value) });
                    }
                        
                    if (val.paramname === 'IsSeqTubeBarcodeValidated')
                        dispatch({ type: SET_SETTINGS_IS_SEQ_TUBE_BARCODE_VALIDATED, payload: val.value == 'true' ? true : false });                        
                });
            })
            .catch(error => {
                dispatch({ type: SET_ALERT, payload: { errorMessage: error.message, errorCode: error.message, errorType: 'error' } });
                dispatch({ type: IS_LOADING, payload: false });
            });
    };
}

export const postSettingsData = (settings) => {
    return async dispatch => {
        dispatch({ type: IS_LOADING, payload: true });
        await postSettings(settings.path1, settings.path2, settings.path3, settings.modeAMP2, settings.prefixSamplePlate, settings.prefixSeqTube)
            .then(response => {
                if (!response.ok) throw Error(response.statusText);
                return response.json();
            })
            .then(json => {
                dispatch({ type: IS_LOADING, payload: false });
                dispatch({ type: POST_SETTINGS, payload: true });
                dispatch(getSettingsData());
                dispatch({ type: SET_ALERT, payload: { errorMessage: '', errorCode: 'Saved successfully', errorType: 'success' } });
            })
            .catch(error => {
                dispatch({ type: SET_ALERT, payload: { errorMessage: error.message, errorCode: error.message, errorType: 'error' } });
                dispatch({ type: IS_LOADING, payload: false });
            });
    };
}

export const setAlert = (errorMessage, errorCode, errorType) => {
    return async dispatch => {
        dispatch({ type: SET_ALERT, payload: { errorMessage: errorMessage, errorCode: errorCode, errorType: errorType } });
    };
}

export const clearAlert = () => {
    return async dispatch => {
        dispatch({ type: CLEAR_ALERT, payload: { errorMessage: '', errorCode: '', errorType: '' } });
    };
}

export const disableTab = (tab1, tab2) => {
    return async dispatch => {
        dispatch({ type: DISABLE_TAB, payload: { isTab1Disabled: tab1, isTab2Disabled: tab2 } });
    };
}

export const setFilterSearchIn = (searchIn) => {
    return async dispatch => {
        dispatch({ type: SET_FILTER_SEARCH_IN, payload: searchIn });
    };
}

export const setIsLoading = (isLoading) => {
    return async dispatch => {
        dispatch({ type: IS_LOADING, payload: isLoading });
    };
}

export const setFilterFilterBy = (filterBy, filterByFieldType, isMultiSearchEnabled) => {
    return async dispatch => {
        dispatch({ type: SET_FILTER_FILTER_BY, payload: { filterBy: filterBy, filterByFieldType: filterByFieldType, isMultiSearchEnabled: isMultiSearchEnabled } });
    };
}

export const setFilterSearchText = (searchText) => {
    return async dispatch => {
        dispatch({ type: SET_FILTER_SEARCH_TEXT, payload: searchText });
    };
}

export const setFilterDateFrom = (dateFrom) => {
    return async dispatch => {
        dispatch({ type: SET_FILTER_DATE_FROM, payload: dateFrom });
    };
}

export const setFilterDateTo = (dateTo) => {
    return async dispatch => {
        dispatch({ type: SET_FILTER_DATE_TO, payload: dateTo });
    };
}

export const setFilterMultiSearchValue = (value) => {
    return async dispatch => {
        dispatch({ type: SET_FILTER_MULTI_SEARCH_VALUE, payload: value });
    };
}

export const highlightSample = (sample) => {
    return async dispatch => {
        dispatch({ type: SET_FILTER_HIGHLIGHTED_SAMPLE, payload: sample });
    };
}

export const runSearch = (data) => {
    return async dispatch => {
        dispatch({ type: SEARCHED_DATA, payload: data });
    };
}

export const setTab1SaveButtonState = (isDisabled, isHidden) => {
    return async dispatch => {
        dispatch({ type: SET_TAB1_SAVE_BUTTON_STATE, payload: { isDisabled: isDisabled, isHidden: isHidden } });
    };
}

export const setTab1CancelButtonState = (isDisabled, isHidden) => {
    return async dispatch => {
        dispatch({ type: SET_TAB1_CANCEL_BUTTON_STATE, payload: { isDisabled: isDisabled, isHidden: isHidden } });
    };
}

export const setTab2SearchButtonState = (isDisabled, isHidden) => {
    return async dispatch => {
        dispatch({ type: SET_TAB2_SEARCH_BUTTON_STATE, payload: { isDisabled: isDisabled, isHidden: isHidden } });
    };
}

export const setTab2ClearButtonState = (isDisabled, isHidden) => {
    return async dispatch => {
        dispatch({ type: SET_TAB2_CLEAR_BUTTON_STATE, payload: { isDisabled: isDisabled, isHidden: isHidden } });
    };
}

export const setTab2EditButtonState = (isDisabled, isHidden) => {
    return async dispatch => {
        dispatch({ type: SET_TAB2_EDIT_BUTTON_STATE, payload: { isDisabled: isDisabled, isHidden: isHidden } });
    };
}

export const setTab2SaveButtonState = (isDisabled, isHidden) => {
    return async dispatch => {
        dispatch({ type: SET_TAB2_SAVE_BUTTON_STATE, payload: { isDisabled: isDisabled, isHidden: isHidden } });
    };
}

export const setTab2CancelButtonState = (isDisabled, isHidden) => {
    return async dispatch => {
        dispatch({ type: SET_TAB2_CANCEL_BUTTON_STATE, payload: { isDisabled: isDisabled, isHidden: isHidden } });
    };
}

export const setTab2DeleteButtonState = (isDisabled, isHidden) => {
    return async dispatch => {
        dispatch({ type: SET_TAB2_DELETE_BUTTON_STATE, payload: { isDisabled: isDisabled, isHidden: isHidden } });
    };
}

export const hideForm2Fields = (value) => {
    return async dispatch => {
        dispatch({ type: HIDE_FORM2_FIELDS, payload: value });
    };
}

export const setFieldsState = (state) => {
    return async dispatch => {
        dispatch({ type: SET_FORM_FIELDS_STATE, payload: state });
    };
}

export const checkPrefix1 = (str) => {
    return async dispatch => {        
        dispatch({ type: CHECK_PREFIX1, payload: str });
    };
}

export const checkPrefix2 = (str) => {
    return async dispatch => {        
        dispatch({ type: CHECK_PREFIX2, payload: str });
    };
}

export const setSettingsPath1 = (str) => {
    return async dispatch => {        
        dispatch({ type: SET_SETTINGS_PATH1, payload: str });
    };
}

export const setSettingsPath2 = (str) => {
    return async dispatch => {        
        dispatch({ type: SET_SETTINGS_PATH2, payload: str });
    };
}

export const setSettingsPath3 = (str) => {
    return async dispatch => {        
        dispatch({ type: SET_SETTINGS_PATH3, payload: str });
    };
}

export const setSettingsModeAMP2 = (str) => {
    return async dispatch => {        
        dispatch({ type: SET_SETTINGS_MODEAMP2, payload: str });
    };
}

export const setSettingsPrefix1 = (str) => {
    return async dispatch => {        
        dispatch({ type: SET_SETTINGS_PREFIXSAMPLEPLATE, payload: str });
    };
}

export const setSettingsPrefix2 = (str) => {
    return async dispatch => {        
        dispatch({ type: SET_SETTINGS_PREFIXSEQTUBE, payload: str });
    };
}

export const getVersionData = () => {
    return async dispatch => {
        const json = await getVersion();        
        dispatch({ type: GET_VERSION, payload: json });
    };
}

export const setAllFieldsDisabled = (isDisabled) => {
    return async dispatch => {        
        dispatch({ type: SET_ALL_FIELDS_DISABLED, payload: isDisabled });
    };
}

export const setRecordIsOld = (isUsed) => {
    return async dispatch => {
        dispatch({ type: SET_RECORD_IS_OLD, payload: isUsed });
    };
}

export const setAllowEditingRunsInProgress = (value) => {
    return async dispatch => {        
        dispatch({ type: SET_ALLOW_EDITING_RUNS_IN_ROGRESS, payload: value });
    };
}

export const setActiveTab = (tabName) => {
    return async dispatch => {
        dispatch({ type: SET_ACTIVE_TAB, payload: tabName });
    };
}

export const setRecordStateData = (data) => {
    return async dispatch => {
        dispatch({ type: SET_RECORD_STATE_DATA, payload: data });
    };
}

export const uploadSampleSheet = (file) => {    
    return async dispatch => {
        dispatch({ type: IS_LOADING, payload: true });
        await uploadSampleSheetFile(file)
            .then(response => {                
                if (!response.ok) throw Error(response.statusText);
                return response.json();
            })
            .then(json => {
                dispatch({ type: IS_LOADING, payload: false });
                dispatch({ type: TOGGLE_UPLOAD_MENU, payload: false });
                dispatch({ type: SET_ALERT, payload: { errorMessage: '', errorCode: 'Uploaded successfully', errorType: 'success' } });
            })
            .catch(error => {                
                dispatch({ type: SET_ALERT, payload: error.message === "Unsupported Media Type" ? { errorMessage: "Only CSV files are allowed", errorCode: error.name, errorType: 'error' } : { errorMessage: error.message, errorCode: error.name, errorType: 'error' } });
                dispatch({ type: IS_LOADING, payload: false });
            });
    };
}


export const toggleUploadMenu = (isOpen) => {
    return async dispatch => {
        dispatch({ type: TOGGLE_UPLOAD_MENU, payload: isOpen });
    };
}

export const setUser = (user) => {
    return async dispatch => {
        dispatch({ type: SET_USER, payload: user });
    };
}

export const setIsPrefixSamplePlateCorrect = (data) => {
    return async dispatch => {
        dispatch({ type: SET_SETTINGS_PREFIXSAMPLEPLATE_IS_CORRECT, payload: data });
    };
}

export const setIsPrefixSeqTubeCorrect = (data) => {
    return async dispatch => {
        dispatch({ type: SET_SETTINGS_PREFIXSEQTUBE_IS_CORRECT, payload: data });
    };
}

export const setIsAuthenticated = (data) => {
    return async dispatch => {
        dispatch({ type: SET_ISAUTHENTICATED, payload: data });
    };
}

export const logOutCurrentUser = () => {
    return async dispatch => {
        dispatch({ type: IS_LOADING, payload: true });
        await AuthAPI.logOut().then(response => {
            dispatch({ type: LOGOUT_CURRENT_USER, payload: undefined });
            dispatch({ type: IS_LOADING, payload: false });
        }).catch(error => {
            dispatch({ type: SET_ALERT, payload: { errorMessage: error.message, errorCode: error.message, errorType: 'error' } });
            dispatch({ type: IS_LOADING, payload: false });
        });
    };
}

export const resetState = () => {
    return async dispatch => {
        dispatch({ type: RESET_STATE });
    };
}

export const setIsReadOnlyMode = (data) => {
    return async dispatch => {
        dispatch({ type: SET_READ_ONLY_MODE, payload: data });
    };
}

export const addRow = (data) => {
    return async dispatch => {
        dispatch({ type: TABLE_ADD_ROW, payload: data });
    };
}

export const updateColumnHeader = (data) => {
    return async dispatch => {
        dispatch({ type: TABLE_UPDATE_COLUMN_HEADER, payload: data });
    };
}

export const updateColumnType = (data) => {
    return async dispatch => {
        dispatch({ type: TABLE_UPDATE_COLUMN_TYPE, payload: data });
    };
}

export const addColumnLeft = (data) => {
    return async dispatch => {
        dispatch({ type: TABLE_ADD_COLUMN_LEFT, payload: data });
    };
}

export const setTableColumns = (data) => {
    return async dispatch => {
        dispatch({ type: TABLE_SET_TABLE_COLUMNS, payload: data });
    };
}

export const setTableData = (data) => {
    return async dispatch => {
        dispatch({ type: TABLE_SET_TABLE_DATA, payload: data });
    };
}

export const setTableColumnsTab1 = (data) => {
    return async dispatch => {
        dispatch({ type: TABLE_SET_TABLE_COLUMNS_TAB1, payload: data });
    };
}

export const setTableDataTab1 = (data) => {
    return async dispatch => {
        dispatch({ type: TABLE_SET_TABLE_DATA_TAB1, payload: data });
    };
}

export const addOptionToColumn = (data) => {
    return async dispatch => {
        dispatch({ type: TABLE_ADD_OPTION_TO_COLUMN, payload: data });
    };
}

export const updateCell = (data) => {
    return async dispatch => {
        dispatch({ type: TABLE_UPDATE_CELL, payload: data });
    };
}

export const deleteColumn = (data) => {
    return async dispatch => {
        dispatch({ type: TABLE_DELETE_COLUMN, payload: data });
    };
}

export const addColumnRight = (data) => {
    return async dispatch => {
        dispatch({ type: TABLE_ADD_COLUMN_RIGHT, payload: data });
    };
}

export const resetTableState = () => {
    return async dispatch => {
        dispatch({ type: TABLE_STATE_RESET });
    };
}

export const setDefaultColumnName = () => {
    return async dispatch => {
        dispatch({ type: TABLE_SET_DEFAULT_COLUMN_NAME });
    };
}

export const resetDefaultColumnName = () => {
    return async dispatch => {
        dispatch({ type: TABLE_RESET_DEFAULT_COLUMN_NAME });
    };
}

export const saveTableState = (state) => {
    return async dispatch => {
        dispatch({ type: TABLE_SAVE_STATE, payload: state });
    };
}

export const backupSettingsPath1Data = (data) => {
    return async dispatch => {
        dispatch({ type: SETTINGS_BACKUP_PATH1, payload: data });
    };
}

export const backupSettingsPath2Data = (data) => {
    return async dispatch => {
        dispatch({ type: SETTINGS_BACKUP_PATH2, payload: data });
    };
}

export const backupSettingsPath3Data = (data) => {
    return async dispatch => {
        dispatch({ type: SETTINGS_BACKUP_PATH3, payload: data });
    };
}

export const backupSettingsModeAMPData = (data) => {
    return async dispatch => {
        dispatch({ type: SETTINGS_BACKUP_MODE_AMP2, payload: data });
    };
}

export const backupSettingsPrefixSamplePlateData = (data) => {
    return async dispatch => {
        dispatch({ type: SETTINGS_BACKUP_PREFIX_SAMPLE_PLATE, payload: data });
    };
}

export const backupSettingsPrefixSeqTubeData = (data) => {
    return async dispatch => {
        dispatch({ type: SETTINGS_BACKUP_PREFIX_SEQ_TUBE, payload: data });
    };
}