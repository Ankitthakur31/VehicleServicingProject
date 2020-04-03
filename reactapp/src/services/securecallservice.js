import axios from "axios";

class SecureCallService {
    constructor() {
        this.url = 'http://localhost:6070';
    }

    //authenticate the user
    authUserName(username){
        let response = axios.get(`${this.url}/api/users/${username}`)
        console.log(`http ${response}`);
        
        return response;
    }
    // register users
    register(user) {
        let response = axios.post(`${this.url}/api/users/register`,
            user, {
                headers: {
                    'Content-type': 'application/json'
                }
            });
        return response;
    }

    // login users
    login(user) {
        let response = axios.post(`${this.url}/api/employees/authuser`,
            user, {
                headers: {
                    'Content-type': 'application/json'
                }
            });
        return response;
    }

    getEmployees(token) {
        let response = axios.get(`${this.url}/api/employees`, {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        });
        return response;
    }

    vehicles_details(token) {
        let response = axios.get(`${this.url}/api/vehicles_details`, {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        });
        return response;
    }

    addEmployees(Employee , token) {
        let response = axios.post(`${this.url}/api/employees`,Employee, {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        });
        return response;
    }

    registerVehicle(Vehicle_Details , token) {
        let response = axios.post(`${this.url}/api/vehicles_details`,Vehicle_Details, {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        });
        return response;
    }

    deleteStudent(id,token) {
        let response = axios.delete(`${this.url}/api/students/${id}`, {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        });
        return response;
    }

    stateOfVehicle(id , token){
        let response = axios.get(`${this.url}/api/stateOfVehicle/${id}`, {
            headers: {
                'AUTHORIZATION': `Bearer ${token}`
            }
        });
        return response;
    }

    updateRepairStage(stage , id) {
        let response = axios.put(`${this.url}/api/stateOfVehicles/${stage}`,id);
        return response;
    }

    getWorkers(){
        let response = axios.get(`${this.url}/api/workers`);
        return response;
    }

    updateRepairCost(stage , id) {
        let response = axios.put(`${this.url}/api/updateRepair/${stage}`,id);
        return response;
    }

    updateCleaningCost(stage ,  id) {
        let response = axios.put(`${this.url}/api/updateClean`,id);
        return response;
    }

    updateReason(stage ,  id) {
        let response = axios.put(`${this.url}/api/delayReason/${stage}`,id);
        return response;
    }
}

export default SecureCallService;