import React, { Component } from 'react';
import SecureCallService from './../services/securecallservice';
var boxlayout = {
    margin: 20,
    padding: 20,
    border: '1px solid #DDD',
    
  };
class LoginComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            empId : '',
            password : '',
            userValid:true,
            reg: true,
            credentials : true
         }
         
        this.serv= new SecureCallService();
    }

    
    handleinputs=(evt)=>{
        this.setState({[evt.target.name] : evt.target.value});

        if(this.state.password && this.state.empId){
            this.setState({reg : false})
        }
    };
   

    onLoginUser=()=>{
        const user = {
            empId:this.state.empId,
            password: this.state.password
        };
        console.log(user);
        
        this.serv.login(user)
        .then((response)=> {
            if(response.data.statusCode === 200){
                console.log(response.data.data + response.data.authenticated);
                
                // save the received token in session storage
                sessionStorage.setItem('token', response.data.authenticated);
                sessionStorage.setItem('user', response.data.data);
                console.log(response.data.id);
                
                this.loginNavigation(response.data.data , response.data.id)
            }else{
                this.setState({credentials : false})
            }
        }).catch((error)=>{
            this.setState({user : false})
        });
    }

    loginNavigation(role , id){
        console.log(role);
        
        if(role == "Admin"){
            this.props.history.push('/admin')
        }else if(role == "Supervisor"){
            this.props.history.push(`/supervisor`);
        }else if(role == "Mechanic"){
            this.props.history.push(`/mechanic/${id}`)  
        } 
    }
    navigateToRegister(){
        this.props.history.push('/register');
    }
    render() { 
        if (sessionStorage.getItem('token') !== null ) {
            this.loginNavigation(sessionStorage.getItem('user'))
        }
        return (
            <div className="container" style={boxlayout}>
                <h1 style={{marginBottom : 20}}>Login </h1>
                <div className="form-group">
                    <input type="text" name="empId" className="form-control" onChange={this.handleinputs.bind(this)} placeholder="Enter Employee Name/Employee ID   "/>
                </div>
                <div className="form-group">
                    <input type="password" name="password" className="form-control"  onChange={this.handleinputs.bind(this)} placeholder="Enter Password"/>
                </div>
                <div hidden={this.state.credentials} className="alert alert-danger">Invalid Credentials</div>
             <div className="form-group">
                <input type="button" value="login" onClick={this.onLoginUser} disabled={this.state.reg} style={{marginBottom : 20}} className="btn btn-success"/>               
           </div>
            </div>
        );
    }
}
 
export default LoginComponent;