const settingsOptions = require("../common/settingsOptions")

const fetchSettingsOptions = (role) => {
    return settingsOptions.map(option => {
        if(option.permission.includes(role)) {
            return {
                name: option.name,
                code: option.code
            }
        }
    }).filter(e => e)
}

module.exports = fetchSettingsOptions