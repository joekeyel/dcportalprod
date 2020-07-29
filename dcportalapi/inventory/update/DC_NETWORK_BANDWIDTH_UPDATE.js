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
    const callapi = app.post('/api/DC_NETWORK_BANDWIDTH_UPDATE',(req,res)=>{
     
      result1 = JSON.parse(req.body)
      result = result1.data
      console.log(result)
     
     makeConnection(res)           
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
                `update DC_Bandwidth set
                NTW_SITE_ID=(select site_id from dc_site where site_name='`+result['SITE_NAME']+`'),
                NTW_NAME='`+result['NTW_NAME']+`',
                NTW_BANDWIDTH='`+result['NTW_BANDWIDTH']+`',
                NTW_STATUS='`+result['NTW_STATUS']+`',
                NTW_DESC='`+result['NTW_DESC']+`',
                NTW_COMM_DT=to_date('`+result['NTW_COMM_DT']+`','DD/MM/YYYY'), 
                NTW_DECOMM_DT=to_date('`+result['NTW_DECOMM_DT']+`','DD/MM/YYYY'),
                NTW_UPDATED_BY='`+result['NTW_UPDATED_BY']+`'
                WHERE NTW_ID='`+result['NTW_ID']+`'` ,
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