import * as Veiculo from '../models/VeiculoModel.js';

export const cadastrar = async (req, res) => {
    try {
        const veiculo = req.body;
        if (!veiculo || Object.keys(veiculo).length === 0) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: 'Dados do veículo não fornecidos'
            });
        }
        if (!veiculo.modelo || !veiculo.ano_fabricacao || !veiculo.ano_modelo || !veiculo.cor || !veiculo.num_portas || !veiculo.categoria_id || !veiculo.montadora_id || !veiculo.tipo_cambio || !veiculo.tipo_direcao) {
            return res.status(400).json({
                success: false,
                status: 400,
                message: 'Dados do veículo incompletos ou inválidos'
            });
        }
        const novoVeiculo = await Veiculo.cadastrar(veiculo);   
        res.status(201).json({
            success: true,
            status: 201,
            message: 'Veículo cadastrado com sucesso',
            veiculoId: novoVeiculo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            message: 'Erro ao cadastrar veículo',
            error: error.message
        });
    }
};

export const consultar = async (req, res) => {
    try {
        const veiculos = await Veiculo.consultar();
        res.status(200).json({
            success: true,
            status: 200,
            veiculos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            message: 'Erro ao consultar veículos',
            error: error.message
        });
    }
};

export const consultarPorId = async (req, res) => {
    try {
        const id = req.params.id;
        const veiculo = await Veiculo.consultarPorId(id);
        res.status(200).json({
            success: true,
            status: 200,
            veiculo
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            status: 404,
            message: 'Veículo não encontrado',
            error: error.message
        });
    }
};

export const alterar = async (req, res) => {
    try {
        let veiculo = req.body;
        veiculo.id = req.params.id;
        const result = await Veiculo.alterar(veiculo);
        res.status(200).json({
            success: true,
            status: 200,
            message: 'Veículo alterado com sucesso',
            result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            message: 'Erro ao alterar veículo',
            error: error.message
        });
    }
};

export const deletar = async (req, res) => {
    try {
        let id = req.params.id;
        const result = await Veiculo.deletar(id);
        res.status(200).json({
            success: true,
            status: 200,
            message: 'Veículo deletado com sucesso',
            result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            message: 'Erro ao deletar veículo',
            error: error.message
        });
    }
};