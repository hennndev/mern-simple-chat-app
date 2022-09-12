const moment = require('moment')

module.exports = (message) => {
    return {
        sendAt: moment().format('LT'),
        ...message
    }
}