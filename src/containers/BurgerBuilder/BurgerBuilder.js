import React , {Component} from 'react';
import {connect} from 'react-redux';
import Aux from '../../hoc/Auxx/Auxiliary.js';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actionTypes from '../../store/actions';


class BurgerBuilder extends Component{
    
    state = {
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount () {
        console.log(this.props);
        
        // axios.get('https://burger-app-de130.firebaseio.com/ingredients.json')
        //     .then(response => {
        //         this.setState({ingredients: response.data});
        //     })
        //     .catch(error => {
        //         this.setState({error: true});
        //     });
    }

    updatePurchaseState(el){
        // const ingredients = {
        //     ...this.state.ingredients
        // };
        // const sum = Object.keys(ingredients)
        // .map(igKey => {
        //     return ingredients[igKey];
        // })
        // .reduce((sum, el) => {
        //     return sum + el;
        // }, 0);
        // this.setState({purchasable: sum > 0})
        if(el>4)
        {
            return true;
        } else {
            return false;
        }

    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        this.props.history.push('/checkout');
    }

    render() {
        const disableInfo = {
            ...this.props.ings
        };
        
        for(let key in disableInfo){
            disableInfo[key] = disableInfo[key] <= 0
        }
        let orderSummary = null;
        let burger = this.state.error ? <p>Ingredients cant be loaded!</p> : <Spinner/>;
        if(this.props.ings) {
            burger = (
                <Aux>
                <Burger ingredients={this.props.ings}/>

                <BuildControls
                    ingredientAdded={this.props.onIngredientAdded}
                    ingredientRemoved = {this.props.onIngredientRemoved}
                    disabled={disableInfo}
                    purchasable={this.updatePurchaseState(this.props.price)}
                    ordered={this.purchaseHandler}
                    price={this.props.price}  />
                </Aux>
            );
            orderSummary = <OrderSummary 
            purchaseCancelled={this.purchaseCancelHandler}
            price={this.props.price}
            purchaseContinued={this.purchaseContinueHandler}
            ingredients={this.props.ings}/>;
        }
        if(this.state.loading) {
            orderSummary = <Spinner/>;
        }
        
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
                
            </Aux>
        );
    }
}
const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
        onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));