import React, { Component } from 'react';
import {Route, Link, Switch,Redirect} from 'react-router-dom';
import CreateComponent from './createComponent'
import LoginComponent from './loginConponent'
import AdminDashboardComponent from './admindashboardComponent'
import SupervisorDashboardComponent from './supervisordashboardComponent'
import MechanicDashboardComponent from './mechanicdashboardComponent'
import RegisterComponent from './registerComponent'
import RegisterVehicleComponent from './registerVehicleComponent'


const bodyStyle={
    backgroundColor : ''
}
class IndexComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            id:1000
        }
        
    }
    render() { 
        return (
            <div className="container-fluid" style={bodyStyle}>
                {/* <div>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#news">Login</a></li>
                        <li><a href="#contact">Register</a></li>
                    </ul>
                </div> */}
                {/* Define Route Table Here */}
                <div className="container">
                    <Switch>
                        <Route exact path="/" component={LoginComponent}></Route>
                        <Route exact path="/createEmployees" component={CreateComponent}></Route>
                        <Route exact path="/admin" component={AdminDashboardComponent}></Route>
                        <Route exact path="/supervisor" component={SupervisorDashboardComponent}></Route>
                        <Route exact path="/mechanic/:id" component={MechanicDashboardComponent}></Route>
                        <Route exact path="/registerVehicle" component={RegisterVehicleComponent}></Route>
                        <Redirect to="/"/>
                    </Switch>
                </div>
            </div>
        );
    }
}
 
export default IndexComponent;