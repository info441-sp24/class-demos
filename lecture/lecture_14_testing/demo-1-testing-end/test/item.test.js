import { assert } from 'chai'
import request from 'supertest'

// I want to test item.js, but it needs
// models from app.js, so I import app.js
import app from '../app.js'

describe('Items integration test (with database)', function(){
    it("should get items from the db for GET items", async function(){
        const res = await request(app).get("/items")

        assert.equal(res.statusCode, 200)
        assert.equal(res.type, 'application/json')

        assert.isArray(res.body)
        assert.include(res.body[0], {
            name: 'orange',
            price: 1.5
        })
    })
})