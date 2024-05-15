// "../../functions/generate.js"
module.exports = (client) => {
    function generateRandomCode(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = "";
    
        for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
        }
    
        return result;
    }
    
    function convertToMilliseconds(timeString) {
        const units = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
        M: 30 * 24 * 60 * 60 * 1000,
        y: 365 * 24 * 60 * 60 * 1000
        };
    
        const match = timeString.match(/(\d+)[smhdMy] ?/g);
    
        if (!match) {
        throw new Error('Invalid time string format: ' + timeString);
        }
        
        return match.map(t => {
        const str = t.trim();
        const value = parseInt(str.slice(0, str.length - 1), 10);
        const unit = str[str.length - 1];
        return value * units[unit];
        }).reduce((a, b) => a + b);
    }
    
    function convertUnix(unixTimestamp) {
        const milliseconds = unixTimestamp * 1000; // Convert seconds to milliseconds
        return milliseconds;
    }
    
    module.exports = { generateRandomCode, convertToMilliseconds, convertUnix };
}
 