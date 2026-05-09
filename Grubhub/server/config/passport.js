import bcrypt from 'bcrypt';
import jwtSecret from './jwtConfig.js';
import {
    Users
} from '../src/sequelize.js';

import passport from 'passport';
import { Strategy as localStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt as ExtractJWT } from 'passport-jwt';

const SALT_ROUND = 12;

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use("register", new localStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    (username, password, done) => {
        try {
            Users.findOne({
                where: {
                    email: username
                }
            }).then(user => {
                if (user !== null) {
                    return done(null, false);
                } else {
                    bcrypt.hash(password, SALT_ROUND).then(hashPassword => {
                        Users.create({
                            email: username,
                            password: hashPassword
                        }).then(user => {
                            return done(null, true);
                        });
                    });
                }
            });
        } catch (err) {
            done(err);
        }
    }
));

passport.use("login", new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
}, (username, password, done) => {
    try {
        Users.findOne({
            where: {
                email: username
            }
        }).then(user => {
            if (!user) {
                return done(null, false)
            } else {
                bcrypt.compare(password, user.password).then(result => {
                    if (!result) {
                        console.log("Password does not match");
                        return done(null, false);
                    }
                    return done(null, true);
                })
            }
        })
    } catch (err) {
        done(err);
    }
}));

const options = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: jwtSecret.secret
};

passport.use('jwt', new JWTStrategy(options, (jwt_payload, done) => {
    try {
        Users.findOne({
            where: {
                id: jwt_payload.id
            }
        }).then(user => {
            if (user) {
                done(null, true);
            } else {
                done(null, false);
            }
        });
    } catch (err) {
        done(err);
    }
}));