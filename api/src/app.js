import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

// Importando as rotas
import veiculoRoute from './routes/veiculoRoute.js';
import usuarioRoute from './routes/usuario.js';

const app = express();

app.use(cors());
app.use(express.json());


// 🔓 Rotas públicas
app.get('/', (req, res) => {
    const rootDomain = req.protocol + '://' + req.get('host');
    res.status(200).json({     
        status_server: 'ok',
        dominio_raiz : rootDomain,
        atualização: '14/09/2024 - 18:42',
        rotas: {
            // Veículos
            'GET - Consultar veículo': `${rootDomain}/api/veiculo`,
            'GET - Consultar todos os veículos': `${rootDomain}/api/veiculos`,
            'POST - Cadastrar veículo': `${rootDomain}/api/veiculo`,
            'PUT - Alterar veículos': `${rootDomain}/api/veiculo`,
            'DELETE - Deletar veículos': `${rootDomain}/api/veiculo`,

            // Usuário públicas
            'POST - Login usuário': `${rootDomain}/api/usuario/login`,
            'POST - Cadastrar usuário': `${rootDomain}/api/usuario/cadastrar`,

            // Usuário privadas
            'GET - Usuário logado': `${rootDomain}/api/usuario/logado`,
            'GET - Consultar usuário por ID': `${rootDomain}/api/usuario/:id`,
            'PUT - Alterar usuário': `${rootDomain}/api/usuario/:id`,
            'DELETE - Deletar usuário': `${rootDomain}/api/usuario/:id`,
            'GET - Consultar todos os usuários': `${rootDomain}/api/usuario/`
        }
    });
});

// 🔓 Rotas públicas
app.use('/api/usuario', usuarioRoute); // login e cadastrar são públicas, o resto está protegido pelo middleware
app.use('/api/veiculo', veiculoRoute); // você pode separar públicas e privadas dentro de veiculoRoute


const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log('Sistema inicializado: ', `Acesso: http://localhost:${PORT}`);
});
