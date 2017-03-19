/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module

define( [
	"./var/arr",
	"./var/document",
	"./var/getProto",
	"./var/slice",
	"./var/concat",
	"./var/push",
	"./var/indexOf",
	"./var/class2type",
	"./var/toString",
	"./var/hasOwn",
	"./var/fnToString",
	"./var/ObjectFunctionString",
	"./var/support",
	"./core/DOMEval"
], function( arr, document, getProto, slice, concat, push, indexOf,
	class2type, toString, hasOwn, fnToString, ObjectFunctionString,
	support, DOMEval ) {

"use strict";

var
	version = "3.1.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );//每一个jQuery对象都是 jQuery.fn.init函数的实例, jQuery.__proto__===jQuery.fn.init.prototype
	},

	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,	//字节序标记 (\uFEFF) 即nbsp 空白字符

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {//jQuery.fn = jQuery.prototype  jQuery对象原型 

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );即Array.prototype.slice.call( this )
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];//此处类似String.prototype.substr
	},

	// Take an array of elements and push it onto the stack  入栈
	// (returning the new matched element set)
	pushStack: function( elems ) { //取一个数组中的元素，将其放入栈上，返回新的栈上的元素集合（jQuery对象）

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );//jQuery.merge(first,last)   将两个数组内容合并 ，first是被merge的，last数组不会被改变
															//this.constructor()是个空的JQ对象
		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;// 将this挂到该属性下，就可通过end()找到

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );// +i ,把字符串转为数组，i为负数则查询i+length的内容
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {//注意 jQuery.fn = jQuery.prototype
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation //当第一个参数是布尔值的时候，会被来判断是否开启深复制，并从第二个参数开始读取；如果不是布尔值，默认开启浅复制
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};//接受>=1个参数且第一个参数为布尔值时，布尔值被赋给deep，并将target顺延获取第二个参数，无第二个参数时，给target一个空对象
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction( target ) ) { //如果target不为对象或函数，则不进行拷贝，将target赋值空对象
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {//不计布尔值，只接受一个参数对象时，用参数来扩展jQuery本身
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {// 无序遍历options对象中的属性 , target是被扩展对象，src是扩展来源对象中的属性，copy是src的副本
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||//深复制入口，jQuery.isPlainObject 判断是否为纯粹对象(字面量或new Object生成的对象)，
					( copyIsArray = jQuery.isArray( copy ) ) ) ) {	  //否，则判断是否为数组

					if ( copyIsArray ) {							  //数组处理
						copyIsArray = false;
						clone = src && jQuery.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );//这个方法哪来的？

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {						//浅复制入口，或者说，当属性不为纯粹对象时，深复制的处理方法跟浅复制相同
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {													//通过上面定义的extend方法为jQuery添加各种方法

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isArray: Array.isArray,

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;//为什么要检测null？
	},

	isNumeric: function( obj ) {//判断参数是否为数字或只包含纯数字的字符串

		// As of jQuery 3.0, isNumeric is limited to
		// strings and numbers (primitives or objects)
		// that can be coerced to finite numbers (gh-2662)
		var type = jQuery.type( obj );
		return ( type === "number" || type === "string" ) &&

			// parseFloat NaNs numeric-cast false positives ("")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			!isNaN( obj - parseFloat( obj ) );//这个手法很妙，利用parseFloat('1111word') =1111 的特性
	},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {//Object.prototype.string.call() 深度检测对象类型
			return false;
		}

		proto = getProto( obj );//Object.getPrototypeOf

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;//判断是否为 new Object()创建
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;//上文 ：var ObjectFunctionString = fnToString.call( Object ); //typeof ObjectFunctionString   =  "function Object() { [native code] }"
	},

	isEmptyObject: function( obj ) {

		/* eslint-disable no-unused-vars */
		// See https://github.com/eslint/eslint/issues/6125
		var name;

		for ( name in obj ) {//in操作符
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}

		// Support: Android <=2.3 only (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?//var class2type = {}; var toString = class2type.toString;
			class2type[ toString.call( obj ) ] || "object" :  //class2type[ toString.call( obj ) ] 的作用是什么？
			typeof obj;
	},

	// Evaluates a script in a global context    //全局环境下执行一段代码（通过插入script标签）
	globalEval: function( code ) {
		DOMEval( code );
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE <=9 - 11, Edge 12 - 13
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );//	rmsPrefix = /^-ms-/, 	rdashAlpha = /-([a-z])/g,
	},																				//正则rdashAlpha用于匹配字符串中连字符“-”和其后的第一个字母
																					//匹配部分会被替换为对应的大写字母
	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android <=4.0 only
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );//rtrim 正则匹配空白字符
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {// 转换一个类似数组的对象成为真正的JavaScript数组。
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) { // Object( arr )生成一个对象，但这是什么用法
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {//这个函数多次被其他函数内部调用，用来合并两个数组或类数组(要有数字类型的length或者可以转化为数字类型的length)
		var len = +second.length,	  //关于“+”：arraylike 的length可能不为数字
			j = 0,					  //merge是破坏性的，第一个数组的内容被改变
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {//invert是布尔值，false则函数返回callback返回值为true的函数，true则相反，invert默认值为false
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;		  //如果invert不填，则为undefined，!undefinded===true

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {//遍历数组用for循环，遍历对象用for in，for in是无序遍历，而对数组而言，顺序比较重要
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) { //proxy用法：1：jQuery.proxy( function, context [, additionalArguments ] )将函数function的上下文对象更改为指定的context。
		var tmp, args, proxy;		 //			 2：jQuery.proxy( context, name [, additionalArguments ] )将名为name的函数的上下文更改为指定的context。函数name应是context对象的一个属性。

		if ( typeof context === "string" ) {//第二种用法的判定
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );//处理参数[, additionalArguments ]
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;//为将来移除proxy提供guid句柄

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support//一个空对象，用于以后储存其他属性
} );

if ( typeof Symbol === "function" ) {//不是很懂这个条件判定  添加了一个迭代器，fn实际上是一个对象。要想能够被for...of正常遍历的，都需要实现一个遍历器Iterator。而数组，Set和Map结构，早就内置好了遍历器Iterator（又叫迭代器），它们的原型中都有一个Symbol.iterator方法；而Object对象并没有实现这个接口，使得它无法被for...of遍历。
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];// 把arr数组的迭代器赋给jQuery.fn，使fn可以被for of迭代
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );
//得到：
//class2type[[object Boolean]] = "boolean"  
//class2type[[object Number]] = "number"  
//class2type[[object String]] = "string"  
//class2type[[object Funtion]] = "funtion"  
//class2type[[object Array]] = "array"  
//class2type[[object Date]] = "date"  
//class2type[[object RegExp]] = "regexp"  
//class2type[[object Object]] = "object"  
//class2type[[object Error]] = "error"  
//才是是用来为Object.prototype.toString.call()判断类型服务
function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,//!!obj？ 如果obj里面有length键，则length等于obj.lenght;否则等于false
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {//如果obj是function类型 或者是window对象 则返回false;
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;//多组条件判断 一个条件满足即为数组  ( length - 1 ) in obj，边界判断
}

return jQuery;
} );
