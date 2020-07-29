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
    const callapi = app.post('/api/DC_CRAC_CREATE',(req,res)=>{
      
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
          console.log('DC_CRAC_CREATE');

            var query1p =  connection.execute(
                `declare
                err_msg varchar2(1000);
                begin
                  dc_hosting.crac_insert(c_name => '`+result['CRAC_NAME']+`',
                                         c_site_name => '`+result['SITE_NAME']+`',
                                         c_locn_name => '`+result['LOCN_NAME']+`',
                                         c_area => '`+result['CRAC_AREA']+`',
                                         c_kw => `+result['CRAC_KW']+`,
                                         c_quantity => `+result['CRAC_QUANTITY']+`,
                                         c_cool_capacity => `+result['CRAC_COOL_CAPACITY']+`,
                                         c_brand => '`+result['CRAC_BRAND']+`',
                                         c_type => '`+result['CRAC_TYPE']+`',
                                         c_status => '`+result['CRAC_STATUS']+`',
                                         c_desc => '`+result['CRAC_DESC']+`',
                                         commissioned_date => to_date('`+result['CRAC_COMM_DT']+`','DD/MM/YYYY'),
                                         decommissioned_date => to_date('`+result['CRAC_DECOMM_DT']+`','DD/MM/YYYY'),
                                         c_created_by => '`+result['CRAC_CREATED_BY']+`',
                                         err_message => err_msg);
                end;` ,
                [],                 
              );
                Promise.join(query1p).spread(function (){           
                  res.status(200).send("success");
                  console.log(req.body)
                  })
                } catch (err) {
                  console.error(err.message+ "===> DC_CRAC_CREATE");
                  //res.status(200).send({"failed":err.message});
                 return
                } 
                
            }