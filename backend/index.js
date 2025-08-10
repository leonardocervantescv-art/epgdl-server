const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

const seccionesRoutes = require('./routes/secciones.routes');
const asideRoutes = require('./routes/aside.routes');
const contenidoRoutes = require('./routes/contenido.routes');
const bannerRoutes = require('./routes/banner.routes');
const programasRoutes = require('./routes/programas.routes');
const authRoutes = require('./routes/auth.routes');
const inicioRoutes = require('./routes/inicio.routes'); 
const inicioImagenesRoutes = require('./routes/inicioImagenes.routes');  
const inicioBannersRoutes = require('./routes/inicioBanners.routes');
const bloquesRoutes = require('./routes/bloques.routes')
const footer = require('./routes/footer.routes')
const formularioRoutes = require('./routes/formulario.routes');
const headerRoutes = require('./routes/header.routes');
const adminRoutes = require('./routes/admin.routes');

app.use(cors());
app.use(express.json());       
app.use('/api/auth', authRoutes);
app.use('/api/secciones', seccionesRoutes);
app.use('/api/aside', asideRoutes);
app.use('/api/contenido', contenidoRoutes);
app.use('/api/banner', bannerRoutes);
app.use('/api/programas', programasRoutes);
app.use('/api/bloques', bloquesRoutes);
app.use('/api/inicio', inicioRoutes); 
app.use('/api/inicio-imagenes', inicioImagenesRoutes);
app.use('/api/inicio-banners', inicioBannersRoutes);
app.use('/api/footer', footer);
app.use('/api/formulario', formularioRoutes);
app.use('/api/header', headerRoutes);
app.use('/api/admin', adminRoutes);


app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));    


app.listen(3001, () => {
    console.log('Servidor backend corriendo en puerto 3001');
});