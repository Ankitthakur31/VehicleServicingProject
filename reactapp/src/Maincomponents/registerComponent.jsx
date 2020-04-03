import React, { Component } from 'react';
import SecureCallService from './../services/securecallservice';
var boxlayout = {
    margin: 20,
    padding: 20,
    border: '1px solid #DDD',
    
  };
class RegisterComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username : '',
            password : '',
            userValid:true,
            reg : true,
            formvalid: false
         }
        this.serv= new SecureCallService();
    }
    handleinputs=(evt)=>{
        this.setState({[evt.target.name] : evt.target.value});
        
        if(this.state.password && this.state.username){
            this.setState({reg : false})
            this.setState({formvalid:true})
        }
    };

    
    onRegisterUser=()=>{

        this.serv.authUserName(this.state.username)
        .then((response)=>{
            
            if(response.data.statusCode === 500){
                const user = {
                    UserName:this.state.username,
                    Password: this.state.password
                };
                this.serv.register(user)
                .then((response)=> {
                    console.log(JSON.stringify(response.data));
                    this.props.history.push('/login')
                }).catch((error)=>{
                    console.log(`Error in creating user ${error}`);
                });
            }else{
                
                this.setState({userValid:false})

            }
        })
    
        
        
    };
    navigateToLogin(){
        this.props.history.push('/login');
    }
    render() { 
        if (sessionStorage.getItem('token') !== null ) {
            this.props.history.push('/');
        }
        return (
            <div className="container" style={boxlayout}>
                <h1 style={{marginBottom : 20}}>Register Users</h1>
                <div className="form-group">
                    <input type="text" name="username" className="form-control" onChange    ={this.handleinputs.bind(this)} placeholder="Enter Username"/>
                    <div hidden={this.state.userValid} className="alert alert-danger">Username Taken</div>
                </div>
                <div className="form-group">
                    <input type="password" name="password" className="form-control"  onChange={this.handleinputs.bind(this)} placeholder="Enter Password"/>
                </div>
             <div className="form-group">
                <input type="button" value="register" onClick={this.onRegisterUser} disabled={this.state.reg} style={{marginBottom : 20}} className="btn btn-warning"/>
                <p onClick={this.navigateToLogin.bind(this)} style={{color : 'blue' }}>Already a User----></p>
           </div>
            </div>
        );
    }
}
 
export default RegisterComponent;