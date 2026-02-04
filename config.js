const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const configPath = path.join(app.getPath('userData'), 'config.json');

function getConfig() {
    if (!fs.existsSync(configPath)) {
        // Return default config if file doesn't exist
        return {
            user: '',
            password: '',
            server: '',
            database: '',
            options: {
                encrypt: false,
                trustServerCertificate: true
            },
            pdfSavePath:''
        };
    }
    const rawData = fs.readFileSync(configPath);
    return JSON.parse(rawData);
}

function saveConfig(config) {
    console.log('data per save ne config',config)
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
}

module.exports = { getConfig, saveConfig };
