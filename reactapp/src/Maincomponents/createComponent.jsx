import React, { Component } from 'react';
import SelectComponent from './../components/selectComponent';
import SecureCallService from './../services/securecallservice';
import { Universities, Roles } from './../models/constants';

var boxlayout = {
    margin: 20,
    padding: 20,
    border: '12px solid #DDD',
    
  };

class CreateComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            EmpId:'',
            EmpName: '',
            MobileNumber:'',
            EmpRole:'',
            EmpStatus:'Idle',
            EmpAddr:'',
            EmpPAss:'',
            Role: Roles,
            
        };
        // define an instancve of HTTP Service
        this.serv = new SecureCallService();
    }

    handleInputs=(evt)=> {
        this.setState({[evt.target.name]: evt.target.value});
    }

    handleClear=(evt)=>{
        this.setState({'EmpName':''});
        this.setState({'EmpPAss':''});
        this.setState({'MobileNumber':''});
        this.setState({'EmpRole':''});
        this.setState({'EmpAddr':''});
    };
    generateID(name){
        var data = '';
            var date = new Date();            
            var month = new Date();           
            var year = new Date();            
            data = month.getMonth()  + 1 + date.getDate().toString() ; 
            var keyset = name.slice(0, 3) + data.toString() ;
            console.log(keyset);
             return keyset;
    };

    handleSave=(evt)=>{
         let id = this.generateID(this.state.EmpName);
         console.log(id);
         
         let Employee = {
             EmpId: id,
             EmpName: this.state.EmpName,
             MobileNumber: this.state.MobileNumber,
             EmpRole: this.state.EmpRole,
             EmpStatus: this.state.EmpStatus,
             EmpAddr: this.state.EmpAddr,
             EmpPAss: this.state.EmpPAss
         };
        const token = sessionStorage.getItem('token'); 
         this.serv.addEmployees(Employee,token)
         .then((response)=>{
             console.log(response.data.data);
             this.props.history.push('/admin')
         }).catch((error)=>{
             console.log(`Error Occured ${error}`);
         });
     }
    
    
    getSelectedRole(val) {
        this.setState({EmpRole: val})
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
              <h2>Register Employee </h2>
              <div style={boxlayout}>
               <div className="form-group">
                  <label>Employee Name</label>
                  <input type="text" value={this.state.EmpName} name="EmpName" 
                    onChange={this.handleInputs.bind(this)}
                  className="form-control"/>
               </div>
               <div className="form-group">
                  <label>Phone Number</label>
                  <input type="text" value={this.state.MobileNumber} name="MobileNumber" 
                  onChange={this.handleInputs.bind(this)}
                  className="form-control"/>
               </div>
               <div className="form-group">
                  <label>Role</label>
                  <SelectComponent name="University" data={this.state.University} selectedValue={this.getSelectedRole.bind(this)} value={this.state.University} dataSource={this.state.Role}></SelectComponent>
               </div>
               <div className="form-group">
                  <label>Address</label>
                  <input type="text" value={this.state.EmpAddr} name="EmpAddr" 
                  onChange={this.handleInputs.bind(this)} className="form-control"/>
               </div>
               <div className="form-group">
                  <label>Employee Password</label>
                  <input type="text" value={this.state.EmpPAss} name="EmpPAss" 
                  onChange={this.handleInputs.bind(this)} className="form-control"/>
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

export default CreateComponent;