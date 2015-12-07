var chai = require('chai');
var chaiSubset = require('chai-subset');
var chaiString = require('chai-string');

chai.use(chaiString);
chai.use(chaiSubset);

global.chai = chai;
global.sinon = require('sinon');
global.expect = global.chai.expect;
global.should = global.chai.should;
