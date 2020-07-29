const express = require('express');
const morgan  = require('morgan')
const path = require('path');
require('dotenv').config()

const app = express();

app.use(morgan('combined'))


//check oracle connection
const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
// bqmdev schema password
var password = process.env.oraclePwd 
// checkConnection asycn function
try {
  oracledb.initOracleClient({libDir: 'D:\\POCEXPRESSRESTAPI\\instantclient_19_6'});
} catch (err) {
  console.error('Whoops!');
  console.error(err);
  process.exit(1);
}


//

// const callapi = app.get('/api/testuser',(req,res)=>{
  

// async function makeConnection() {
//   try {
//     connection = await oracledb.getConnection({
//         user: process.env.oracleUser,
//         password: password,
//         connectString: process.env.localhost
//     });
//     console.log('connected to database');
//   } catch (err) {
//     console.error(err.message);
//   } finally {
//     if (connection) {
//       // try {
//       //   // Always close connections
//       //   awaitreturn 
//       //   console.log('close connection success');
//       // } catch (err) {
//       //   console.error(err.message);
//       // }

//       connection.execute(
//         `SELECT *
//          FROM DC_LOCATION`,
//         [],  
//        function(err, result) {
//           if (err) {
//             console.error(err.message);
//             return;
//           }
//           console.log(result.rows);
//        });
  
//     }
//   }

  
  

// }

// })

//jump host for nice database

var config = {
  username:'clarity',
  password:'clarity',
  host:'10.54.5.141',
  port:22,
  dstHost:'10.54.8.162',
  dstPort:1521,
  localHost:'127.0.0.1',
  localPort: 1521
};

// var tunnel = require('tunnel-ssh');
// tunnel(config, function (error, server) {

//   if(error){
//     console.log(error.message);
//   }

//   console.log("tunnel connected")
  
// });


//call api dc user table



//api dc_cage
//const jwt = require('jsonwebtoken')

//app.use(express.json())


  // app.post('/login', (req, res) => {
  //   // Authenticate User LDAP Here


  //   //After authentichate success give authorization here
  
  //   const username = req.body.username
  //   const user = { name: username }
  
  //   const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
  
  //   res.json({ accessToken: accessToken })
  // })


  // serve up production assets
//app.use(express.static('build'));
// app.use(app.router);
app.use(express.static(__dirname + '/build'));
// let the react app to handle any unknown routes 
// serve up the index.html if express does'nt recognize the route
app.get('/*', function(req, res, next){ 
  res.setHeader('Last-Modified', (new Date()).toUTCString());
  next(); 
});


require('./dcportalapi/DC_USER')(app);
require('./dcportalapi/DC_LOV')(app);
require('./dcportalapi/DC_MASTERLIST')(app);
require('./dcportalapi/DC_INBOX_LIST')(app);

require('./dcportalapi/inventory/DC_CAGE')(app);
require('./dcportalapi/inventory/DC_CRAC')(app);
require('./dcportalapi/inventory/DC_DASHBOARD_INFO')(app);
require('./dcportalapi/inventory/DC_LOCATION')(app);
require('./dcportalapi/inventory/DC_NETWORK_BANDWIDTH')(app);
require('./dcportalapi/inventory/DC_NETWORK_PORT')(app);
require('./dcportalapi/inventory/DC_PDU')(app);
require('./dcportalapi/inventory/DC_RACK')(app);
require('./dcportalapi/inventory/DC_SITE')(app);
require('./dcportalapi/inventory/DC_UPS')(app);

require('./dcportalapi/inventory/create/DC_CRAC_CREATE')(app);
require('./dcportalapi/inventory/create/DC_LOCATION_CREATE')(app);
require('./dcportalapi/inventory/create/DC_NETWORK_BANDWIDTH_CREATE')(app);
require('./dcportalapi/inventory/create/DC_NETWORK_PORT_CREATE')(app);
require('./dcportalapi/inventory/create/DC_PDU_CREATE')(app);
require('./dcportalapi/inventory/create/DC_RACK_CREATE')(app);
require('./dcportalapi/inventory/create/DC_SITE_CREATE')(app);
require('./dcportalapi/inventory/create/DC_UPS_CREATE')(app);

require('./dcportalapi/inventory/delete/DC_CRAC_DELETE')(app);
require('./dcportalapi/inventory/delete/DC_LOCATION_DELETE')(app);
require('./dcportalapi/inventory/delete/DC_NETWORK_BANDWIDTH_DELETE')(app);
require('./dcportalapi/inventory/delete/DC_NETWORK_PORT_DELETE')(app);
require('./dcportalapi/inventory/delete/DC_PDU_DELETE')(app);
require('./dcportalapi/inventory/delete/DC_RACK_DELETE')(app);
require('./dcportalapi/inventory/delete/DC_SITE_DELETE')(app);
require('./dcportalapi/inventory/delete/DC_UPS_DELETE')(app);

require('./dcportalapi/inventory/update/DC_CRAC_UPDATE')(app);
require('./dcportalapi/inventory/update/DC_LOCATION_UPDATE')(app);
require('./dcportalapi/inventory/update/DC_NETWORK_BANDWIDTH_UPDATE')(app);
require('./dcportalapi/inventory/update/DC_NETWORK_PORT_UPDATE')(app);
require('./dcportalapi/inventory/update/DC_PDU_UPDATE')(app);
require('./dcportalapi/inventory/update/DC_RACK_UPDATE')(app);
require('./dcportalapi/inventory/update/DC_SITE_UPDATE')(app);
require('./dcportalapi/inventory/update/DC_UPS_UPDATE')(app);
//require('./dcportalapi/DC_PENDING_TASK')(app);






  // Serve any static files
 // app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  // app.get('*', function(req, res) {
  //   res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  // });


const PORT = process.env.PORT || 5004;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));