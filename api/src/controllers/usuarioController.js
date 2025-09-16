import * as Usuario from '../models/Usuario.js';
import * as Token from '../models/Token.js';
import * as View from '../view/index.js';

export const login = async (req, res) => {
    const { email, senha } = req.body;
    try {
        const usuario = await Usuario.login(email, senha);
        if (usuario) {
            const horas_validade = 24;
            const _token = await Token.criar(usuario.id, horas_validade);
            if (_token) {
                let data = [
                    { token: `Bearer ${_token.chave_token}` },
                    { expiracao: _token.validade },
                    { usuario: usuario }
                ];
                return View.result(res, 'GET', data);
            } else {
                throw { mensagem: 'Erro ao gerar token' };
            }
        } else {
            return View.result(res, 'GET', [], 'Credenciais inválidas');
        }
    } catch (error) {
        View.erro(res, { mensagem: 'Erro interno do servidor', error });
    }
};

export const consultarLogado = async (req, res) => {
    try {
        const id = req.loginId;
        const data = await Usuario.consultarPorId(id);
        return View.result(res, 'GET', data);
    } catch (error) {
        View.erro(res, error);
    }
};

export const cadastrar = async (req, res) => {
    try {
        const usuario = req.body;
        const novoUsuario = await Usuario.cadastrar(usuario);
        View.result(res, 'POST', novoUsuario);
    } catch (error) {
        View.erro(res, error);
    }
};

export const alterar = async (req, res) => {
    try {
        let usuario = req.body;
        usuario.id = req.params.id;
        const usuarioAlterado = await Usuario.alterar(usuario);
        return View.result(res, 'PUT', usuarioAlterado);
    } catch (error) {
        View.erro(res, error);
    }
};

export const deletar = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Usuario.deletar(id);
        return View.result(res, 'DELETE', data);
    } catch (error) {
        View.erro(res, error);
    }
};

export const consultar = async (req, res) => {
    try {
        const email = req.query.email;
        const nome = req.query.nome;
        let data = [];
        if (email) {
            data = await Usuario.consultarPorEmail(email);
        } else if (nome) {
            data = await Usuario.consultar(nome);
        } else {
            data = await Usuario.consultar();
        }
        return View.result(res, 'GET', data);
    } catch (error) {
        View.erro(res, error);
    }
};
