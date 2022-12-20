const request = require("supertest")
const matchApiStub = require('./match.stub.json');
const baseURL = "http://localhost:3000"

describe("GET Match",()=>{

    it("Should return 200", async()=>{
        const response = await request(baseURL).get(`/matches/${matchApiStub[0]._id}`);
        expect(response.statusCode).toBe(200);

    })

    it("Should be equal to the stub match", async()=>{
        const response = await request(baseURL).get(`/matches/${matchApiStub[0]._id}`);
        expect(response.body).toEqual(matchApiStub[0]); 
        
    })

})