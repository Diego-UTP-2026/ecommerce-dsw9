// controllers/userAuthController.js
const { User } = require('../models');
const bcrypt = require('bcrypt'); // Asegúrate de que esté importado al inicio

const showRegister = (req, res) =>
  res.render('user-auth/register', { layout: false, error: null });

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({ name, email, password_hash: password });
    req.session.userId = user.id;
    req.session.user   = { id: user.id, name: user.name };
    res.redirect('/customer/dashboard');
  } catch (err) {
    const msg = err.name === 'SequelizeUniqueConstraintError'
      ? 'Ya existe una cuenta con ese email.'
      : 'Error al crear la cuenta.';
    res.render('user-auth/register', { layout: false, error: msg });
  }
};

const showLogin = (req, res) =>
  res.render('user-auth/login', { layout: false, error: null });

/*const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.validatePassword(password))) {
      return res.render('user-auth/login', { layout: false, error: 'Credenciales incorrectas.' });
    }
    req.session.userId = user.id;
    req.session.user   = { id: user.id, name: user.name };
    const returnTo = req.session.returnTo || '/customer/dashboard';
    delete req.session.returnTo;
    res.redirect(returnTo);
  } catch (err) {
    res.render('user-auth/login', { layout: false, error: 'Error del servidor.' });
  }
};*/

// POST /user/login o /auth/user/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validar que los campos no vengan vacíos
    if (!email || !password) {
      return res.status(400).send("Por favor, rellene todos los campos.");
    }

    // 2. Buscar al usuario comprador en la base de datos de Aiven
    const user = await User.findOne({ where: { email: email.trim() } });
    if (!user) {
      return res.status(401).send("El correo electrónico o la contraseña son incorrectos.");
    }

    // 3. Verificar la contraseña usando la columna password_hash que tienes en MySQL Workbench
    // Nota: Si el temario usa user.password, cámbialo aquí a user.password_hash para que coincida con tu BD
    const validPassword = bcrypt.compareSync(password, user.password_hash || user.password);
    if (!validPassword) {
      return res.status(401).send("El correo electrónico o la contraseña son incorrectos.");
    }

    // 4. Guardar los identificadores exactos en la sesión del servidor Express
    req.session.userId = user.id; // Requerido por el middleware requireUserAuth
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email
    }; // Requerido para pintar el layout global de la UTP

    // 5. Guardar explícitamente la sesión antes de hacer la redirección al Dashboard
    req.session.save((err) => {
      if (err) {
        console.error("Error al guardar la sesión en Express:", err);
        return res.status(500).send("Error interno al procesar la sesión.");
      }
      // Redirección limpia al espacio oficial del cliente del Paso 16
      return res.redirect('/customer/dashboard');
    });

  } catch (error) {
    // Si la base de datos o el código falla, esto evita el "Error Interno del Servidor" genérico
    console.error("ERROR CRÍTICO EN LOGIN DE USUARIO:", error);
    return res.status(500).render('error', { 
      title: 'Error en Autenticación', 
      message: 'Hubo un problema al conectar con el servicio. Detalle: ' + error.message,
      layout: false 
    });
  }
};

const logout = (req, res) => {
  req.session.destroy(() => res.redirect('/user/login'));
};

module.exports = { showRegister, register, showLogin, login, logout };