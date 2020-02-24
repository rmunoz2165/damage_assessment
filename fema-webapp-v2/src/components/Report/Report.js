import React, { Component } from 'react';
import classes from './Report.css'

class Report extends Component {

    render() {
        return (
            <div className={classes.Container}>
                <div className={classes.Child}>{this.props.fname}</div>
                <div className={classes.Child}>{this.props.lname}</div>
                <div className={classes.Child}>{this.props.street}</div>
                <div className={classes.Child}>{this.props.city}</div>
                <div className={classes.Child}>{this.props.state}</div>
                <div className={classes.Child}>{this.props.zip}</div>
                <div className={classes.Child}></div>
                <div className={classes.Child}></div>
            </div>

        );
    }
}

export default Report;