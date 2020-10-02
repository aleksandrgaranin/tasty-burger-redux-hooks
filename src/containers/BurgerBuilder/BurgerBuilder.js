import React,{ Component } from 'react';
import { connect } from 'react-redux';
import axios from '../../axios-orders';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';

import * as actions from '../../store/actions/index';


class BurgerBuilder extends Component {

    state = {              
        purchasing: false,        
    }

    componentDidMount (){
        this.props.onInitIngredients();
    }

    updatePurchaseState (ingredients) {
     
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        return sum > 0;
    }

    purchaseHandler = () => {
        if (this.props.isAuthenticated){
            this.setState({purchasing: true});
        } else{
            this.props.onSetAuthRedirectPath('/checkout')
            this.props.history.push('/auth')
        }
        
    }

    purchaseCanselHandler = () => {
        this.setState({purchasing: false})
    }

    purchaseContinueHandler = () => {      
        this.props.onInitPurchase();  
        this.props.history.push('/checkout');
    }

    render () {
        const disabledInfo = {
            ...this.props.ing
        };
        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        let orderSummary = null
        
        let burger = this.props.error ? <p style={{textAlign:"center"}}>Ingredients can't be loaded</p> : <Spinner/>

        if (this.props.ing){
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ing}></Burger>
                    <BuildControls 
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        purchaseable={this.updatePurchaseState (this.props.ing)}
                        ordered={this.purchaseHandler}
                        isAuth={this.props.isAuthenticated}
                        price={this.props.price}
                    />       
                </Aux>
            )
            orderSummary = <OrderSummary 
                ingredients={this.props.ing}
                purchaseCanceled={this.purchaseCanselHandler}
                purchaseContinued={this.purchaseContinueHandler}
                price={this.props.price}
            />;

        }       
       
        return (            
            <Aux>                
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCanselHandler}> 
                    {orderSummary}
                </Modal>
                {burger}
                    
            </Aux>
        );
    }
}


const mapStateToProps = state => {
    return {
        ing: state.bbr.ingredients,
        price: state.bbr.totalPrice,
        error: state.bbr.error,
        isAuthenticated: state.auth.token !== null
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));