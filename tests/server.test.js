const request = require("supertest")
const matchApiStub = require('./match.stub.json');
const baseURL = "http://localhost:3000"

const matchId = "639c7980d4aadd7d8786182a"

describe("GET Match",()=>{

    it("Should return 200", async()=>{
        const response = await request(baseURL).get("/matches/" + matchId);
        expect(response.statusCode).toBe(200);

    })

    it("Should be equal to the stub match", async()=>{
        const response = await request(baseURL).get("/matches/" + matchId);
        expect(response.body).toEqual(matchApiStub); 
        
    })

})