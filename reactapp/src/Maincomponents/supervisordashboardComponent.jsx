import React, { Component } from 'react';
import {Route, Link, Switch,Redirect} from 'react-router-dom';
import SecureCallService from './../services/securecallservice';
import CreateComponent from './createComponent'
import Pdf from "react-to-pdf";

const ref = React.createRef();
var boxlayout = {
    margin: 20,
    padding: 20,
    border: '12px solid #DDD',
    
  };
class SupervisorDashboardComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vehicles_details:[],
            BVN:'',
            BVNA: '',
            TYPE:'',
            RC:'',
            CC:'',
            WC:'',
            TC:'',
            RB:'',
            bill:true,
            color:[],
        };
        // define an instancve of HTTP Service
        this.serv = new SecureCallService();
        this.row = new CreateComponent();
    }

    sortByProperty(property){
        return function (x,y){
            return ((x[property] === y[property]) ? 0 : ((x[property] > y[property]) ? 1 : -1));
        };
    };

    revByProperty(property){
        return function (x,y){
            return ((x[property] === y[property]) ? 0 : ((x[property] < y[property]) ? 1 : -1));
        };
    };

    sortin=(evt)=>{
        let stds = this.state.vehicles_details
        let id = evt.target.id;        
        stds.sort(this.sortByProperty(id));
        this.setState({'vehicles_details' : stds});        
    }
    reversin=(evt)=>{
        let stds = this.state.vehicles_details
        let id = evt.target.id;        
        stds.sort(this.revByProperty(id));
        this.setState({'vehicles_details' : stds});        
    }
    search(evt){
        let id = evt.target.value;
        //console.log(id);

        const token = sessionStorage.getItem('token'); 
         this.serv.getStudentsById(id,token)
         .then((response)=>{
            this.setState({vehicles_details : response.data.data})
         }).catch((error)=>{
             console.log(`Error Occured ${error}`);
    });

    }

    handleDelete(evt){
         let id = evt.target.name;
        // console.log(id);
         
         const token = sessionStorage.getItem('token'); 
         this.serv.deleteStudent(id,token)
         .then((response)=>{
            this.loadData();
            //sessionStorage.setItem('token', response.data.data);
         }).catch((error)=>{
             console.log(`Error Occured ${error}`);
    });
}
    
    // the method that has calls to all heavy operations or external async calls
    componentDidMount=()=>{
        this.loadData();
    }
    loadData=()=>{
        const token = sessionStorage.getItem('token'); 
        this.serv.vehicles_details(token)
        .then((response)=> {
            console.log(JSON.stringify(response.data.data));
            this.setState({vehicles_details : response.data.data})
            this.setColor(response.data.data);
           // sessionStorage.setItem('token', response.data.data);
        }).catch((error)=>{
            console.log(`Error in creating user ${error}`);
        });
    }
    navigateRegisterVehicle(){
        this.props.history.push(`/registerVehicle`);

    }
    setColor(data){
        let color = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].DelayReason) {
                color.push('red')
            }else{
                color.push('black')
            }            
        }    
        this.setState({color : color});    
    }
    handleEdit(row){
        
        this.props.history.push(`updateStudents/${row}`);
        
    }
    handleBill(bill){
        let total = parseInt(bill.RepairingCost) + parseInt(bill.CleaningCost) + parseInt(bill.WashingCost)
        console.log(bill);
        
        this.setState({
            TC:total,
            BVN: bill.VehicleNumber,
            BVNA: bill.VehicleName,
            TYPE: bill.Wheels,
            RC:bill.RepairingCost,
            CC:bill.CleaningCost,
            WC:bill.WashingCost,
            RB:bill.EmpId,
            bill:false,
        })
    }
    deliver(evt){
        console.log(evt.target.name);
        // this.setState({servicestate:evt.target.name});
        let id = {id:this.state.RB , VehicleNumber : this.state.BVN }
         this.serv.updateRepairStage(evt.target.name,id)
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
                <h2>The Supervisor's Dashboard</h2>

               <div style={boxlayout}>
               <input type="text" name="searchBox" value={this.state.search} onBlur={this.search.bind(this)} placeholder="Search..."/>
                <input type="button" value="Register Vehicles+" 
               onClick={this.navigateRegisterVehicle.bind(this)} className="btn btn-warning"
               style={{float : "right",marginBottom:20,marginTop:10}} />
               
                <table className="table table-bordered table-striped">
                    <thead>
                    <tr>
                        
                            <th>Vehicle Number</th>
                            <th>Vehicle Name</th>
                            <th>Type</th>
                            <th>Stage Of Repairing</th>
                            <th>Worker Assign ID</th>
                            <th>Bill</th>          
                           

                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.vehicles_details.map((d,j) => (


                            
                            <tr key={j} >
                                <td>{d.VehicleNumber}</td>
                                <td>{d.VehicleName}</td>
                                <td>{d.Wheels}</td>
                                <td style={{color : this.state.color[j]}}>{d.StageOfRepair} {d.DelayReason}</td>
                                <td >{d.EmpId}</td>
                                <td><input type="button" className="btn btn-warning" value="Generate" onClick={() => this.handleBill(d)} /></td>
                            </tr>


                        ))
                    }
                    </tbody>
                </table>
            
                </div>
                <div>
                    <div style={{border:'1px solid black',padding:20}}  hidden={this.state.bill} >
                        
                    <Pdf targetRef={ref} filename="bill.pdf">
                        {({ toPdf }) => <button onClick={toPdf} onMouseUp={this.deliver.bind(this)} name="DELIVERED" className="btn btn-primary" >DownloadBill</button>}
                    </Pdf>
                    <i onClick={()=>this.setState({bill : true})} style={{float:"right",width:5}}>&times;</i>
                    <h2 style={{textAlign:"center"}}> Vehicle Servicing Centre</h2>
                    <hr/>
                        <div ref={ref} style={{ marginTop:10}}>

                            <table className="table table-dark" >
                                <thead></thead>
                                <tbody>
                                    <tr colSpan="3"><td>Vehicle Number : </td><td>{this.state.BVN}</td></tr>
                                    <tr><td>Vehicle Name : </td><td>{this.state.BVNA}</td></tr>
                                    <tr><td>Type : </td><td>{this.state.TYPE}</td></tr>
                                    <tr><td>Repairing Cost : </td><td>{this.state.RC}</td></tr>
                                    <tr><td>Cleaning Cost : </td><td>{this.state.CC}</td></tr>
                                    <tr><td>Washing Cost : </td><td>{this.state.WC}</td></tr>
                                    <tr><td>Total Cost : </td><td>{this.state.TC}</td></tr>
                                    <tr><td>Repaired by : </td><td>{this.state.RB}</td></tr>
                                </tbody>
                            </table>
                            <hr/>
                            <p style={{textAlign:'center'}}>Thank you Visit Again!</p>
                        </div>                      
                    </div>
                </div>
{/* 
                <Pdf targetRef={ref} filename="code-example.pdf">
                    {({ toPdf }) => <button onClick={toPdf}>Generate Pdf</button>}
                </Pdf>
                <div ref={ref}>
                    <h1 >Hello CodeSandbox</h1>
                    <h2>Start editing to see some magic happen!</h2>
                    <h2>hw{this.state.RB}</h2>
                </div>     */}
                    {/* <div style={{width: 500, height: 500, background: 'blue'}} ref={ref}/> */}

            </div>
        );
    }
}

export default SupervisorDashboardComponent;