import React, { Component } from 'react'
import classes from './Application.css'
import axinstance from '../../../axios-orders';
import Input from '../../../components/Layout/UI/Input/Input';
import Spinner from '../../../components/Layout/UI/Spinner/Spinner';
import Modal from '../../../components/Layout/UI/Modal/Modal'
import Button from '../../../components/Layout/UI/Button/Button';
import { connect } from 'react-redux';

import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'
import * as actionCreators from '../../../store/actions/index'
import { updateObject, checkValidity } from '../../../shared/utility'
import AppSummary from '../AppSummary/AppSummary'
import AppSubitted from '../AppSubmited/AppSubmitted'
import { withRouter } from 'react-router-dom';


class Application extends Component {
    state = {
        appForm: {
            appid: {
                fieldname: 'appid',
                elementType: 'input',
                labelTxt: "App ID",
                elementConfig: {
                    type: 'text',
                    placeholder: 'Fema App ID'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },

            fname: {
                fieldname: 'fname',
                elementType: 'input',
                labelTxt: "First Name",
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your First Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            lname: {
                fieldname: 'lname',
                elementType: 'input',
                labelTxt: "Last Name",
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Last Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                fieldname: 'email',
                elementType: 'input',
                labelTxt: "E-Mail",
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your E-Mail'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            street: {
                fieldname: 'street',
                elementType: 'input',
                labelTxt: "Street",
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            city: {
                fieldname: 'city',
                elementType: 'input',
                labelTxt: "City",
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your City'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            state: {
                fieldname: 'state',
                elementType: 'select',
                labelTxt: "State",
                elementConfig: {
                    options: [
                        { value: 'Choose State', displayValue: 'Choose Your State' },
                        { value: 'Alabama', displayValue: 'Alabama' },
                        { value: 'Alaska', displayValue: 'Alaska' },
                        { value: 'Arizona', displayValue: 'Arizona' },
                        { value: 'Arkansas', displayValue: 'Arkansas' },
                        { value: 'California', displayValue: 'California' },
                        { value: 'Colorado', displayValue: 'Colorado' },
                        { value: 'Connecticut', displayValue: 'Connecticut' },
                        { value: 'Delaware', displayValue: 'Delaware' },
                    ]
                },
                value: 'California',
                valid: true,
                touched: false
            },
            zipCode: {
                fieldname: 'zipCode',
                elementType: 'input',
                labelTxt: "Zip",
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP Code'
                },
                value: '',
                validation: {
                    required: true,
                    minlength: 5,
                    maxlength: 5,
                    dataType: 'numeric'
                },
                valid: false,
                touched: false
            },
            owned: {
                fieldname: 'owned',
                elementType: 'select',
                labelTxt: "Ownership",
                elementConfig: {
                    options: [
                        { value: 'owned', displayValue: 'Owned' },
                        { value: 'rented', displayValue: 'Rented' }
                    ]
                },
                value: 'owned',
                valid: true,
                touched: false
            },
            propertyval: {
                fieldname: 'pvalue',
                elementType: 'input',
                labelTxt: "Property Value",
                elementConfig: {
                    type: 'text',
                    placeholder: 'Property value (as per the citys tax records)'
                },
                value: '',
                validation: {
                    required: true,
                    dataType: 'numeric'
                },
                valid: false,
                touched: false
            },   
            insurance: {
                fieldname: 'insurance',
                elementType: 'input',
                labelTxt: "Insurance Payout",
                elementConfig: {
                    type: 'text',
                    placeholder: 'Property insured for'
                },
                value: '',
                validation: {
                    required: true,
                    dataType: 'numeric'
                },
                valid: false,
                touched: false
            },     
            income: {
                fieldname: 'income',
                elementType: 'input',
                labelTxt: "Household Income",
                elementConfig: {
                    type: 'text',
                    placeholder: 'Household Income'
                },
                value: '',
                validation: {
                    required: true,
                    dataType: 'numeric'
                },
                valid: false,
                touched: false
            },                                
            upload: {
                fieldname: 'upload',
                elementType: 'imageFileSelector',
                labelTxt: "Pictures",
                elementConfig: {
                    type: 'text',
                    placeholder: 'Upload Pictures'
                },
                value: '',
                validation: {
                    required: false
                },
                valid: false,
                touched: false
            }
        },
        formIsValid: false,
        applied: false,
        submitted: false
    }

    applyingHandler = (event) => {
        event.preventDefault();
        this.setState({ applied: true });
    }

    applyCancelHandler = () => {
        this.setState({ applied: false });
    }

    appliedRedirect = () => {
        this.setState({ submitted: false });
        this.props.history.push({
            pathname: '/',
        });
    }

    appHandler = (event) => {
        //event.preventDefault();

        const formData = {};
        for (let fei in this.state.appForm) {
            formData[fei] = this.state.appForm[fei].value;
        }

        const application = {
            applicationData: formData,
            userId: this.props.username,
            applicationID: new Date().getTime()
        }
        this.props.addApplication(application, this.props.token, this.props.googlekey);
        this.setState({ applied: false });
        this.setState({ submitted: true });
    }

    inputChangedHandler = (event, inputIdentifier) => {
        // Deep clone
        // Note below is not a deep clone


        // This makes its a proper clone.
        // need to know the structure bore we begin ..
        // NOTE : How can we handle multiple nested objects?
        
        let upFormElement = null;
        if (this.state.appForm[inputIdentifier].elementType === "imageFileSelector") {
            
            let image = null;
            if (event.target.files[0]) {
                image = event.target.files[0];
            }
            upFormElement = updateObject(this.state.appForm[inputIdentifier], {
                value: image,
                touched: true,
                valid: checkValidity(this.state.appForm[inputIdentifier].validation, event.target.value)
            });
        } else {
            upFormElement = updateObject(this.state.appForm[inputIdentifier], {
                value: event.target.value,
                touched: true,
                valid: checkValidity(this.state.appForm[inputIdentifier].validation, event.target.value)
            });
        }


        const updatedAppForm = updateObject(this.state.appForm, {
            [inputIdentifier]: upFormElement
        })

        let isFormValid = true;

        for (let key in updatedAppForm) {
            if (!updatedAppForm[key].valid) {
                isFormValid = false;
                break;
            }
        }
        this.setState({ appForm: updatedAppForm, formIsValid: isFormValid });

    }

    render() {
        let formElementArry = [];
        for (let key in this.state.appForm) {
            formElementArry.push({
                id: key,
                config: this.state.appForm[key],
            });
        }

        let form = <Spinner />
        if (!this.props.loading) {
            form = <form onSubmit={this.applyingHandler}>
                {formElementArry.map(formElement => (
                    <Input
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        changed={(event) => (this.inputChangedHandler(event, formElement.id))}
                        valid={formElement.config.valid}
                        touched={formElement.config.touched}
                        lblTxt={formElement.config.labelTxt}
                    />
                ))}
                <Button btnType="Success" disabled={!this.state.formIsValid}>Apply</Button>
            </form>
        }

        return (
            <div >
                <Modal show={this.state.applied} modalClosed={this.applyCancelHandler}>
                    <AppSummary
                        applicationCanceled={this.applyCancelHandler}
                        applicationContinue={this.appHandler} />
                </Modal>

                <Modal show={this.state.submitted} modalClosed={this.appliedRedirect}>
                    <AppSubitted applicationContinue={this.appliedRedirect} />
                </Modal>

                <h4>FEMA Application Form</h4>
                <div className={classes.ContactData}>
                    {form}
                </div>

            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        username: state.auth.localId,
        googlekey: state.auth.googlekey
    };
};

const mapDispatchToProps = dispatch => {
    return {
        addApplication: (applicationData, token, googlekey) => dispatch(actionCreators.addApplication(applicationData, token, googlekey)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withErrorHandler(Application, axinstance)));
