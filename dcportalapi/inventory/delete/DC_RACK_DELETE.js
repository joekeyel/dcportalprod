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
    const callapi = app.post('/api/DC_RACK_DELETE',(req,res)=>{

      
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

                `delete from dc_rack
                where rack_id='`+result['RACK_ID']+`'` ,
                [],  
               
                );

                Promise.join(query1p).spread(function (result){           
                  res.status(200).send("success");
                  console.log(req.body)
                  })
                } catch (err) {
                  console.error(err.message);
                 return
                } 
                
            }               
