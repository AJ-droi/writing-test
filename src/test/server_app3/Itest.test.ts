import * as generate from "../../app/server_app/data/IdGenerator";
import { Account } from "../../app/server_app/model/AuthModel";
import { Reservation } from "../../app/server_app/model/ReservationModel";
import { HTTP_CODES, HTTP_METHODS } from "../../app/server_app/model/ServerModel";
import { Server } from "../../app/server_app/server/Server";
import { makeAwesomeRequest } from "./utils/http-client";


xdescribe('Server app integration test', ()=>{

    let server: Server;

    beforeAll(()=>{
        server = new Server()
        server.startServer()
    })

    afterAll(()=>{
        server.stopServer()
    })

    const someUser: Account = {
        id:'',
        userName:'someUserName',
        password: 'somePassword'
    }

    
    const someReservation: Reservation = {
        id:'',
        endDate:'someEndDate',
        startDate:'someStartDate',
        room: 'someRoom',
        user: 'someUser'

    }
    it('should register new user', async ()=>{
        const result = await fetch('http://localhost:8080/register', {
            method: HTTP_METHODS.POST,
            body: JSON.stringify(someUser)
        })

        const resultBody = await result.json()

        expect(result.status).toBe(HTTP_CODES.CREATED)
        expect(resultBody.userId).toBeDefined()
        console.log(`connecting to address: ${process.env.HOST}`)
    })

    it('should register new user with awesomeRequest', async ()=>{
        const result = await makeAwesomeRequest({
            method: HTTP_METHODS.POST,
            port: 8080,
            hostname: 'localhost',
            path: '/register'
        }, someUser)

        expect(result.statusCode).toBe(HTTP_CODES.CREATED)
        expect(result.body.userId).toBeDefined()
    })

    let token: string

    it('should login a register user', async ()=>{
        const result = await fetch('http://localhost:8080/login', {
            method: HTTP_METHODS.POST,
            body: JSON.stringify(someUser)
        })

        const resultBody = await result.json()

        expect(result.status).toBe(HTTP_CODES.CREATED)
        expect(resultBody.token).toBeDefined()
        token = resultBody.token
    })

    let createReservationId: string;
    it('should create resrvation if authorized', async ()=>{
        const result = await fetch('http://localhost:8080/reservation', {
            method: HTTP_METHODS.POST,
            body: JSON.stringify(someReservation),
            headers:{
                authorization: token
            }
        })

        const resultBody = await result.json()

        expect(result.status).toBe(HTTP_CODES.CREATED)
        expect(resultBody.reservationId).toBeDefined()
        createReservationId = resultBody.reservationId
    })

    it('should get resrvation if authorized', async ()=>{
        const result = await fetch(`http://localhost:8080/reservation/${createReservationId}`, {
            method: HTTP_METHODS.GET,
            headers:{
                authorization: token
            }
        })

        const resultBody = await result.json()

        const expectedReservation = structuredClone(someReservation)
        expectedReservation.id = createReservationId

        expect(result.status).toBe(HTTP_CODES.OK)
        expect(resultBody).toEqual(expectedReservation)
    })

    it('should create and retrieve multiple reservation if authorized', async ()=>{
         await fetch('http://localhost:8080/reservation', {
            method: HTTP_METHODS.POST,
            body: JSON.stringify(someReservation),
            headers:{
                authorization: token
            }
        })

        await fetch('http://localhost:8080/reservation', {
            method: HTTP_METHODS.POST,
            body: JSON.stringify(someReservation),
            headers:{
                authorization: token
            }
        })

        await fetch('http://localhost:8080/reservation', {
            method: HTTP_METHODS.POST,
            body: JSON.stringify(someReservation),
            headers:{
                authorization: token
            }
        })

        const getAllResult = await fetch(`http://localhost:8080/reservation/all`, {
            method: HTTP_METHODS.GET,
            headers:{
                authorization: token
            }
        })

        const resultBody = await getAllResult.json()

        expect(getAllResult.status).toBe(HTTP_CODES.OK)
        expect(resultBody).toHaveLength(4)

    })

    it('should update resrvation if authorized', async ()=>{
        const updateResult = await fetch(`http://localhost:8080/reservation/${createReservationId}`, {
            method: HTTP_METHODS.PUT,
            body: JSON.stringify({
                startDate:'otherStartDate'
            }),
            headers:{
                authorization: token
            }
        })

      

        expect(updateResult.status).toBe(HTTP_CODES.OK)
        const getResult = await fetch(`http://localhost:8080/reservation/${createReservationId}`, {
            method: HTTP_METHODS.GET,
            headers:{
                authorization: token
            }
        })

        const getRequestBody: Reservation = await getResult.json()
        expect(getRequestBody.startDate).toBe('otherStartDate')
    })

    it('should delete resrvation if authorized', async ()=>{
        const deleteResult = await fetch(`http://localhost:8080/reservation/${createReservationId}`, {
            method: HTTP_METHODS.DELETE,
            body: JSON.stringify({
                startDate:'otherStartDate'
            }),
            headers:{
                authorization: token
            }
        })

        expect(deleteResult.status).toBe(HTTP_CODES.OK)
        const getResult = await fetch(`http://localhost:8080/reservation/${createReservationId}`, {
            method: HTTP_METHODS.GET,
            headers:{
                authorization: token
            }
        })

  
        expect(getResult.status).toBe(HTTP_CODES.NOT_fOUND)

    })

    it('snapshot demo', async ()=>{

        jest.spyOn(generate, 'generateRandomId').mockReturnValueOnce('1234')

        const result = await fetch('http://localhost:8080/reservation', {
            method: HTTP_METHODS.POST,
            body: JSON.stringify(someReservation),
            headers:{
                authorization: token
            }
        })

        const getResult = await fetch(`http://localhost:8080/reservation/1234`, {
            method: HTTP_METHODS.GET,
            headers:{
                authorization: token
            }
        })

        const getRequestBody: Reservation = await getResult.json()

        expect(getRequestBody).toMatchSnapshot()


        
    })
})