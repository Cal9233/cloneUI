import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { DropdownButton, Dropdown, Button, InputGroup } from "react-bootstrap";
import './samplesheetdropdown.css';
import { setAlert } from "../actions/index";
import RemoveIcon from '@material-ui/icons/DeleteForeverOutlined';

const SampleSheetDropDown = (props) => {
    const { rows, setRows, isEditable } = props;

    const [selectedValue, setSelectedValue] = useState('');
    const [isSelectHidden, setSelectIsHidden] = useState(true);
    const [attributeName, setAttributeName] = useState('');
    const [attributeValue, setAttributeValue] = useState('');
    const [attributeNameRequired, setAttributeNameRequired] = useState(false);
    const [attributeValueRequired, setAttributeValueRequired] = useState(false);

    const dispatch = useDispatch();

    React.useEffect(() => {
        setSelectedValue('');
        if (rows != undefined && rows.length > 0) {
            setSelectedValue(rows[0]);
            setSelectIsHidden(false);
        }
        if (rows != undefined && rows.length === 0) {
            setSelectIsHidden(true);
        }
    }, [rows]);

    React.useEffect(() => {       
        setAttributeName('');
        setAttributeValue('');
    }, [isEditable]);

    React.useEffect(() => {       
        setAttributeNameRequired(false);
        setAttributeValueRequired(false);
    }, [isSelectHidden]);

    React.useEffect(() => {
        if (attributeName != '') {
            setAttributeNameRequired(false);
        }
    }, [attributeName]);

    React.useEffect(() => {
        if (attributeValue != '') {
            setAttributeValueRequired(false);
        }
    }, [attributeValue]);    

    const handleSelectedValueChange = e => {
        if (rows != undefined && rows.length > 0) {
            var row = rows.find(f => f.Item1 == e.target.textContent);
            if (row != undefined)
                setSelectedValue(row);
        }
    }

    const handleInputChange = e => {
        if (selectedValue != undefined && selectedValue.Item1 != undefined) {
            var rowIdx = rows.findIndex(f => f.Item1 === selectedValue.Item1);
            if (rowIdx != -1) {
                rows[rowIdx].Item1 = selectedValue.Item1;
                rows[rowIdx].Item2 = e.target.value;
                setSelectedValue({ Item1: selectedValue.Item1, Item2: e.target.value });
                setRows(rows);
            }
        }
    }

    const handleAddnewAttributeClick = e => {
        setSelectIsHidden(!isSelectHidden);
    }

    const handleNameInputChange = e => {
        setAttributeName(e.target.value);
    }

    const handleValueInputChange = e => {
        setAttributeValue(e.target.value);
    }

    const handleSubmitClick = () => {
        if (attributeName === '') {
            setAttributeNameRequired(true);
        }

        if (attributeValue === '') {
            setAttributeValueRequired(true);
        }

        if (attributeName != '' && attributeValue != '') {
            var exists = checkAttributeNameExists(attributeName);
            if (!exists) {
                setAttributeNameRequired(false);
                setRows([...rows, { Item1: attributeName, Item2: attributeValue }]);
                setSelectIsHidden(true);
                setAttributeName('');
                setAttributeValue('');
            }
            else {
                dispatch(setAlert(`Attribute name "${attributeName}" already exists`, 'Duplicate Name', 'error'));
            }
        }
    }

    const checkAttributeNameExists = value => {
        return rows.map(m => m.Item1.toLowerCase()).filter(row => row != undefined && row != null && row != '').indexOf(value.toLowerCase()) >= 0;
    }

    const handleDeleteOptionClick = e => {
        if (rows != undefined && rows.length > 0) {
            var filtered = rows.filter(f => f.Item1 != e);
            setRows(filtered);

            if (filtered.length === 0) {
                setSelectedValue('');
                setSelectIsHidden(!isSelectHidden);
            }
        }
    }

    return (
        <div id="formGroup">
            {!isSelectHidden ?
                <React.Fragment>
                    <InputGroup className="mb-3">
                        <DropdownButton
                            id="dropdown-button-dark"
                            menuvariant="dark"
                            title={selectedValue != undefined && selectedValue != '' ? selectedValue.Item1 : (rows && rows.length > 0) && rows[0].Item1}
                            onClick={(e) => handleSelectedValueChange(e)}
                        >
                            {rows && rows.map((m, i) => {
                                var s = selectedValue != undefined && selectedValue.Item2 != undefined ? selectedValue.Item2 : selectedValue;
                                return <Dropdown.Item active={m.Item2 === s ? true : false} key={i}>{m.Item1}{isEditable && <i className='pull-right' style={{ verticalAlign: 'unset !important' }} onClick={() => handleDeleteOptionClick(m.Item1)}><RemoveIcon /></i>}</Dropdown.Item>
                            })}
                        </DropdownButton>
                        <input type='text' className="form-control" value={(selectedValue != undefined && selectedValue != null && selectedValue != '' && selectedValue.Item2 != undefined) ? selectedValue.Item2 : selectedValue} onChange={handleInputChange} disabled={!isEditable} />
                        <Button onClick={handleAddnewAttributeClick} style={{ width: 50 }} className="dropDownAdd" disabled={!isEditable} >{!isSelectHidden ? '+' : '-'}</Button>
                    </InputGroup>
                </React.Fragment>
                :
                <InputGroup className="mb-3">
                    <InputGroup.Text className="pull-right">Name:</InputGroup.Text>
                    <input type='text' className="form-control" onChange={handleNameInputChange} id="globalAttrName" placeholder={attributeNameRequired ? "Name is required" : "Enter Name"} value={attributeName} disabled={!isEditable} style={attributeNameRequired ? { borderColor: 'red' } : { borderColor: '#ced4da' }} />
                    <InputGroup.Text>Value:</InputGroup.Text>
                    <input type='text' className="form-control" onChange={handleValueInputChange} id="globalAttrValue" placeholder={attributeValueRequired ? "Value is required" : "Enter Value"} value={attributeValue} disabled={!isEditable} style={attributeValueRequired ? { borderColor: 'red' } : { borderColor: '#ced4da' }} />
                    <Button onClick={handleSubmitClick} style={{ width: 100 }} className="dropDownAdd" disabled={!isEditable} >Add</Button>
                    <Button onClick={handleAddnewAttributeClick} style={{ width: 50 }} className="dropDownAdd" disabled={!isEditable} >{!isSelectHidden ? '+' : '-'}</Button>
                </InputGroup>
            }
        </div >
    );
}

export default SampleSheetDropDown;