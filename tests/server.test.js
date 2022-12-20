import supertest from 'supertest'
import { app } from '../server'


const api = supertest(app)


const server = require('../server')