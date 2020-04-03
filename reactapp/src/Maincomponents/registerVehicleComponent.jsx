import React, { Component } from 'react';
import SelectComponent from './../components/selectComponent';
import SecureCallService from './../services/securecallservice';
import { Wheels } from './../models/constants';

var boxlayout = {
    margin: 20,
    padding: 20,
    border: '12px solid #DDD',
    
  };

class RegisterVehicleComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            VehicleNumber:'',
            VehicleName: '',
            Type:'',
            SOR:'SERVICING RECEIVED',
            EmpId:'',
            RepairingCost:0,
            CleaningCost:0,
            WashingCost:0,
            Role: Wheels,
            Emp: [],
            
        };
        // define an instancve of HTTP Service
        this.serv = new SecureCallService();
    }

    handleInputs=(evt)=> {
        this.setState({[evt.target.name]: evt.target.value});
    }

    handleClear=(evt)=>{
        this.setState({'VehicleNumber':''});
        this.setState({'VehicleName':''});
        this.setState({'Type':''});
        this.setState({'SOR':''});
        this.setState({'EmpId':''});
    };
  

    handleSave=(evt)=>{
         //let id = this.generateID(this.state.VehicleNumber);
         //console.log(id);
         
         let Vehicle_Details = {
             VehicleNumber: this.state.VehicleNumber,
             VehicleName: this.state.VehicleName,
             Wheels: this.state.Type,
             SOR: this.state.SOR,
             EmpId: this.state.EmpId,
             RepairingCost: this.state.RepairingCost,
             WashingCost: this.state.WashingCost,
             CleaningCost: this.state.CleaningCost,
             DelayReason:''
         };
         console.log(`react ${JSON.stringify(Vehicle_Details)}`);
         
        const token = sessionStorage.getItem('token'); 
         this.serv.registerVehicle(Vehicle_Details,token)
         .then((response)=>{
             console.log(response.data.data);
             this.props.history.push('/supervisor')
         }).catch((error)=>{
             console.log(`Error Occured ${error}`);
         });
     }

     componentDidMount=()=>{
        this.loadData();
    }
    loadData=()=>{
        this.serv.getWorkers()
        .then((response)=> {
            console.log(JSON.stringify(response.data.data));
            this.setselect(response.data.data);
           // sessionStorage.setItem('token', response.data.data);
        }).catch((error)=>{
            console.log(`Error in creating user ${error}`);
        });
    }

    setselect(arr){
        console.log(arr[0].EmpId);
        
        let arr1 =[]; 
        for (let i = 0; i < arr.length; i++) {
            arr1.push(arr[i].EmpId)
        }
        this.setState({Emp : arr1})
    }
    
    
    getSelectedRole(val) {
        this.setState({Type: val})
        if(val === '2 Wheeler'){
            this.setState({WashingCost : '150'})
        }else if(val === '4 Wheeler'){
            this.setState({WashingCost : '500'})
        }
        
    }
    getSelectedEmp(val) {
        this.setState({EmpId: val})
    }
    logout()
    {
        sessionStorage.clear();
        this.props.history.push('/')
    }
    back()
    {
        this.props.history.push('/admin')
    }
   
    render() {
        if (sessionStorage.getItem('token') === null ) {
            this.props.history.push('/');
        }
        return (
            <div className="container" style={{marginTop:20}}>
                <input type="button" value="Logout =>" 
                onClick={this.logout.bind(this)} className="btn btn-danger" 
                style={{float : "right",margin:5,}} />
                 <input type="button" value="Back" 
                onClick={this.back.bind(this)} className="btn btn-primary" 
                style={{float : "right",margin:5}} />
              <h2>Register Vehicle</h2>
              <div style={boxlayout}>
               <div className="form-group">
                  <label>Vehicle Number</label>
                  <input type="text" value={this.state.VehicleNumber} name="VehicleNumber" 
                    onChange={this.handleInputs.bind(this)}
                  className="form-control"/>
               </div>
               <div className="form-group">
                  <label>Vehicle Name</label>
                  <input type="text" value={this.state.VehicleName} name="VehicleName" 
                  onChange={this.handleInputs.bind(this)}
                  className="form-control"/>
               </div>
               <div className="form-group">
                  <label>Type</label>
                  <SelectComponent name="University" data={this.state.University} selectedValue={this.getSelectedRole.bind(this)} value={this.state.University} dataSource={this.state.Role}></SelectComponent>
               </div>
               {/* <div className="form-group">
                  <label>Employee Id</label>
                  <input type="text" value={this.state.EmpId} name="EmpId" 
                  onChange={this.handleInputs.bind(this)} className="form-control"/>
               </div> */}
               <div className="form-group">
                  <label>Id Of Idle Employee</label>
                  <SelectComponent name="University" data={this.state.University} selectedValue={this.getSelectedEmp.bind(this)} value={this.state.University} dataSource={this.state.Emp}></SelectComponent>
               </div>
               <div className="form-group">
                   <input type="button"  value="New" onClick={this.handleClear.bind(this)} style={{margin:5}} className="btn btn-warning"/>
                   <input type="button" value="Save" onClick={this.handleSave.bind(this)} className="btn btn-success"/>
               </div>
                <hr/>
                </div>
            </div>
        );
    }
}

export default RegisterVehicleComponent;