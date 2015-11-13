var chai = require('chai');
var expect = chai.expect;
var Rectangle = require('../../src/geom/Rectangle');
var util = require('../util');
var shouldThrowErrorIfNotNumber = util.shouldThrowErrorIfNotNumber; 
var shouldThrowErrorIfNotPositiveNumber = util.shouldThrowErrorIfNotPositiveNumber; 

describe('Rectangle', function () 
{  
    'use strict';
    
    describe('Constructor (x, y, width, height)', function () 
    {  
        it('Should supply default values for x, y, width, height', function () 
        {
            var rect = new Rectangle();
            expect(rect.x()).to.equal(0);
            expect(rect.y()).to.equal(0);
            expect(rect.width()).to.equal(100);
            expect(rect.height()).to.equal(100);
        });
        it('Arguments should be numbers or undefined', function () 
        {
            expect(function(){new Rectangle('1');}).to.throw(Error);
            expect(function(){new Rectangle(1, '2', 3, 4);}).to.throw(Error);
            expect(function(){new Rectangle(1, '2', 3, 4);}).to.throw(Error);
            expect(function(){new Rectangle(1, 2, '3', 4);}).to.throw(Error);
            expect(function(){new Rectangle(1, 2, 3, '4');}).to.throw(Error);
            expect(function(){new Rectangle([1]);}).to.throw(Error);
            expect(function(){new Rectangle([1, 2, 3, 4]);}).to.throw(Error);

            expect(function(){new Rectangle();}).to.not.throw(Error);
            expect(function(){new Rectangle(1);}).to.not.throw(Error);
            expect(function(){new Rectangle(1, 2);}).to.not.throw(Error);
            expect(function(){new Rectangle(1, 2, 3);}).to.not.throw(Error);
            expect(function(){new Rectangle(1, 2, 3, 4);}).to.not.throw(Error);
            expect(function(){new Rectangle(undefined, undefined, undefined, 4);}).to.not.throw(Error);
        });
    });

    describe('Methods', function () 
    {  
        var rect;
        beforeEach('Create a new rectangle', function() 
        {
            rect = new Rectangle();
        });

        describe('x(coord)', function () 
        {
            it('Should return the coordinate if no arguments are supplied, otherwise the Rectangle.', function () 
            {
                expect(rect.x(10)).to.be.an.instanceof(Rectangle);
                expect(rect.x()).to.equal(10);
            });
            it('The argument should be a number if its defined', function () 
            {
                shouldThrowErrorIfNotNumber(rect.x);
            });
        });
        describe('y(coord)', function () 
        {
            it('Should return the coordinate if no arguments are supplied, otherwise the Rectangle.', function () 
            {
                expect(rect.y(10)).to.be.an.instanceof(Rectangle);
                expect(rect.y()).to.equal(10);
            });
            it('The argument should be a number if its defined', function () 
            {
                shouldThrowErrorIfNotNumber(rect.y);
            });
        });
        describe('width(w)', function () 
        {
            it('Should return the width if no arguments are supplied, otherwise the Rectangle.', function () 
            {
                expect(rect.width(10)).to.be.an.instanceof(Rectangle);
                expect(rect.width()).to.equal(10);
            });
            it('The argument should be a positive number if its defined', function () 
            {
                shouldThrowErrorIfNotPositiveNumber(rect.width);
            });
        });
        describe('height(h)', function () 
        {
            it('Should return the height if no arguments are supplied, otherwise the Rectangle.', function () 
            {
                expect(rect.height(10)).to.be.an.instanceof(Rectangle);
                expect(rect.height()).to.equal(10);
            });
            it('The argument should be a positive number if its defined', function () 
            {
                shouldThrowErrorIfNotPositiveNumber(rect.height);
            });
        });
    });
});