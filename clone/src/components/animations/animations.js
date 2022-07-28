import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
        width: 300,
    },
});

const Animations = (props) => {
    const { count, height} = props;
    const classes = useStyles();
    return (
        <div >
            {[...Array(count)].map((e, i) => {
                return <Skeleton key={i} animation="pulse" height={height ? height : 60}/>
            })}
        </div>
    );
};


export default Animations;