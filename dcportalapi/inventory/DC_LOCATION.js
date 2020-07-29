const oracledb = require('oracledb');
const Promise = require("bluebird");

var password = process.env.oraclePwd 
module.exports = function (app) {

    const callapi = app.get('/api/DC_LOCATION',(req,res,next)=>{
    
      site = req.query.site;
      locn_id = req.query.locn_id;
      location = req.query.location;

      if (site != null && location != null) {
        query1="where site_name='"+site+"'" +
          "and locn_name='"+location+"'";
        } 
        else if (site != null && location == null) {
        query1="where site_name='"+site+"'";
        }  
        else if (site == null && location!=null) {
        query1="where locn_name='"+location+"'";
        }
        else if (locn_id != null) {
        query1="where locn_id='"+locn_id+"'";
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
  
          oracledb.fetchAsString = [ oracledb.CLOB ];
            var query1p =  connection.execute(

                `select * from DC_LOCATION_VIEW  `+ query1 +`` ,
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