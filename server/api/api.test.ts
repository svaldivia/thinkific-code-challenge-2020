import request from 'supertest'
import app from '../..'

describe('Api Test', () => {
  describe('Signup', () => {
    it('should sign up a user with valid credentials', async () => {
      const testUser = { email: 'test@test.com', password: 'password' }
      const response = await request(app).post('/api/signup').send(testUser)

      expect(response.status).toEqual(200)
      expect(response.body).toHaveProperty('user')
    })

    it('should return 400 required field is missing', async () => {
      const testUser = { email: 'test@test.com' }
      const response = await request(app).post('/api/signup').send(testUser)

      expect(response.status).toEqual(400)
    })

    it('should return 400 user already exists', async () => {
      const testUser = { email: 'test@test.com', password: 'password' }
      const testUser2 = { email: 'test@test.com', password: 'password' }
      await request(app).post('/api/signup').send(testUser)
      const response = await request(app).post('/api/signup').send(testUser2)

      expect(response.status).toEqual(400)
    })
  })

  describe('Login', () => {
    let test: any
    beforeEach(async () => {
      test = {}
      test.user = { email: 'test@test.com', password: 'password' }
      await request(app).post('/api/signup').send(test.user)
    })

    it('should log in a user with valid credentials and provide token', async () => {
      const response = await request(app).post('/api/login').send(test.user)

      expect(response.status).toEqual(200)
      expect(response.body).toHaveProperty('token')
    })

    it('should return 404 if user does not exist', async () => {
      const testUser = { email: 'test2@test.com', password: 'password' }
      const response = await request(app).post('/api/login').send(testUser)

      expect(response.status).toEqual(404)
    })

    it('should return 400 if missing credentials', async () => {
      const testUser = { email: 'test@test.com' }
      const response = await request(app).post('/api/signup').send(testUser)

      expect(response.status).toEqual(400)
    })

    it('should return 401 if invalid credentials', async () => {
      const testUser = { email: 'test@test.com', password: 'wrong' }
      const response = await request(app).post('/api/signup').send(testUser)

      expect(response.status).toEqual(400)
    })
  })

  describe('Current', () => {
    let test: any
    beforeEach(async () => {
      test = {}
      test.user = { email: 'test@test.com', password: 'password' }
      await request(app).post('/api/signup').send(test.user)
      const response = await request(app).post('/api/login').send(test.user)
      test.token = response.body?.token
    })

    it('should return current count', async () => {
      const response = await request(app)
        .get('/api/current')
        .set('Authorization', `Bearer ${test.token}`)

      expect(response.status).toEqual(200)
      expect(response.body).toHaveProperty('count')
    })

    it('should return 401 if token invalid', async () => {
      const response = await request(app)
        .get('/api/current')
        .set('Authorization', `Bearer 123456`)

      expect(response.status).toEqual(401)
    })
  })

  describe('Next', () => {
    let test: any
    beforeEach(async () => {
      test = {}
      test.user = { email: 'test@test.com', password: 'password' }
      await request(app).post('/api/signup').send(test.user)
      const response = await request(app).post('/api/login').send(test.user)
      test.token = response.body?.token
    })

    it('should return updated count', async () => {
      const response = await request(app)
        .get('/api/next')
        .set('Authorization', `Bearer ${test.token}`)

      expect(response.status).toEqual(200)
      expect(response.body).toHaveProperty('count')
      expect(response.body.count).toEqual(1)
    })

    it('should return 401 if token invalid', async () => {
      const response = await request(app)
        .get('/api/next')
        .set('Authorization', `Bearer 123456`)

      expect(response.status).toEqual(401)
    })
  })

  describe('Reset', () => {
    let test: any
    beforeEach(async () => {
      test = {}
      test.user = { email: 'test@test.com', password: 'password' }
      await request(app).post('/api/signup').send(test.user)
      const response = await request(app).post('/api/login').send(test.user)
      test.token = response.body?.token
    })

    it('should return updated count', async () => {
      test.newCount = { count: 200 }
      const response = await request(app)
        .put('/api/reset')
        .set('Authorization', `Bearer ${test.token}`)
        .send(test.newCount)

      expect(response.status).toEqual(200)
      expect(response.body).toHaveProperty('count')
      expect(response.body.count).toEqual(test.newCount.count)
    })

    it('should return 400 if count is negative updated count', async () => {
      test.newCount = { count: -20 }
      const response = await request(app)
        .put('/api/reset')
        .set('Authorization', `Bearer ${test.token}`)
        .send(test.newCount)

      expect(response.status).toEqual(400)
    })
    it('should return 400 if count is a string', async () => {
      test.newCount = { count: 'wrong!' }
      const response = await request(app)
        .put('/api/reset')
        .set('Authorization', `Bearer ${test.token}`)
        .send(test.newCount)

      expect(response.status).toEqual(400)
    })

    it('should return 400 if count is not an integer', async () => {
      test.newCount = { count: 1.5 }
      const response = await request(app)
        .put('/api/reset')
        .set('Authorization', `Bearer ${test.token}`)
        .send(test.newCount)

      expect(response.status).toEqual(400)
    })

    it('should return 401 if token invalid', async () => {
      test.newCount = { count: 20 }
      const response = await request(app)
        .put('/api/reset')
        .set('Authorization', `Bearer 123456`)
        .send(test.newCount)

      expect(response.status).toEqual(401)
    })
  })
})
