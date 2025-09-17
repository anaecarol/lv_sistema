import pool from '../database/data.js';
import bcrypt from 'bcryptjs';
import { criar } from '../models/Token.js';

// Cadastrar usuário
export const cadastrar = async (req, res) => {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) return res.status(400).json({ message: "Todos os campos são obrigatórios" });

    try {
        const [existente] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (existente.length > 0) return res.status(400).json({ message: "Email já cadastrado" });

        const hashSenha = await bcrypt.hash(senha, 8);
        const [resultado] = await pool.query('INSERT INTO usuarios (nome,email,senha) VALUES (?,?,?)', [nome, email, hashSenha]);

        res.status(201).json({ id: resultado.insertId, nome, email });
    } catch (err) {
        res.status(500).json({ message: "Erro ao cadastrar usuário", error: err.message });
    }
};

// Login
export const login = async (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ message: "Email e senha são obrigatórios" });

    try {
        const [usuario] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (!usuario[0]) return res.status(400).json({ message: "Usuário não encontrado" });

        const senhaValida = await bcrypt.compare(senha, usuario[0].senha);
        if (!senhaValida) return res.status(401).json({ message: "Senha incorreta" });

        // Cria token válido por 24h
        const tokenCriado = await criar(usuario[0].id, 24);
        res.json({ usuario: { id: usuario[0].id, nome: usuario[0].nome, email }, token: tokenCriado.hash });
    } catch (err) {
        res.status(500).json({ message: "Erro ao fazer login", error: err.message });
    }
};

// Listar todos os usuários (rota privada)
export const listar = async (req, res) => {
    try {
        const [usuarios] = await pool.query('SELECT id,nome,email FROM usuarios');
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ message: "Erro ao listar usuários", error: err.message });
    }
};

// Buscar usuário logado (rota privada)
export const buscarUsuarioLogado = async (req, res) => {
    try {
        const [usuario] = await pool.query('SELECT id,nome,email FROM usuarios WHERE id = ?', [req.usuario]);
        res.json(usuario[0]);
    } catch (err) {
        res.status(500).json({ message: "Erro ao buscar usuário", error: err.message });
    }
};
