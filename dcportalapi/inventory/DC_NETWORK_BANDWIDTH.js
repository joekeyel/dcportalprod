const oracledb = require('oracledb');
const Promise = require("bluebird");

var password = process.env.oraclePwd 
module.exports = function (app) {

    const callapi = app.get('/api/DC_NETWORK_BANDWIDTH',(req,res,next)=>{

      site = req.query.site;   
      ntwId = req.query.ntw_id;  
     
      if (site != null && Id == null) {
        query1=" where NTW_SITE_ID in (select site_id from dc_site where site_name='"+site+"')";
        } 
        else if (ntwId != null) {
          query1=" where NTW_ID='"+ntwId+"'";
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
                `select 
                NTW_ID,
                (select site_name from dc_site where site_id=t.NTW_SITE_ID) as site_name,
                NTW_NAME,
                NTW_BANDWIDTH,
                NTW_STATUS,
                NTW_DESC,
                to_char(NTW_CREATED_DT,'dd/mm/yyyy hh:mi:ss am') as NTW_CREATED_DT,
                NTW_CREATED_BY,
                to_char(NTW_UPDATED_DT,'dd/mm/yyyy hh:mi:ss am') as NTW_UPDATED_DT,
                NTW_UPDATED_BY,
                to_char(NTW_COMM_DT,'dd/mm/yyyy') as NTW_COMM_DT,
                to_char(NTW_DECOMM_DT,'dd/mm/yyyy') as NTW_DECOMM_DT,
                to_char(NTW_COMM_DT,'dd/mm/yyyy hh:mi:ss am') as NTW_COMM_DT_V,
                to_char(NTW_DECOMM_DT,'dd/mm/yyyy hh:mi:ss am') as NTW_DECOMM_DT_V
                from dc_bandwidth t  `+ query1 ,
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