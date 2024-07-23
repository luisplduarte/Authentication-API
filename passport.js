/**
 * Passport and JWT configuration
 */
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const UserModel = require('./models/userModel')

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
}

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, async (payload, done) => {
            try {
                const user = await UserModel.findById(payload.id)
                if (user) return done(null, user)
                return done(null, false)
            } catch (error) {
                return done(error)
            }
        })
    );
}