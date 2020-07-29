const oracledb = require('oracledb');
const Promise = require("bluebird");

var password = process.env.oraclePwd 
module.exports = function (app) {

    const callapi = app.get('/api/DC_RACK',(req,res,next)=>{

      site = req.query.site;
      location = req.query.location;
      rackId = req.query.rack_id;      
          
      if (rackId != null) {
        query1=" where rack_id='"+rackId+"'";
        } 
      else if (site != null && location!=null) {
        query1=" where RACK_SITE_ID in (select site_id from dc_site where site_name='"+site+"')  and RACK_LOCN_ID in (select locn_id from dc_location where locn_name='"+location+"')";
        } 
        else if (site != null && location==null) {
        query1=" where RACK_SITE_ID in (select site_id from dc_site where site_name='"+site+"')";
        }
        else if (site == null && location!=null) {
        query1=" where RACK_LOCN_ID in (select locn_id from dc_location where locn_name='"+location+"')";
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
                RACK_ID,
                (select a.site_name from dc_site a where a.site_id=t.RACK_SITE_ID) SITE_NAME,
                (select d.locn_name from dc_location d where d.locn_id=RACK_LOCN_ID) as LOCATION_NAME,
                RACK_NO,
                RACK_STATUS,
                RACK_ROOM,
                RACK_TYPE,
                RACK_SIZE,
                RACK_POWER_DENSITY,
                RACK_BREAKER_TYPE,
                RACK_POWER_PHASE,
                RACK_CABLE_ID,
                RACK_PDU_A,
                RACK_PDU_B,
                RACK_SOURCE_A,
                RACK_SOURCE_B,
                RACK_POWER_PRELAID,
                RACK_CABLING_PRELAID,
                RACK_DESC,
                RACK_CONTRACTUAL_POWER,
                RACK_SERVICEID,
                (select c.cusr_name from dc_customer c where c.cusr_id=t.RACK_CUSR_ID) as rack_customer,
                to_char(RACK_COMM_DT,'dd/mm/yyyy') as RACK_COMM_DT ,	
                to_char(RACK_DECOMM_DT,'dd/mm/yyyy') as RACK_DECOMM_DT,		
                to_char(RACK_COMM_DT,'dd/mm/yyyy hh:mi:ss am') as RACK_COMM_DT_V ,	
                to_char(RACK_DECOMM_DT,'dd/mm/yyyy hh:mi:ss am') as RACK_DECOMM_DT_V,		
                to_char(RACK_UPDATED_DT,'dd/mm/yyyy hh:mi:ss am')as RACK_UPDATED_DT,
                RACK_UPDATED_BY,	
                to_char(RACK_CREATED_DT,'dd/mm/yyyy hh:mi:ss am') as RACK_INSERT_DT,
                RACK_CREATED_BY as RACK_INSERT_BY
                from DC_RACK t`+ query1 +`` ,
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