// app.listen(3000)
require("dotenv").config();
// 1. Importamos el modelo
const Server = require('./models/server.js')

// 2. Instanciamos el servidor o la clase
const server = new Server()

// 3. Escuchamos el servidor
server.listen();