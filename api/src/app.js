import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

// Importando as rotas
import veiculoRoute from './routes/veiculoRoute.js';
import usuarioRoute from './routes/usuarioRoute.js';

const app = express();

app.use(cors());
app.use(express.json());

// Root info (mantive o conteúdo original da sua app, apenas corrigi os imports/mounts)

app.get('/', (req, res) => {
    const rootDomain = process.env.ROOT_DOMAIN || `http://localhost:${process.env.PORT || 3000}`;
    return res.json({
        message: 'API LV - ativa',
        endpoints: {
            'POST - Cadastrar usuário': `${rootDomain}/api/usuario/`,
            'POST - Login': `${rootDomain}/api/usuario/login`,
            'GET - Consultar todos os usuários': `${rootDomain}/api/usuario/`
        }
    });
});

// 🔓 Rotas públicas
app.use('/api', usuarioRoute); // rotas de usuário: /api/usuario, /api/usuario/login, etc
app.use('/api', veiculoRoute); // rotas de veículo: /api/veiculo, /api/veiculo/:id, etc


const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log('Sistema inicializado: ', `Acesso: http://localhost:${PORT}`);
});