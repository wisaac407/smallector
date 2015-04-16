# Smallector [![Build Status](https://travis-ci.org/wisaac407/Smallector.svg?branch=master)](https://travis-ci.org/wisaac407/Smallector)

Smallector is a [Nodejs](http://nodejs.org) module designed to shorten css class names. This is useful for shrinking
css files and reducing the overall size of your site.

## Usage
Smallector provides the `Smallector` class which can be used as fallows:

    var Smallector = require( 'Smallector', { compress: true } ),
        s = new Smallector( '.red-text { color: red; }' );
    console.log( s.compiled ); // Will output `.a{color:red;}`

There are two ways to shorten classes:
  1. Compleate replacment.
  2. Segment replacment.

The example above uses compleate replacement, let's have a look at segment replacment:

    var Smallector = require( 'Smallector' ),
          s = new Smallector( '.red-text { color: red; }', { compress: true, split: true} );
      console.log( s.compiled ); // Will output `.a-b{color:red;}`
    
As you can see segment replacment splits the classes at the hyphen and replaces each segment seperatly.
This is usefull for very large projects which have a lot of repeated segments.
But for most projects it is best to leave this off.
