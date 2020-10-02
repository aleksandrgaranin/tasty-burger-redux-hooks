import React,{ useState, useEffect } from 'react';
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


const BurgerBuilder = props => {
    const [purchasing, setPurchasing] = useState(false);
    
    useEffect(() => {
        props.onInitIngredients();
    }, []);

    const updatePurchaseState = (ingredients) => {
     
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        return sum > 0;
    }

    const purchaseHandler = () => {
        if (props.isAuthenticated){
            setPurchasing(true);
        } else{
            props.onSetAuthRedirectPath('/checkout')
            props.history.push('/auth')
        }
        
    }

    const purchaseCanselHandler = () => {
        setPurchasing(false)
    }

    const purchaseContinueHandler = () => {      
        props.onInitPurchase();  
        props.history.push('/checkout');
    }

        const disabledInfo = {
            ...props.ing
        };
        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        let orderSummary = null
        
        let burger = props.error ? <p style={{textAlign:"center"}}>Ingredients can't be loaded</p> : <Spinner/>

        if (props.ing){
            burger = (
                <Aux>
                    <Burger ingredients={props.ing}></Burger>
                    <BuildControls 
                        ingredientAdded={props.onIngredientAdded}
                        ingredientRemoved={props.onIngredientRemoved}
                        disabled={disabledInfo}
                        purchaseable={updatePurchaseState (props.ing)}
                        ordered={purchaseHandler}
                        isAuth={props.isAuthenticated}
                        price={props.price}
                    />       
                </Aux>
            )
            orderSummary = <OrderSummary 
                ingredients={props.ing}
                purchaseCanceled={purchaseCanselHandler}
                purchaseContinued={purchaseContinueHandler}
                price={props.price}
            />;

        }       
       
        return (            
            <Aux>                
                <Modal show={purchasing} modalClosed={purchaseCanselHandler}> 
                    {orderSummary}
                </Modal>
                {burger}
                    
            </Aux>
        );
    
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