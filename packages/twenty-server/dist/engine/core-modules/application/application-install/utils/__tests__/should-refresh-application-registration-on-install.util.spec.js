"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _shouldrefreshapplicationregistrationoninstallutil = require("../should-refresh-application-registration-on-install.util");
describe('shouldRefreshApplicationRegistrationOnInstall', ()=>{
    it('should refresh when latestAvailableVersion is null', ()=>{
        expect((0, _shouldrefreshapplicationregistrationoninstallutil.shouldRefreshApplicationRegistrationOnInstall)({
            installedVersion: '1.0.0',
            latestAvailableVersion: null
        })).toBe(true);
    });
    it('should refresh when latestAvailableVersion is not a valid semver', ()=>{
        expect((0, _shouldrefreshapplicationregistrationoninstallutil.shouldRefreshApplicationRegistrationOnInstall)({
            installedVersion: '1.0.0',
            latestAvailableVersion: 'not-a-version'
        })).toBe(true);
    });
    it('should refresh when installed version is newer than latestAvailableVersion', ()=>{
        expect((0, _shouldrefreshapplicationregistrationoninstallutil.shouldRefreshApplicationRegistrationOnInstall)({
            installedVersion: '2.0.0',
            latestAvailableVersion: '1.0.0'
        })).toBe(true);
    });
    it('should refresh when installed version equals latestAvailableVersion', ()=>{
        expect((0, _shouldrefreshapplicationregistrationoninstallutil.shouldRefreshApplicationRegistrationOnInstall)({
            installedVersion: '1.2.3',
            latestAvailableVersion: '1.2.3'
        })).toBe(true);
    });
    it('should not refresh when installed version is older than latestAvailableVersion', ()=>{
        expect((0, _shouldrefreshapplicationregistrationoninstallutil.shouldRefreshApplicationRegistrationOnInstall)({
            installedVersion: '1.0.0',
            latestAvailableVersion: '2.0.0'
        })).toBe(false);
    });
    it('should not refresh when installed version is not a valid semver and latestAvailableVersion is valid', ()=>{
        expect((0, _shouldrefreshapplicationregistrationoninstallutil.shouldRefreshApplicationRegistrationOnInstall)({
            installedVersion: 'not-a-version',
            latestAvailableVersion: '1.0.0'
        })).toBe(false);
    });
});

//# sourceMappingURL=should-refresh-application-registration-on-install.util.spec.js.map