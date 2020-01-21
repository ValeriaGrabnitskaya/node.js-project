const fs = require('fs');
const os = require('os');

function addLog(filePath, text) {
    return new Promise((resolve, reject) => {
        const lodDateTime = new Date();
        let time = lodDateTime.toLocaleDateString() + " " + lodDateTime.toLocaleTimeString();
        let fullLog = time + " " + text;

        console.log(fullLog); // выводим сообщение в консоль

        fs.open(filePath, 'a+', (err, logFd) => {
            if (err)
                reject(err);
            else
                fs.write(logFd, fullLog + os.EOL, (err) => {
                    if (err)
                        reject(err);
                    else
                        fs.close(logFd, (err) => {
                            if (err)
                                reject(err);
                            else
                                resolve();
                        });
                });

        });
    })
}

module.exports={
    addLog
}