import React from 'react';
import classes from './Apply.css';
import { withRouter } from 'react-router-dom';
import Application from './Application/Application'


const apply = ( props ) => {

    return (
        <div className={classes.Apply}>
            <Application />
        </div>
    )
}
export default withRouter(apply);