const oracledb = require('oracledb');
const Promise = require("bluebird");

var password = process.env.oraclePwd 
module.exports = function (app) {

    const callapi = app.get('/api/DC_NETWORK_PORT',(req,res,next)=>{

      site = req.query.site;
      portId=req.query.port_id;           
      
      if (site != null && portId== null) {
        query1=" where PORT_SITE_ID in (select site_id from dc_site where site_name='"+site+"')";
        } 
        else if (portId != null) {
          query1=" where PORT_ID='"+portId+"'";
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
                `SELECT 
                PORT_ID,
                (select ntw_name from dc_bandwidth where ntw_id=PORT_NTW_ID) as ntw_name,
                PORT_NO,
                (select site_name from dc_site where site_id=PORT_SITE_ID) as site_name,
                PORT_NTW_TYPE,
                PORT_CAB_PRELAID,
                PORT_STATUS,
                PORT_DESC,
                PORT_SERVICEID,
                PORT_SWITCH_NAME,
                (select cusr_name from dc_customer where cusr_id=PORT_CUSR_ID) as customer_name,
                PORT_BANDWIDTH,
                to_char(PORT_CREATED_DT,'dd/mm/yyyy hh:mi:ss am') as PORT_CREATED_DT,
                PORT_CREATED_BY,
                to_char(PORT_UPDATED_DT,'dd/mm/yyyy hh:mi:ss am') as PORT_UPDATED_DT,
                PORT_UPDATED_BY,
                to_char(PORT_COMM_DT,'dd/mm/yyyy hh:mi:ss am') as PORT_COMM_DT,
                to_char(PORT_DECOMM_DT,'dd/mm/yyyy hh:mi:ss am') as PORT_DECOMM_DT
                FROM DC_NETWORK_PORT  `+ query1 ,
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