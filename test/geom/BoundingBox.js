var chai = require('chai');
var expect = chai.expect;
var BoundingBox = require('../../src/geom/BoundingBox');

describe('BoundingBox', function () 
{
    'use strict';
    describe('constructor', function () 
    {
        it('must supply default values', function () 
        {
            var bBox = new BoundingBox();
            expect(bBox.xMin()).to.equal(0);
            expect(bBox.yMin()).to.equal(0);
            expect(bBox.xMax()).to.equal(100);
            expect(bBox.yMax()).to.equal(100);

            var bb = new BoundingBox(10,100,10,100);
            expect(bb.xMin()).to.equal(10);
            expect(function(){bb.xMin('one');}).to.throw('BoundingBox.xMin(x): x must be a number.');

        });
    });
});