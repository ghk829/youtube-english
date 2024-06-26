const  jwtDecode = require("jwt-decode");

module.exports = {
 getUserInfo:(res, req) => {

},
insertUser:(res, req) => {
    
},

decodeToken:(res, req) => {
    let userObj = jwtDecode(req.credential);
    res.json({user: userOb})
}
}