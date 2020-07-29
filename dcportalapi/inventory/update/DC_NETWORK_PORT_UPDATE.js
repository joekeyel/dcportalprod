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
    const callapi = app.post('/api/DC_NETWORK_PORT_UPDATE',(req,res)=>{
    
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
                `update DC_Network_Port set
                PORT_NTW_ID=(select ntw_id from dc_bandwidth where ntw_name='`+result['NTW_NAME']+`'),
                PORT_NO='`+result['PORT_NO']+`',
                PORT_SITE_ID=(select site_id from dc_site where site_name='`+result['SITE_NAME']+`'),
                PORT_NTW_TYPE='`+result['PORT_NTW_TYPE']+`',
                PORT_CAB_PRELAID='`+result['PORT_CAB_PRELAID']+`',
                PORT_STATUS='`+result['PORT_STATUS']+`',
                PORT_DESC='`+result['PORT_DESC']+`',
                PORT_SWITCH_NAME='`+result['PORT_SWITCH_NAME']+`',
                PORT_COMM_DT=to_date('`+result['PORT_COMM_DT']+`','DD/MM/YYYY'), 
                PORT_DECOMM_DT=to_date('`+result['PORT_DECOMM_DT']+`','DD/MM/YYYY'),
                PORT_UPDATED_BY='`+result['PORT_UPDATED_BY']+`'
                WHERE PORT_ID='`+result['NTW_ID']+`'` ,
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