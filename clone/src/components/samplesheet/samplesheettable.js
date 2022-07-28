import React, { useState } from 'react';
import 'react-table-v6/react-table.css'
import { useDispatch, useSelector } from "react-redux";
import './samplesheettable.css';
import Table from '../table/table';
import { setTableColumns, setTableColumnsTab1 } from "../actions/index";

const SampleSheetTable = (props) => {
    const { libraryDataGlobal, isFound } = props;
    const [isTableShown, setTableIsShown] = useState(false);

    const isLoading = useSelector(state => state.isLoading);
    const activeTab = useSelector(state => state.tabs.activeTab);
    const state = useSelector(state => state);
   
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(setTableColumns([]));
        dispatch(setTableColumnsTab1([]));
    }, []);

    const arrayEquals = (a, b) => {
        return Array.isArray(a) &&
          Array.isArray(b) &&
          a.length === b.length &&
          a.sort().every((val, index) => val === b.sort()[index]);
    }
      

    React.useEffect(() => {
        if (state.table.data != undefined && state.table.data.length > 0) {
            var currentColumns = state.table.columns.map(m => m.accessor).filter(f => f != undefined && f != null && f != '');
            var updatedColumns = Object.keys(state.table.data[0]).filter(f => f != undefined && f != null && f != '');
            var isEqual = arrayEquals(currentColumns, updatedColumns);
    
            if (!isEqual) {
                var newColumns = updatedColumns.filter( function( el ) {
                    return currentColumns.indexOf( el ) < 0;
                  } );
    
                  var cols = [];
                  newColumns.forEach(item => {
                    cols.push({
                        id: item,
                        label: item,
                        accessor: item,
                        minWidth: 100,
                        dataType: "text",
                        options: []
                    }); 
                  });
                  var copy = [...state.table.columns];
                  cols.forEach(item => copy.splice(state.table.columns.length - 1, 0, item));
                  dispatch(setTableColumns(copy));             
            }
            else {
                dispatch(setTableColumns(state.table.columns));
            }         
        }                      
    }, [state.table.data]);    

    React.useEffect(() => {
        if (state.table.data_tab1 != undefined && state.table.data_tab1.length > 0) {
            var currentColumns = state.table.columns_tab1.map(m => m.accessor).filter(f => f != undefined && f != null && f != '');
            var updatedColumns = Object.keys(state.table.data_tab1[0]).filter(f => f != undefined && f != null && f != '');
            var isEqual = arrayEquals(currentColumns, updatedColumns);
    
            if (!isEqual) {
                var newColumns = updatedColumns.filter( function( el ) {
                    return currentColumns.indexOf( el ) < 0;
                  } );
    
                  var cols = [];
                  newColumns.forEach(item => {
                    cols.push({
                        id: item,
                        label: item,
                        accessor: item,
                        minWidth: 100,
                        dataType: "text",
                        options: []
                    }); 
                  });
                  var copy = [...state.table.columns_tab1];
                  cols.forEach(item => copy.splice(state.table.columns_tab1.length - 1, 0, item));
                  dispatch(setTableColumnsTab1(copy));             
            }
            else {
                dispatch(setTableColumnsTab1(state.table.columns_tab1));
            }         
        }                    
    }, [state.table.data_tab1]); 

    const transformLabels = data => {
        if (data != undefined && data.length) {
            data = data.map(item => {
                if (item.label === 'Item2' ) {
                    item.label = 'Index';
                }
                if (item.label === 'Item1' ) {
                    item.label = 'Sample'; 
                }

                if (item.label === 'Item3' ) {
                    item.label = 'Sequence'; 
                }
               
                return item;
            })
        } 

        return data;
    }

    const table = (
        <Table
            columns={activeTab === '2' ? transformLabels(state.table.columns) : transformLabels(state.table.columns_tab1)}
            data={activeTab === '2' ? state.table.data : state.table.data_tab1 }
            loading={isLoading}
            skipReset={state.table.skipReset}
            libraryDataGlobal={libraryDataGlobal}
        />
    );

    React.useEffect(() => {
        if (activeTab === '1' && isFound && state.table.data_tab1 != undefined && state.table.data_tab1.length !== 0)
            setTableIsShown(true);
        else if (activeTab === '2' )
            setTableIsShown(true);
        else setTableIsShown(false);         
    }, [activeTab]);   

    return (
        <React.Fragment>
            {isTableShown && table}
        </React.Fragment>
    )
}

export default SampleSheetTable;

