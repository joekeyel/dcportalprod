const oracledb = require('oracledb');
const Promise = require("bluebird");

var password = process.env.oraclePwd 
module.exports = function (app) {
 
    const callapi = app.get('/api/DC_PDU',(req,res,next)=>{

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
        query2=" where PDU_ID='"+Id+"'";
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
                    select 
                    PDU_ID,
                    PDU_NAME,
                    (select site_name from dc_site where site_id=PDU_SITE_ID) as site_name,
                    (SELECT 
                    LISTAGG(b.locn_name, ',') WITHIN GROUP (ORDER BY locn_name)
                    FROM dc_location_multi d,dc_location b
                    where d.multi_oth_id=t.pdu_id
                    and d.multi_locn_id=b.locn_id) as location_name,
                    PDU_CODE,
                    PDU_FUSE,
                    PDU_USER_RACK,
                    PDU_STATUS,
                    PDU_DESC,
                    to_char(PDU_CREATED_DT,'dd/mm/yyyy hh:mi:ss am') as PDU_CREATED_DT, 
                    PDU_CREATED_BY,
                    to_char(PDU_UPDATED_DT,'dd/mm/yyyy hh:mi:ss am') as PDU_UPDATED_DT, 
                    PDU_UPDATED_BY,
                    to_char(PDU_COMM_DT,'dd/mm/yyyy hh:mi:ss am') as PDU_COMM_DT,
                    to_char(PDU_DECOMM_DT,'dd/mm/yyyy hh:mi:ss am') as PDU_DECOMM_DT
                    from DC_PDU t `+ query2 + `)`+query1+`` ,
                [],                 
                );

                var query2p =  connection.execute(
                    `select b.pdu_status as status_jn,b.pdu_maintenance_upd as maintenance_upd_jn,b.pdu_updated_by as staff_id, 
                    (select u.dcu_name from dc_users u where u.dcu_id=b.pdu_updated_by) staff_name,
                    to_char(b.pdu_updated_dt,'dd/mm/yyyy hh:mi am') as date_jn
                    from dc_pdu a, dc_pdu_jn b
                    where a.pdu_id=b.pdu_id
                    and b.pdu_id=`+Id+`` ,
                    [],                     
                );

               Promise.join(query1p,query2p).spread(function (result,result2){           
                  res.status(200).send({pdu:result.rows,journal:result2.rows});
                  })
                } catch (err) {
                  console.error(err.message);
                 return
                }             
            } 