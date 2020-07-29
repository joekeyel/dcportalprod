const oracledb = require('oracledb');
const Promise = require("bluebird");

var password = process.env.oraclePwd 
module.exports = function (app) {
  

    const callapi = app.get('/api/DC_MASTERLIST',(req,res,next)=>{

      makeConnection(res)           
    })   
}     
      async function makeConnection(res) {
        try {
          connection = await oracledb.getConnection({
              user: process.env.oracleUser,
              password: password,
              connectString: process.env.localhost
              //connectString: process.env.localhost
          });
          console.log('DC MASTERLIST');

          var query1p =  connection.execute(
                `select * from DC_MASTERLIST`,
                [],  
              );

                Promise.join(query1p).spread(function (result){
                  res.status(200).send(result.rows);
                })
              } catch (err) {
                console.error(err.message+" ERROR DC MASTERLIST");
               return
              } 
              
          }
      
          
        
