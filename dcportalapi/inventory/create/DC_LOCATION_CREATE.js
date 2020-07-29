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
    const callapi = app.post('/api/DC_LOCATION_CREATE',(req,res)=>{     
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
          console.log('connected DC_LOCATION_CREATE');

          var query1p =  connection.execute(
                ` INSERT INTO DC_LOCATION(LOCN_ID,LOCN_NAME,LOCN_SITE_ID,LOCN_TYPE,LOCN_SPACE_CAPACITY,LOCN_STATE,LOCN_STATUS,LOCN_DESC,
                    LOCN_COMM_DT,LOCN_DECOMM_DT,LOCN_CREATED_BY)
                    VALUES
                    (
                    DC_LOCN_ID_SEQ.nextval,
                    '`+result['LOCN_NAME']+`',
                    (select site_id from dc_site where site_name='`+result['SITE_NAME']+`'),
                    '`+result['LOCN_TYPE']+`',
                    `+result['LOCN_SPACE_CAPACITY']+`,
                    '`+result['LOCN_STATE']+`',
                    '`+result['LOCN_STATUS']+`',
                    '`+result['LOCN_DESC']+`',
                    to_date('`+result['LOCN_COMM_DT']+`','DD/MM/YYYY'), 
                    to_date('`+result['LOCN_DECOMM_DT']+`','DD/MM/YYYY'), 
                    '`+result['LOCN_CREATED_BY']+`')` ,
                [],                 
              );
                  Promise.join(query1p).spread(function (){           
                    res.status(200).send("success");
                    console.log(req.body)
                    })
                  } catch (err) {
                    console.error(err.message);
                    //res.status(200).send("failed");
                   return
                  }                  
              }