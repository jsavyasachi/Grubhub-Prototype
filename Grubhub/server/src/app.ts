import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from 'cors';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import userRoutes from '../routes/user.js';
import restaurantRoutes from '../routes/restaurant.js';
import dishRoutes from '../routes/dish.js'
import orderRoutes from '../routes/order.js'

const app = express();

//load configurations for passport
import '../config/passport.js';

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Grubhub Prototype API',
            version: '1.0.0',
            description: 'API documentation for the modernized Grubhub Prototype',
        },
        servers: [
            {
                url: 'http://localhost:3001',
            },
        ],
    },
    apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

app.use('/', userRoutes);
app.use('/', restaurantRoutes);
app.use('/', dishRoutes)
app.use('/', orderRoutes)

app.listen(3001);
console.log("Grubhub Server listening on port 3001");
console.log("Swagger docs available at http://localhost:3001/api-docs");

export default app;
