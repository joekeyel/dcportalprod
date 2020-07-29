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
    const callapi = app.post('/api/DC_UPS_CREATE',(req,res)=>{
      
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
                  dc_hosting.ups_insert(u_name => '`+result['UPS_NAME']+`',
                                        ups_site_name => '`+result['SITE_NAME']+`',
                                        ups_locn_name => '`+result['LOCN_NAME']+`',
                                        power_capacity => '`+result['UPS_POWER_CAPACITY']+`',
                                        brand => '`+result['UPS_BRAND']+`',
                                        model => '`+result['UPS_MODEL']+`',
                                        status => '`+result['UPS_STATUS']+`',
                                        description => '`+result['UPS_DESC']+`',
                                        commissioned_Date => to_date('`+result['UPS_COMM_DT']+`','DD/MM/YYYY'), 
                                        decommissioned_Date => to_date('`+result['UPS_DECOMM_DT']+`','DD/MM/YYYY'),
                                        created_by => '`+result['UPS_CREATED_BY']+`',
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