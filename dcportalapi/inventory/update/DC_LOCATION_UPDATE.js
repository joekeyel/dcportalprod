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
 // app.use(bodyParser.text({ type: 'text/html' }))
    const callapi = app.post('/api/DC_LOCATION_UPDATE',(req,res)=>{
      
     // res.send(req.body)
     // res.send(req.body)
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
          console.log('/api/DC_LOCATION_UPDATE');

            var query1p =  connection.execute(
              `UPDATE DC_LOCATION SET 
              LOCN_NAME='`+result['LOCN_NAME']+`',
              LOCN_SITE_ID=(select site_id from dc_site where site_name='`+result['SITE_NAME']+`'),
              LOCN_TYPE='`+result['LOCN_TYPE']+`',
              LOCN_SPACE_CAPACITY=`+result['LOCN_SPACE_CAPACITY']+`,
              LOCN_STATE='`+result['LOCN_STATE']+`',
              LOCN_STATUS='`+result['LOCN_STATUS']+`',
              LOCN_DESC='`+result['LOCN_DESC']+`',
              LOCN_COMM_DT=to_date('`+result['LOCN_COMM_DT']+`','DD/MM/YYYY'),
              LOCN_DECOMM_DT=to_date('`+result['LOCN_DECOMM_DT']+`','DD/MM/YYYY'),
              LOCN_UPDATED_BY='`+result['LOCN_UPDATED_BY']+`',
              LOCN_UPDATED_DT=sysdate
              where 
              locn_id=`+result['LOCN_ID']+`` ,
                [],                 
              ).catch(function(err) {
                console.log(err.message +" error 1 DC_LOCATION_UPDATE");
              //  res.status(200).send({"failed":err.message});
                return 
            })

                var query2p =  connection.execute(
                    `delete from dc_attachment where 
                    ATTH_FOREIGNID='`+result['LOCN_ID']+`' 
                    and ATTH_TABLENAME='DC_LOCATION' 
                    and ATTH_TYPE='FLOOR_PLAN'` ,
                  [],                        
                ).catch(function(err) {
                  console.log(err.message + " error 2 DC_LOCATION_UPDATE");
                //  res.status(200).send({"failed":err.message});
                  return 
              })
                var query3p =  connection.execute(
                    `insert into dc_attachment(ATTH_ID,ATTH_TABLENAME,ATTH_TYPE,ATTH_FOREIGNID,ATTH_FILENAME,ATTH_FILESIZE,ATTH_FILE,ATTH_CREATED_BY,ATTH_CREATED_DT) values (DC_ATTH_ID_SEQ.NEXTVAL,'DC_LOCATION','FLOOR_PLAN',`+result["LOCN_ID"]+`,'`+result["LOCN_FLOORPLAN_FILENAME"]+`',`+result["LOCN_FLOORPLAN_FILESIZE"]+`,'`+result["LOCN_FLOORPLAN_BLOB"]+`','`+result["LOCN_UPDATED_BY"]+`',sysdate)` ,
                  [],                        
                ).catch(function(err) {
                  console.log(err.message + " error 3 DC_LOCATION_UPDATE");
                 // res.status().send({"failed":err.message});
                  return 
              })
                var query4p = connection.execute(
                        `delete from dc_attachment where 
                        ATTH_FOREIGNID='`+result['LOCN_ID']+`' 
                        and ATTH_TABLENAME='DC_LOCATION' 
                        and ATTH_TYPE='RACK_UTILIZATION'`,
                 [],                        
                ).catch(function(err) {
                  console.log(err.message+ " error 4 DC_LOCATION_UPDATE");
                 /// res.status(200).send({"failed":err.message});
                  return 
              })
                var query5p =  connection.execute(
                  `insert into dc_attachment(ATTH_ID,ATTH_TABLENAME,ATTH_TYPE,ATTH_FOREIGNID,ATTH_FILENAME,ATTH_FILESIZE,ATTH_FILE,ATTH_CREATED_BY,ATTH_CREATED_DT) values (DC_ATTH_ID_SEQ.NEXTVAL,'DC_LOCATION','RACK_UTILIZATION',`+result["LOCN_ID"]+`,'`+result["LOCN_RACK_UTIL_FILENAME"]+`',`+result["LOCN_RACK_UTIL_FILESIZE"]+`,'`+result["LOCN_RACK_UTIL_BLOB"]+`','`+result["LOCN_UPDATED_BY"]+`',sysdate)` ,
                  [],                        
                ).catch(function(err) {
                  console.log(err.message + " error 5 DC_LOCATION_UPDATE");
                  //res.status(200).send({"failed":err.message});
                  return 
              })

                Promise.join(query1p,query2p,query3p,query4p,query5p).spread(function (){     
                    res.status(200).send("success");
                    console.log("success  "+req.body)
                    return 
                    })
                  } catch (err) {
                    console.error(err.message + "===>error all query DC_LOCATION_UPDATE");
                   // res.status(200).send({"failed":err.message});
                    return 
                  } 
                  
              }