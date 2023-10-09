import { OtherStringUtils, calculateComplexity, toUpperCaseWithCb } from "../../app/doubles/OtherUtils"

describe('Otherutils test suite', () => { 

    //spies
    describe('OtherStringUtils tests with spies', () => {
        let sut: OtherStringUtils;

        beforeEach(() => {
            sut = new OtherStringUtils();
        })

        test('Use a spy to track calls', ()=> {
            const toUpperCaseSpy = jest.spyOn(sut, 'toUpperCase')
            sut.toUpperCase('asa')
            expect(toUpperCaseSpy).toBeCalledWith('asa')
        })

        test('Use a spy to track calls to other module', ()=> {
            const consoleLogSpy = jest.spyOn(console, 'log')
            sut.logString('abc')
            expect(consoleLogSpy).toBeCalledWith('abc')
        })

        test('Use a spy to replace theimplementation of a method', ()=> {
            
            jest.spyOn(sut as any, 'callExternalService').mockImplementation(() => {
                console.log('calling mocked implementation!!!')
            });
            (sut as any).callExternalService();

        })


    })

    //mocks
    describe('Tracking callbacks with Jest mocks', () => {

       const callBackMock = jest.fn()

       afterEach(() => {
        jest.clearAllMocks()
    })

        it(' calls callback for invalid argument - track calls', ()=> {
            const actual = toUpperCaseWithCb('', callBackMock);
            expect(actual).toBeUndefined()
            expect(callBackMock).toBeCalledWith('Invalid argument!')
            expect(callBackMock).toBeCalledTimes(1)
         })

         it('calls callback for valid argument - track calls', ()=> {
            const actual = toUpperCaseWithCb('abc', callBackMock);
            expect(actual).toBe('ABC')
            expect(callBackMock).toBeCalledWith('called function with abc')
            expect(callBackMock).toBeCalledTimes(1)
         })
     
    })

    describe('Tracking callbacks', () => {
        let cbArgs = []
        let timesCalled = 0

        function callBackMock(arg:string){
            cbArgs.push(arg)
            timesCalled++;
        }

        afterEach(() => {
            cbArgs = []
            timesCalled = 0
        })

        it(' calls callback for invalid argument - track calls', ()=> {
            const actual = toUpperCaseWithCb('', callBackMock);
            expect(actual).toBeUndefined()
            expect(cbArgs).toContain('Invalid argument!')
            expect(timesCalled).toEqual(1)
         })

         it('calls callback for valid argument - track calls', ()=> {
            const actual = toUpperCaseWithCb('abc', callBackMock);
            expect(actual).toBe('ABC')
            expect(cbArgs).toContain('called function with abc')
            expect(timesCalled).toEqual(1)
         })
     
    })
    //stubs
    it('Calculates complexity', ()=> {
        const someInfo = {
            length: 5,
            extraInfo: {
                field1:"someInfo",
                field2: "someInfo2"            
            }
        }

        const actual = calculateComplexity(someInfo as any)
        expect(actual).toBe(10)
    })

     //fakes
     it('ToUpperCase - calls callback for invalid argument', ()=> {
       const actual = toUpperCaseWithCb('', ()=> {});
       expect(actual).toBeUndefined()
    })

    it('ToUpperCase - calls callback for valid argument', ()=> {
        const actual = toUpperCaseWithCb('abc', ()=> {});
        expect(actual).toBe('ABC')
     })
})