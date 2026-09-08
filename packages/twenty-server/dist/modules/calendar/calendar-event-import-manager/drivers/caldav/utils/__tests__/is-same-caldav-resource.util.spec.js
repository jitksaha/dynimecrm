"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _issamecaldavresourceutil = require("../is-same-caldav-resource.util");
describe('isSameCalDavResource', ()=>{
    const collectionUrl = 'https://caldav.example.com/calendars/user/work/';
    it.each([
        'https://caldav.example.com/calendars/user/work/',
        'https://caldav.example.com/calendars/user/work',
        'https://caldav.example.com/calendars/user/work/?foo=bar',
        'https://caldav.example.com/calendars/user/work/#section',
        '/calendars/user/work/',
        '/calendars/user/work'
    ])('resolves %s to the same resource', (href)=>{
        expect((0, _issamecaldavresourceutil.isSameCalDavResource)(href, collectionUrl)).toBe(true);
    });
    it.each([
        'https://caldav.example.com/calendars/user/work/event.ics',
        'https://caldav.example.com/calendars/user/work/attachments/',
        'https://caldav.example.com/calendars/user/personal/',
        'https://other.example.com/calendars/user/work/',
        '/calendars/user/work/event.ics'
    ])('resolves %s to a different resource', (href)=>{
        expect((0, _issamecaldavresourceutil.isSameCalDavResource)(href, collectionUrl)).toBe(false);
    });
    it.each([
        'http://[',
        'https://%%',
        'http://host name/calendar/'
    ])('treats the unparseable href %s as a different resource', (href)=>{
        expect((0, _issamecaldavresourceutil.isSameCalDavResource)(href, collectionUrl)).toBe(false);
    });
    it('treats an unparseable collection url as a different resource', ()=>{
        expect((0, _issamecaldavresourceutil.isSameCalDavResource)('/calendars/user/work/', 'not a url')).toBe(false);
    });
    it('resolves percent-encoded and decoded paths to the same resource', ()=>{
        expect((0, _issamecaldavresourceutil.isSameCalDavResource)('/calendars/user/My Calendar/', 'https://caldav.example.com/calendars/user/My%20Calendar/')).toBe(true);
    });
});

//# sourceMappingURL=is-same-caldav-resource.util.spec.js.map