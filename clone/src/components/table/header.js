import React, { useState, useEffect } from "react";
import { usePopper } from "react-popper";
import { grey } from "./colors";
import ArrowUpIcon from "./img/arrowup";
import ArrowDownIcon from "./img/arrowdown";
import ArrowLeftIcon from "./img/arrowleft";
import ArrowRightIcon from "./img/arrowright";
import TrashIcon from "./img/trash";
import TextIcon from "./text";
import MultiIcon from "./img/multi";
import HashIcon from "./img/hash";
import PlusIcon from "./img/plus";
import { shortId } from "./utils";
import { useDispatch, useSelector } from "react-redux";
import { updateColumnHeader, addColumnLeft, deleteColumn, addColumnRight,setDefaultColumnName, setTableColumns, setTableData, setAlert, clearAlert } from "../actions/index";

const Header = ({ column: { id, created, label, dataType, getResizerProps, getHeaderProps }, setSortBy}) => {
    const dispatch = useDispatch();
    const state = useSelector(state => state);

    const [expanded, setExpanded] = useState(created || false);
    const [referenceElement, setReferenceElement] = useState(null);
    const [popperElement, setPopperElement] = useState(null);
    const [inputRef, setInputRef] = useState(null);
    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        placement: "bottom",
        strategy: "absolute"
    });
    const [header, setHeader] = useState(label);   

    const buttons = [
        {
            onClick: (e) => {
                dispatch(updateColumnHeader({ columnId: id, label: header }));
                setSortBy([{ id: id, desc: false }]);
                setExpanded(false);
            },
            icon: <ArrowUpIcon />,
            label: "Sort ascending",
            disabled: false
        },
        {
            onClick: (e) => {
                dispatch(updateColumnHeader({ columnId: id, label: header }));
                setSortBy([{ id: id, desc: true }]);
                setExpanded(false);
            },
            icon: <ArrowDownIcon />,
            label: "Sort descending",
            disabled: false
        },
        {
            onClick: (e) => {
                dispatch(updateColumnHeader({ columnId: id, label: header }));                           
                dispatch(addColumnLeft({ columnId: id, focus: false, counter: getNewColumnIndex()  }));
                //dispatch(setDefaultColumnName());
                setExpanded(false);
            },
            icon: <ArrowLeftIcon />,
            label: "Insert left",
            disabled: !(state.fields.isAllFieldsDisabled ? false : state.fields.fieldsState.AMP_Run_Start == null && state.fields.fieldsState.Sequencer_Run_Start == null && state.record.isRecordOld ? false : true)
        },
        {
            onClick: (e) => {
                dispatch(updateColumnHeader({ columnId: id, label: header }));
                dispatch(addColumnRight({ columnId: id, focus: false, counter: getNewColumnIndex()  }));
                //dispatch(setDefaultColumnName());
                setExpanded(false);
            },
            icon: <ArrowRightIcon />,
            label: "Insert right",
            disabled: !(state.fields.isAllFieldsDisabled ? false : state.fields.fieldsState.AMP_Run_Start == null && state.fields.fieldsState.Sequencer_Run_Start == null && state.record.isRecordOld ? false : true)
        },
        {
            onClick: (e) => {
                dispatch(updateColumnHeader({ columnId: id, label: header }));
                dispatch(deleteColumn({ columnId: id }));
                setExpanded(false);
            },
            icon: <TrashIcon />,
            label: "Delete",
            disabled: !(state.fields.isAllFieldsDisabled ? false : state.fields.fieldsState.AMP_Run_Start == null && state.fields.fieldsState.Sequencer_Run_Start == null && state.record.isRecordOld ? false : true)
        }
    ];   

    let propertyIcon =  <TextIcon />;    

    useEffect(() => {
        if (created) {
            setExpanded(true);
        }
    }, [created]);

    useEffect(() => {
        setHeader(label);
    }, [label]);

    useEffect(() => {
        if (inputRef) {
            inputRef.focus();
            inputRef.select();
        }
    }, [inputRef]);   

    const handleKeyDown = e => {
        if (e.key === "Enter") {
            dispatch(updateColumnHeader({ columnId: id, label: header }));
            setExpanded(false);
        }
    }

    const handleChange = e => {
        if (state.tabs.activeTab == '2' && (state.fields.isAllFieldsDisabled ? false : state.fields.fieldsState.AMP_Run_Start == null && state.fields.fieldsState.Sequencer_Run_Start == null && state.record.isRecordOld ? false : true)) {            
            var newColumnNameIndex = state.table.columns.map(m => m.label).indexOf(id);
            var columnnameAlreadyExists = state.table.columns.map(m => m.label).indexOf(e.target.value) != -1;
            if (newColumnNameIndex != -1 && !columnnameAlreadyExists) {
                dispatch(clearAlert());
                setHeader(e.target.value);
                var columns = state.table.columns;
                columns[newColumnNameIndex].label = e.target.value;
                columns[newColumnNameIndex].accessor = e.target.value;
                columns[newColumnNameIndex].id = e.target.value;
                dispatch(setTableColumns(columns));
                var data = state.table.data;
                data.map(m => {
                    if (data.indexOf(id) === -1) {
                        var t = Object.getOwnPropertyDescriptor(m, id);
                        if (t != undefined) {
                            Object.defineProperty(m, e.target.value, Object.getOwnPropertyDescriptor(m, id));
                            delete m[id];
                        }
                    }                               
                });
                dispatch(setTableData(data));
            }  
            else dispatch(setAlert(`Column name ${e.target.value} already exists`, "Warning", 'error'));            
        }         
    }

    const handleBlur  = e => {
        e.preventDefault();
        dispatch(updateColumnHeader({ columnId: id, label: header }));
    }    

    const getNewColumnIndex = () => {
        var exists = state.table.columns.map(m => {
            if (m.id != undefined) {
                if ( m.id.toString().includes("Column")) {
                    var str = m.id.replace( /^\D+/g, '');
                    return parseInt(str);
                }                   
            }
        });
        
        return exists.filter(m => m != undefined).length > 0 ? Math.max(...exists.filter(m => m != undefined)) + 1 : 1; 
    }

    const handleAddColumnToLeftClick = e => {
        if (state.tabs.activeTab == '2' && (state.fields.isAllFieldsDisabled ? false : state.fields.fieldsState.AMP_Run_Start == null && state.fields.fieldsState.Sequencer_Run_Start == null && state.record.isRecordOld ? false : true)) {
            dispatch(addColumnLeft({ columnId: 999999, focus: true, counter: getNewColumnIndex() }));            
            //dispatch(setDefaultColumnName());
        } 
    }

    return id !== 999999 ? (
        <>
            <div {...getHeaderProps({ style: { display: "inline-block" } })} className='th noselect'>
                <div className='th-content' onClick={() => setExpanded(true)} ref={setReferenceElement} style={{color: '#008196' }}>
                    <span className='svg-icon svg-gray icon-margin'>{propertyIcon}</span>
                    <strong>{label}</strong>
                </div>
                <div {...getResizerProps()} className='resizer' />
            </div>
            {expanded && <div className='overlay' onClick={() => setExpanded(false)} />}
            {expanded && (
                <div ref={setPopperElement} style={{ ...styles.popper, zIndex: 3 }} {...attributes.popper}>
                    <div
                        className='bg-white shadow-5 border-radius-md'
                        style={{
                            width: 240
                        }}>
                        <div style={{ paddingTop: "0.75rem", paddingLeft: "0.75rem", paddingRight: "0.75rem" }}>
                            <div className='is-fullwidth' style={{ marginBottom: 12 }}>
                                <input
                                    className='form-input'
                                    ref={setInputRef}
                                    type='text'
                                    value={header}
                                    style={{ width: "100%" }}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                        </div>

                        <div
                            key={shortId()}
                            style={{
                                borderTop: `2px solid ${grey(200)}`,
                                padding: "4px 0px"
                            }}>
                            {buttons.map((button, i) => (
                                <button disabled={button.disabled} key={shortId()} type='button' className='sort-button' onMouseDown={button.onClick}>
                                    <span className='svg-icon svg-text icon-margin'>{button.icon}</span>
                                    {button.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    ) : (
        <div {...getHeaderProps({ style: { display: "inline-block"} })} className='th noselect'>
            <div
                className='th-content'
                style={{ display: "flex", justifyContent: "center", color: '#008196' }}
                onClick={() => handleAddColumnToLeftClick()}>
                <span className='svg-icon-sm svg-gray'>
                    <PlusIcon />
                </span>
            </div>
        </div>
    );
}

export default Header;
