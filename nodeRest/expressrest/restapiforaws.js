const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const jwtoken = require('jsonwebtoken');
const { Sequelize } = require('sequelize');
const instance = express();
instance.use(bodyParser.json());
instance.use(bodyParser.urlencoded({ extended: false }));
instance.use(cors());
const jwtObject = {
    'jwtSecret': 'xyzprq00700qrpzyx'
}

// define a varible that will contains the Token on server
// globally
let globalTokan;

const sequelize = new Sequelize("vechicle_servicing", "admin", "admin123", {
    host: 'database-1.cgxefe29mdtw.ap-south-1.rds.amazonaws.com',
    dialect: 'mysql',
    pool: {
        min: 0,
        max: 5,
        idle: 10000
    },
    define: {
        timestamps: false  
    }
});

const vehicles_details = sequelize.import('./../models/vehicles_details.js');
const employees = sequelize.import('./../models/employees.js');


//Authentication for registration of username
instance.get('/api/employees/:empId', (request, response) => {
    console.log(request.params.empId);
    sequelize.sync({ force: false })
        .then(() => employees.findByPk(request.params.empId)) 
        .then((result) => {
            response.json({ statusCode: 200, rowCount: result.length, data: true });
            response.end();
        }).catch((error) => {
            response.send({ statusCode: 500, data: error });
        })
});

// post method to create user
instance.post('/api/employees/register', (request, response) => {
    sequelize.sync({ force: false })
        .then(() => users.create({
            userName: request.body.UserName,
            password: request.body.Password
        })).then((result) => {
            response.json({
                statucCode: 200,
                data: `User Created Successfully ${JSON.stringify(result.toJSON())}`
            });
            response.end();
        }).catch((error) => {
            response.send({
                statucCode: 500,
                data: `Error Occured ${error}`
            });
            response.end();
        });
});


instance.set('jwtSecret', jwtObject.jwtSecret);


//  Authorize the user and generate token and Login
instance.post('/api/employees/authuser', (request, response) => {
    const authValue = {
        EmpId: request.body.empId,
        EmpPass: request.body.password
    };
    console.log(`auth value ${authValue.EmpId}`);
    
    sequelize.sync({ force: false })
        .then(() => employees.findByPk(authValue.EmpId))
        .then((result) => {
            console.log(JSON.stringify(result));
            if (result === null) {
                response.json({ statusCode: 401, data: `User Not Found` });
                response.end();
            } else {
                if (result.EmpPAss !== authValue.EmpPass) {
                    response.json({ statusCode: 401, data: `Un-Authenticated response Password Does not match` });
                    response.end();
                } else {
                    response.send({
                        statusCode: 200,
                        authenticated: true,
                        data: result.EmpRole,
                        id:result.EmpId
                    });
                    response.end();
                }
            }

        }).catch((error) => {
            response.json({ statusCode: 401, data: `User Not Found ${error}` });
            response.end();
        });
});



instance.get('/api/employees', (request, response) => {
    let header = request.headers.authorization;
    // 3b read the token value
    let token = header.split(' ')[1];
    console.log(token);
    {
            if (token == null) {
                response.send({ statusCode: 401, data: `Token Verification failed ${err}` });
                response.end();
            } else {
                sequelize.sync({ force: false })
                    .then(() => employees.findAll())
                    .then((result) => {
                        response.json({ statusCode: 200, rowCount: result.length, data: result });
                        response.end();
                    }).catch((error) => {
                        response.send({ statusCode: 500, data: error });
                    });
            }
    }
    
});

instance.get('/api/vehicles_details', (request, response) => {
    let header = request.headers.authorization;
    // 3b read the token value
    let token = header.split(' ')[1];
    console.log(token);
    {
            if (token == null) {
                response.send({ statusCode: 401, data: `Token Verification failed ${err}` });
                response.end();
            } else {
                sequelize.sync({ force: false })
                    .then(() => vehicles_details.findAll({where : Sequelize.or(
                        { StageOfRepair: ['SERVICING RECEIVED' , 'REPAIRING' , 'CLEANING' , 'WASHING','READY TO DELIVER']  })}))
                    .then((result) => {
                        response.json({ statusCode: 200, rowCount: result.length, data: result });
                        response.end();
                    }).catch((error) => {
                        response.send({ statusCode: 500, data: error });
                    });
            }
    }
    
});


instance.get('/api/stateOfVehicle/:id', (request, response) => {
    // read the parameter
    let id = request.params.id;
    console.log(id);
    
    // do not overwrite the models
    let header = request.headers.authorization;
    let token = header.split(' ')[1];
    console.log(token);
    {
            if (token == null) {
                response.send({ statusCode: 401, data: `Token Verification failed ${err}` });
                response.end();
            } else {
                sequelize.sync({ force: false })
                .then(() => vehicles_details.findAll({where : {Empid : id , StageOfRepair: ['SERVICING RECEIVED' ,'REPAIRING', 'WASHING' , 'CLEANING']}})) 
                .then((result) => {
                    if (result !== null) {
                        response.json({ statusCode: 200, data: result[0].StageOfRepair, number: result[0].VehicleNumber , name: result[0].VehicleName});
                        response.end();
                    } else {
                        response.json({ statusCode: 200, data: `Record not found` });
                        response.end();
                    }
                }).catch((error) => {
                    response.send({ statusCode: 500, data: error });
                })
            }
        
    }
    
});

instance.post('/api/employees', (request, response) => {
    const Employee = {
        EmpId : request.body.EmpId,
        EmpName : request.body.EmpName,
        MobileNumber: request.body.MobileNumber,
        EmpRole: request.body.EmpRole,
        EmpStatus: request.body.EmpStatus,
        EmpAddr: request.body.EmpAddr,
        EmpPAss: request.body.EmpPAss 
    };
    
    let header = request.headers.authorization;
    let token = header.split(' ')[1];
    {
            if (token == null) {
                response.send({ statusCode: 401, data: `Token Verification failed ${err}` });
                response.end();
            } else {
                sequelize.sync({ force: false })
                .then(() => employees.create(Employee))
                .then((result) => {
                    if (result !== null) {
                        response.json({ statusCode: 200, data: JSON.stringify(result.toJSON()) });
                        
                        response.end();
                    } else {
                        response.json({ statusCode: 200, data: `Record is not Created` });
                        response.end();
                    }
                }).catch((error) => {
                    response.send({ statusCode: 500, data: error });
                })
                
            }
    }
    
});

instance.post('/api/vehicles_details', (request, response) => {
    const Vehicles_Details = {
        VehicleNumber : request.body.VehicleNumber,
        VehicleName : request.body.VehicleName,
        Wheels: request.body.Wheels,
        StageOfRepair: request.body.SOR,
        RepairingCost: request.body.RepairingCost,
        CleaningCost: request.body.CleaningCost,
        WashingCost: request.body.WashingCost  , 
        EmpId: request.body.EmpId  ,
        DelayReason : request.body.DelayReason
    };
    console.log(`token ${JSON.stringify(Vehicles_Details)}`);
    
    
    let header = request.headers.authorization;
    let token = header.split(' ')[1];
    {
            if (token == null) {
                response.send({ statusCode: 401, data: `Token Verification failed ${err}` });
                response.end();
            } else {
                sequelize.sync({ force: false })
                .then(() => vehicles_details.create(Vehicles_Details ))
                .then((result) => {
                    if (result !== null) {
                        response.json({ statusCode: 200, data: JSON.stringify(result.toJSON()) });
                        sequelize.sync({ force: false })
                        .then(() => employees.update({EmpStatus : 'Idle'}, { where: {EmpId : Vehicles_Details.EmpId } } ))
                        .then((result) => {
                            if (result !== null) {
                                response.json({ statusCode: 200, data: JSON.stringify(result.toJSON()) });
                                
                                response.end();
                            } else {
                                response.json({ statusCode: 200, data: `Record is not Created` });
                                response.end();
                            }
                        }).catch((error) => {
                            response.send({ statusCode: 500, data: error });
                        })
                        response.end();
                    } else {
                        response.json({ statusCode: 200, data: `Record is not Created` });
                        response.end();
                    }
                }).catch((error) => {
                    response.send({ statusCode: 500, data: error });
                })

                
                
            }
    }
    
});


instance.put('/api/stateOfVehicles/:stage', (request, response) => {
    let stage = request.params.stage;
    let up = false;
    if(stage === 'READY TO DELIVER'){ up = true}
                let id = request.body.id;
    let vehicleNumber = request.body.VehicleNumber;
    console.log((`${id} &&&&&&& ${stage}`));
    
    sequelize.sync({ force: false })
    .then(() => vehicles_details.update({StageOfRepair : stage}, { where: {VehicleNumber : vehicleNumber } }))
    .then((result) => {
        if (result[0] !== 0) {
            response.json({ statusCode: 200, data: result });
            console.log(result);
            if(up){
            console.log('ready');

                sequelize.sync({ force: false })
                .then(() => employees.update({EmpStatus : 'Idle'}, { where: {EmpId : Id } } ))
                .then((result) => {
                    if (result !== null) {
                        response.json({ statusCode: 200, data: JSON.stringify(result.toJSON()) });
                        
                        response.end();
                    } else {
                        response.json({ statusCode: 200, data: `Record is not Created` });
                        response.end();
                    }
                }).catch((error) => {
                    response.send({ statusCode: 500, data: error });
                })
            }
            
            response.end();
        } else {
            response.json({ statusCode: 500, data: `Record is not Updated` });
            response.end();
        }
    }).catch((error) => {
        response.send({ statusCode: 500, data: error });
    })
});

instance.put('/api/updateRepair/:stage', (request, response) => {
    let stage = request.params.stage;
    let id = request.body.id;
    let vehicleNumber = request.body.VehicleNumber;
    console.log((`${id} &&&&&&& ${stage}`));
    
    sequelize.sync({ force: false })
    .then(() => vehicles_details.update({RepairingCost : stage}, { where: {VehicleNumber : vehicleNumber } }))
    .then((result) => {
        if (result[0] !== 0) {
            response.json({ statusCode: 200, data: result });
            console.log(result);
            response.end();
        } else {
            response.json({ statusCode: 500, data: `Record is not Updated` });
            response.end();
        }
    }).catch((error) => {
        response.send({ statusCode: 500, data: error });
    })
});

instance.put('/api/updateClean', (request, response) => {
    let stage = request.body.stage;
    let id = request.body.id;
    let vehicleNumber = request.body.VehicleNumber;
    console.log((`${id} &&&&&&& ${stage}`));
    
    sequelize.sync({ force: false })
    .then(() => vehicles_details.update({CleaningCost : stage}, { where: {VehicleNumber : vehicleNumber } }))
    .then((result) => {
        if (result[0] !== 0) {
            response.json({ statusCode: 200, data: result });
            console.log(result);
            response.end();
        } else {
            response.json({ statusCode: 500, data: `Record is not Updated` });
            response.end();
        }
    }).catch((error) => {
        response.send({ statusCode: 500, data: error });
    })
});

instance.put('/api/delayReason/:stage', (request, response) => {
    let stage = request.params.stage;
    let id = request.body.id;
    let vehicleNumber = request.body.VehicleNumber;
    console.log((`${id} &&&&&&& ${stage}`));
    
    sequelize.sync({ force: false })
    .then(() => vehicles_details.update({DelayReason : stage}, { where: {VehicleNumber : vehicleNumber } }))
    .then((result) => {
        if (result[0] !== 0) {
            response.json({ statusCode: 200, data: result });
            console.log(result);
            response.end();
        } else {
            response.json({ statusCode: 500, data: `Record is not Updated` });
            response.end();
        }
    }).catch((error) => {
        response.send({ statusCode: 500, data: error });
    })
});

instance.delete('/api/students/:id', (request, response) => {
    // read the parameter
    let id = parseInt(request.params.id);

    let header = request.headers.authorization;
    let token = header.split(' ')[1];
    {
        jwtoken.verify(token, instance.get('jwtSecret'), (err, decoded) => {
            if (err) {
                response.send({ statusCode: 401, data: `Token Verification failed ${err}` });
                response.end();
            } else {
                request.decoded = decoded;
                sequelize.sync({ force: false })
                .then(() => students.destroy({ where: { studentId: id } }))
                .then((result) => {
                    if (result === 0) {
                        response.json({ statusCode: 200, data: 'No Record deleted' });
                        response.end();
                    } else {
                        response.json({ statusCode: 200, data: result });
                        response.end();
                    }
                }).catch((error) => {
                    response.send({ statusCode: 500, data: error });
                })
            }
        });
    }
    // do not overwrite the models
        
});



instance.get('/api/workers', (request, response) => {
    sequelize.sync({ force: false })
        .then(() => employees.findAll({
            attributes : ['EmpId'],
            where : {EmpStatus : 'Idle' , EmpRole : 'Mechanic'}
        })) 
        .then((result) => {
            response.json({ statusCode: 200, rowCount: result.length, data: result });
            response.end();
        }).catch((error) => {
            response.send({ statusCode: 500, data: error });
        })
});


// listenting on the port
instance.listen(6070, () => {
    console.log('Server is listening on port 6070');
})















