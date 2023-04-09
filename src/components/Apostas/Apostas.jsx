import React, { useState } from "react";
import { Button, FormGroup, Input, Label } from "reactstrap";
import { Form } from 'react-bootstrap';
import Swal from 'sweetalert2'
import './Apostas.css';
import axios from "axios";




//const numerosDisponiveis = Array.from({ length: 60 }, (_, i) => i + 1);

const Apostas = () => {
  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [telefone, setTelefone] = useState("");
  const [id, setId] = useState("");
  const [dataAposta, setDataAposta] = useState(new Date);
  const [idVendedor, setIdVendedor] = useState(1);
  const [numBolao, setNumBolao] = useState(1);
  const [numerosSelecionados, setNumerosSelecionados] = useState([]);
  const [formValidado, setFormValidado] = useState(false);
  const [apostas, setApostas] = useState([]);
  const [novaAposta, setNovaAposta] = useState(false);
  
  const generateRandomString = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 15; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setNovaAposta(true)
    return setId(result) ;
  };

  // Função para lidar com a seleção de um número
  const handleNumeroClick = (numero) => {
    if (numerosSelecionados.includes(numero)) {
      setNumerosSelecionados(numerosSelecionados.filter((n) => n !== numero));
    } else if (numerosSelecionados.length < 10) {
      setNumerosSelecionados([...numerosSelecionados, numero]);
    }
  };
  
  
  const validarCampos = () => {
    // Verificar se todos os campos estão preenchidos
    if (!nome || !cidade || !telefone) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Preencha todos os campos!',
       
      })
      
      return false;
    }
  
    // Verificar se foram selecionadas 10 dezenas
    if (numerosSelecionados.length !== 10) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Selecione as 10 dezenas!',
       
      })
      return false;
    }
  
    // Se chegou até aqui, significa que todos os campos estão válidos
    return true;
  };

  // Função para lidar com a submissão do formulário
  const handleFormSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (validarCampos()){
         
      const novaAposta = {
        id: id,
        nome,
        cidade,
        telefone,
        numeros: numerosSelecionados.sort(),
        numBolao,
        idVendedor,
        dataAposta,
      };
      setApostas([...apostas, novaAposta]);
      setNumerosSelecionados([]);
      setFormValidado(true);
              
    }
   
  };

  // Função para lidar com a remoção de uma aposta da lista
  const handleRemoverAposta = (index) => {
    const novasApostas = [...apostas];
    novasApostas.splice(index, 1);
    setApostas(novasApostas);
  };

  // Função para lidar com a mudança no input de nome
  const handleNomeChange = (event) => {
    setNome(event.target.value);
  };

  // Função para lidar com a mudança no input de cidade
  const handleCidadeChange = (event) => {
    setCidade(event.target.value);
  };

  // Função para lidar com a mudança no input de telefone
  const handletelefoneChange = (event) => {
    setTelefone(event.target.value);
  };

  
  // Função para finalizar as apostas e enviar para o banco de dados
  const handleFinalizarApostasClick = () => {
    if (apostas.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Faça pelo menos 1 aposta!',
      })
      return;
    }
  
    axios.post('http://localhost:4000/api/apostas', { apostas })
      .then(response => {
        
        console.log(response.data.message);
        setFormValidado(false);
        setId("");
        setNome("");
        setCidade("");
        setTelefone("");
        setNumerosSelecionados([]);
        setNovaAposta(false);
        setApostas([]);
        Swal.fire({
          icon: 'success',
          title: 'Tudo Ok!!',
          text: 'Sua aposta foi cadastrada!',
          showConfirmButton: false,
          timer: 1500,
          
        })
        
        window.open('http://localhost:4000/api/ticket/'+id, '_blank');
        axios.get('http://localhost:4000/api/image');
         
      })
     
        .catch(error => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text:'Ocorreu um erro ao cadastrar sua aposta. Tente novamente mais tarde.',
        })
      });
  }
    


  const renderNumeros = () => {
    const numeros = [];
    for (let i = 1; i <= 60; i++) {
      const numero = i.toString().padStart(2, "0");
      numeros.push(
      <button
      key={numero}
      type="button"
      className={numerosSelecionados.includes(numero) ? 'btn btn-success me-2 mb-2' : 'btn btn-outline-success me-2 mb-2'}
      onClick={() => handleNumeroClick(numero)}
>
     {numero}
    </button>
      );
    }
    return numeros;
  };
  
  const gerarDezenasAleatorias = () => {
    const numerosAleatorios = [];
    while (numerosAleatorios.length < 10) {
      const numeroAleatorio = Math.floor(Math.random() * 60) + 1;
      if (!numerosAleatorios.includes(numeroAleatorio)) {
        numerosAleatorios.push(numeroAleatorio);
      }
    }
    setNumerosSelecionados(numerosAleatorios.map(num => num.toString().padStart(2, "0")));
  
  };
 

// Função para renderizar a lista de apostas
const renderApostas = () => {
  return <table className="table table-hover lista-apostas">
      <thead>
      <tr>
        <th scope="col">Apostador</th>
        <th scope="col">Cidade</th>
        <th scope="col">Telefone</th>
        <th scope="col">Dezenas</th>
        <th scope="col"></th>
    </tr>
  </thead>
  <tbody>{apostas.map((aposta, index) => (
       // <td> key={aposta.id}</td>
       <tr> 
       <td>{aposta.nome}</td>
       <td>{aposta.cidade}</td>
       <td>{aposta.telefone}</td>
       <td className="icone-numeros">{aposta.numeros.join(' ')}</td>
       <td>
        <i onClick={() => handleRemoverAposta(index)} className="fa-solid fa-trash-can"></i>
        </td>
       </tr>    
      ))}        
  </tbody>
  </table>   
};

  // Retorno do componente com os inputs e botões
  return (
    <div className="container-fluid" >
      <h1>Cadastro de Apostas</h1>
      <div className="btn-inicio">
      <Button type="submit" color="primary" onClick={generateRandomString}>
        Nova Aposta
      </Button>
    </div>
      
     
  <Form noValidate validated={formValidado} onSubmit={handleFormSubmit}>
    <Form.Group controlId="nome">
    <Form.Label>Nome do Apostador</Form.Label>
    <Form.Control
     required 
     type="text" 
     placeholder="Digite o nome do apostador" 
     value={nome}
     onChange={handleNomeChange}
     disabled={!novaAposta} />
    <Form.Control.Feedback type="invalid">Por favor, digite o nome do apostador.</Form.Control.Feedback>
  </Form.Group>
  <div className="cidade-telefone">
  <Form.Group controlId="cidade">
    <Form.Label>Cidade</Form.Label>
    <Form.Control required 
    type="text" 
    placeholder="Digite a cidade" 
    value={cidade} 
    onChange={handleCidadeChange}
    disabled={!novaAposta} />
    <Form.Control.Feedback type="invalid">Por favor, digite a cidade do apostador.</Form.Control.Feedback>
  </Form.Group>
  <Form.Group controlId="telefone">
    <Form.Label>Telefone</Form.Label>
    <Form.Control required 
    type="tel" 
    placeholder="(XX) XXXXX-XXXX" 
    value={telefone} 
    onChange={handletelefoneChange}
    disabled={!novaAposta} />
    <Form.Control.Feedback type="invalid">Por favor, digite o telefone do apostador.</Form.Control.Feedback>
  </Form.Group>
  </div>
    
  <Form.Group controlId="numeros">
    <Form.Label>Selecione 10 números:</Form.Label>
    <Button className="btn-supresinha" type="button" onClick={gerarDezenasAleatorias} disabled={!novaAposta}>
        Supresinha
      </Button>
    <div className="d-flex flex-wrap">{renderNumeros()}</div>
    
  </Form.Group>
  <div className="btn-salvar" >
      <Button type="submit" color="success" onClick={handleFormSubmit} disabled={!novaAposta}>
        Salvar
      </Button>
      <Button color="warning" onClick={handleFinalizarApostasClick} disabled={!novaAposta}>
        Finalizar Apostas
      </Button>
      </div>
</Form>
    <div >
      <h4>Apostas Salvas</h4>
      {renderApostas()}
    </div> 
    </div>    
  );

  
};

export default Apostas;
