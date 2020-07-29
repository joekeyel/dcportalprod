const oracledb = require('oracledb');
const Promise = require("bluebird");

var password = process.env.oraclePwd 
module.exports = function (app) {

    const callapi = app.get('/api/DC_USER',(req,res,next)=>{

      userId = req.query.userid
      
    
      if (userId != null) {
        query1=" where id='"+userId+"'";
        }else{
          query1="";
        };
        
        if (userId != null) {
        query2=" and rl_dcu_id='"+userId+"'";
        }else{
          query2="";
        };
        
        if (userId != null) {
        query3=" and ur_dcu_id= '"+userId+"'";
        }else{
          query3="";
        };
          
        if (userId != null) {
        query4=" and uw_dcu_id= '"+userId+"'";
        }else{
          query4="";
        };
           
         makeConnection(query1,query2,query3,query4,res)       
        
            })
           
          
        
        }


        async function makeConnection(query1,query2,query3,query4,res) {

          
          try {
            connection = await oracledb.getConnection({
                user: process.env.oracleUser,
                password: password,
                connectString: process.env.localhost
                //connectString: process.env.localhost
            });
            console.log('/DC_USER');
  
            var query1p =   connection.execute(  
              `select * from DC_USER_VIEW `+query1+``,
              [],           
              ).catch(function(err) {
                console.log(err.message +" error 1 DC USER");
              //  res.status(200).send({"failed":err.message});
                return
            })
  
              var query2p =   connection.execute(
              `SELECT b.ro_name as roles FROM DC_USER_ROLE A, DC_ROLES B
              where a.rl_ro_id=b.ro_id `+ query2,
              []).catch(function(err) {
                console.log(err.message +" error 2 DC USER");
              //  res.status(200).send({"failed":err.message});
                return
            })
  
              var query3p =   connection.execute(
                `SELECT  r.ur_dcu_id,c.rt_name as rights FROM DC_USER_rights r, dc_rights c
                where r.ur_rt_id=c.rt_id `+ query3,
                []).catch(function(err) {
                  console.log(err.message +" error 3 DC USER");
                //  res.status(200).send({"failed":err.message});
                  return
              }) 
  
                var query4p =  connection.execute(
                  `SELECT  C.WG_NAME as workgroups FROM DC_USER_workgroup r, dc_workgroup c
                  where r.uw_wg_id=c.wg_id `+ query4,
                  []).catch(function(err) {
                    console.log(err.message +" error 4 DC USER");
                  //  res.status(200).send({"failed":err.message});
                    return
                })
  
              Promise.join(query1p, query2p, query3p, query4p).spread(function (result, result2, result3, result4){
  
                var rolesarray = [];
                var rightsarray = [];
                var workgrouparray = [];
                  
                result2.rows.forEach(element => {
                  rolesarray.push(element.ROLES)
                });
  
                result3.rows.forEach(element => {
                  rightsarray.push(element.RIGHTS)
                });
  
                result4.rows.forEach(element => {
                  workgrouparray.push(element.WORKGROUPS)
                });
    
                res.status(200).send( { user: result.rows, roles: rolesarray , rights: rightsarray, workgroups: workgrouparray});                               
              })
              
          } catch (err) {
            console.error(err.message + " error all DC USER");
           return
          } 
          
          }