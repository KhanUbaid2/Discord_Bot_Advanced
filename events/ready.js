const mongoose = require('mongoose');
const mongodbURL = process.env.MONGODB_URI;

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log('Ready!');

        if (!mongodbURL) return;
        mongoose.connect(process.env.MONGODB_URI || client.config.connectionString);

        mongoose.set("strictQuery", false);
        await mongoose.connect(mongodbURL || ``, {
            keepAlive: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        if (mongoose.connect) {
            console.log('Database is up and running!')
        }

        module.exports = {
            name: 'ready',
            once: true,
            async execute(client) {
                console.log('Ready!');
        
                async function pickPresence () {
                    const option = Math.floor(Math.random() * statusArray.length);
        
                    try {
                        await client.user.setPresence({
                            activities: [
                                {
                                    name: statusArray[option].content,
                                    type: statusArray[option].type,
        
                                },
                            
                            ],
        
                            status: statusArray[option].status
                        })
                    } catch (error) {
                        console.error(error);
                    }
                }
            },
        };
    }
};