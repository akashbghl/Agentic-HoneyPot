import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import messageRoute from './routes/messageRoute.js';
const app = express();

app.use(express.json());
app.use('/api', messageRoute);


app.get('/', (req, res) => {
    res.send('Server is running');
});
const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})