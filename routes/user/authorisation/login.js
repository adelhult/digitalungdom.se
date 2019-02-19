const express = require( 'express' );
const router = express.Router();
const passport = require( 'passport' );
const LocalStrategy = require( 'passport-local' ).Strategy;
const bcrypt = require( 'bcryptjs' );
const validator = require( 'validator' );

const ensureUserAuthenticated = require( './../../../helpers/ensureUserAuthentication' ).ensureUserAuthenticated;
const ensureNotUserAuthenticated = require( './../../../helpers/ensureUserAuthentication' ).ensureNotUserAuthenticated;

const getUserByEmail = require( './../../../models/get' ).getUserByEmail;
const getUserByUsername = require( './../../../models/get' ).getUserByUsername;

router.post( '/login', async function( req, res ) {
  passport.authenticate( 'local', function( err, user, info ) {
    if ( err ) throw err;
    if ( !user ) return res.send( { type: 'fail', reason: info } )
    req.login( user[ '_id' ], function( err ) {
      if ( err ) throw err;
      return res.send( { type: 'success', username: user.username, name: user.name, email: user.email } );
    } );
  } )( req, res )
} );

// Simple passportjs local strategy
passport.use( 'local', new LocalStrategy(
  // Remember the username and password fields have to be named "username" and "password". See passportjs documentation to change default names.
  async function( username, password, done ) {
    // Checks that both inputs are string, so no errors occur.
    if ( typeof username != 'string' || typeof password != 'string' ) {
      return done( null, false, { field: 'username', message: 'incorrect input' } );
    }

    // Finds the user by username/email. If the username looks like a valid email it will find user by email, else it will find by username.
    let user;
    user = validator.isEmail( username ) ? user = await getUserByEmail( db, username ) : await getUserByUsername( db, username );

    if ( !user ) {
      // If it does not find a user will return false and say that it could not find a user
      return done( null, false, { field: 'username', message: 'no account' } );
    } else if ( !user.verified ) {
      // If the user is not verified will return false and say that the user is not verified.
      return done( null, false, { field: 'username', message: 'not verified' } );
    }

    // Compares the candidate password to the users password, if they are "equal" the strategy will return true and the users id, name, username, and email. Else false and an incorrect password message.
    if ( await bcrypt.compare( password, user.password ) ) {
      return done( null, { '_id': user[ '_id' ], name: user.name, username: user.username, email: user.email }, { message: 'Klart.' } );
    } else {
      return done( null, false, { field: 'password', message: 'incorrect password' } );
    }
  }
) );

// yeah, i do not really know what this does, but it is needed for passportjs to work.
passport.serializeUser( function( user, done ) {
  done( null, user );
} );

passport.deserializeUser( function( user, done ) {
  done( null, user );
} );

module.exports = router;