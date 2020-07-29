const oracledb = require('oracledb');
const Promise = require("bluebird");

var password = process.env.oraclePwd 
module.exports = function (app) {

    const callapi = app.get('/api/DC_UPS',(req,res)=>{
    
      site = req.query.site;
      location = req.query.location;
      Id = req.query.id;
          
      if (site != null && location!=null) {
        query1=" where site_name='"+site+"' and location_name like '%"+location+"%'";
        } 
        else if (site != null && location==null) {
        query1=" where site_name='"+site+"' ";
        }
        else if (site == null && location!=null) {
        query1=" location_name like '%"+location+"%'";
        }
        else{
          query1="";
        };
        
        if (Id != null) {
        query2=" where UPS_ID='"+Id+"'";
        }else{
            query2="";
            Id=0;
        };
        makeConnection(query1,query2,res)           
      })   
  }             
      async function makeConnection(query1,query2,res) {
        try {
          connection = await oracledb.getConnection({
              user: process.env.oracleUser,
              password: password,
              connectString: process.env.localhost
              //connectString: process.env.localhost
          });
          console.log('connected to database');

          var query1p =  connection.execute(
                `select * from (
                    SELECT 
                    UPS_ID,
                    UPS_NAME,
                    (select site_name from dc_site where site_id=UPS_SITE_ID) as site_name,
                    (SELECT 
                    LISTAGG(b.locn_name, ',') WITHIN GROUP (ORDER BY locn_name)
                    FROM dc_location_multi d,dc_location b
                    where d.multi_oth_id=a.ups_id
                    and d.multi_locn_id=b.locn_id) as location_name,
                    UPS_POWER_CAPACITY,
                    UPS_POWER_KVA,
                    UPS_POWER_AVAILABLE,
                    UPS_BRAND,
                    UPS_MODEL,
                    UPS_STATUS,
                    UPS_DESC,
                    to_char(UPS_CREATED_DT,'dd/mm/yyyy hh:mi:ss am') as UPS_CREATED_DT,
                    UPS_CREATED_BY,
                    to_char(UPS_UPDATED_DT,'dd/mm/yyyy hh:mi:ss am') as UPS_UPDATED_DT,
                    UPS_UPDATED_BY,
                    to_char(UPS_COMM_DT,'MM/dd/yyyy') as UPS_COMM_DT,
                    to_char(UPS_DECOMM_DT,'MM/dd/yyyy') as UPS_DECOMM_DT,
                    to_char(UPS_COMM_DT,'dd/mm/yyyy hh:mi:ss am') as UPS_COMM_DT_TV,
                    to_char(UPS_DECOMM_DT,'dd/mm/yyyy hh:mi:ss am') as UPS_DECOMM_DT_TV
                    FROM  DC_UPS a `+ query2 + `)`+query1+`` ,
                [],  
              );
                var query2p =  connection.execute(
                    `select b.ups_status as status_jn,b.ups_maintenance_upd as maintenance_upd_jn,b.ups_updated_by as staff_id, 
                    (select u.dcu_name from dc_users u where u.dcu_id=b.ups_updated_by) staff_name,
                    to_char(b.ups_updated_dt,'dd/mm/yyyy hh:mi am') as date_jn
                    from dc_ups a, dc_ups_jn b
                    where a.ups_id=b.ups_id
                    and b.ups_id=`+Id+`` ,
                    [],                   
                );

                Promise.join(query1p,query2p).spread(function (result,result2){
                res.status(200).send({ups:result.rows,journal:result2.rows});
              })
            } catch (err) {
              console.error(err.message);
             return
            }             
        } 