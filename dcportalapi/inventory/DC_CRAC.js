const oracledb = require('oracledb');
const Promise = require("bluebird");

var password = process.env.oraclePwd 
module.exports = function (app) {
  

    const callapi = app.get('/api/DC_CRAC',(req,res)=>{

      userId = req.query.userid

      site = req.query.site;
      location = req.query.location;
      Id = req.query.id;
      

      if (site != null && location!=null) {
        query1=" where site_name="+site+" and location_name like '%"+location+"%'";
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
        query2=" where CRAC_ID='"+Id+"'";
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
                    CRAC_ID,
                    CRAC_NAME,
                    (select site_name from dc_site where site_id=CRAC_SITE_ID) as site_name,
                    (SELECT 
                    LISTAGG(b.locn_name, ',') WITHIN GROUP (ORDER BY locn_name)
                    FROM dc_location_multi d,dc_location b
                    where d.multi_oth_id=t.crac_id
                    and d.multi_locn_id=b.locn_id) as location_name,
                    CRAC_AREA,
                    CRAC_KW,
                    CRAC_QUANTITY,
                    CRAC_COOL_CAPACITY,
                    CRAC_BRAND,
                    CRAC_TYPE,
                    CRAC_STATUS,
                    CRAC_DESC,
                    CRAC_COMM_DT,
                    CRAC_DECOMM_DT,
                    to_char(CRAC_CREATED_DT) as CRAC_CREATED_DT,
                    CRAC_CREATED_BY,
                    to_char(CRAC_UPDATED_DT) as CRAC_UPDATED_DT,
                    CRAC_UPDATED_BY
                    from DC_CRAC t  `+ query2 + `)`+query1+``,
                  [],                 
                );
                var query2p = connection.execute(
                  `select b.crac_status as status_jn,b.crac_maintenance_upd as maintenance_upd_jn,b.crac_updated_by as staff_id, 
                  (select u.dcu_name from dc_users u where u.dcu_id=b.crac_updated_by) staff_name,
                  to_char(b.crac_updated_dt,'dd/mm/yyyy hh:mi am') as date_jn
                  from dc_crac a, dc_crac_jn b
                  where a.crac_id=b.crac_id
                  and b.crac_id='`+ Id+`'`,
                  [] 
                ); 
              
                Promise.join(query1p, query2p).spread(function (result, result2){
                    res.status(200).send( { crac: result.rows, journal: result2.rows });
                  })
                } catch (err) {
                  console.error(err.message);
                 return
                } 
                
            }   
            
