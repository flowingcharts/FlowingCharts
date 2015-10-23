/*
deepEqual(value, expected[, message]): A recursive, strict comparison that works on all the JavaScript types. 
The assertion passes if value and expected are identical in terms of properties, values, and they have the same prototype;

equal(value, expected[, message]): Verify the value provided is equal the expected parameter using a non-strict comparison (==).

notDeepEqual(value, expected[, message]): Same as deepEqual() but tests for inequality;

notEqual(value, expected[, message]): Same as equal() but tests for inequality;

propEqual(value, expected[, message]): A strict comparison of the properties and values of an object. 
The assertion passes if all the properties and the values are identical;

strictEqual(value, expected[, message]): Verify the value provided is equal to the expected parameter using a strict comparison (===);

notPropEqual(value, expected[, message]): Same as propEqual() but tests for inequality;

notStrictEqual(value, expected[, message]): Same as strictEqual() but tests for inequality;

ok(value[, message]: An assertion that passes if the first argument is truthy;

throws(function [, expected ] [, message ]): Test if a callback throws an exception, and optionally compare the thrown error;
*/

QUnit.test('flowingcharts.geom.BoundingBox', function (assert) 
{
	expect(4);
	var bb = new flowingcharts.geom.BoundingBox(10,100,10,100);
	assert.strictEqual(bb.xMin(), 10, 'xMin is equal to 10');    
	assert.strictEqual(bb.yMin(), 10, 'yMin is equal to 10');
	assert.strictEqual(bb.xMax(), 10, 'xMax is equal to 10');
	assert.strictEqual(bb.yMax(), 10, 'yMax is equal to 10');
});

QUnit.test( 'ok test', function (assert) 
{
	assert.ok( true, 'true succeeds' );
	assert.ok( 'non-empty', 'non-empty string succeeds' );

	assert.ok( false, 'false fails' );
	assert.ok( 0, '0 fails' );
	assert.ok( NaN, 'NaN fails' );
	assert.ok( '', 'empty string fails' );
	assert.ok( null, 'null fails' );
	assert.ok( undefined, 'undefined fails' );
});

QUnit.test( 'equal test', function (assert)  
{
	assert.equal( 0, 0, 'Zero, Zero; equal succeeds' );
	assert.equal( '', 0, 'Empty, Zero; equal succeeds' );
	assert.equal( '', '', 'Empty, Empty; equal succeeds' );
	assert.equal( 0, false, 'Zero, false; equal succeeds' );

	assert.equal( 'three', 3, 'Three, 3; equal fails' );
	assert.equal( null, false, 'null, false; equal fails' );
});

QUnit.test( 'deepEqual test', function (assert)  
{
	var obj = { foo: 'bar' };

	assert.deepEqual( obj, { foo: 'bar' }, 'Two objects can be the same in value' );
});

QUnit.test( 'a test', function (assert) 
{
	assert.expect( 1 );

	var $body = $( 'body' );

	$body.on( 'click', function() {
	assert.ok( true, 'body was clicked!' );
	});

	$body.trigger( 'click' );
});