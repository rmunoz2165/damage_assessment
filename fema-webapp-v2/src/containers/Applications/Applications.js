import React, { Component } from 'react';
//import classes from './Orders.css'
import Application from '../../components/Application/Application';
import axinstance from '../../axios-orders';
import Spinner from '../../components/Layout/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as actionCreators from '../../store/actions/index'
import { connect } from 'react-redux';
import classes from './Applications.css'
import Backdrop from '../../components/Layout/UI/Backdrop/Backdrop'
import ProcessApp from '../ProcessApp/ProcessApp'
import Modal from '../../components/Layout/UI/Modal/Modal'
import ConfirmProcess from '../ConfirmProcess/ConfirmProcess'

class Applications extends Component {
    state = {
        applications: null,
        loading: true,
        cardClicked: false,
        appData: null,
        processing: false,
        confirmed: false
    }

    componentDidMount() {
        // Round about way to handle incoorect calls.
        this.props.onInitOrders(this.props.token, this.props.userId);

    }
    onCardClicked = (event, applicationdata) => {
        this.setState({ cardClicked: true, appData: applicationdata })
    }

    onProcessStarted = (event) => {
        this.setState({ cardClicked: false, processing: true })
    }

    onProcessEnded = (event) => {
        this.setState({ cardClicked: false, processing: false })
    }

    onConfirmation = (event) => {
        console.log("Onconfirmation")
        console.log(this.state.appData)
        this.setState({ cardClicked: false, processing: false, confirmed: true })
        this.props.onProcessApplication(this.props.token, this.state.appData)
    }

    confirmationCancel = (event) => {
        console.log("Confirmed Cancel!!!")
        this.setState({ cardClicked: false, appData: null, processing: false, confirmed: false })
    }

    onCardClosed = () => {
        console.log("onCardClosed")
        this.setState({ cardClicked: false, appData: null })
    }
    render() {

        let applications = <Spinner />
        if (this.props.error) {
            applications = <h1>{this.props.error}</h1>
        }
        if (!this.props.loading) {
            if (this.props.applications) {
                applications = Object.keys(this.props.applications).map((okey) => {
                    return (<Application key={okey}
                        appid={this.props.applications[okey]['applicationData'].appid}
                        fname={this.props.applications[okey]['applicationData'].fname}
                        lname={this.props.applications[okey]['applicationData'].lname}
                        street={this.props.applications[okey]['applicationData'].street}
                        city={this.props.applications[okey]['applicationData'].city}
                        state={this.props.applications[okey]['applicationData'].state}
                        zip={this.props.applications[okey]['applicationData'].zipCode}
                        ownership={this.props.applications[okey]['applicationData'].owned}
                        pictures={this.props.applications[okey]['applicationData']['image-url']}
                        check={okey}
                        clicked={(event) => (this.onCardClicked(event, this.props.applications[okey]))}
                    />)
                })
            } else {
                applications = <h1>No Orders Found!</h1>
            }
        }
        let modalDisp = (
            <div >
                <Backdrop show={this.state.cardClicked} clicked={this.onCardClosed} />
                <div className={classes.Modal}
                    style={{
                        transform: this.state.cardClicked ? 'translateY(0)' : 'translateY(-100vh)',
                        opacity: this.state.cardClicked ? '1' : '0'
                    }}>
                    <ProcessApp appData={this.state.appData}
                        applicationCanceled={this.onCardClosed}
                        applicationContinue={this.onProcessStarted} />
                </div>
            </div>
        )
        let processStrted = (
            <Modal show={this.state.processing} modalClosed={this.onProcessEnded}>
                <ConfirmProcess
                    message="Do you want to continue processing this form?"
                    applicationCanceled={this.onProcessEnded}
                    applicationContinue={this.onConfirmation} />
            </Modal>
        )
        if (!this.state.cardClicked) {
            modalDisp = null;
        }

        if (!this.state.processing) {
            processStrted = null;
        }

        let confirmSuccess = null;
        let confirmFailed = null;

        if (!this.props.processAppFailed && this.props.processAppDone && this.state.confirmed) {
            console.log("WE ARE DONE WITH SUCCESS!!!!")
            confirmSuccess = (
                <Modal show={this.props.processAppDone} modalClosed={this.confirmationCancel}>
                    <ConfirmProcess
                        message="Application was sucessfully Processed!!"
                        applicationDone={this.confirmationCancel} />
                </Modal>
            )
        }

        if (this.props.processAppFailed && this.props.processAppDone && this.state.confirmed) {
            console.log("WE ARE DONE WITH FAILURE!!!!")
            confirmFailed = (
                <Modal show={this.props.processAppDone} modalClosed={this.confirmationCancel}>
                    <ConfirmProcess
                        message="Application Processing failed!!"
                        applicationCanceled={this.confirmationCancel} />
                </Modal>
            )

        }

        let confirmStarted = (
            <Modal show={!this.props.processAppDone} modalClosed={this.onProcessEnded}>
                <Spinner />
                <ConfirmProcess
                    message="Processing your Application!!"
                    applicationCanceled={this.confirmationCancel} />
            </Modal>
        )

        if (!this.state.confirmed) {
            confirmStarted = null
        }



        return (
            <div className={classes.Applications}>
                {modalDisp}
                {processStrted}
                {confirmStarted}
                {confirmSuccess}
                {confirmFailed}
                {applications}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        error: state.applications.appError,
        applications: state.applications.applications,
        loading: state.applications.appLoading,
        token: state.auth.token,
        userId: state.auth.localId,
        processAppFailed: state.applications.processAppFailed,
        processAppDone: state.applications.processAppDone
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onInitOrders: (token, userId) => dispatch(actionCreators.fetchApplications(token, userId)),
        onProcessApplication: (token, appData) => dispatch(actionCreators.processApplication(token, appData)),
        resetProcessAppState: () => dispatch(actionCreators.resetProcessAppState())
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Applications, axinstance));

