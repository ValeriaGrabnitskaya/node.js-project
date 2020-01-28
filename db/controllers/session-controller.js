const Session = require("../models/session");

exports.setSession = function (session) {
    return new Promise((resolve, reject) => {
        console.log("добавление сесси");
        Session.create(session).then(()=>{
            resolve();
          }).catch(err=>reject(err));
    })
};
