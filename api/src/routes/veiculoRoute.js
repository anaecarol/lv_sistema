import express from 'express';
import * as veiculo from '../controllers/veiculoController.js';

const router = express.Router();

router.get('/veiculo/:id', veiculo.consultarPorId);
router.get('/veiculos',veiculo.consultar);
router.post('/veiculo',veiculo.cadastrar);
router.delete('/veiculo',veiculo.deletar);
router.put('/veiculo',veiculo.alterar);



export default router;