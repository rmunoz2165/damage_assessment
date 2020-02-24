import React, { Component } from 'react';
import classes from './Auth.css'
import axinstance from '../../axios-orders';
import Input from '../../components/Layout/UI/Input/Input';
import Spinner from '../../components/Layout/UI/Spinner/Spinner';
import { Redirect } from 'react-router-dom'

import Button from '../../components/Layout/UI/Button/Button';
import { connect } from 'react-redux';

import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as actionCreators from '../../store/actions/index'
import { checkValidity } from '../../shared/utility'



class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                labelTxt: "Username",
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your Username (email)'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                labelTxt: "Password",
                elementConfig: {
                    type: 'password',
                    placeholder: 'Your Password'
                },
                value: '',
                validation: {
                    required: true,
                    minlength: 7
                },
                valid: false,
                touched: false
            }
        },
        formIsValid: false,
        isSignUp: false,
        shouldRedirect: false
    }

    componentDidMount() {
        this.setState({shouldRedirect: false})
    }
    

    inputChangedHandler = (event, inputIdentifier) => {
        // Deep clone
        // Note below is not a deep clone
        const updatedControls = {
            ...this.state.controls,
            [inputIdentifier]: {
                ...this.state.controls[inputIdentifier],
                value: event.target.value,
                valid: checkValidity(this.state.controls[inputIdentifier].validation, event.target.value),
                touched: true
            }
        };
        
        // const updatedControls = updateObject(this.state.controls, {
        //     [inputIdentifier]: updateObject(...this.state.controls[inputIdentifier], {
        //         value: event.target.value,
        //         valid: this.checkValidity(this.state.controls[inputIdentifier].validation, event.target.value),
        //         touched: true
        //     })
        // });

        let isFormValid = true;

        for (let key in updatedControls) {
            if (!updatedControls[key].valid) {
                isFormValid = false;
                break;
            }
        }
        this.setState({ controls: updatedControls, formIsValid: isFormValid });

    }

    submitHandler = (event) => {
        event.preventDefault();
        this.props.onAuthenticate(this.state.controls['email'].value, this.state.controls['password'].value, !this.state.isSignUp)
        this.setState({shouldRedirect: true})

    }

    switchModeHandler = (event) => {
        this.setState((prevState) => {
            return { isSignUp: !prevState.isSignUp }
        });

    }

    logout = () => {
        this.props.onLogout();
    } 

    render() {
        let formElementArry = [];
        for (let key in this.state.controls) {
            formElementArry.push({
                id: key,
                config: this.state.controls[key],
            });
        }

        let form = <Spinner />
        if (!this.props.loading) {
            form = <form onSubmit={this.submitHandler}>
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
                <Button btnType="Success" disabled={!this.state.formIsValid}>Login</Button>
            </form>


        };
        let renderItems = (
            <React.Fragment>
                <h4>Login</h4>
                {form}
                {this.props.error ? <div style={{ color: '#FF0000' }}>Error On Login: {this.props.error}</div> : null}
                <div style={{ fontSize: "small" }}>{!this.state.isSignUp ? "Not a user? " : "Have a Account? "}
                    <Button btnType="Danger" clicked={this.switchModeHandler}>{this.state.isSignUp ? "Sign In" : "Sign Up"}</Button>
                </div>
            </React.Fragment>);
        if (this.props.isAuthenticated) {
            renderItems = (
                <React.Fragment>
                    <p>Logged in as : <strong style={{color: "#3333AA"}}>{this.props.username}</strong></p>
                    <div style={{ fontSize: "small" }}>
                        <Button btnType="Danger" clicked={this.logout}>Logout</Button>
                    </div>
                </React.Fragment>);
            if (this.state.shouldRedirect) {
                renderItems = <Redirect to="/"/>
            }
        }
        return (
            <div className={classes.Auth}>
                {renderItems}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
        username: state.auth.username,
        error: state.auth.error,
        loading: state.auth.loading,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuthenticate: (username, password, isSignIn) => dispatch(actionCreators.login(username, password, isSignIn)),
        onLogout: () => dispatch(actionCreators.logout()),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Auth, axinstance));
