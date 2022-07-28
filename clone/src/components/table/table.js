import React, { useMemo, useState } from "react";
import { useTable, useFlexLayout, useResizeColumns, useSortBy } from "react-table";
import Cell from "./cell";
import Header from "./header";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import Pagination from './pagination';

const defaultColumn = {
    minWidth: 50,
    width: 150,
    maxWidth: 400,
    Cell: Cell,
    Header: Header,
    sortType: "alphanumericFalsyLast",
};

const Table = ({ columns, data, loading, libraryDataGlobal }) => {
    const state = useSelector(state => state);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(8); 

    const sortTypes = useMemo(
        () => ({
            alphanumericFalsyLast(rowA, rowB, columnId, desc) {
                if (!rowA.values[columnId] && !rowB.values[columnId]) {
                    return 0;
                }

                if (!rowA.values[columnId]) {
                    return desc ? -1 : 1;
                }

                if (!rowB.values[columnId]) {
                    return desc ? 1 : -1;
                }

                return isNaN(rowA.values[columnId])
                    ? rowA.values[columnId].localeCompare(rowB.values[columnId])
                    : rowA.values[columnId] - rowB.values[columnId];
            }
        }),
        []
    );

    const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = useTable(
        {
            columns,
            data,
            defaultColumn,
            //dataDispatch,
            autoResetSortBy: !state.table.skipReset,
            autoResetFilters: !state.table.skipReset,
            autoResetRowState: !state.table.skipReset,
            sortTypes,

        },
        useFlexLayout,
        useResizeColumns,
        useSortBy,
    );

    const currentTableData = useMemo(() => {
        if (rows != undefined && rows.length) {
            const firstPageIndex = (currentPage - 1) * pageSize;
            const lastPageIndex = firstPageIndex + pageSize;
            return rows.slice(firstPageIndex, lastPageIndex);
        }
    }, [currentPage, rows]);
   

    const getTableStyles = () => {        
        if (libraryDataGlobal != undefined && libraryDataGlobal.length > 0 && data.length >= pageSize && state.tabs.activeTab == '2')
            return { maxWidth: 850, };
        else if ((libraryDataGlobal == undefined || (libraryDataGlobal != undefined && libraryDataGlobal.length === 0)) && data.length <= pageSize && state.tabs.activeTab == '2')
            return { maxWidth: 850, };
        else if (state.tabs.activeTab == '2')
            return { maxWidth: 850, }
        else return { maxWidth: 1325 }
    }   

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-lg-12" style={{overflowX: 'auto', overflowY: 'hidden', border: '1px solid grey', /*maxWidth: state.tabs.activeTab == '1' ? 1325 : 850,*/ maxWidth: state.tabs.activeTab == '1' ? '93%' : '97%', height: state.tabs.activeTab == '1' ? 375 : 375, marginLeft:15, paddingLeft: 0, paddingRight: 0 }} id="sampleSheetTableContainer">
                    <div id="sampleSheetTable" {...getTableProps()} className={`table `} style={getTableStyles()} >
                        <div>
                            {headerGroups.map((headerGroup, i) => (
                                <div {...headerGroup.getHeaderGroupProps()} className='tr' key={(i+1)*2}>
                                    {headerGroup.headers.map((column, j) => <React.Fragment key={(j+1)*3}>{column.render("Header")}</React.Fragment>)}
                                </div>
                            ))}
                        </div>
                        <div {...getTableBodyProps()}>
                            {currentTableData && currentTableData.map((row, i) => {
                                prepareRow(row);
                                return (
                                    <div {...row.getRowProps()} className='tr' key={(i+2)*4}>
                                        {row.cells.map((cell, j) => (
                                            <div {...cell.getCellProps()} className='td' key={(i+j)*5}>
                                                {cell.render("Cell")}
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <div className="row" style={{maxHeight: 38, marginTop:10}}>
                <div className="col-lg-12  text-center">
                    <div className="pagination" style={{ display: 'table', alignItems: 'center', margin: '0 auto' }}>
                        <Pagination
                            className="pagination-bar"
                            currentPage={currentPage}
                            totalCount={state.tabs.activeTab == '2' ? state.table.data.length : state.table.data_tab1.length}
                            pageSize={pageSize}
                            onPageChange={page => setCurrentPage(page)}
                        />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Table;
