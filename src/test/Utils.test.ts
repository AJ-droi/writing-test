import { StringUtils, getStringInfo, toUpperCase } from "../app/Utils"


describe('Utils test suite', ()=>{

    describe.only('StringUtils tests', ()=>{

        let sut: StringUtils;

        beforeEach(()=>{
            sut = new StringUtils();
            console.log('Setup')
        })

        afterEach(() => {
            // clearing mocks
            console.log('Teardown')
        })

        it.only('Should return correct upperCase', ()=>{
            const sut = new StringUtils();

            const actual = sut.toUpperCase('abc')

            expect(actual).toBe('ABC')

        })

        it.only('Should throw error on invalid argument - function', ()=>{
            function expectError() {
                const actual = sut.toUpperCase('')
            }
            expect(expectError).toThrow();
            expect(expectError).toThrowError('Invalid argument!')
        })

        it('Should throw error on invalid argument - try catch block', (done)=>{
          try{
            sut.toUpperCase('');
            done('GetStringInfo should throw error for invalid arg!')
          }catch(error){
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Invalid argument!')
            expect(error.message).toBe('Invalid argument!')
            done()
          }
        })
    })




    it('should return uppercase', () => {
        const result = toUpperCase('abc')
        expect(result).toBe('ABC')
    })

    it('should return info for valid string', () => {
        const actual = getStringInfo('My-String')

        expect(actual.lowerCase).toBe('my-string');
        expect(actual.extraInfo).toEqual({})

        expect(actual.characters).toHaveLength(9)
        
        expect(actual.characters).toEqual(['M','y','-','S','t','r','i','n','g'])
        expect(actual.characters).toContain<string>('M')

        //for array
        expect(actual.characters).toEqual(
            expect.arrayContaining(['S','t','r','i','n','g'])
        )

        expect(actual.extraInfo).not.toBe(undefined);
        expect(actual.extraInfo).not.toBeUndefined();
        expect(actual.extraInfo).toBeDefined();
        expect(actual.extraInfo).not.toBe(undefined);
        expect(actual.extraInfo).toBeTruthy()

        
    })
})