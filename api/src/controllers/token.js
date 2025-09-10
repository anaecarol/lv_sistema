import * as Token from '../models/Token.js';

// Sessões em memória
let sessions = [];

// Middleware de autenticação
export const middlewareAutenticacao = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers['authorization'];
        if (!authorizationHeader) {
            return res.status(498).json({
                success: false,
                quant: 0,
                data: [],
                status: 498,
                erro: 'Token de autenticação não fornecido'
            });
        }

        const [bearer, token] = authorizationHeader.split(' ');
        if (bearer !== 'Bearer' || !token) {
            return res.status(498).json({
                success: false,
                quant: 0,
                data: [],
                status: 498,
                erro: 'Formato de token inválido'
            });
        }

        const [loginId] = token.split('.');
        let sessionIndex = sessions.findIndex(session => session.usuario == loginId);
        let session_id = sessions[sessionIndex];
        let horaAtual = new Date();

        if (session_id) {
            let fimTemp = new Date(horaAtual.getTime() + 3600000);
            if (session_id.validade < fimTemp) {
                sessions.splice(sessionIndex, 1);
                session_id = null;
            }
        }

        if (!session_id) {
            session_id = await Token.consultar(token);
            if (session_id) {
                if (session_id.validade > new Date()) {
                    let tempoParaExpirar = (session_id.validade.getTime() - horaAtual.getTime()) / 60000;
                    if (tempoParaExpirar < 60) {
                        let horas_extra_token = 24;
                        await Token.extender(loginId, horas_extra_token);
                    } else {
                        sessions.push(session_id);
                    }
                } else {
                    return res.status(498).json({
                        success: false,
                        quant: 0,
                        data: [],
                        status: 498,
                        erro: 'Token de autenticação expirou'
                    });
                }
            }
        }

        if (session_id) {
            req.loginId = loginId;
            next();
        } else {
            return res.status(498).json({
                success: false,
                quant: 0,
                data: [],
                status: 498,
                erro: 'Token de autenticação inválido'
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            quant: 0,
            data: [],
            status: 500,
            erro: 'Erro interno do servidor: ' + error
        });
    }
};
