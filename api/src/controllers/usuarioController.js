import pool from '../database/data.js';
import bcrypt from 'bcryptjs';
import { criar } from '../models/Token.js';

// ==============================
// Cadastrar usuário
// ==============================
export const cadastrar = async (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }

    try {
        const [existente] = await pool.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );
        if (existente.length > 0) {
            return res.status(400).json({ message: "Email já cadastrado" });
        }

        const hashSenha = await bcrypt.hash(senha, 8);
        const [resultado] = await pool.query(
            'INSERT INTO usuarios (nome,email,senha) VALUES (?,?,?)',
            [nome, email, hashSenha]
        );

        res.status(201).json({
            id: resultado.insertId,
            nome,
            email
        });
    } catch (err) {
        res.status(500).json({
            message: "Erro ao cadastrar usuário",
            error: err.message
        });
    }
};

// ==============================
// Login
// ==============================
export const login = async (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ message: "Email e senha são obrigatórios" });

    try {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        const usuario = rows[0];
        if (!usuario) return res.status(400).json({ message: "Usuário não encontrado" });

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) return res.status(401).json({ message: "Senha incorreta" });

        const validade = new Date(Date.now() + 24 * 60 * 60 * 1000); // agora + 24h
        const tokenCriado = await criar(usuario.id, validade);

        if (!tokenCriado || !tokenCriado.hash) {
            // caso improvável: criar não retornou hash
            return res.status(500).json({ message: 'Erro ao gerar token' });
        }

        return res.json({
            usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
            token: tokenCriado.hash
        });
    } catch (err) {
        return res.status(500).json({ message: "Erro ao fazer login", error: err.message });
    }
};

// ==============================
// Listar todos os usuários (rota privada)
// ==============================
export const listar = async (req, res) => {
    try {
        const [usuarios] = await pool.query(
            'SELECT id,nome,email FROM usuarios'
        );
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({
            message: "Erro ao listar usuários",
            error: err.message
        });
    }
};

// ==============================
// Buscar usuário logado (rota privada)
// ==============================
export const buscarUsuarioLogado = async (req, res) => {
    try {
        const [usuario] = await pool.query(
            'SELECT id,nome,email FROM usuarios WHERE id = ?',
            [req.usuario]
        );
        res.json(usuario[0]);
    } catch (err) {
        res.status(500).json({
            message: "Erro ao buscar usuário",
            error: err.message
        });
    }
};
