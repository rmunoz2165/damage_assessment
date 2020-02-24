import React, { Component } from 'react';
import Aux from '../../../hoc/Aux'
import Button from '../../Layout/UI/Button/Button'


class AppSubmitted extends Component {

    render() {

        return (

            <Aux>
                <h3>Your Application has been submitted!</h3>
                <Button btnType="Success" clicked={this.props.applicationContinue}>OK</Button>
            </Aux>
        );
    }
}

export default AppSubmitted;


