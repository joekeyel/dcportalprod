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
    const callapi = app.post('/api/DC_NETWORK_BANDWIDTH_CREATE',(req,res)=>{
      
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
                `insert into DC_Bandwidth 
                (
                NTW_SITE_ID,
                NTW_NAME,
                NTW_BANDWIDTH,
                NTW_STATUS,
                NTW_DESC,
                NTW_COMM_DT,
                NTW_DECOMM_DT,
                NTW_CREATED_BY
                )values(
                (select site_id from dc_site where site_name='`+result['SITE_NAME']+`'),
                '`+result['NTW_NAME']+`',
                '`+result['NTW_BANDWIDTH']+`',
                '`+result['NTW_STATUS']+`',
                '`+result['NTW_DESC']+`',
                to_date('`+result['NTW_COMM_DT']+`','DD/MM/YYYY'), 
                to_date('`+result['NTW_DECOMM_DT']+`','DD/MM/YYYY'),
                '`+result['NTW_CREATED_BY']+`'
                )` ,
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