module.exports = (function() {
	var css = require( 'css' ), // Load css module

		classTest = /\.([\w-]+)/g,
		// All avaliable characters used in the short classes.
		chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	
	function Smallector( str, options ) {
		var opt;
		
		// Handle `new Smallector( options )`
		if ( Object.prototype.toString.apply( str ) === '[object Object]' ) {
			options = str;
			str = false;
		}
		// Set all the options.
		this.options = {
			split: false,
			compress: true
		};
		for ( opt in options ) {
			this.options[ opt ] = options[ opt ];
		}
		this.reset();
		
		if ( str !== false ) {
			// Parse the string (if we have one).
			this.parse( str );
		}
	}
	
	Smallector.prototype = {
		options: null,
		map: null,
		charPosSet: null,
		
		// Ware the compiled css goes.
		compiled: null,
		
		reset: function() {
			/**
			 * Resets the parser to the starting state.
			 */
			this.map = {};
			this.charPosSet = [ 0 ];
			this.compiled = null;
		},
		
		parse: function( str ) {
			var ast  = css.parse( str ),
				self = this,
				counts = {},
				sortedCounts = [];
			
			// Walk pass 1 collecting all the segments.
			this.walk(ast.stylesheet, function ( rule ) {
				rule.selectors.forEach(function ( selector ) {
					var match;
					while ( (match = classTest.exec(selector)) != null ) {
						self.getClassSegments( match[ 1 ] ).forEach(function( segment ) {
							counts[ segment ] = counts[ segment ] + 1 || 1;
						});
						selector = selector.slice( match.index + match[ 0 ].length );
					}
				});
			});
			
			Object.keys( counts ).forEach(function( segment ) {
				sortedCounts.push({ name: segment, count: counts[ segment ] });
			});
			
			sortedCounts.sort(function( a, b ) {
				return b.count - a.count
			}).forEach(function( segment ) {
				self.getClassName( segment.name );
			});
			
			// Walk pass 2 assigning the compiled class names.
			this.walk(ast.stylesheet, function( rule ) {
				rule.selectors = rule.selectors.map(function( selector ) {
					return self.getClassSelector( selector );
				});
			});
			
			this.compiled = css.stringify( ast, this.options );
		},
		
		generateSegment: function() {
			var s = '',
				i = this.charPosSet.length,
				propogate = true;
			
			while ( i-- ) {
				// Use `s = chars[ this.charPosSet[i] ] + s` to build the name left to right.
				s += chars[ this.charPosSet[i] ];
				
				if ( propogate ) {
					this.charPosSet[ i ]++;
					if ( this.charPosSet[ i ] === chars.length ) {
						this.charPosSet[ i ] = 0;
						if ( i === 0 )
							this.charPosSet.push( 0 );
					} else {
						propogate = false;
					}
				}
			}
			return s;
		},
		
		getClassSegments: function( cls ) {
			if ( this.options.split ) {
				return cls.split( '-' );
			} else {
				return [ cls ];
			}
		},
		
		getClassSelector: function( selector ) {
			var self = this;
			return selector.replace( classTest, function( match, cls ) {
				return '.' + self.getClassName( cls );
			});
		},
		
		getClassName: function( cls ) {
			var self = this;
			return this.getClassSegments( cls ).map(function( segment ) {
				if ( !self.map[segment] ) {
					self.map[ segment ] = self.generateSegment();
				}
				return self.map[ segment ];
			}).join( '-' );
		},
		
		walk: function ( rule, callback ) {
			var i;
			if ( rule.type === 'rule' ) {
				callback.apply( this, [ rule ] );
			} else if ( rule.rules !== undefined ) {
				i = rule.rules.length;
				while ( i-- ) {
					this.walk( rule.rules[i], callback )
				}
			}
		}
	}
	
	return Smallector;
})();