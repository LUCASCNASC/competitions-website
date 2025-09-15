require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do multer para upload de fotos
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB por foto
  fileFilter: (req, file, cb) => {
    // Aceita apenas imagens
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não suportado.'));
    }
  }
});

// Configuração do banco de dados usando variáveis do .env
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// Teste de conexão ao banco de dados
pool.connect((err, client, release) => {
  if (err) {
    console.error('Erro ao conectar ao PostgreSQL:', err);
  } else {
    console.log('Conectado ao PostgreSQL com sucesso!');
    release();
  }
});

// Rota para buscar todas as competições
app.get('/api/competitions', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name_championship FROM competitions ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar competições.' });
  }
});

// Rota para buscar temporadas de uma competição, trazendo nomes dos campeões e vices
app.get('/api/competitions/:id/seasons', async (req, res) => {
  const id_competition = req.params.id;

  // Ordena por ano da temporada (mais recente primeiro)
  const order = 'DESC';

  try {
    const result = await pool.query(`
      SELECT
        s.id,
        s.name_season_american,
        s.name_season_european,
        t1.name_team AS champion_name,
        t2.name_team AS runner_up_name
      FROM seasons s
      LEFT JOIN teams t1 ON s.id_champion = t1.id
      LEFT JOIN teams t2 ON s.id_runner_up = t2.id
      WHERE s.id_competition = $1
      ORDER BY CAST(s.name_season_american AS INTEGER) ${order}
    `, [id_competition]);

    // Renomeia "runner_up_name" para "runner_top_name" para compatibilidade com main.js
    const rows = result.rows.map(row => ({
      ...row,
      runner_top_name: row.runner_up_name
    }));

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar temporadas da competição.' });
  }
});

// Cadastro de usuário com suporte a foto (multipart/form-data)
app.post('/api/usuarios', upload.single('foto'), async (req, res) => {
  const {
    nome_completo, apelido, data_nascimento, email, genero, cidade, senha
  } = req.body;
  const foto = req.file ? req.file.filename : null;

  // Alinhe os campos obrigatórios conforme o frontend
  if (!nome_completo || !data_nascimento || !email || !genero || !cidade || !senha) {
    return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
  }

  try {
    // Validação de email único
    const checkEmail = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (checkEmail.rows.length > 0) {
      return res.status(400).json({ error: 'E-mail já cadastrado.' });
    }

    // Criptografa a senha antes de salvar
    const senhaHash = await bcrypt.hash(senha, 12);

    await pool.query(`
      INSERT INTO usuarios (
        nome_completo, apelido, data_nascimento, email, genero, cidade,
        senha, foto, criado_em
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
    `, [
      nome_completo,
      apelido || null,
      data_nascimento ? new Date(data_nascimento) : null,
      email,
      genero || null,
      cidade || null,
      senhaHash,
      foto
    ]);

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
  }
});

// Exemplo de rota para listar times
app.get('/api/teams', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name_team, escudo_team FROM teams ORDER BY name_team');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar times.' });
  }
});

// Exemplo de rota para listar países
app.get('/api/countries', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name_country FROM countries ORDER BY name_country');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar países.' });
  }
});

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve arquivos de imagem de uploads caso queira utilizar (opcional)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});