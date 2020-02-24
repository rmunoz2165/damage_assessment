import React, { Component } from 'react';
import classes from './Reports.css'
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index'


class Reports extends Component {

    state = {
        applications: null,
        processing: true
    }

    componentDidMount() {
        // Round about way to handle incoorect calls.
        this.props.onInitOrders(this.props.token, this.props.userId);

    }

    renderTableHeader() {

        let header = ["APPID", "Name",  "Address", "Property Value", "Insurance", "Analysis"]
        return header.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })

    }

    renderTableData() {

        return this.props.applications.map((application, index) => {
            const id = application.applicationID
            const name = application.applicationData.fname + " " + application.applicationData.lname 
            const address = application.applicationData.address 
            const property = application.applicationData.propertyval 
            const insurance = application.applicationData.insurance 
            const loss = application.applicationData.propertyval - application.applicationData.insurance 
            let damageAnalysis = "Not Processed"
            if (application.applicationData.analysis === 1) {
                if (loss <= 0) {
                    damageAnalysis = "Property Damaged, but Insured"
                } else {
                    damageAnalysis = "Total Loss: " + loss
                }
                
            }
            if (application.applicationData.analysis === 0) {
                damageAnalysis = "Property not damaged"
            }
            if (application.applicationData.analysis === -1) {
                damageAnalysis = "Anaysis Failed!"
            }


            return (
                <tr key={id}>
                    <td>{id}</td>
                    <td>{name}</td>
                    <td>{address}</td>
                    <td>{property}</td>
                    <td>{insurance}</td>
                    <td>{damageAnalysis}</td>
                </tr>
            )
        })
    }



    render() {

        let report = null

        if (this.props.applications) {
            report = (
                <div className={classes.Reports}>
                    <h1 className={classes.Title}>Processed Application Reports</h1>
                    <table className={classes.Report}>
                        <tbody>
                            <tr>{this.renderTableHeader()}</tr>
                            {this.renderTableData()}
                        </tbody>
                    </table>
                </div>
            )
        }

        return (
            <div>
                {report}
            </div>
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
        onInitOrders: (token, userId) => dispatch(actionCreators.fetchApplications(token, userId)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Reports);
