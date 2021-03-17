mdConverter = require('../lib/converter');

describe('getHeadingType', function() {
    it('should identify the heading type', function() {
        expect(mdConverter.getHeadingType('# heading 1')).toEqual(1);
        expect(mdConverter.getHeadingType('## heading 1')).toEqual(2);
        expect(mdConverter.getHeadingType(' heading 1')).toEqual(0);
        expect(mdConverter.getHeadingType('heading 1')).toEqual(0);
        expect(mdConverter.getHeadingType(' ### heading 1')).toEqual(0);
    });
});

describe('getPlainText', function() {
    it('should extract text leaving out markdown syntax', function() {
        expect(mdConverter.getPlainText('# heading 1')).toEqual('heading 1');
        expect(mdConverter.getPlainText('## heading 2')).toEqual('heading 2');
    });
});

describe('getHtmlText', function() {
    it('should return HTML text based on the level parameter provided', function() {
        expect(mdConverter.getHtmlText('plain text', 0)).toEqual('<p>plain text</p>');
        expect(mdConverter.getHtmlText('heading 1', 1)).toEqual('<h1>heading 1</h1>');
        expect(mdConverter.getHtmlText('heading 2', 2)).toEqual('<h2>heading 2</h2>');
        expect(mdConverter.getHtmlText('heading 6', 6)).toEqual('<h6>heading 6</h6>');
    });
});

describe('processLinks', function() {
    it('should process any links in the markdown text', function() {
        expect(mdConverter.processLinks('The [Mailchimp](http://mc.com) homework')).toEqual('The <a href="http://mc.com">Mailchimp</a> homework')
        expect(mdConverter.processLinks(' # The [Mailchimp](http://mc.com) homework')).toEqual(' # The <a href="http://mc.com">Mailchimp</a> homework')
        expect(mdConverter.processLinks('## header [with link](http://yh.co)')).toEqual('## header <a href="http://yh.co">with link</a>')
    });
});