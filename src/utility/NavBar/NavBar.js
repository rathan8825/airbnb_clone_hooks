import React, { Component } from 'react';
import './NavBar.css';
import {Link,} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import openModal from '../../actions/openModal';
import LogoutAction from '../../actions/LogoutAction';
import Login from '../../pages/Home/Login/Login';
import SignUp from '../../pages/Home/Login/SignUp';


class NavBar extends Component{

    componentDidUpdate(oldProps){
        if(oldProps.auth.token !== this.props.auth.token){
            this.props.openModal('closed','');
        }
    }
    render(){

        let navColor = "transparent";
        if(this.props.location.pathname !=='/'){
            // then user is on the home page
            navColor = 'black';
        }
        return(
            <div className = "container-fluid nav">
                <div className = "row">
                    <nav className= {navColor}>
                        <div className="nav-wrapper">
                            <Link to = "/" className = "left">AirBnB</Link>
                            <ul id = "nav-mobile" className = "right">
                                <li> <Link to = "/">English(US)</Link></li>
                                <li> <Link to = "/">$ USD</Link></li>
                                <li> <Link to = "/">Becoming a Host</Link></li>
                                <li> <Link to = "/">Help</Link></li>
                                {this.props.auth.email
                                ?   <> 
                                        <li><Link to="/account">Hello, {this.props.auth.email}</Link></li>
                                        <li onClick={()=>this.props.logoutAction()}>Logout</li>
                                    </>
                                :   <>
                                        <li className="login-signup" onClick={()=>{this.props.openModal('open',<SignUp />)}}>Sign Up</li>
                                        <li className="login-signup" onClick={()=>{this.props.openModal('open',<Login />)}}>Log in</li>
                                    </>
                            }
                                
                            </ul>      
                        </div>
                    </nav>
                </div>
            </div>
            )
    }
}

function mapStatetoProps(state){
    return{
        auth: state.auth,
    }
}

function mapDispatchToProps(dispatcher){
    return bindActionCreators({
        openModal: openModal,
        LogoutAction: LogoutAction
    },dispatcher)
}

export default connect(mapStatetoProps, mapDispatchToProps)(NavBar);