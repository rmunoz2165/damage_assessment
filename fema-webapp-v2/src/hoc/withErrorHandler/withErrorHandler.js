import React, { Component } from 'react';
import Modal from '../../components/Layout/UI/Modal/Modal';
import Aux from '../Aux';

const withErrorHandler = ( WrappedComponent, axios ) => {
    
    return class extends Component {
        
        state = {error: null};

        reqInterceptor = axios.interceptors.request.use(
            req => {
                this.setState({error: null});
                return req;
            }, error => {
                this.setState({error: error});
            }
        );

        resInterceptor = axios.interceptors.response.use(
            res => res,
            error => {
                this.setState({error: error})
            }
        );

        errorConfirmHandler = () => {
            this.setState({error: null});
        }

        componentWillUnmount() {
            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.response.eject(this.resInterceptor);
        }

        render() {
            let erMsg = null
            if (this.state.error) {
                erMsg =  this.state.error.response.data.error + " (Status: " + this.state.error.response.status + ", " + this.state.error.response.statusText + ")";
            }

            return (
                <Aux>
                    <Modal 
                        show={this.state.error} 
                        modalClosed={this.errorConfirmHandler}>
                            {erMsg}
                    </Modal>
                    
                    <WrappedComponent {...this.props}></WrappedComponent>
                </Aux>
                
            )
        }
    }
}

export default withErrorHandler;