import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from '../../containers/Checkout/ContactData/ContactData';





class Checkout extends Component{        

    checkoutCanceledHandler = () => {
        this.props.history.goBack();
    }

    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    }

    render() {
        let summary = <Redirect to="/"/>
        
        if (this.props.ing) {
            const purchasedRedirect = this.props.purchased ? <Redirect to="/"/> : null;
            summary =  (
                <div>
                    {purchasedRedirect}
                    <CheckoutSummary 
                        ingredients={this.props.ing}
                        checkoutCanceled={this.checkoutCanceledHandler}
                        checkoutContinued={this.checkoutContinuedHandler}
                    />
                    <Route 
                        path={this.props.match.path + '/contact-data'} 
                        component={ContactData}
                    />
                </div>               
            )
        }
        return summary;
    }
}

const mapStateToProps = state => {
    return {
        ing: state.bbr.ingredients,    
        purchased: state.ordr.purchased    
    }
};




export default connect(mapStateToProps)(Checkout);