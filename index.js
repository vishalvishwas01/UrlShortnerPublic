const express = require('express')
const {connectToMongoDB} = require('./connect')
const dotenv = require('dotenv')
const cors = require('cors');
const UAParser = require("ua-parser-js");
const urlRoute = require('./routes/url')
const URL = require('./models/url')
const app = express();
const PORT = 8001;

dotenv.config();

connectToMongoDB(process.env.MONGO_URL)
.then(()=>console.log("mongodb connected"));


app.use(cors());
app.use(express.json());

app.use('/url', urlRoute);

app.get('/:shortId', async(req, res)=>{
    const shortId = req.params.shortId;
    const ip = req.headers['x-forwarded-for'];
    
    const parser = new UAParser(req.headers['user-agent']);
    const result = parser.getResult();

    const device = result.device.type || "desktop"; 
    const os = result.os.name || "unknown";
    const browser = result.browser.name || "unknown";

     const entry = await URL.findOneAndUpdate({
        shortId
    }, {$push:{
        visitHistory: {
            timestamp: Date.now(),
            ipAddress: ip,
            userAgent: req.headers['user-agent'],
            device: `${device} (${os}) - ${browser}`,
        },
    }, 
    },
    { new: true }
);
res.redirect(entry.redirectURL)
})


app.listen(PORT, ()=>console.log(`server started http://localhost:${PORT}`))