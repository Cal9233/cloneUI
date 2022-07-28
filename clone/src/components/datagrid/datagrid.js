import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ReactDataGrid from 'react-data-grid';
import { useDispatch, useSelector } from "react-redux";

const RowFormatter = (props) => {
    return (
        <span style={{fontWeight: 'bold'}}>
            {props.value}
        </span>
    );
}

const DataGrid = (props) => {
    const { data, displayBy, handleRowSelect, isClearClicked, selectedIndexes, setSelectedIndexes } = props;
    const [rows, setRows] = React.useState(data.map(el => (el.Sample_Plate == null || el.Sample_Plate == '') ? {...el, Sample_Plate: '<empty>' } : el).map(el => (el.Sample_Tube == null || el.Sample_Tube == '') ? {...el, Sample_Tube: '<empty>' } : el));
    const [columns, setColumns] = React.useState([{ key: displayBy.dbName, name: displayBy.label, editable: false }]); 
    
    const state = useSelector(state => state);

    React.useEffect(() => {
        var newData = data.map(el => (el.Sample_Plate == null || el.Sample_Plate == '') ? {...el, Sample_Plate: '<empty>' } : el).map(el =>  (el.Sample_Tube == null || el.Sample_Tube == '') ? {...el, Sample_Tube: '<empty>' } : el);
        var gridRows = getGridColumns(newData);
        setRows(gridRows);
        if (data != undefined && data.length)
          handleRowSelect(data[0]);
    }, [data, state.SearchDataFound]);

    React.useEffect(() => {
        setColumns([{ key: displayBy.dbName, name: displayBy.label, editable: false, formatter: RowFormatter }]);
        var newData = data.map(el =>  (el.Sample_Plate == null || el.Sample_Plate == '') ? {...el, Sample_Plate: '<empty>' } : el).map(el =>  (el.Sample_Tube == null || el.Sample_Tube == '') ? {...el, Sample_Tube: '<empty>' } : el);
        var gridRows = getGridColumns(newData);
        setRows(gridRows);
    }, [displayBy]);

    React.useEffect(() => {
        setRows([]);
    }, [isClearClicked]);    

    const sortModel = [
        {
            field: 'commodity',
            sort: 'asc',
        },
    ];

    const useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
            marginTop: 15
        },
        label: {
            marginLeft: 5,
            textAlign: 'left !important'
        },
        edit: {
            float: 'right',
            verticalAlign: 'middle',
            cursor: 'pointer'
        }
    }));

    const classes = useStyles();

    const onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        setRows(state => {
            for (let i = fromRow; i <= toRow; i++) {
                rows[i] = { ...rows[i], ...updated };
            }
            return { rows };
        });
    };

    const sortRows = (initialRows, sortColumn, sortDirection) => rows => {
        const comparer = (a, b) => {
            if (sortDirection === "ASC") {
                return a[sortColumn] > b[sortColumn] ? 1 : -1;
            } else if (sortDirection === "DESC") {
                return a[sortColumn] < b[sortColumn] ? 1 : -1;
            }
        };

        return sortDirection === "NONE" ? initialRows : [...rows].sort(comparer);
    };

    const getGridColumns = data => {
        const gridRows = [];       
        if (data != undefined) {
            if (data.length) {
                if (displayBy.value === 0) {
                    data.map(row => gridRows.push({ 'Library_Pool': row[displayBy.dbName] }));
                }
                else if (displayBy.value === 1) {
                    data.map(row => gridRows.push({ 'Sample_Plate': row[displayBy.dbName], 'Library_Pool': row['Library_Pool'] }));
                }
                else if (displayBy.value === 2) {
                    data.map(row => gridRows.push({ 'Sample_Tube': row[displayBy.dbName], 'Library_Pool': row['Library_Pool'] }));
                }
            }
        }

        return gridRows;
    };

    const onRowClick = (rowIdx, row) => {       
        if (rowIdx != -1) {
            setSelectedIndexes([]);
            setSelectedIndexes(rowIdx);
            var record = null;
            
            if (displayBy.value === 0) {
                record = data.find(r => r.Library_Pool === row.Library_Pool);
            }
            else if (displayBy.value === 1) {
                record = data.find(r => {
                    if (row.Sample_Plate == '<empty>')
                    {
                        //return r.Sample_Plate == null;
                        //if Sample_Plate is empty we are searching by Library Pool  
                        return r.Library_Pool === row.Library_Pool;
                    }                        
                    else return r.Sample_Plate === row.Sample_Plate;
                }) 
            }
            else if (displayBy.value === 2) {
                record = data.find(r => {
                    if (row.Sample_Tube == '<empty>')
                    {
                        return r.Library_Pool === row.Library_Pool;
                    }                        
                    else return r.Sample_Tube === row.Sample_Tube;

                    //r.Sample_Tube === row.Sample_Tube
                });
            }
           
            handleRowSelect(record);
        }
    }

    const EmptyRowsView = () => {
        const message = "No data to show";
        return (
            <div style={{ textAlign: "center", backgroundColor: "#ddd", padding: "30px", height: '586px' }}>
                <h3>{message}</h3>
                <h5>Please, use 'Search' button to search for Records...</h5>
            </div>
        );
    };

    return (
        <ReactDataGrid
            columns={columns}
            rowGetter={i => rows[i]}
            rowsCount={rows.length}
            minHeight={586} 
            minWidth={405}           
            enableCellSelect={false}
            onGridRowsUpdated={onGridRowsUpdated}
            headerRowHeight={-1}
            /*onGridSort={(sortColumn, sortDirection) =>
                setRows(sortRows(data, sortColumn, sortDirection))
            }*/
            enableRowSelect='single'
            onRowClick={onRowClick}
            emptyRowsView={EmptyRowsView}
            rowSelection={{
                showCheckbox: false,
                selectBy: {
                    indexes: selectedIndexes
                }
            }}
            enableCellAutoFocus={true}
        />
    )
}

export default DataGrid;