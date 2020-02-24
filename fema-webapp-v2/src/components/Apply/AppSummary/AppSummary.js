import React, { Component } from 'react';
import Aux from '../../../hoc/Aux'
import Button from '../../Layout/UI/Button/Button'


class AppSummary extends Component {

    render() {

        return (

            <Aux>
                <h3>Your Application</h3>
                <p>You are submitting an Application with the following!</p>
                <ul>
                    {this.props.formdata}
                </ul>
                <p>Continue to Apply?</p>
                <Button btnType="Danger" clicked={this.props.applicationCanceled}>CANCEL</Button>
                <Button btnType="Success" clicked={this.props.applicationContinue}>CONTINUE</Button>
            </Aux>
        );
    }
}

export default AppSummary;


