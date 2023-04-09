import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Apostas from '../Apostas/Apostas';
import App from '../Apostas/teste';
import Login from '../Login/Login';
import CadastroUsuarios from '../Usuarios/Usuarios';

function Rotas() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Apostas />} />
        <Route path="/cadastrousuario" element={<CadastroUsuarios />} />
        <Route path="/cadastroaposta" element={<Apostas/>}/>
       // <Route path="/teste" element={<App/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;






