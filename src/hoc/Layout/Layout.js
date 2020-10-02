import React, { Component } from 'react';
import { connect } from 'react-redux';

import classes from './Layout.module.css';
import Aux from '../Aux/Aux';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';




class Layout extends Component{
    state ={
        showSideDrawer: false
    }

    sideDrawerClosedHandler =()=>{
        this.setState({showSideDrawer: false});
    }

    sideDrawerToggleHandler = (prevState) =>{
        this.setState({showSideDrawer: !prevState.showSideDrawer})
    }

    render(){ 
        return(
            <Aux>                
                <Toolbar  
                    isAuth = {this.props.isAuthenticated}
                    open={this.sideDrawerToggleHandler}/>
                <SideDrawer 
                    isAuth = {this.props.isAuthenticated}
                    open={this.state.showSideDrawer} 
                    closed={this.sideDrawerClosedHandler}/>
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        );
    }
} 

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    }
}

export default connect(mapStateToProps)(Layout);