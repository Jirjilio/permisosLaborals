import JsonWebToken from 'jsonwebtoken';
import UsuarioModelo from '../models/users.js';

export function generarToken(email) {
    return JsonWebToken.sign({email},process.env.JWT_TOKEN_SECRET, {expiresIn: '1h'});
}

export function verificarToken(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    //console.log("Token recibido:", token);

    if (!token) {
        return res.status(401).send({error: 'Token no proporcionado'});
    }
    
    try {
        const dataToken = JsonWebToken.verify(token, process.env.JWT_TOKEN_SECRET);
        console.log("Token verificado:", token);
        console.log(dataToken.email);
        req.emailConectado = dataToken.email;
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
        const dataToken = JsonWebToken.verify(token, process.env.JWT_TOKEN_SECRET);
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