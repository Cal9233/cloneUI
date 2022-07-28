import {
    LOAD_SEQUENCING_RECIPES, LOAD_ANALYSIS_RECIPES, SET_SETTINGS, SET_SETTINGS_PATH1, SET_SETTINGS_PATH2, SET_SETTINGS_PATH3, SET_SETTINGS_MODEAMP2, SET_SETTINGS_PREFIXSAMPLEPLATE,
    SET_SETTINGS_PREFIXSEQTUBE, POST_SETTINGS, IS_LOADING, SET_ALERT, CLEAR_ALERT, DISABLE_TAB, SET_FILTER_SEARCH_IN,
    SET_FILTER_FILTER_BY, SET_FILTER_SEARCH_TEXT, SET_FILTER_MULTI_SEARCH_VALUE, SEARCHED_DATA, SET_TAB1_SAVE_BUTTON_STATE, SET_TAB1_CANCEL_BUTTON_STATE,
    SET_TAB2_SEARCH_BUTTON_STATE, SET_TAB2_CLEAR_BUTTON_STATE, SET_TAB2_EDIT_BUTTON_STATE, SET_TAB2_SAVE_BUTTON_STATE, SET_TAB2_CANCEL_BUTTON_STATE, SET_TAB2_DELETE_BUTTON_STATE,
    HIDE_FORM2_FIELDS, SET_FILTER_DATE_FROM, SET_FILTER_DATE_TO, SET_FORM_FIELDS_STATE, SET_FILTER_HIGHLIGHTED_SAMPLE, CHECK_PREFIX1, CHECK_PREFIX2, GET_VERSION, SET_ALL_FIELDS_DISABLED,
    SET_RECORD_IS_OLD, SET_ALLOW_EDITING_RUNS_IN_ROGRESS, SET_SETTINGS_IS_SEQ_TUBE_BARCODE_VALIDATED, SET_ACTIVE_TAB, SET_RECORD_STATE_DATA, TOGGLE_UPLOAD_MENU, SET_USER,
    SET_SETTINGS_PREFIXSAMPLEPLATE_IS_CORRECT, SET_SETTINGS_PREFIXSEQTUBE_IS_CORRECT, TABLE_ADD_ROW, TABLE_UPDATE_COLUMN_HEADER, TABLE_UPDATE_COLUMN_TYPE, TABLE_ADD_COLUMN_LEFT,
    TABLE_SET_TABLE_COLUMNS, TABLE_SET_TABLE_DATA, TABLE_ADD_OPTION_TO_COLUMN, TABLE_UPDATE_CELL, TABLE_DELETE_COLUMN, TABLE_ADD_COLUMN_RIGHT, TABLE_STATE_RESET, TABLE_SET_DEFAULT_COLUMN_NAME,
    TABLE_RESET_DEFAULT_COLUMN_NAME, TABLE_SAVE_STATE, SET_READ_ONLY_MODE, SET_ISAUTHENTICATED, LOGOUT_CURRENT_USER, RESET_STATE, TABLE_SET_TABLE_COLUMNS_TAB1, TABLE_SET_TABLE_DATA_TAB1, SETTINGS_BACKUP_PATH1, SETTINGS_BACKUP_PATH2, SETTINGS_BACKUP_PATH3, SETTINGS_BACKUP_MODE_AMP2, SETTINGS_BACKUP_PREFIX_SAMPLE_PLATE, SETTINGS_BACKUP_PREFIX_SEQ_TUBE
}
    from "../constants/action-types";

const getInitialState = () => {
    return {
        filterByRowData: [{ Id: 0, Name: 'Library Pool', fieldType: 'text', multiSearch: false }, { Id: 1, Name: 'Sample Plate', fieldType: 'text', multiSearch: false }, 
        { Id: 2, Name: 'Sequencer Tube', fieldType: 'text', multiSearch: false }, { Id: 3, Name: 'Sample', fieldType: 'text', multiSearch: false }, 
        { Id: 4, Name: 'Pre-AMP Reagents', fieldType: 'text', multiSearch: false }, { Id: 5, Name: 'Sequencing Recipe', fieldType: 'text', multiSearch: false }, 
        { Id: 6, Name: 'Analysis Recipe', fieldType: 'text', multiSearch: false }, { Id: 7, Name: 'Comments', fieldType: 'text', multiSearch: true },
        { Id: 8, Name: 'AMP Start Time', fieldType: 'date', multiSearch: false }, { Id: 9, Name: 'AMP Stop Time', fieldType: 'date', multiSearch: false },
        { Id: 10, Name: 'Sequencing Start Time', fieldType: 'date', multiSearch: false }, { Id: 11, Name: 'Sequencing Stop Time', fieldType: 'date', multiSearch: false }],
        sequencingRecipes: [],
        analysisRecipes: [],
        settings: {
            allowEditingRunsInProgress: false,
            isSeqTubeBarcodeValidated: true,
            path1: '',
            path1_backup: '',
            path2: '',
            path2_backup: '',
            path3: '',
            path3_backup: '',
            modeAMP2: false,
            modeAMP2_backup: false,
            prefixSamplePlate: 'SP', 
            prefixSamplePlate_backup: 'SP',        
            prefixSeqTube: 'SQM',
            prefixSeqTube_backup: 'SQM',
            isPrefixedSamplePlateCorrectly: true,
            isPrefixedSeqTubeCorrectly: true,
            isSettingsSuccessfullySaved: false,                
        },
        error: {
            errorMessage: '',
            errorCode: '',
            errorType: ''
        },
        isLoading: false,
        tabs: {
            activeTab: '1',
            isTab1Disabled: false,
            isTab2Disabled: false,
        },
        filters: {
            filterBy: -1,
            filterByFieldType: 'text',
            searchIn: 0,
            isMultiSearchEnabled: false,
            multiSearchValue: '0',
            searchText: '',
            dateFrom: '',
            dateTo: '',
            highlightedSample: '',
        },
        buttons: {
            tab1: {
                saveButton: {
                    isDisabled: true,
                    isHidden: false
                },
                cancelButton: {
                    isDisabled: true,
                    isHidden: false
                }
            },
            tab2: {
                searchButton: {
                    isDisabled: false,
                    isHidden: false
                },
                clearButton: {
                    isDisabled: true,
                    isHidden: false
                },
                editButton: {
                    isDisabled: true,
                    isHidden: false
                },
                saveButton: {
                    isDisabled: true,
                    isHidden: false
                },
                cancelButton: {
                    isDisabled: true,
                    isHidden: false
                },
                deleteButton: {
                    isDisabled: true,
                    isHidden: false
                }
            }
        },
        fields: {
            isTab2FormFieldsHidden: true,
            fieldsState: {},
            isAllFieldsDisabled: false,
        },    
        SearchDataFound: [],
        version: '',
        record: {
            isRecordOld: false,
            data: {},
            isReadOnly: true,
        },
        menu: {
            isUploadMenuOpen: false
        },
        user: {},
        table: {
            data: [],
            data_tab1: [],
            columns: [],
            columns_tab1: [],
            skipReset: true,
            defaultColumnName: 1,        
        },
        saved: {
            table_state: {}
        },
        isAuthenticated: false,
    };
}

const rootReducer = (state = getInitialState(), action) => {
    if (action.type === LOAD_SEQUENCING_RECIPES) {
        return { ...state, sequencingRecipes: action.payload };
    }

    if (action.type === LOAD_ANALYSIS_RECIPES) {
        return { ...state, analysisRecipes: action.payload };
    }

    if (action.type === SET_SETTINGS) {
        return Object.assign({}, state, {
            settings: {
                ...state.settings,
                settings: action.payload
            }
        });
    }

    if (action.type === SET_SETTINGS_PATH1) {
        return Object.assign({}, state, {
            settings: {
                ...state.settings,
                path1: action.payload
            }
        });
    }

    if (action.type === SET_SETTINGS_PATH2) {
        return Object.assign({}, state, {
            settings: {
                ...state.settings,
                path2: action.payload
            }
        });
    }

    if (action.type === SET_SETTINGS_PATH3) {
        return Object.assign({}, state, {
            settings: {
                ...state.settings,
                path3: action.payload
            }
        });
    }

    if (action.type === SET_SETTINGS_MODEAMP2) {
        return Object.assign({}, state, {
            settings: {
                ...state.settings,
                modeAMP2: action.payload
            }
        });
    }

    if (action.type === SET_SETTINGS_PREFIXSAMPLEPLATE) {
        return Object.assign({}, state, {
            settings: {
                ...state.settings,
                prefixSamplePlate: action.payload
            }
        });
    }

    if (action.type === SET_SETTINGS_PREFIXSEQTUBE) {
        return Object.assign({}, state, {
            settings: {
                ...state.settings,
                prefixSeqTube: action.payload
            }
        });
    }


    if (action.type === SET_SETTINGS_PREFIXSAMPLEPLATE_IS_CORRECT) {
        return Object.assign({}, state, {
            settings: {
                ...state.settings,
                isPrefixedSamplePlateCorrectly: action.payload
            }
        });
    }


    if (action.type === SET_SETTINGS_PREFIXSEQTUBE_IS_CORRECT) {
        return Object.assign({}, state, {
            settings: {
                ...state.settings,
                isPrefixedSeqTubeCorrectly: action.payload
            }
        });
    }

    if (action.type === SET_SETTINGS_IS_SEQ_TUBE_BARCODE_VALIDATED) {
        return Object.assign({}, state, {
            settings: {
                ...state.settings,
                isSeqTubeBarcodeValidated: action.payload
            }
        });
    }

    if (action.type === SET_ALLOW_EDITING_RUNS_IN_ROGRESS) {
        return Object.assign({}, state, {
            settings: {
                ...state.settings,
                allowEditingRunsInProgress: action.payload
            }
        });
    }

    if (action.type === POST_SETTINGS) {
        return Object.assign({}, state, {
            settings: {
                ...state.settings,
                isSettingsSuccessfullySaved: action.payload
            }
        });
    }

    if (action.type === IS_LOADING) {
        return { ...state, isLoading: action.payload };
    }

    if (action.type === SET_ALERT) {
        return Object.assign({}, state, {
            error: {
                ...state.error,
                errorMessage: action.payload.errorMessage,
                errorCode: action.payload.errorCode,
                errorType: action.payload.errorType
            }
        });
    }

    if (action.type === CLEAR_ALERT) {
        return Object.assign({}, state, {
            error: {
                ...state.error,
                errorMessage: action.payload.errorMessage,
                errorCode: action.payload.errorCode,
                errorType: action.payload.errorType
            }
        });
    }

    if (action.type === DISABLE_TAB) {
        return Object.assign({}, state, {
            tabs: {
                ...state.tabs,
                isTab1Disabled: action.payload.isTab1Disabled,
                isTab2Disabled: action.payload.isTab2Disabled,
            }
        });
    }

    if (action.type === SET_ACTIVE_TAB) {
        return Object.assign({}, state, {
            tabs: {
                ...state.tabs,
                activeTab: action.payload,
            }
        });
    }

    if (action.type === SET_FILTER_SEARCH_IN) {
        return Object.assign({}, state, {
            filters: {
                ...state.filters,
                searchIn: action.payload
            }
        });
    }

    if (action.type === SET_FILTER_FILTER_BY) {
        return Object.assign({}, state, {
            filters: {
                ...state.filters,
                filterBy: action.payload.filterBy,
                filterByFieldType: action.payload.filterByFieldType,
                isMultiSearchEnabled: action.payload.isMultiSearchEnabled,
            }
        });
    }

    if (action.type === SET_FILTER_SEARCH_TEXT) {
        return Object.assign({}, state, {
            filters: {
                ...state.filters,
                searchText: action.payload,
            }
        });
    }

    if (action.type === SET_FILTER_DATE_FROM) {
        return Object.assign({}, state, {
            filters: {
                ...state.filters,
                dateFrom: action.payload,
            }
        });
    }

    if (action.type === SET_FILTER_DATE_TO) {
        return Object.assign({}, state, {
            filters: {
                ...state.filters,
                dateTo: action.payload,
            }
        });
    }


    if (action.type === SET_FILTER_MULTI_SEARCH_VALUE) {
        return Object.assign({}, state, {
            filters: {
                ...state.filters,
                multiSearchValue: action.payload,
            }
        });
    }

    if (action.type === SET_FILTER_HIGHLIGHTED_SAMPLE) {
        return Object.assign({}, state, {
            filters: {
                ...state.filters,
                highlightedSample: action.payload,
            }
        });
    }

    if (action.type === SEARCHED_DATA) {
        return { ...state, SearchDataFound: action.payload };
    }

    if (action.type === SET_TAB1_SAVE_BUTTON_STATE) {
        return Object.assign({}, state, {
            buttons: Object.assign({}, state.buttons, {
                tab1: Object.assign({}, state.buttons.tab1, {
                    saveButton: Object.assign({}, state.buttons.tab1.saveButton, {
                        isDisabled: action.payload.isDisabled,
                        isHidden: action.payload.isHidden
                    })
                })
            })
        });
    }

    if (action.type === SET_TAB1_CANCEL_BUTTON_STATE) {
        return Object.assign({}, state, {
            buttons: Object.assign({}, state.buttons, {
                tab1: Object.assign({}, state.buttons.tab1, {
                    cancelButton: Object.assign({}, state.buttons.tab1.cancelButton, {
                        isDisabled: action.payload.isDisabled,
                        isHidden: action.payload.isHidden
                    })
                })
            })
        });
    }

    if (action.type === SET_TAB2_SEARCH_BUTTON_STATE) {
        return Object.assign({}, state, {
            buttons: Object.assign({}, state.buttons, {
                tab2: Object.assign({}, state.buttons.tab2, {
                    searchButton: Object.assign({}, state.buttons.tab2.searchButton, {
                        isDisabled: action.payload.isDisabled,
                        isHidden: action.payload.isHidden
                    })
                })
            })
        });
    }

    if (action.type === SET_TAB2_CLEAR_BUTTON_STATE) {
        return Object.assign({}, state, {
            buttons: Object.assign({}, state.buttons, {
                tab2: Object.assign({}, state.buttons.tab2, {
                    clearButton: Object.assign({}, state.buttons.tab2.clearButton, {
                        isDisabled: action.payload.isDisabled,
                        isHidden: action.payload.isHidden
                    })
                })
            })
        });
    }

    if (action.type === SET_TAB2_EDIT_BUTTON_STATE) {
        return Object.assign({}, state, {
            buttons: Object.assign({}, state.buttons, {
                tab2: Object.assign({}, state.buttons.tab2, {
                    editButton: Object.assign({}, state.buttons.tab2.editButton, {
                        isDisabled: action.payload.isDisabled,
                        isHidden: action.payload.isHidden
                    })
                })
            })
        });
    }

    if (action.type === SET_TAB2_SAVE_BUTTON_STATE) {
        return Object.assign({}, state, {
            buttons: Object.assign({}, state.buttons, {
                tab2: Object.assign({}, state.buttons.tab2, {
                    saveButton: Object.assign({}, state.buttons.tab2.saveButton, {
                        isDisabled: action.payload.isDisabled,
                        isHidden: action.payload.isHidden
                    })
                })
            })
        });
    }

    if (action.type === SET_TAB2_CANCEL_BUTTON_STATE) {
        return Object.assign({}, state, {
            buttons: Object.assign({}, state.buttons, {
                tab2: Object.assign({}, state.buttons.tab2, {
                    cancelButton: Object.assign({}, state.buttons.tab2.cancelButton, {
                        isDisabled: action.payload.isDisabled,
                        isHidden: action.payload.isHidden
                    })
                })
            })
        });
    }

    if (action.type === SET_TAB2_DELETE_BUTTON_STATE) {
        return Object.assign({}, state, {
            buttons: Object.assign({}, state.buttons, {
                tab2: Object.assign({}, state.buttons.tab2, {
                    deleteButton: Object.assign({}, state.buttons.tab2.deleteButton, {
                        isDisabled: action.payload.isDisabled,
                        isHidden: action.payload.isHidden
                    })
                })
            })
        });
    }

    if (action.type === HIDE_FORM2_FIELDS) {
        return Object.assign({}, state, {
            fields: {
                ...state.fields,
                isTab2FormFieldsHidden: action.payload,
            }
        });
    }

    if (action.type === SET_FORM_FIELDS_STATE) {
        return Object.assign({}, state, {
            fields: Object.assign({}, state.fields, {
                ...state.fields,
                fieldsState: action.payload
            })
        });
    }

    if (action.type === SET_ALL_FIELDS_DISABLED) {
        return Object.assign({}, state, {
            fields: {
                ...state.fields,
                isAllFieldsDisabled: action.payload,
            }
        });
    }

    if (action.type === CHECK_PREFIX1) {
        return Object.assign({}, state, {
            settings: {
                ...state.settings,
                isPrefixedSamplePlateCorrectly: action.payload
            }
        });
    }

    if (action.type === CHECK_PREFIX2) {
        return Object.assign({}, state, {
            settings: {
                ...state.settings,
                isPrefixedSeqTubeCorrectly: action.payload
            }
        });
    }

    if (action.type === GET_VERSION) {
        return { ...state, version: action.payload };
    }

    if (action.type === SET_RECORD_IS_OLD) {
        return Object.assign({}, state, {
            record: {
                ...state.record,
                isRecordOld: action.payload
            }
        });
    }

    if (action.type === SET_ALLOW_EDITING_RUNS_IN_ROGRESS) {
        return Object.assign({}, state, {
            settings: {
                ...state.settings,
                allowEditingRunsInProgress: action.payload
            }
        });
    }

    if (action.type === SET_RECORD_STATE_DATA) {
        return Object.assign({}, state, {
            record: {
                ...state.record,
                data: action.payload,
            }
        });
    }

    if (action.type === TOGGLE_UPLOAD_MENU) {
        return Object.assign({}, state, {
            menu: {
                ...state.menu,
                isUploadMenuOpen: action.payload
            }
        });
    }

    if (action.type === SET_USER) {
        return { ...state, user: action.payload };
    }

    if (action.type === SET_READ_ONLY_MODE) {
        return Object.assign({}, state, {
            record: {
                ...state.record,
                isReadOnly: action.payload
            }
        });
    }

    if (action.type === TABLE_ADD_ROW) {
        return Object.assign({}, state, {
            table: {
                ...state.table,
                skipReset: true,
                data: [...action.payload, {}]
            }
        });
    }

    if (action.type === TABLE_UPDATE_COLUMN_HEADER) {
        const index = state.table.columns.findIndex(
            (column) => column.id === action.payload.columnId
        );
        return Object.assign({}, state, {
            table: {
                ...state.table,
                skipReset: true,
                columns: [
                    ...state.table.columns.slice(0, index),
                    { ...state.table.columns[index], label: action.payload.label, /*accessor: action.payload.label, id: `${action.payload.label}`*/ },
                    ...state.table.columns.slice(index + 1, state.table.columns.length)
                ]
            }
        });
    }

    if (action.type === TABLE_UPDATE_COLUMN_TYPE) {
        const typeIndex = state.table.columns.findIndex(
            (column) => column.id === action.payload.columnId
        );
        return Object.assign({}, state, {
            table: {
                ...state.table,
                skipReset: true,
                columns: [
                    ...state.table.columns.slice(0, typeIndex),
                    { ...state.table.columns[typeIndex], dataType: action.payload.dataType },
                    ...state.table.columns.slice(typeIndex + 1, state.table.columns.length)
                ],
                data: state.table.data.map((row) => ({
                    ...row,
                    [action.payload.columnId]: isNaN(row[action.payload.columnId])
                        ? ""
                        : Number.parseInt(row[action.payload.columnId])
                }))
            }
        });
    }

    if (action.type === TABLE_ADD_COLUMN_LEFT) {
        const leftIndex = state.table.columns.findIndex(
            (column) => column.id === action.payload.columnId
        );        
        return Object.assign({}, state, {
            table: {
                ...state.table,
                skipReset: true,
                columns: [
                    ...state.table.columns.slice(0, leftIndex),
                    {
                        id: `Column${action.payload.counter}`,
                        label: `Column${action.payload.counter}`,
                        accessor: `Column${action.payload.counter}`,
                        dataType: "text",
                        created: action.payload.focus && true,
                        options: []
                    },
                    ...state.table.columns.slice(leftIndex, state.table.columns.length)
                ]
            }
        });
    }

    if (action.type === TABLE_ADD_COLUMN_RIGHT) {
        const rightIndex = state.table.columns.findIndex(
            (column) => column.id === action.payload.columnId
        );        
        return Object.assign({}, state, {
            table: {
                ...state.table,
                skipReset: true,
                columns: [
                    ...state.table.columns.slice(0, rightIndex + 1),
                    {
                        id: `Column${action.payload.counter}`,
                        label: `Column${action.payload.counter}`,
                        accessor: `Column${action.payload.counter}`,
                        dataType: "text",
                        created: action.payload.focus && true,
                        options: []
                    },
                    ...state.table.columns.slice(rightIndex + 1, state.table.columns.length)
                ]
            }
        });
    }

    if (action.type === TABLE_SET_TABLE_COLUMNS) {
        return Object.assign({}, state, {
            table: {
                ...state.table,
                skipReset: true,
                columns:  action.payload === undefined ? [
                    {
                        id: "Item2",
                        label: "Index",
                        accessor: "Item2",
                        minWidth: 100,
                        dataType: "text",
                        options: []
                    },
                    {
                        id: "Item1",
                        label: "Sample",
                        accessor: "Item1",
                        minWidth: 100,
                        dataType: "text",
                        options: []
                    },
                    {
                        id: "Item3",
                        label: "Sequence",
                        accessor: "Item3",
                        minWidth: 100,
                        dataType: "text",
                        options: []
                    },
                    {
                        id: 999999,
                        width: 20,
                        label: "+",
                        disableResizing: true,
                        dataType: "null"
                    }
                ] 
                : action.payload
            }
        });
    }

    if (action.type === TABLE_SET_TABLE_COLUMNS_TAB1) {
        return Object.assign({}, state, {
            table: {
                ...state.table,
                skipReset: true,
                columns_tab1:  action.payload === undefined ? [
                    {
                        id: "Item2",
                        label: "Index",
                        accessor: "Item2",
                        minWidth: 100,
                        dataType: "text",
                        options: []
                    },
                    {
                        id: "Item1",
                        label: "Sample",
                        accessor: "Item1",
                        minWidth: 100,
                        dataType: "text",
                        options: []
                    },
                    {
                        id: "Item3",
                        label: "Sequence",
                        accessor: "Item3",
                        minWidth: 100,
                        dataType: "text",
                        options: []
                    },
                    {
                        id: 999999,
                        width: 20,
                        label: "+",
                        disableResizing: true,
                        dataType: "null"
                    }
                ] 
                : action.payload
            }
        });
    }

    if (action.type === TABLE_SET_TABLE_DATA) {
        return Object.assign({}, state, {
            table: {
                ...state.table,
                skipReset: true,
                data: action.payload
            }
        });
    }

    if (action.type === TABLE_SET_TABLE_DATA_TAB1) {
        return Object.assign({}, state, {
            table: {
                ...state.table,
                skipReset: true,
                data_tab1: action.payload
            }
        });
    }

    if (action.type === TABLE_ADD_OPTION_TO_COLUMN) {
        const optionIndex = state.table.columns.findIndex(
            (column) => column.id === action.payload.columnId
        );
        return Object.assign({}, state, {
            table: {
                ...state.table,
                skipReset: true,
                columns: [
                    ...state.table.columns.slice(0, optionIndex),
                    {
                        ...state.table.columns[optionIndex],
                        options: [
                            ...state.table.columns[optionIndex].options,
                            { label: action.payload.option, backgroundColor: action.payload.backgroundColor }
                        ]
                    },
                    ...state.table.columns.slice(optionIndex + 1, state.table.columns.length)
                ]
            }
        });
    }

    if (action.type === TABLE_UPDATE_CELL) {
        return Object.assign({}, state, {
            table: {
                ...state.table,
                skipReset: true,
                data: state.table.data.map((row, index) => {
                    if (index === action.payload.rowIndex) {
                        return {
                            ...state.table.data[action.payload.rowIndex],
                            [action.payload.columnId]: action.payload.value
                        };
                    }
                    return row;
                })
            }
        });
    }

    if (action.type === TABLE_DELETE_COLUMN) {
        const deleteIndex = state.table.columns.findIndex(
            (column) => column.id === action.payload.columnId
        );
        var upd = [];
        state.table.data.forEach(item => {
            delete item[action.payload.columnId];
            upd.push(item);
        });
        return Object.assign({}, state, {
            table: {
                ...state.table,
                skipReset: true,
                columns: [
                    ...state.table.columns.slice(0, deleteIndex),
                    ...state.table.columns.slice(deleteIndex + 1, state.table.columns.length)
                ],
                data: upd
            }
        });
    }    

    if (action.type === TABLE_STATE_RESET) {
        return Object.assign({}, state, {
            table: {
                ...state.table,
                skipReset: false,
                //data: [],

                //defaultColumnName: 1
            }
        });
    }

    if (action.type === TABLE_SET_DEFAULT_COLUMN_NAME) {
        return Object.assign({}, state, {
            table: {
                ...state.table,
                defaultColumnName: state.table.defaultColumnName + 1
            }
        });
    }

    if (action.type === TABLE_RESET_DEFAULT_COLUMN_NAME) {
        return Object.assign({}, state, {
            table: {
                ...state.table,               
                defaultColumnName: 1
            }
        });
    } 
    
    if (action.type === TABLE_SAVE_STATE) {
        return Object.assign({}, state, {
            saved: {
                ...state.saved,
                table_state: action.payload
            }
        });
    }

    if (action.type === SET_ISAUTHENTICATED) {
        return { ...state, isAuthenticated: action.payload };
    }

    if (action.type === LOGOUT_CURRENT_USER) {
        return { ...state, user: undefined, isAuthenticated: false };
    }

    if (action.type === RESET_STATE) {
        return getInitialState();
    }

    if (action.type === SETTINGS_BACKUP_PATH1) {
        return Object.assign({}, state, {
            settings: {
                ...state.settings,
                path1_backup:action.payload              
            }
        });
    }

    if (action.type === SETTINGS_BACKUP_PATH2) {
        return Object.assign({}, state, {
            settings: {
                ...state.settings,               
                path2_backup: action.payload               
            }
        });
    }

    if (action.type === SETTINGS_BACKUP_PATH3) {
        return Object.assign({}, state, {
            settings: {
                ...state.settings,
                path3_backup:action.payload,              
            }
        });
    }

    if (action.type === SETTINGS_BACKUP_MODE_AMP2) {
        return Object.assign({}, state, {
            settings: {
                ...state.settings,
                modeAMP2_backup:action.payload,              
            }
        });
    }

    if (action.type === SETTINGS_BACKUP_PREFIX_SAMPLE_PLATE) {
        return Object.assign({}, state, {
            settings: {
                ...state.settings,
                prefixSamplePlate_backup:action.payload              
            }
        });
    }

    if (action.type === SETTINGS_BACKUP_PREFIX_SEQ_TUBE) {
        return Object.assign({}, state, {
            settings: {
                ...state.settings,
                prefixSeqTube_backup:action.payload              
            }
        });
    }

    return state;
}

export default rootReducer;