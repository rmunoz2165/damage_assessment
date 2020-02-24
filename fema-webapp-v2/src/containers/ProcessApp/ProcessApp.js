import React, { Component } from 'react'
import Aux from '../../hoc/Aux'
import Button from '../../components/Layout/UI/Button/Button'
import Spinner from '../../components/Layout/UI/Spinner/Spinner';
import * as actionCreators from '../../store/actions/index'
import { connect } from 'react-redux';
import classes from './ProcessApp.css'

class ProcessApp extends Component {

    state = {
        processing: false,

    }


    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
        if (nextProps.appData !== this.props.appData && nextProps.appData !== null) {
            console.log(nextProps.appData)
            this.props.processApplication(nextProps.token, nextProps.appData)
        }
    }



    render() {
        let content = <Spinner />
        console.log(this.props.appData)
        if (!this.state.processing) {
            content = (
                <Aux>
                    <h3>Process Application</h3>

                    <div className={classes.Row}>
                        <div className={classes.Column}>
                            <img src={this.props.appData.applicationData['image-url']} alt="uploaded"  className={classes.Image} />
                        </div>
                        <div className={classes.Column}>
                            <img src={this.props.appData.applicationData['street-url']} alt="StreetView"  className={classes.Image} />
                        </div>
                    </div>

                    <div className={classes.Row}>
                        <div className={classes.Column}>
                            <p><b>Uploaded Image</b></p>
                        </div>
                        <div className={classes.Column}>
                            <p><b>StreetView Image</b></p>
                        </div>
                    </div>

                    <div className={classes.Row}>
                        <div className={classes.ColumnFull}>
                            <p><b>Created By:</b> {this.props.appData.applicationData.fname} {this.props.appData.applicationData.lname}</p>
                        </div>
                    </div>

                    <div className={classes.Row}>
                        <div className={classes.ColumnFull}>
                            <p><b>Address: </b>{this.props.appData.applicationData.address}</p>
                        </div>
                    </div>

                    <div>
                        <Button btnType="Danger" clicked={this.props.applicationCanceled}>CANCEL</Button>
                        <Button btnType="Success" clicked={this.props.applicationContinue}>PROCESS</Button>
                    </div>

                </Aux >
            )
        }
        return (
            <Aux >
                {content}
            </Aux >
        )
    }
}

const mapStateToProps = state => {
    return {
        error: state.applications.appError,
        applications: state.applications.applications,
        loading: state.applications.appLoading,
        token: state.auth.token,
        userId: state.auth.localId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processApplication: (token, appData) => dispatch(actionCreators.processApplication(token, appData)),
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(ProcessApp);
