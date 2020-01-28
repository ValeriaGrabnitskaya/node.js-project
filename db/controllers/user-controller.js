const User = require("../models/users");

exports.getUserByLoginPassword = function (login, password) {
    return new Promise((resolve, reject) => {
        console.log("получение пользователя по логину и паролю");
        User.findOne({ where: { login: login, password: password }, raw: true }).then(user => {
            resolve(user);
        }).catch(err => reject(err));
    })
};
