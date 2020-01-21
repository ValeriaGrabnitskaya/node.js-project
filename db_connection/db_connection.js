function newConnectionFactory(pool, res) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                if (res) {
                    res.status(500);
                    res.send("");
                }
                console.error(err);
            }
            else {
                resolve(connection);
            }
        });
    })
}

function selectQueryFactory(connection, queryText, queryValues) {
    return new Promise((resolve, reject) => {
        connection.query(queryText, queryValues, function (err, rows, fields) {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        });
    })
}

module.exports={
    newConnectionFactory,
    selectQueryFactory
}