import pool from '../database/data.js';
import crypto from 'crypto';

/**
 * Tenta executar a procedure token_consultar; se não existir, faz SELECT direto.
 * Retorna uma linha (obj) ou undefined.
 */
export const consultar = async (token) => {
    let cx;
    try {
        cx = await pool.getConnection();
        // tenta procedure primeiro
        try {
            const [dados] = await cx.query('CALL token_consultar(?)', [token]);
            // quando CALL retorna, dados[0][0] costuma ser a linha
            const row = dados?.[0]?.[0];
            if (row) return row;
        } catch (procErr) {
            // fallback: procedure não existe ou erro -> SELECT direto
            // console.warn('token_consultar proc erro, fallback SELECT', procErr.message);
            const [rows] = await cx.query('SELECT * FROM tokens WHERE token = ? LIMIT 1', [token]);
            return rows[0];
        }
    } catch (error) {
        throw error;
    } finally {
        if (cx) cx.release();
    }
};

/**
 * Cria token: tenta CALL token_criar, se não existir faz INSERT direto.
 * Retorna { hash }
 */
export const criar = async (usuario, validade) => {
    let cx;
    try {
        const hashToken = crypto.randomBytes(32).toString('hex');
        cx = await pool.getConnection();

        // tenta usar procedure (se existir)
        try {
            const [dados] = await cx.query('CALL token_criar(?,?,?)', [usuario, validade, hashToken]);
            // se procedure retornar um SELECT com hash, pega-o
            const resultado = dados?.[0]?.[0];
            if (resultado && (resultado.hash || resultado.token)) {
                return { hash: resultado.hash || resultado.token };
            }
            // se não retornou, ainda podemos retornar nosso hash (assumindo procedure inseriu)
            return { hash: hashToken };
        } catch (procErr) {
            // fallback: INSERT direto na tabela tokens
            await cx.query('INSERT INTO tokens (usuario, validade, token) VALUES (?,?,?)', [usuario, validade, hashToken]);
            return { hash: hashToken };
        }
    } catch (error) {
        throw error;
    } finally {
        if (cx) cx.release();
    }
};

/**
 * Extende validade - tenta procedure token_extender, senão UPDATE direto.
 */
export const extender = async (usuario, tempo_horas) => {
    let cx;
    try {
        cx = await pool.getConnection();
        try {
            const [dados] = await cx.query('CALL token_extender(?,?)', [usuario, tempo_horas]);
            // se procedure devolver affectedRows no resultado
            if (dados && dados.affectedRows !== undefined) return dados.affectedRows > 0;
            // ou fallback: se procedure retornou arrays, tente interpretar
            return true;
        } catch (procErr) {
            const [res] = await cx.query('UPDATE tokens SET validade = DATE_ADD(validade, INTERVAL ? HOUR) WHERE usuario = ?', [tempo_horas, usuario]);
            return res.affectedRows > 0;
        }
    } catch (error) {
        throw error;
    } finally {
        if (cx) cx.release();
    }
};

/**
 * Middleware de autenticação: extrai Bearer <token>, consulta e valida validade.
 * Define req.usuario = id do usuário (numero).
 */
export const middlewareAutenticacao = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Token não fornecido' });

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Header Authorization malformado' });
    }
    const token = parts[1];

    try {
        const resultado = await consultar(token);
        if (!resultado) return res.status(401).json({ message: 'Token inválido' });

        // determine o campo do usuário (compatível com procedure que retorne usuario, usuario_id, etc.)
        const userId =
            resultado.usuario ??
            resultado.usuario_id ??
            resultado.usuarioId ??
            resultado.user_id ??
            resultado.userId ??
            resultado.usuarioId;

        // checar validade (quando usando SELECT direto, a coluna chama validade)
        const validade = resultado.validade ?? resultado.expire ?? resultado.valid_until;
        if (validade && new Date(validade) < new Date()) {
            return res.status(401).json({ message: 'Token expirado' });
        }

        req.usuario = userId || resultado.usuario || null;
        next();
    } catch (err) {
        return res.status(500).json({ message: 'Erro ao validar token', error: err.message });
    }
};
