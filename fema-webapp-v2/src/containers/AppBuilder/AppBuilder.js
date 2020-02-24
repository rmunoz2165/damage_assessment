import React, { Component } from 'react';
import Aux from '../../hoc/Aux';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Apply from '../../components/Apply/Apply'
import Modal from '../../components/Layout/UI/Modal/Modal'
import axinstance from '../../axios-orders';
import Spinner from '../../components/Layout/UI/Spinner/Spinner';

export class AppBuilder extends Component {

    loginHandler = () => {
        this.props.history.push({
            pathname: '/login'
        });
    }

    render() {

        let apply = <Spinner />
        if (this.props.error) {
            // Note here we do not let user close the modal
            // We cannot proceed if this fails!
            apply = <Modal
                show={this.prop.error}>
                {this.prop.error}
            </Modal>
        }

        apply = (<Apply />)

        return (
            <Aux>
                {apply}
            </Aux>
        );
    }
};


export default (withErrorHandler(AppBuilder, axinstance));