const oracledb = require('oracledb');
const Promise = require("bluebird");

var password = process.env.oraclePwd 
module.exports = function (app) {
 
    const callapi = app.get('/api/DC_DASHBOARD_INFO',(req,res,next)=>{

      userId = req.query.userid
      site = req.query.site;
      location = req.query.location;
           
      if (site != null && location!=null) {
      query1="where site_name='"+site+"' and locn_name='"+location+"'";
      } 
      else if (site != null && location==null) {
      query1="where site_name='"+site+"'";
      }  
      else if (site == null && location!=null) {
      query1="where locn_name='"+location+"'";
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
                `select * from DC_EX_SUMMARY `+ query1 ,
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