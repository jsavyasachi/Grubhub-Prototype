import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from 'cors';
import passport from 'passport';
import userRoutes from '../routes/user.js';
import restaurantRoutes from '../routes/restaurant.js';
import dishRoutes from '../routes/dish.js'
import orderRoutes from '../routes/order.js'

const app = express();

//load configurations for passport
import '../config/passport.js';

app.use(passport.initialize());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(cors());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.setHeader('Access-Control-Allow-Credentials', 'true');
//     res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
//     res.setHeader('Cache-Control', 'no-cache');
//     next();
// });

app.use('/', userRoutes);
app.use('/', restaurantRoutes);
app.use('/', dishRoutes)
app.use('/', orderRoutes)

app.listen(3001);
console.log("Grubhub Server listening on port 3001");
export default app;