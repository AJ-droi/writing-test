jest.mock('../../app/doubles/OtherUtils', ()=>({
    ...jest.requireActual('../../app/doubles/OtherUtils'),
    calculateComplexity: ()=> {
        return 10
    }
}))

jest.mock('uuid', ()=>{
    v4:()=>'1234'
})

import * as OtherUtils from '../../app/doubles/OtherUtils'

describe('module tests', ()=> {

    test.only('calculate complexity', ()=>{
        const result = OtherUtils.calculateComplexity({} as any);
        console.log(result)
    })

    test.only('keep other functions', ()=>{
        const result = OtherUtils.toUpperCase('abc')
        expect(result).toBe('ABC');
    })

    test('string with Id', ()=>{
        const result = OtherUtils.toLowerCaseId('abc')
        expect(result).toContain('abc1234')
    })
})