const request = require("supertest")
const matchApiStub = require('./match.stub.json');
const flagApiStub = require('./flag.stub.json');
const baseURL = "http://localhost:3000"

describe("GET Matches",()=>{

    it("Should return 200", async()=>{
        const response = await request(baseURL).get(`/matches/${matchApiStub[0]._id}`);
        expect(response.statusCode).toBe(200);

    })

    it("Should return 500", async()=>{
        const response = await request(baseURL).get(`/matches/one`);
        expect(response.statusCode).toBe(500);

    })

    it("Should be equal to the first match", async()=>{
        const response = await request(baseURL).get(`/matches/${matchApiStub[0]._id}`);
        expect(response.body).toEqual(matchApiStub[0]); 
        
    })

    it("Should return 200", async()=>{
        const response = await request(baseURL).get('/matches');
        expect(response.statusCode).toBe(200);

    })

    it("Should be equal to the first 7 matches", async()=>{
        const response = await request(baseURL).get("/matches");
        expect(response.body).toEqual(matchApiStub); 
        
    })

});


describe("Search for coutry flag",() => {

    it("Should return 200", async()=>{
        const response = await request(baseURL).get('/flag/Netherlands');
        expect(response.statusCode).toBe(200);

    })

    it("Should return Neterlands flag", async()=>{
        const response = await request(baseURL).get('/flag/Netherlands');
        expect(response.body).toEqual(flagApiStub[0]);

    })

    it("Should return white flag with question mark", async()=>{
        const response = await request(baseURL).get('/flag/Netherlandssssssss');
        expect(response.body).toEqual(flagApiStub[1]);

    })
});

// describe("",() => {


// });









jest.setTimeout(500000)
