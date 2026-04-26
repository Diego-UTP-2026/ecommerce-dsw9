// app.js - version Hello World
required('dotenv').config();
const express = require('express');
const app    = express();
const port    = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`
        <h1>Hello World - [DIEGO CÓRDOBA]</h1>
        <p>La aplicacion funciona en Render.</p>
        <p>Puerto: ${port} | Entorno: ${process.env.NODE_ENV || 'development'}</p>
    `);   
});

app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
}); 