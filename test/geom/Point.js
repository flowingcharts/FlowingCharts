var chai = require('chai');
var expect = chai.expect;
var Point = require('../../src/geom/Point');
var util = require('../util');
var shouldThrowErrorIfNotNumber = util.shouldThrowErrorIfNotNumber; 
var shouldThrowErrorIfNotPositiveNumber = util.shouldThrowErrorIfNotPositiveNumber; 

describe('Point', function () 
{  
    'use strict';
    
    describe('Constructor (x, y)', function () 
    {  
        it('Should supply default values for x, y', function () 
        {
            var pt = new Point();
            expect(pt.x()).to.equal(0);
            expect(pt.y()).to.equal(0);
        });
        it('Arguments should be numbers or undefined', function () 
        {
            expect(function(){new Point('1');}).to.throw(Error);
            expect(function(){new Point(1, '2');}).to.throw(Error);
            expect(function(){new Point('1', 2);}).to.throw(Error);
            expect(function(){new Point([1]);}).to.throw(Error);
            expect(function(){new Point([1, 2]);}).to.throw(Error);

            expect(function(){new Point();}).to.not.throw(Error);
            expect(function(){new Point(1);}).to.not.throw(Error);
            expect(function(){new Point(1, 2);}).to.not.throw(Error);
            expect(function(){new Point(1, undefined);}).to.not.throw(Error);
            expect(function(){new Point(undefined, 2);}).to.not.throw(Error);
        });
    });

    describe('Methods', function () 
    {  
        var pt;
        beforeEach('Create a new ptangle', function() 
        {
            pt = new Point();
        });

        describe('x(coord)', function () 
        {
            it('Should return the coordinate if no arguments are supplied, otherwise the Point.', function () 
            {
                expect(pt.x(10)).to.be.an.instanceof(Point);
                expect(pt.x()).to.equal(10);
            });
            it('The argument should be a number if its defined', function () 
            {
                shouldThrowErrorIfNotNumber(pt.x);
            });
        });
        describe('y(coord)', function () 
        {
            it('Should return the coordinate if no arguments are supplied, otherwise the Point.', function () 
            {
                expect(pt.y(10)).to.be.an.instanceof(Point);
                expect(pt.y()).to.equal(10);
            });
            it('The argument should be a number if its defined', function () 
            {
                shouldThrowErrorIfNotNumber(pt.y);
            });
        });
    });
});