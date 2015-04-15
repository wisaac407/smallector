var fs         = require( 'fs' ),
    Smallector = require( '..' ),
    should     = require( 'should' );

describe('Smallector', function() {
	it('Should compile split classes.', function() {
		var s = new Smallector( '.red-text {color: red} .green-text {color: green}', {
			compress: true,
			split: true
		});
		s.compiled.should.equal( '.c-a{color:red;}.b-a{color:green;}' );
	});
	it('Should compile non-split classes', function() {
		var s = new Smallector( '.red-text {color: red} .green-text {color: green}', {
			compress: true,
			split: false
		});
		s.compiled.should.equal( '.b{color:red;}.a{color:green;}' );
	});
	it('Should properly compile all stylesheets', function() {
		var stylesheets = __dirname + '/stylesheets/';
		fs.readdirSync( stylesheets ).forEach(function( file ) {
			var content, expected, s, options, match;
			
			if ( file.match( /^.+\.css$/ ) ) {
				content = fs.readFileSync( stylesheets + file, 'utf8' );
				expected = fs.readFileSync( stylesheets + file + '.expected', 'utf8' );
				
				// Default options
				options = {
					split: false,
					compress: false
				};
				
				match = /\/\*(?:.|\n)+commands:([^\n]+)/.exec( content );
				if ( match ) {
					match[ 1 ].split( ',' ).forEach(function( option ) {
						var value;
						option = option.split( '=' );
						options[ option[0].trim() ] = 
							(option[1] && option[1].trim() === 'false'? false : true);
					});
				}
				s = new Smallector( content, options );
				s.compiled.should.equal( expected );
			}
		});
	});
});