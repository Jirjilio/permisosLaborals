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
      const user= await usuariosModelo.create({
        ...testUserData,
        password: hashedPassword
      })
      console.log("Usuario de prueba creado:", user)
    }
  })
  afterAll(async () => {
    // Eliminar usuario de prueba si existe
    const existingUser = await usuariosModelo.getOne({ usuario: testUserData.usuario })
    if (existingUser) {
      const user= await usuariosModelo.delete({
        usuario: testUserData.usuario
      })
      console.log("Usuario de prueba eliminado:", user)
    }
  })

  it('should login successfully with valid credentials', async () => {
    // Paso 1: enviar petición de login
    // Comentario: este console.log ayuda a comprobar que se envía correctamente
    console.log('[login test] Enviando petición de login para usuario:', testUserData.usuario)
    const response = await request(app)
      .post('/usuarios/login')
      .send({
        usuario: testUserData.usuario,
        password: testUserData.password
      })

    // Paso 2: mostrar respuesta recibida
    console.log('[login test] Status recibido:', response.status)
    console.log('[login test] Body recibido:', response.body)

    // Paso 3: aserciones (cada una precedida de un log para ver cuál falla)
    console.log('[login test] Aserción: status === 200')
    expect(response.status).toBe(200)

    console.log('[login test] Aserción: existe token')
    expect(response.body).toHaveProperty('token')

    console.log('[login test] Aserción: existe user')
    expect(response.body).toHaveProperty('user')

    console.log('[login test] Aserción: existe rol')
    expect(response.body).toHaveProperty('rol')

    console.log('[login test] Aserción: existe id')
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