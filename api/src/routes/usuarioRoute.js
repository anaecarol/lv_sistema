import express from 'express';
import * as UsuarioController from '../controllers/usuarioController.js';
import { middlewareAutenticacao } from '../models/Token.js';

const router = express.Router();

// 🔓 rotas públicas
router.post('/usuario', UsuarioController.cadastrar);
router.post('/usuario/login', UsuarioController.login);

// 🔒 rotas privadas
router.get('/usuario/usuarios', middlewareAutenticacao, UsuarioController.listar);
router.get('/usuario/usuario', middlewareAutenticacao, UsuarioController.buscarUsuarioLogado);

export default router;
