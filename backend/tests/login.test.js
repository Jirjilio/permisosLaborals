import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import usuariosModelo from '../models/users.js'
import bcrypt from 'bcrypt'

const testUserData = {
  nombre: 'Test',
  apellido1: 'User',
  apellido2: 'Apellido',
  email: 'test@example.com',
  usuario: 'testuser',
  password: 'testpassword',
  rol: 'user'
}

describe('API Login', () => {
  beforeAll(async () => {
    // Crear usuario de prueba si no existe
    const existingUser = await usuariosModelo.getOne({ usuario: testUserData.usuario })
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(testUserData.password, 10)
      await usuariosModelo.create({
        ...testUserData,
        password: hashedPassword
      })
    }
  })

  it('should login successfully with valid credentials', async () => {
    const response = await request(app)
      .post('/usuarios/login')
      .send({
        usuario: testUserData.usuario,
        password: testUserData.password
      })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('token')
    expect(response.body).toHaveProperty('user')
    expect(response.body).toHaveProperty('rol')
    expect(response.body).toHaveProperty('id')
  })

  it('should return error for invalid credentials', async () => {
    const response = await request(app)
      .post('/usuarios/login')
      .send({
        usuario: testUserData.usuario,
        password: 'wrongpassword'
      })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('error')
  })

  it('should return error for non-existent user', async () => {
    const response = await request(app)
      .post('/usuarios/login')
      .send({
        usuario: 'nonexistent',
        password: 'password'
      })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('error', 'El usuario no existe')
  })
})