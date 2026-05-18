import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import app from '../app.js'
import usuariosModelo from '../models/users.js'
import bcrypt from 'bcrypt'
import 'dotenv/config'

const testEmployee = {
  nombre: 'Empleado',
  apellido1: 'Prueba',
  apellido2: 'Usuario',
  email: `empleado+${Date.now()}@example.com`,
  usuario: `empleadoPrueba${Date.now()}`,
  password: 'Password123!',
  rol: 'user'
}

describe('API Users - Obtener empleado concreto', () => {
  beforeAll(async () => {
    const existing = await usuariosModelo.getOne({ usuario: testEmployee.usuario })
    if (!existing) {
      const hashedPassword = await bcrypt.hash(testEmployee.password, 10)
      await usuariosModelo.create({
        ...testEmployee,
        password: hashedPassword
      })
    }
  })

  it('debe obtener un usuario concreto con token válido', async () => {
    const loginResponse = await request(app)
      .post('/usuarios/login')
      .send({
        usuario: testEmployee.usuario,
        password: testEmployee.password
      })

    expect(loginResponse.status).toBe(200)
    expect(loginResponse.body).toHaveProperty('token')
    const token = loginResponse.body.token

    const response = await request(app)
      .get('/usuarios/obtenerusuario')
      .query({ usuario: testEmployee.usuario })
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('usuario', testEmployee.usuario)
    expect(response.body).toHaveProperty('nombre', testEmployee.nombre)
    expect(response.body).toHaveProperty('rol', testEmployee.rol)
    expect(response.body).not.toHaveProperty('password')
  })
})