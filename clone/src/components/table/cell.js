
import React, { useEffect, useState } from "react";
import ContentEditable from "react-contenteditable";
import { useDispatch, useSelector } from "react-redux";
import { updateCell } from "../actions/index";

const Cell = ({ value: initialValue, row: { index }, column: { id, dataType, options } }) => {
    const [value, setValue] = useState({ value: initialValue, update: false });

    const dispatch = useDispatch();

    const state = useSelector(state => state);

    const onChange = (e) => {
        setValue({ value: e.target.value, update: false });
    };    

    useEffect(() => {
        setValue({ value: initialValue, update: false });
    }, [initialValue]);

    useEffect(() => {        
        if (value.update) {
            dispatch(updateCell({ columnId: id, rowIndex: index, value: value.value }));
        }
    }, [value, id, index]);

    const isContentEditable = () => {
        if (state.tabs.activeTab == '2' && !(state.fields.isAllFieldsDisabled ? false : state.fields.fieldsState.AMP_Run_Start == null && state.fields.fieldsState.Sequencer_Run_Start == null && state.record.isRecordOld ? false : true) )
            return true;
        else if (state.tabs.activeTab == '1')
            return true;
        else return false;
    }

    let element = (
        <ContentEditable
            disabled={isContentEditable()} 
            html={(value.value && value.value.toString()) || ""}
            onChange={onChange}
            onBlur={() => setValue((old) => ({ value: old.value, update: true }))}
            className='data-input'
        />
    );

    return element;
}

export default Cell;
