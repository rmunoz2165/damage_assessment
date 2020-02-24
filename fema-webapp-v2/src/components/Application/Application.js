import React, { Component } from 'react';
import classes from './Application.css'

class Application extends Component {

    render() {
        return (
            <div className={classes.Column}>
                <div className={classes.FlipCard}>
                    <div className={classes.FlipCardInner}>
                        <div className={classes.FlipCardBack}>
                            <img src={this.props.pictures} alt="Avatar" style={{ "width": "100%" }} />
                        </div>
                        
                        <div className={classes.FlipCardFront} onClick={this.props.clicked}>
                            <div className={classes.Container}>
                                <h4><b>{this.props.fname} {this.props.lname}</b></h4>
                                <p>Street: {this.props.street}</p>
                                <p>City: {this.props.city}</p>
                                <p>{this.props.state}, {this.props.zip}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default Application;