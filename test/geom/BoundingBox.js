var chai = require('chai');
var expect = chai.expect;
var BoundingBox = require('../../src/geom/BoundingBox');
var util = require('../util');
var shouldThrowErrorIfNotNumber = util.shouldThrowErrorIfNotNumber; 
var shouldThrowErrorIfNotPositiveNumber = util.shouldThrowErrorIfNotPositiveNumber; 

describe('BoundingBox', function () 
{  
    'use strict';
    var bBox;

    beforeEach('Create a new bounding box', function() 
    {
        bBox = new BoundingBox();
    });

    describe('BoundingBox (xMin, yMin, xMax, yMax)', function () 
    {
        it('Should supply default values for the arguments', function () 
        {
            expect(bBox.xMin()).to.equal(0);
            expect(bBox.yMin()).to.equal(0);
            expect(bBox.xMax()).to.equal(100);
            expect(bBox.yMax()).to.equal(100);
        });
    });
    describe('xMin(x)', function () 
    {
        it('Should return the coordinate if no arguments are supplied, otherwise the BoundingBox.', function () 
        {
            expect(bBox.xMin(10)).to.be.an.instanceof(BoundingBox);
            expect(bBox.xMin()).to.equal(10);
        });
        it('The argument should be a number if its defined', function () 
        {
            shouldThrowErrorIfNotNumber(bBox.xMin);
        });
    });
    describe('xMax(x)', function () 
    {
        it('Should return the coordinate if no arguments are supplied, otherwise the BoundingBox.', function () 
        {
            expect(bBox.xMax(10)).to.be.an.instanceof(BoundingBox);
            expect(bBox.xMax()).to.equal(10);
        });
        it('The argument should be a number if its defined', function () 
        {
            shouldThrowErrorIfNotNumber(bBox.xMax);
        });
    });
    describe('xCenter(x)', function () 
    {
        it('Should return the coordinate if no arguments are supplied, otherwise the BoundingBox.', function () 
        {
            expect(bBox.xCenter(10)).to.be.an.instanceof(BoundingBox);
            expect(bBox.xCenter()).to.equal(10);
        });
        it('The argument should be a number if its defined', function () 
        {
            shouldThrowErrorIfNotNumber(bBox.xCenter);
        });
    });
    describe('width(w)', function () 
    {
        it('Should return the width if no arguments are supplied, otherwise the BoundingBox.', function () 
        {
            expect(bBox.width(10)).to.be.an.instanceof(BoundingBox);
            expect(bBox.width()).to.equal(10);
        });
        it('The argument should be a number if its defined', function () 
        {
            shouldThrowErrorIfNotPositiveNumber(bBox.width);
        });
    });
    describe('yMin(y)', function () 
    {
        it('Should return the coordinate if no arguments are supplied, otherwise the BoundingBox.', function () 
        {
            expect(bBox.yMin(10)).to.be.an.instanceof(BoundingBox);
            expect(bBox.yMin()).to.equal(10);
        });
        it('The argument should be a number if its defined', function () 
        {
            shouldThrowErrorIfNotNumber(bBox.yMin);
        });
    });
    describe('yMax(y)', function () 
    {
        it('Should return the coordinate if no arguments are supplied, otherwise the BoundingBox.', function () 
        {
            expect(bBox.yMax(10)).to.be.an.instanceof(BoundingBox);
            expect(bBox.yMax()).to.equal(10);
        });
        it('The argument should be a number if its defined', function () 
        {
            shouldThrowErrorIfNotNumber(bBox.yMax);
        });
    });
    describe('yCenter(y)', function () 
    {
        it('Should return the coordinate if no arguments are supplied, otherwise the BoundingBox.', function () 
        {
            expect(bBox.yCenter(10)).to.be.an.instanceof(BoundingBox);
            expect(bBox.yCenter()).to.equal(10);
        });
        it('The argument should be a number if its defined', function () 
        {
            shouldThrowErrorIfNotNumber(bBox.yCenter);
        });
    });
    describe('height(h)', function () 
    {
        it('Should return the height if no arguments are supplied, otherwise the BoundingBox.', function () 
        {
            expect(bBox.height(10)).to.be.an.instanceof(BoundingBox);
            expect(bBox.height()).to.equal(10);
        });
        it('The argument should be a number if its defined', function () 
        {
            shouldThrowErrorIfNotPositiveNumber(bBox.height);
        });
    });
});