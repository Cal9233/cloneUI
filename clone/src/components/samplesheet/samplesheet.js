import React from 'react';
import ReactDOM from "react-dom";
import { makeStyles } from '@material-ui/core/styles';
import './samplesheet.css';
import ReactDataGrid from 'react-data-grid';
import 'font-awesome/css/font-awesome.min.css';
import Tooltip from "@material-ui/core/Tooltip";
import { FormLabel } from '@material-ui/core';
import { highlightSample } from "../actions/index";
import { useSelector, useDispatch } from "react-redux";

class CustomEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = { color: props.value };
    }

    getValue() {
        return { labelColour: this.state.color };
    }

    getInputNode() {
        return ReactDOM.findDOMNode(this).getElementsByTagName("input")[0];
    }

    handleChangeComplete = color => {
        this.setState({ color: color.hex }, () => this.props.onCommit());
    };
    render() {
        return (
            <span></span>
        );
    }
}


const SampleSheet = (props) => {
    const { isEditable, rows, setRows, maxWidth } = props;
    const highlightedSample = useSelector(state => state.filters.highlightedSample);

    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(highlightSample(''));
    }, []);

    React.useEffect(() => {
        setColumns(isEditable ?
            [
                { key: 'Item2', name: 'Index', sortDescendingFirst: true, sortable: true, editable: true },
                { key: 'Item1', name: 'Sample', sortable: true, editable: true, },
                { key: 'Item3', name: 'Sequence', sortable: true, editable: true }
            ]
            :
            [
                { key: 'Item2', name: 'Index', sortDescendingFirst: true, sortable: true, editable: false },
                { key: 'Item1', name: 'Sample', sortable: true, editable: false, },
                { key: 'Item3', name: 'Sequence', sortable: true, editable: false }
            ]);
    }, [isEditable]);

    const [columns, setColumns] = React.useState(
        isEditable ?
            [
                { key: 'Item2', name: 'Index', sortDescendingFirst: true, sortable: true, editable: true },
                { key: 'Item1', name: 'Sample', sortable: true, editable: true, },
                { key: 'Item3', name: 'Sequence', sortable: true, editable: true }
            ]
            :
            [
                { key: 'Item2', name: 'Index', sortDescendingFirst: true, sortable: true, editable: false },
                { key: 'Item1', name: 'Sample', sortable: true, editable: false, },
                { key: 'Item3', name: 'Sequence', sortable: true, editable: false }
            ]
    );

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
        },
        formLabel: {
            fontSize: '14px',
            color: '#008196',
            marginTop: '9px',
            marginBottom: '13px'
        }
    }));

    const EmptyRowsView = () => {
        const message = "No data to show";
        return (
            <div style={{ textAlign: "center", backgroundColor: "#ddd", padding: "30px", height: '586px' }}>
                <h3>{message}</h3>
                <h5>Please, use 'Search' button to search for Records...</h5>
            </div>
        );
    };

    const classes = useStyles();

    const onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        if (isEditable) {
            var copy = [...rows];
            for (let i = fromRow; i <= toRow; i++) {
                copy[i] = { ...copy[i], ...updated };
            }
            setRows(copy);
        }
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

    const allCellActions = [
        {
            icon: "fa fa-edit disabled",
            callback: () => {
                //alert("Editing");
            }
        }
    ];

    const getCellActions = (column, row) => {
        const cellActions = {
            Item1: allCellActions,
            Item2: allCellActions,
            Item3: allCellActions
        };

        return cellActions[column.key];
    }

    const RowRenderer = ({ renderBaseRow, ...props }) => {
        const style = { fontWeight: props.row.Item1 == highlightedSample ? "bold" : "normal", borderColor: props.row.Item1 == highlightedSample ? "green" : "", borderWidth: props.row.Item1 == highlightedSample ? '1px' : "", borderStyle: props.row.Item1 == highlightedSample ? 'solid' : "" };
        return <div style={style}>{renderBaseRow(props)}</div>;
    };

   /*const checkCellEditable = ({ column, row }) => {
        return false;
     };*/
     

    return (
        <div className='col-lg-11' style={{ maxWidth: maxWidth }}>
            {(rows != undefined && rows.length !== 0) &&
                <React.Fragment>
                    <div className='row'>
                        <div className='col-lg-3 text-left'>
                            <FormLabel className={classes.formLabel}>Sample Sheet</FormLabel>
                        </div>
                    </div>
                    <ReactDataGrid                                              
                        columns={columns}
                        rowGetter={i => rows[i]}
                        rowsCount={rows.length}
                        minHeight={468}
                        enableCellSelect={isEditable}
                        onGridRowsUpdated={onGridRowsUpdated}
                        //getCellActions={getCellActions}
                        onGridSort={(sortColumn, sortDirection) =>
                            setRows(sortRows(rows, sortColumn, sortDirection))
                        }
                        rowRenderer={RowRenderer}   
                        //onCheckCellEditable={checkCellEditable}                                       
                    />
                </React.Fragment>
            }
        </div>
    )
}

export default SampleSheet;