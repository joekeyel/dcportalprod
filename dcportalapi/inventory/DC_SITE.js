const oracledb = require('oracledb');
const Promise = require("bluebird");

var password = process.env.oraclePwd 
module.exports = function (app) {
  
    const callapi = app.get('/api/DC_SITE',(req,res)=>{   

      site = req.query.site;

      if (site != null) {
        query1=" where SITE_NAME='"+site+"'";
        } 
        else{
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
                `select * from DC_SITE_VIEW `+ query1 +`` ,
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