import express from 'express';
import * as UsuarioController from '../controllers/usuario.js';
import { middlewareAutenticacao } from '../controllers/token.js';

const router = express.Router();

// 🔓 públicas
router.post('/login', UsuarioController.login);
router.post('/cadastrar', UsuarioController.cadastrar);

// 🔒 privadas
router.get('/logado', middlewareAutenticacao, UsuarioController.consultarLogado);
router.get('/:id', middlewareAutenticacao, UsuarioController.consultarPorId);
router.put('/:id', middlewareAutenticacao, UsuarioController.alterar);
router.delete('/:id', middlewareAutenticacao, UsuarioController.deletar);
router.get('/', middlewareAutenticacao, UsuarioController.consultar);

export default router;
