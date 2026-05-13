import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import usuariosModelo from '../models/users.js'
import bcrypt from 'bcrypt'
import 'dotenv/config'

const testUserData = {
  nombre: 'Test',
  apellido1: 'User',
  apellido2: 'Apellido',
  email: 'test',
  usuario: 'testuser',
  password: 'testpassword',
  rol: 'user'
}

describe('API Users - Get All', () => {
  beforeAll(async () => {
    console.log('Iniciando beforeAll: Verificando/creando usuario de prueba')
    // Crear usuario de prueba si no existe
    const existingUser = await usuariosModelo.getOne({ usuario: testUserData.usuario })
    console.log('Usuario existente:', existingUser ? 'Sí' : 'No')
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(testUserData.password, 10)
      const createdUser = await usuariosModelo.create({
        ...testUserData,
        password: hashedPassword
      })
      console.log('Usuario creado:', createdUser ? 'Éxito' : 'Fallo')
    } else {
      console.log('Usuario ya existe, no se crea')
    }
    console.log('Fin beforeAll')
  })

  it('should get all users with valid token', async () => {
    console.log('Iniciando test: Login para obtener token')
    // Primero hacer login para obtener token
    const loginResponse = await request(app)
      .post('/usuarios/login')
      .send({
        usuario: testUserData.usuario,
        password: testUserData.password
      })
    console.log('Login status:', loginResponse.status)
    console.log('Login body:', loginResponse.body)
    expect(loginResponse.status).toBe(200)
    const token = loginResponse.body.token
    console.log('Token obtenido:', token ? 'Sí' : 'No (undefined)')

    console.log('Haciendo petición GET /usuarios/todosusuarios')
    // Luego obtener todos los usuarios
    const response = await request(app)
      .get('/usuarios/todosusuarios')
      .set('Authorization', `Bearer ${token}`)

    console.log('GET Status:', response.status)
    console.log('GET Body:', response.body)

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body.data)).toBe(true)
    expect(response.body.data.length).toBeGreaterThan(0)

    // Verificar que incluye el usuario de prueba sin contraseña
    const user = response.body.data.find(u => u.usuario === testUserData.usuario)
    console.log('Usuario encontrado en data:', user ? 'Sí' : 'No')
    expect(user).toBeDefined()
    expect(user).toHaveProperty('nombre', testUserData.nombre)
    expect(user).toHaveProperty('usuario', testUserData.usuario)
    expect(user).toHaveProperty('rol', testUserData.rol)
    expect(user).not.toHaveProperty('password')
    console.log('Test completado exitosamente')
  })
})