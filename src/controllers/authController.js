const jwt = require('jsonwebtoken');

const USER = {
  email: 'admin@teste.com',
  senha: '1234'
};

function login(req, res) {
  const { email, senha } = req.body;

  if (email !== USER.email || senha !== USER.senha) {
    return res.status(401).json({ erro: 'Credenciais inválidas' });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
}

module.exports = { login };
