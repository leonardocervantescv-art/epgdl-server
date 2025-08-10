import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PaginaInicio from './paginas/PaginaInicio'; // PAGINA DEL INDEX
import AdminAside from './componentes/AdminAside'; //ADMINISTRADOR DE LOS HORARIOS Y DIPLOMADOS / POSGRADOS
import AdminPanel from './componentes/AdminPanel'; //ADMINISTRADOR DE SECCIONES MENUS Y SUBMENUS
import AdminProgramas from './componentes/AdminProgramas'; //ADMINISTRADOR DE PROGRAMAS
import RuteadorDinamico from './componentes/RuteadorDunamico'; //CARGA  LAS RUTAS DE FORMA DINAMICA, IMPORTANTE
import AdminInicioPanel from './componentes/AdminInicioPanel'; //ADMINISTRADOR DEL INDEX
import AdminBanner from './componentes/AdminBanner'; //ADMINISTRADOR DEL CONTENIDO DE LAS PAGINAS (BANNERS Y TEXTO)
//import PaginaGenerica from './paginas/PaginaGenerica';
//import PaginaProgramas from './paginas/PaginaProgramas';
//import PaginaDetallePrograma from './paginas/PaginaDetallePrograma';
import AdminDetallesProgram from './componentes/AdminDetallesProgram'; //ADMINISTRADOR DEL CONTENIDO DE LOS PROGRAMAS (BANNER, TEXTO Y MODULOS)
import AdminMenu from './componentes/AdminMenu'; //MENÚ DE TODOS LOS ADMINISTRADORES
import Login from './componentes/Login'; //LOGIN PARA ENTRAR AL MENÚ DE LOS ADMINISTRADORES
import RegistrarUsuario from './componentes/RegistrarUsuario'; //SOLO HABILITADA A LOS ADMINISTRADORES PARA DAR ACCESOS DE ADMINISTRACION
import AdminFooter from './componentes/AdminFooter'; //ADMINISTRADOR DEL FOOTER
import FormularioContacto from './componentes/FormularioContacto'; //FORMULARIO DEL INDEX
import RutaProtegida from './componentes/RutaProtegida'; //AUTENTICACION DE RUTAS PARA EL LO0GIN
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';  //  ESTILOS DEL INDEX Y EL HEADER
import './estilo.css'; // ESTILOS DEL ASIDE 
import './edit.css'; //   ESTILOS DEL MENU TIP TAP 
import './program.css';  // ESTILOS DE LA PLANTILLA DE PROGRAMAS
import './adminMenu.css';  // ESTILOS DEL PANEL DE ADMINISTRACIÓN
import './styleInicio.css';  // ESTILOS DE IMAGENES DE CIRCULOS, PENDEINTE REVISAR 
import './styleForm.css'; // ESTILOS DEL FORMULARIO
import './stylePaginaGenerica.css'


import { useState } from 'react';

function App() {
  const [usuario, setUsuario] = useState(null);
  return (
    <Router>
      <Routes>
        <Route path='/'element={<PaginaInicio /> } />
        <Route path="/login" element={<Login setUsuario={setUsuario} />} /> {/* Inicio de Sesión  */}

        <Route path="/:seccion/:slug" element={<RuteadorDinamico />} /> {/*AQUI SE CARGAM TOOODAS LAS RUTAS INCLUIDO ENTERATE O EVENTOS */}

        
        <Route path="/login/admin" element={ <RutaProtegida> <AdminMenu /> </RutaProtegida>} />    {/* INTERFAZ DE LOS ADMINITRADORES */}
        <Route path="/admin/secciones" element={ <RutaProtegida> <AdminPanel /> </RutaProtegida>} />    {/* ADMINISTRADOR DE SECCIONES DEL HEADER  */}
        <Route path="/admin/contenido" element={ <RutaProtegida> <AdminBanner /> </RutaProtegida>} />   { /* ADMINISTRADOR DE LAS PÁGINAS DE CONÓCENOS  */}
        <Route path="/admin/aside" element={ <RutaProtegida> <AdminAside /> </RutaProtegida>} />         { /* ADMINISTRADOR DE LAS FECHAS Y LOS EVENTOS */}
        <Route path="/admin/programas" element={ <RutaProtegida> <AdminProgramas /> </RutaProtegida>} /> { /* ADMINISTRADOR DE PROGRAMAS  */}
        <Route path="/admin/detalles-programas" element={ <RutaProtegida> <AdminDetallesProgram /> </RutaProtegida>} />  { /* ADMINISTRADOR DE CONTENIDO DE PROGRAMAS   */}
        <Route path="/admin/registrar"  element={ <RutaProtegida> <RegistrarUsuario /> </RutaProtegida>}  />   { /* COMPONENTE DE AGREGAR USUARIO */}
        <Route path="/admin/inicio-admin" element={ <RutaProtegida> <AdminInicioPanel /> </RutaProtegida>} />   { /* ADMINISTRADOR DEL INDEX */}
        <Route path="/admin-footer" element={ <RutaProtegida> <AdminFooter /> </RutaProtegida>} />  { /*ADMINISTRADOR DEL FOOTER  */}
        <Route path="/formulario" element={ <RutaProtegida> <FormularioContacto /> </RutaProtegida>} />  { /*ADMINISTRADOR DEL FOOTER  */}
        
      </Routes>
    </Router>
  );
}

export default App;

 




//             //          /////
//             //        //     //
//             //      //        //
//             //     //          //
//             //     //          //
// //////////////     //          //
//             //     //          //
//             //     //          //
//             //     //          //
//             //     //          //
//             //      //         // 
//             //        /////////
// REVISAR ADMINBANNER ES POSIBLE QUE CON LOS NUEVOS CONTROLADORES SE TENGA QUE CAMBIAR BUSCAR EN CHAT EL  CODIGO DE ADMINBANNER

// https://prismic.io/blog/css-hover-effects PARA HOVERS DISEÑOS  16. Social media icons hover effect    PARA EL HEADER

///// PENDIENTE CHECAR LA TABLA QUE SE ELIMINÓ 