const oracledb = require('oracledb');
const Promise = require("bluebird");

var password = process.env.oraclePwd 
module.exports = function (app) {

  const callapi = app.get('/api/DC_INBOX_LIST',(req,res,next)=>{

    userId = req.query.userid
    
      if (userId != null) {
        query1=" where userid='"+userId+"'";
        }else{
          query1="";
        };

        makeConnection(query1,res)           
      })     
  }
        async function makeConnection(query1,res) {
        try {
          connection = await oracledb.getConnection({
              user: process.env.oracleUser,
              password: password,
              connectString: process.env.localhost
              //connectString: process.env.localhost
          });
          console.log('DC_INBOX_LIST');

          var query1p =  connection.execute(
                `select * from dc_inboxlist `+ query1,
                [],                 
                );            

                Promise.join(query1p).spread(function (result){
                  res.status(200).send(result.rows);
                })
              } catch (err) {
                console.error(err.message +" error DC_INBOX_LIST" );
               return
              } 
              
          }
            
