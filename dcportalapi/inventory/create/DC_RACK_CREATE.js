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
    const callapi = app.post('/api/DC_RACK_CREATE',(req,res)=>{
      
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

                `insert into DC_RACK 
                (
                RACK_SITE_ID,
                RACK_LOCN_ID,
                RACK_NO,
                RACK_STATUS,
                RACK_ROOM,
                RACK_TYPE,
                RACK_SIZE,
                RACK_POWER_DENSITY,
                RACK_BREAKER_TYPE,
                RACK_POWER_PHASE,
                RACK_CABLE_ID,
                RACK_PDU_A,
                RACK_PDU_B,
                RACK_SOURCE_A,
                RACK_SOURCE_B,
                RACK_POWER_PRELAID,
                RACK_CABLING_PRELAID,
                RACK_DESC,
                RACK_COMM_DT,
                RACK_DECOMM_DT,
                RACK_CREATED_BY
                )
                values (
                (select site_id from dc_site where site_name='`+result['SITE_NAME']+`'),
                (select locn_id from dc_location where locn_name='`+result['LOCN_NAME']+`' and locn_site_id in (select site_id from dc_site where site_name='`+result['SITE_NAME']+`')),
                `+result['RACK_NO']+`,
                '`+result['RACK_STATUS']+`',
                '`+result['RACK_ROOM']+`',
                '`+result['RACK_TYPE']+`',
                '`+result['RACK_SIZE']+`',
                '`+result['RACK_POWER_DENSITY']+`',
                '`+result['RACK_BREAKER_TYPE']+`',
                '`+result['RACK_POWER_PHASE']+`',
                '`+result['RACK_CABLE_ID']+`',
                '`+result['RACK_PDU_A']+`',
                '`+result['RACK_PDU_B']+`',
                '`+result['RACK_SOURCE_A']+`',
                '`+result['RACK_SOURCE_B']+`',
                '`+result['RACK_POWER_PRELAID']+`',
                '`+result['RACK_CABLING_PRELAID']+`',
                '`+result['RACK_DESC']+`',
                to_date('`+result['RACK_COMM_DT']+`','DD/MM/YYYY'), 
                to_date('`+result['RACK_DECOMM_DT']+`','DD/MM/YYYY'),
                '`+result['RACK_INSERT_BY']+`')` ,
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