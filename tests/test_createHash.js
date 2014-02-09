var mocha = require('mocha');
var chai = require('chai');

var utils = require('../utils/utils');

chai.should();

describe('Creating a hash',function(){
    it('given 13892023552988409291, it should return 08688cba3237c9ea',function(){
      var key = '13892023552988409291'
        , expectedHash = '08688cba3237c9ea';

      utils.createHash(key).should.eql(expectedHash);
    });
    it('given 13892034465856089346, it should return 57fb4665ead4abac',function(){
      var key = '13892034465856089346'
        , expectedHash = '57fb4665ead4abac';

      utils.createHash(key).should.eql(expectedHash);
    });
    it('given 13892034465856089346, it should return 1083ca326a0eeac6',function(){
      var key = 'ravig'
        , expectedHash = '1083ca326a0eeac6';

        console.log(utils.createHash(key))

      utils.createHash(key).should.eql(expectedHash);
    });
});
