import JsonWebToken from 'jsonwebtoken';
import UsuarioModelo from '../models/users.js';

const JWT_SECRET = process.env.JWT_TOKEN_SECRET || 'dev-secret-change-me';

export function generarToken(payload) {
    return JsonWebToken.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

export function verificarToken(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    //console.log("Token recibido:", token);

    if (!token) {
        return res.status(401).send({error: 'Token no proporcionado'});
    }
    
    try {
        const dataToken = JsonWebToken.verify(token, JWT_SECRET);
        console.log("Token verificado:", token);
        console.log(dataToken.email);
        req.emailConectado = dataToken.email;
        req.usuarioConectadoId = dataToken.id;
        req.rolConectado = dataToken.rol;
        next();
    } catch (error) {
        res.status(401).send({error: 'Token no válido'});    
    }
    
}

export async function verificarAdmin(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send({error: 'Token no proporcionado'});
    }

    try {
        const dataToken = JsonWebToken.verify(token, JWT_SECRET);
        const usuario = await UsuarioModelo.getOne({ email: dataToken.email });

        if (!usuario) {
            return res.status(401).send({error: 'Usuario no válido'});
        }

        if (usuario.rol !== 'admin') {
            return res.status(403).send({error: 'No autorizado'});
        }

        req.emailConectado = dataToken.email;
        req.usuarioConectado = usuario;
        next();
    } catch (error) {
        res.status(401).send({error: 'Token no válido'});
    }
}