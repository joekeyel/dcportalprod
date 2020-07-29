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
    const callapi = app.post('/api/DC_SITE_CREATE',(req,res)=>{
      
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
          console.log('connected DC_SITE_CREATE');

            var query1p =  connection.execute(

                `declare
                err_msg varchar2(1000);
                begin
                  dc_hosting.site_insert(s_name => '`+result['SITE_NAME']+`',
                                         a_no => '`+result['ADDE_NO']+`',
                                         a_floor => '`+result['ADDE_FLOOR']+`',
                                         a_building => '`+result['ADDE_BUILDING']+`',
                                         a_sttype => '`+result['ADDE_STTYPE']+`',
                                         a_stname => '`+result['ADDE_STNAME']+`',
                                         a_postcode => '`+result['ADDE_POSTCODE']+`',
                                         a_section => '`+result['ADDE_SECTION']+`',
                                         a_city => '`+result['ADDE_CITY']+`',
                                         a_state => '`+result['ADDE_STATE']+`',
                                         s_desc => '`+result['SITE_DESC']+`',
                                         s_mgr => '`+result['SITE_MGR']+`',
                                         s_mgr_no => '`+result['SITE_MGR_NO']+`',
                                         s_status => '`+result['SITE_STATUS']+`',
                                         s_total_space_cap => '`+result['SITE_TOTAL_SPACE_CAP']+`',
                                         s_total_power_cap => '`+result['SITE_TOTAL_POWER_CAP']+`',
                                         s_verified_by => '`+result['SITE_VERIFIED_BY']+`',
                                         s_created_by => '`+result['SITE_CREATED_BY']+`',
                                         s_comm_dt => to_date('`+result['SITE_COMM_DT']+`','DD/MM/YYYY'),
                                         s_decomm_dt => to_date('`+result['SITE_DECOMM_DT']+`','DD/MM/YYYY'),
                             s_workgroup => '`+result['SITE_WORKGROUP']+`',
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
                  res.status(200).send("failed");
                 return
                } 
                
            }