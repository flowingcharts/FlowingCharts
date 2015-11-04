//var assert = require('assert');
var chai = require('chai');
var expect = chai.expect;
var BoundingBox = require('../../src/geom/BoundingBox');

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