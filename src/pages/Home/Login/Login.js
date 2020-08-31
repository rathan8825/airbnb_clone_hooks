import React, {Component} from 'react';
import './Login.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import openModal from '../../../actions/openModal';
import SignUp from './SignUp';
import regAction from '../../../actions/regAction'
import axios from 'axios';
import swal from 'sweetalert';


class Login extends Component{

    state = {
        email: "",
        password: "",
    }

    changeEmail = (e)=>this.setState({email:e.target.value})
    changePassword = (e)=>this.setState({password:e.target.value})

    submitLogin = async(e)=>{
        e.preventDefault();
        //console.log(this.state.email);
        //console.log(this.state.password);
        const url = `${window.apiHost}/users/login`;
        const data = {
            email:this.state.email,
            password: this.state.password
        }
        const resp = await axios.post(url,data);
        const token = resp.data.token;
        console.log(token);
        console.log(resp.data);


         ////////////////
        //resp.data.msg could be:
        //      -- badPass
        //      -- noEmail
        //      -- loggedIn
        ///////

        if(resp.data.msg === "badPass"){
            swal({
                title: 'Wrong password',
                text: 'The password you entered is wrong',
                icon: 'error',        
        })
        }else if(resp.data.msg === "noEmail"){
            swal({
                title: 'Invalid Email',
                text: 'please enter a valid email address',
                icon: 'error',        
        })
        }else if(resp.data.msg === "loggedIn"){
            swal({
                title: 'Success',
                icon: 'success',        
        })
        //we call our register action to update our auth reducer
        this.props.regAction(resp.data);
         
        }


    }

    render(){
        return(
            <div className="login-form">
                <form onSubmit={this.submitLogin}>
                    <button className="facebook-login">Connect With Facebook</button>
                    <button className="google-login">Connect With Google</button>
                    <div className="login-or center">
                        <span>or</span>
                        <div className="or-divider"></div>
                    </div>
                    <input type="text" className="browser-default" placeholder="Email address" onChange = {this.changeEmail}/>
                    <input type="password" className="browser-default" placeholder="Password" onChange = {this.changePassword} />
                    <button className="sign-up-button">Login</button>
                    <div className="divider"></div>
                    <div>Don't have an account? <span className = "pointer" onClick = {(()=>{this.props.openModal('open',<SignUp />)})}>Sign Up</span></div>
                </form>
            </div>
        )
    }

}
function mapStateToProps(state){
    return{
        auth: state.auth,
    }
}
function mapDispatchToProps(dispatcher){
    return bindActionCreators({
        openModal: openModal,
        regAction: regAction
    },dispatcher)
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);