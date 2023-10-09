import { getRequestBody } from "../../../app/server_app/utils/Utils"
import {IncomingMessage} from 'http'

const requestMock ={
    on: jest.fn()
}

const someObject = {
    name:'John',
    age: 30,
    city: 'Paris'
}


const someObjectAsString = JSON.stringify(someObject)

describe('getRequestBody test suite', ()=>{

    it('should return object for valid JSON', async ()=>{
        requestMock.on.mockImplementation((event, cb) => {
            if(event =='data'){
                cb(someObjectAsString)
            }else{
                cb()
            }

            const actual = getRequestBody(
                requestMock as any as IncomingMessage
            )

            expect(actual).toEqual(someObject)

        })

    })

    it('should throw error for invalid JSON', async ()=>{
        requestMock.on.mockImplementation((event, cb) => {
            if(event =='data'){
                cb('a' + someObjectAsString)
            }else{
                cb()
            }

            expect(getRequestBody(
                requestMock as any 
            )).rejects.toThrow('Unexpected token a in JSON at postion 0')
        })

    })

    it('should throw error for unexpected error', async ()=>{
        const someError = new Error('Something Went Wrong')
        requestMock.on.mockImplementation((event, cb) => {
            if(event =='error'){
                cb(someError)
            }else{
                cb()
            }

            expect(getRequestBody(
                requestMock as any 
            )).rejects.toThrow(someError.message)
        })

    })
})