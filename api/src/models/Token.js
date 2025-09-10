import pool from '../database/data.js';
import bcrypt from 'bcryptjs';

export const consultar = async (token) => {
    let cx;
    try {
        cx = await pool.getConnection();
        const cmdSql = 'CALL token_consultar(?)';
        const [dados] = await cx.query(cmdSql, token);
        return dados[0][0];
    } catch (error) {
        throw error;
    } finally {
        if (cx) cx.release();
    }
};

export const criar = async (usuario, validade, chave_token = new Date()) => {
    let cx;
    try {
        const hashToken = await bcrypt.hash(chave_token.toString(), 1);
        const cmdSql = 'CALL token_criar(?,?,?);';
        cx = await pool.getConnection();
        const [dados] = await cx.query(cmdSql, [usuario, validade, hashToken]);
        if (dados[0][0]) {
            return dados[0][0];
        }
        return false;
    } catch (error) {
        throw error;
    } finally {
        if (cx) cx.release();
    }
};

export const extender = async (usuario, tempo_horas) => {
    let cx;
    try {
        const cmdSql = 'CALL token_extender(?,?);';
        cx = await pool.getConnection();
        const [dados] = await cx.query(cmdSql, [usuario, tempo_horas]);
        return dados.affectedRows > 0;
    } catch (error) {
        throw error;
    } finally {
        if (cx) cx.release();
    }
};
