import { PasswordChecker, PasswordErrors } from "../../app/pass_checker/PasswordChecker"



describe('PasswordChecker test suite', () => {
    let sut: PasswordChecker;

    beforeEach(() => {
        sut = new PasswordChecker();
    })

    it('Password with less than 8 chars is invalid', ()=> {
        const actual = sut.checkPassword('1234567');

        expect(actual.valid).toBe(false)
        expect(actual.reason).toContain(PasswordErrors.SHORT)
    })

    it('Password with more than 8 chars is ok', ()=> {
        const actual = sut.checkPassword('12345678Aa');
        expect(actual.valid).toBe(true)
    })

    it('Password with no uppercase should be invalid', ()=> {
        const actual = sut.checkPassword('12345678abcd');
        expect(actual.valid).toBe(false)
        expect(actual.reason).toContain(PasswordErrors.NO_UPPER_CASE)
    })

    xit('Password with  should be valid', ()=> {
        const actual = sut.checkPassword('12345678abcdAB');
        expect(actual).toBe(true)
    })

    it('Password with no lowercase should be valid', ()=> {
        const actual = sut.checkPassword('12345678ABCD');
        expect(actual.reason).not.toContain(PasswordErrors.NO_UPPER_CASE)
    })

    it('Admin Password with no number is invalid', ()=> {
        const actual = sut.checkAdminPassword('abcdABCD');
        expect(actual.reason).toContain(PasswordErrors.NO_NUMBER)
        expect(actual.valid).toBe(false)
    })

    it('Admin Password with  number is valid', ()=> {
        const actual = sut.checkAdminPassword('abcdABCD7');
        expect(actual.reason).not.toContain(PasswordErrors.NO_NUMBER)
        expect(actual.valid).toBe(true)
    })




})