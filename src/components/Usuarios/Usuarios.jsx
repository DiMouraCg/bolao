import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import './Usuarios.css';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('Adm');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Nome:', nome);
    console.log('Email:', email);
    console.log('Senha:', senha);
    console.log('Tipo de Usuário:', tipoUsuario);
  };

  return (
    <div className="container mt-3">
      <h2>Cadastro de Usuário</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formNome">
          <Form.Label>Nome</Form.Label>
          <Form.Control type="text" placeholder="Digite o nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formEmail">
          <Form.Label>E-mail</Form.Label>
          <Form.Control type="email" placeholder="Digite o e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formSenha">
          <Form.Label>Senha</Form.Label>
          <Form.Control type="password" placeholder="Digite a senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formTipoUsuario">
          <Form.Label>Tipo de Usuário</Form.Label>
          <Form.Control as="select" value={tipoUsuario} onChange={(e) => setTipoUsuario(e.target.value)}>
            <option value="Adm">Administrador</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Vendedor">Vendedor</option>
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit" className='btn-enviar'>
          Cadastrar
        </Button>
      </Form>
    </div>
  );
}

export default Cadastro;
