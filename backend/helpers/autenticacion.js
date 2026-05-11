import dotenv from 'dotenv';
import JsonWebToken from 'jsonwebtoken';

export function generarToken(usuario) {
    return JsonWebToken.sign({usuario},process.env.JWT_TOKEN_SECRET, {expiresIn: '1h'});
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