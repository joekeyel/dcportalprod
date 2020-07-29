const oracledb = require('oracledb');
const Promise = require("bluebird");
const bodyParser = require('body-parser')

var password = process.env.oraclePwd 
module.exports = function (app) {
   
  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.text({ type: 'application/json' }))
    const callapi = app.post('/api/DC_PDU_UPDATE',(req,res)=>{
    
      result1 = JSON.parse(req.body)
      result = result1.data
      console.log(result)
     
     makeConnection(res,req)           
    })   
}  
      async function makeConnection(res,req) {
        try {
          connection = await oracledb.getConnection({
              user: process.env.oracleUser,
              password: password,
              connectString: process.env.localhost
              //connectString: process.env.localhost
          });
          console.log('connected to database');

          var query1p =  connection.execute(
                `declare
                err_msg varchar2(1000);
                begin
                  dc_hosting.pdu_update(p_id => '`+result['PDU_ID']+`',
                                        p_name => '`+result['PDU_NAME']+`',
                                        p_site_name => '`+result['SITE_NAME']+`',
                                        p_locn_name => '`+result['LOCN_NAME']+`',
                                        p_code => '`+result['PDU_CODE']+`',
                                        p_fuse => '`+result['PDU_FUSE']+`',
                                        p_user_rack => '`+result['PDU_USER_RACK']+`',
                                        p_status => '`+result['PDU_STATUS']+`',
                                        p_desc => '`+result['PDU_DESC']+`',
                                        commissioned_Date => to_date('`+result['PDU_COMM_DT']+`','DD/MM/YYYY'), 
                                        decommissioned_Date => to_date('`+result['PDU_DECOMM_DT']+`','DD/MM/YYYY'),
                                        maintenance_upd => '`+result['PDU_MAINTENANCE_UPD']+`',
                                        p_updated_by => '`+result['PDU_UPDATED_BY']+`',
                                        err_message => err_msg);
                end;` ,
                [],                 
              );

                Promise.join(query1p).spread(function (){           
                  res.status(200).send("success");
                  console.log(req.body)
                  })
                } catch (err) {
                  console.error(err.message);
                 return
                } 
                
            }