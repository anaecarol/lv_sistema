import pool from '../database/data.js';
import bcrypt from 'bcryptjs';

// Consultar token no banco
export const consultar = async (token) => {
    let cx;
    try {
        cx = await pool.getConnection();
        const cmdSql = 'CALL token_consultar(?)';
        const [dados] = await cx.query(cmdSql, [token]);
        return dados[0][0];
    } catch (error) {
        throw error;
    } finally {
        if (cx) cx.release();
    }
};

// Criar token no banco
export const criar = async (usuario, validade, chave_token = new Date()) => {
    let cx;
    try {
        const hashToken = await bcrypt.hash(chave_token.toString(), 1);
        const cmdSql = 'CALL token_criar(?,?,?);';
        cx = await pool.getConnection();
        const [dados] = await cx.query(cmdSql, [usuario, validade, hashToken]);
        return dados[0][0] || false;
    } catch (error) {
        throw error;
    } finally {
        if (cx) cx.release();
    }
};

// Extender token
export const extender = async (usuario, tempo_horas) => {
    let cx;
    try {
        const cmdSql = 'CALL token_extender(?,?)';
        cx = await pool.getConnection();
        const [dados] = await cx.query(cmdSql, [usuario, tempo_horas]);
        return dados.affectedRows > 0;
    } catch (error) {
        throw error;
    } finally {
        if (cx) cx.release();
    }
};

// Middleware de autenticação
export const middlewareAutenticacao = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Token não fornecido" });

    const token = authHeader.split(" ")[1];

    try {
        const resultado = await consultar(token);
        if (!resultado) return res.status(401).json({ message: "Token inválido" });

        req.usuario = resultado.usuario; // ou como seu banco retorna
        next();
    } catch (err) {
        return res.status(500).json({ message: "Erro ao validar token", error: err.message });
    }
};
