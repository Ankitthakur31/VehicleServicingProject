import React, { Component } from 'react';
import {Route, Link, Switch,Redirect} from 'react-router-dom';
import SecureCallService from './../services/securecallservice';
import CreateComponent from './createComponent'
var boxlayout = {
    margin: 20,
    padding: 20,
    border: '12px solid #DDD',
    
  };
class MechanicDashboardComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Student:[],
            EmpId: '',
            StageOfRepair:'',
            ServicingReceived:false,
            Repairing:true,
            Cleaning:true,
            Washing:true,
            NoWork:true,
            servicestate:'',
            VehicleNumber:'',
            VehicleName:'',
            RepairingCost:'',
            CleaningCost:'',
            delay:true,
            reason:'',
        };
        // define an instancve of HTTP Service
        this.serv = new SecureCallService();
        this.row = new CreateComponent();
    }

    
compnentToShow(response){
    if(response === "SERVICING RECEIVED"){
        this.setState({ServicingReceived : false})
    }else if(response === "REPAIRING"){
        this.setState({ServicingReceived:true,Repairing:false})
    }else if(response === "CLEANING"){
        this.setState({ServicingReceived:true,Repairing:true,Cleaning:false})
    }else if(response === "WASHING"){
        this.setState({ServicingReceived:true,Cleaning:true,Washing:false})
    }else{
        this.setState({ServicingReceived:true,Washing:true,NoWork:false,details:true});
    }
}
    // the method that has calls to all heavy operations or external async calls
    componentDidMount=()=>{
        this.loadData();
    }
    loadData=()=>{
        let id = this.props.match.params.id ;
        this.setState({EmpId:id});
        const token = sessionStorage.getItem('token'); 
        this.serv.stateOfVehicle(id , token)
        .then((response)=> {
            console.log(JSON.stringify(response.data.data));
            this.setState({VehicleName : response.data.name , VehicleNumber : response.data.number})
            this.compnentToShow(response.data.data);
           // sessionStorage.setItem('token', response.data.data);
        }).catch((error)=>{
            console.log(`Error in creating user ${error}`);
        });
    }
    

    handleStateChange(evt){
        console.log(evt.target.name);
        this.setState({servicestate:evt.target.name});
        this.compnentToShow(evt.target.name);
        let id = {id:this.state.EmpId , VehicleNumber : this.state.VehicleNumber , CleaningCost:this.state.CleaningCost}
         this.serv.updateRepairStage(evt.target.name,id)
         .then((response)=>{
            console.log(response.data.statusCode);
            console.log(response.data.data);
            
         }).catch((error)=>{
             console.log(`Error Occured ${error}`);
         });

         if(this.state.servicestate === "CLEANING"){
             this.serv.updateRepairCost(this.state.RepairingCost , id)
             .then((response)=>{
                console.log(response.data.statusCode);
                console.log(response.data.data);
                
             }).catch((error)=>{
                 console.log(`Error Occured ${error}`);
             });
         }else if(this.state.servicestate === "WASHING"){
            this.serv.updateCleaningCost(id)
            .then((response)=>{
               console.log(response.data.statusCode);
               console.log(response.data.data);
               
            }).catch((error)=>{
                console.log(`Error Occured ${error}`);
            });
         }
    }
    handleCost(evt){
        this.setState({[evt.target.name] : evt.target.value})
        this.setState({[evt.target.name] : evt.target.value});

        console.log(evt.target.name);
        console.log(evt.target.value);
        
    }
    handleDelay(){
        if(this.state.delay){
        this.setState({delay: false})
        }else{
        this.setState({delay: true})
        }
        
    }

    handleReason(){
        let id = {id:this.state.EmpId , VehicleNumber : this.state.VehicleNumber}
        this.serv.updateReason(this.state.reason , id)
        .then((response)=>{
           console.log(response.data.statusCode);
           console.log(response.data.data);
           
        }).catch((error)=>{
            console.log(`Error Occured ${error}`);
        });
    }
   
    logout()
    {
        sessionStorage.clear();
        this.props.history.push('/login')
    }
    render() {
        if (sessionStorage.getItem('token') === null ) {
            this.props.history.push('/login');
        }
        
        return (
            <div className="container" style={{marginTop:50}}>
                <input type="button" value="Logout =>" 
               onClick={this.logout.bind(this)} className="btn btn-danger" 
               style={{float : "right",marginTop:5}} />
                <h2>The Mechanic Information page</h2>
                <h3>Mechanic Id : {this.state.EmpId}</h3>

                <div style={boxlayout}>

                <label style={{marginRight:3}}>If delay in Servicing</label><input type="checkbox" onClick={this.handleDelay.bind(this)}/>
                <div hidden={this.state.delay} style={{margin:15}}> 
                <input type="text" placeholder="Enter the reason for delay" value={this.state.reason} onChange={this.handleCost.bind(this)} style={{width:500,marginBottom:10}} name='reason' className="form-control"/>
                <input type="button" className="btn btn-danger" value="Submit Reason" onClick={this.handleReason.bind(this)}/>
                </div>

                    <h3 hidden={this.state.details}>{`Vehile number : ${this.state.VehicleNumber}`} </h3>
                    <h3 hidden={this.state.details}>{`Vehicle name : ${this.state.VehicleName}`}</h3>
                    <h3 hidden={!this.state.details}>ENJOY!!!!!</h3>
                    <br/>
                    <hr/>
                    <div hidden={this.state.ServicingReceived}>
                        <div className="alert alert-success">New Vehicle For Repairing Received</div>
                        <input type="button" value="Start Repairing" className="btn btn-primary" name="REPAIRING" onClick={this.handleStateChange.bind(this)} />                       
                    </div>
                    <div hidden={this.state.Repairing}>
                        <div className="alert alert-warning">Repairing Started</div>
                        <input type="text" placeholder="Enter the cost of repairing" className="form-control" value={this.state.RepairingCost} onChange={this.handleCost.bind(this)} name="RepairingCost"/><br/>
                        <input type="button" value="Repair Done And Cleaning Started" className="btn btn-primary" name="CLEANING" onClick={this.handleStateChange.bind(this)} />                       
                    </div>
                    <div hidden={this.state.Cleaning}>
                        <div className="alert alert-warning">Cleaning Started</div>
                        <input type="text" placeholder="Enter the cost of cleaning" className="form-control" value={this.state.CleaningCost} onChange={this.handleCost.bind(this)} name="CleaningCost"/><br/>
                        <input type="button" value="Cleaning Done And Washing Started" className="btn btn-primary" name="WASHING" onClick={this.handleStateChange.bind(this)} />                       
                    </div>
                    <div hidden={this.state.Washing}>
                        <div className="alert alert-warning">Washing Started</div>
                        <input type="button" value="Washing Done And Ready To Deliver" className="btn btn-primary" name="READY TO DELIVER" onClick={this.handleStateChange.bind(this)} />                       
                   
                    </div>
                    <div hidden={this.state.NoWork}>
                        <div className="alert alert-success">No Vehicles Assign to Repair at the moment . ENJOY!!!!!</div>                                                 

                    </div>
                </div>
            </div>
        );
    }
}

export default MechanicDashboardComponent;