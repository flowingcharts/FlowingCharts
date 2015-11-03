//var assert = require('assert');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var BoundingBox = require('../../src/geom/BoundingBox');

describe('Array', function() 
{
    describe('#indexOf()', function () 
    {
        it('should return -1 when the value is not present', function () 
        {
            //assert.equal(-1, [1,2,3].indexOf(5));
            //assert.equal(-1, [1,2,3].indexOf(0));
            expect([1,2,3].indexOf(5)).to.equal(-1);
            expect([1,2,3].indexOf(0)).to.equal(-1);
        });
    });
});

describe('BoundingBox', function() 
{
    describe('xMin(x)', function () 
    {
        it('x must be a number', function () 
        {
            var bb = new BoundingBox(10,100,10,100);
            expect(bb.xMin()).to.equal(10);
            expect(function(){bb.xMin('one');}).to.throw('BoundingBox.xMin(x): x must be a number.');

        });
    });
});