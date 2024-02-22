import React, { Component }from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {logIn} from '../features/AuthService';

async function hideAlert(){
    let alert = document.getElementById("alertLogin");
    if(alert.getAttribute("hidden") !== null){
        console.log(" unnecessary hide")
    }
    else{
        alert.setAttribute("hidden", true);
    }
}


async function hideSuccess(){
    let alert = document.getElementById("successLogin");
    if(alert.getAttribute("hidden") !== null){
        console.log(" unnecessary hide")
    }
    else{
        alert.setAttribute("hidden", true);
    }
}

async function unhideLoad(){
    let alert = document.getElementById("alertLogin");
    let alert2 = document.getElementById("successLogin");
    let load = document.getElementById("loadLogin");
    
    if(load.getAttribute("hidden") !== null){
        load.removeAttribute("hidden"); 
        alert2.setAttribute("hidden", true);
        alert.setAttribute("hidden", true);
    }
}

export default class LoginPage extends Component {


    constructor(props){
        //syntax line
        super(props);
        
        //Constructor function bindings
        this.changeEmail= this.changeEmail.bind(this);
        this.changePassword= this.changePassword.bind(this);
        this.onSubmit=this.onSubmit.bind(this);

        //state object
        this.state={
            email:"",
            password:""
        }
    }
    
    //When the email box is changed with new values, the email state variable is updated with those new values
    changeEmail = (e)=>{
        this.setState({
            email: e.target.value
        });
    }
    
    //When the password box is changed with new values, the password state variable is updated with those new values
    changePassword = (e)=>{
        this.setState({
            password: e.target.value
        });
    }  

    //funtion runs on form submit
    onSubmit = async (e)=>{
        e.preventDefault();
        unhideLoad();
        
        //Creates a user object to send to the DB
        const user={
            //lowercase to keep input NOT case sensitive
            email: (this.state.email).toLowerCase(),
            //password should be case sensitive
            password: this.state.password
            
        }

        //Users get a token after logging in, and the page is refreshed into the home screen
        await logIn(user);
        
        //Prevents the page from refreshing as a result of pressing a submit button
        e.preventDefault();
    }

    //The react HTML goes in this render(){return()} statement. ALL OF THE HTML MUST BE WRAPPED IN ONE TAG LIKE A DIV
    //For example, all of my html here is wrapped in a center tag. React will have errors if it isn't all wrapped in one tag.
    render() {
        return(
            <div>
                <center className="LoginBox">
                    <div id="LoginBox">
                        <h1 id="header" className="Login-word">
                            Login 
                        </h1>
                            <form onSubmit={this.onSubmit}>
                                <p id= "Email-Label">
                                    Email
                                </p>
                                <Form.Control id="loginEmailInput" className="input" required type="email" value={this.state.email} onChange={this.changeEmail}></Form.Control>
                                <p id="Password-Label">
                                    Password
                                </p>
                                <Form.Control id="loginPasswordInput" className="input" required type="password" value={this.state.password} onChange={this.changePassword}></Form.Control>
                                <button className="button-28 bb" role="button" type="Submit" id="SignInBtn">Sign In</button>
                            </form>

                    </div>
                </center>
                <div onClick={hideAlert} className="alertLogin" id="alertLogin" hidden>
                    <span className="closebtnLogin" onClick={hideAlert}>x</span> 
                    <strong className="loginstrong">Error:</strong><span> </span><span id="alertLoginText">Error</span>
                </div>
                <div onClick={hideSuccess} className="successLogin" id="successLogin" hidden>
                    <span className="closebtnLogin" onClick={hideSuccess}>x</span> 
                    <strong className="loginstrong">Success:</strong><span> </span><span id="successLoginText"></span>
                </div>
                <div className="loadLogin" id="loadLogin" hidden>
                    <span className="aostrong">Loading . . .</span>
                </div>
            </div>
        )
    }
}
