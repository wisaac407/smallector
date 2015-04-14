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
		fs.readdirSync('stylesheets').forEach(function( file ) {
			var content, expected, s, options, match;
			
			if ( file.match( /^.+\.css$/ ) ) {
				content = fs.readFileSync( 'stylesheets/' + file, 'utf8' );
				expected = fs.readFileSync( 'stylesheets/' + file + '.expected', 'utf8' );
				
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

//describe('Sorting Algorithim', function() {
//	function createList( len ) {
//		var list = new Array( len );
//		while ( len-- ) {
//			list[ len ] = Math.round(Math.random() * 100);
//		}
//		return list;
//	}
//	function sort( list, compare ) {
//		var last,
//			len = list.length
//			j = len, i = 0;
//		
//		compare = compare || function ( a, b ) { return a - b };
//		
//		for ( ; j--; ) {
//			for ( i = len; i--; ) {
//				if ( compare(list[j], list[i]) > 0 ) {
//					last = list[ i ];
//					list[ i ] = list[ j ];
//					list[ j ] = last;
//				}
//			}
//		}
//		return list;
//	}
//	
//	function isSorted( list, compare ) {
//		var i = list.length, last;
//		
//		compare = compare || function ( a, b ) { return a - b };
//		
//		while ( i-- ) {
//			if ( compare( list[ i ], last ) > 0 ) {
//				console.log( list );
//				return false;
//			}
//			last = list[ i ];
//		}
//		return true;
//	}
//	function compare(a, b) {
//		return a - b;
//	}
//	
//	it('Should be faster then built in sort function.', function( done ) {
//		done();
//		var list, sorted, i = 1000000, size = 100, j = i, t1 = Date.now(), t2;
//		while ( i-- ) {
//			list = sort( createList( size ), compare );
//			// Now assert the list actuall is sorted.
//			assert.ok( isSorted( list ) );
//		}
//		t1 = Date.now() - t1;
//		t2 = Date.now();
//		while ( j-- ) {
//			list = createList( size ).sort( compare );
//			assert.ok( isSorted( list ) );
//		}
//		t2 = Date.now() - t2;
//		
//		console.log( t2/t1 );
//		
//		t1.should.be.below( t2 );
//	});
//});