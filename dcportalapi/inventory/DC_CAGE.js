const oracledb = require('oracledb');
const Promise = require("bluebird");

var password = process.env.oraclePwd 
module.exports = function (app) {

    const dc_cage = app.get('/api/DC_CAGE/',(req,res,next)=>{

        let location = req.query.location
        let site  = req.query.site
        let query1 = ""    
      
        if (site != null && location!=null) {
          query1=" where site_name='"+site+"' and location_name='"+location+"'";
          } 
          else if (site != null && location==null) {
          query1=" where site_name='"+site+"'";
          }
          else if (site == null && location!=null) {
          query1=" where location_name='"+location+"'";
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
              });
              console.log('/DC_CAGE');

        var query1p =  connection.execute(
          `select * from DC_CAGE_VIEW` + query1,
          [],  
        );
          Promise.join(query1p).spread(function (result){
            res.status(200).send(result.rows);
          })
        } catch (err) {
          console.error(err.message + "===>DC_CAGE");
         return
        } 
        
    }          
