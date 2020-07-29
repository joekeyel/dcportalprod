const oracledb = require('oracledb');
const Promise = require("bluebird");

var password = process.env.oraclePwd 
module.exports = function (app) {

    const callapi = app.get('/api/DC_LOV',(req,res,next)=>{

        type = req.query.type
      
      if (type != null) {
        query1=" where LOV_NAME='"+type+"'";
        }else{
          query1="";
        };

        makeConnection(query1,res)           
      })   
  }
        async function makeConnection(query1,res) {
        try {
          connection = await oracledb.getConnection({
              user: process.env.oracleUser,
              password: password,
              connectString: process.env.localhost
              //connectString: process.env.localhost
          });
          console.log('connected to database');
      
          var query1p =  connection.execute(
                `select * from DC_LOV_VIEW `+ query1,
                [],               
              );
    
                Promise.join(query1p).spread(function (result){
                  res.status(200).send(result.rows);
                })
              } catch (err) {
                console.error(err.message);
               return
              } 
              
          }