// Importe as bibliotecas necessárias
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const htmlToImage = require('html-to-image');
const fs = require('fs');
const puppeteer = require('puppeteer');

// Crie uma instância do servidor express
const app = express();
const cors = require('cors');
app.use(cors());


app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Use o bodyParser para parsear as requisições como JSON
app.use(bodyParser.json());

app.get('/api/ping', (req, res) => {
    res.json({ message: 'Pong!' });
  });

// Conecte-se ao banco de dados
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '214782',
  database: 'bolao'
});

// Rota para receber as apostas
app.post('/api/apostas', (req, res) => {
  const apostas = req.body.apostas;

  // Verifique se há pelo menos uma aposta
  if (apostas.length === 0) {
    res.status(400).send({
      success: false,
      message: 'Faça pelo menos 1 aposta!'
    });
    return;
  }

  // Insira as apostas no banco de dados
  const query = 'INSERT INTO apostas (identificacao, apostador, cidade, telefone, dezenas,id_vendedor,num_bolao,data_aposta) VALUES (?, ?, ?, ?, ?, ?, ? ,?)';
  for (let aposta of apostas) {
    
    connection.query(query, [aposta.id, aposta.nome, aposta.cidade, aposta.telefone, aposta.numeros.join(',') , aposta.idVendedor, aposta.numBolao, aposta.dataAposta], (error, results) => {
      if (error) {
        res.status(500).send({
          success: false,
          message: 'Erro ao salvar as apostas no banco de dados.'
        });
        return;
      }
      console.log(results);
    });

    
  }

  // Envie uma resposta de sucesso
  res.status(200).send({
    success: true,
    message: 'Apostas cadastradas com sucesso!'
  });

});

// Rota para exibir as informações de uma aposta
app.get('/api/ticket/:id', (req, res) => {
  const id = req.params.id;

  // Busca a aposta no banco de dados
  const query = 'SELECT * FROM apostas WHERE identificacao = ?';
  connection.query(query, [id], (error, results) => {
    if (error || results.length === 0) {
      res.status(404).send({
        success: false,
        message: 'Aposta não encontrada.'
      });
      console.log(error);
      return;
    }

    const aposta = results[0];

    // Formata a data da aposta
    const dataAposta = new Date(aposta.data_aposta).toLocaleString();

    // Formata as dezenas apostadas
    const dezenas = aposta.dezenas.split(',').map(dezena => dezena.trim()).join(' ');

    // Busca os sorteios correspondentes ao número do bolão
    const querySorteios = 'SELECT * FROM sorteios WHERE num_bolao = 1';
    connection.query(querySorteios, [aposta.numero_bolao], (error, resultsSorteios) => {
      if (error) {
        res.status(500).send({
          success: false,
          message: 'Ocorreu um erro ao buscar os sorteios.'
        });
        console.log(error);
        return;
      }

      // Obtém as dezenas sorteadas em cada sorteio
      const dezenasSorteadas = resultsSorteios.map(sorteio => sorteio.dezenas.split(','));

      // Renderiza uma página HTML com as informações da aposta
      const html = `
      <html>
        <head>
          <title>Bolão Mega Sena</title>
          <style>
           
            .circle {
              display: inline-block;
              border-radius: 50%;
              border: 1px solid rgb(231, 231, 231);
              padding: 5px;
              margin: 5px;
              text-align: center;
              width: 10px;
              height: 10px;
              box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
              background-color: #fff;
            }
            .circle.correct {
              background-color: green;
              color: #fff;              
            }
            .ticket{
              background-color: rgb(240, 245, 198);
              width: 60vh;
              margin-left: auto;
              margin-right: auto; 
            }
            h1{
              text-align: center;
            }
            p{
              margin-left:10px;
            }
            h4{
              text-align: center;
            }
            ul{
              font-size: 10px;
              margin-left: -30px;
            }
            .Logo{
              width: 60vh;
              margin-left: auto;
              margin-right: auto;  
            }
            img{
              width: 150px;
            }
          </style>
        </head>
        <body>
          <div class="ticket">
          <div class="Logo">
          <img src="https://www.dcontrol.com.br/LogoDcontrol.png" />  
          </div>
          <h1>Bolão Mega Sena</h1>
          <p><strong>Apostador:</strong> ${results[0].apostador}</p>
          <p><strong>Cidade:</strong> ${results[0].cidade}</p>
          <p><strong>Vendedor:</strong> ${results[0].vendedor}</p>
          <p><strong>Data da Aposta:</strong> ${results[0].data_aposta}</p>
          <hr>
          <h4>Apostas</h4>
          <ul>
            ${results.map((aposta) => `
              <div>
                ${aposta.dezenas.split(',').map((dezena) => {
                  const dezenaTrim = dezena.trim();
                  const acertou = dezenasSorteadas.some(dezenasSorteio => dezenasSorteio.includes(dezenaTrim));
                  return `<div class="circle${acertou ? ' correct' : ''}">${dezenaTrim}</div>`;
                }).join('')}
              </div>
            `).join('')}
          </ul>
          <hr>
          <h2>Informações adicionais:</h2>
          <p>...</p>
          </div>
        </body>
      </html>
    `;
    async function generateImage() {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(html);
      const ticketElement = await page.$('.ticket'); // seleciona a div com a classe 'ticket'
      const imageBuffer = await ticketElement.screenshot(); // gera a imagem da div
      await browser.close();
    
      return imageBuffer;
    }
   /* 
    generateImage().then((imageBuffer) => {
      // Salva a imagem em um arquivo
     fs.writeFileSync(id+'.png', imageBuffer);
      res.download(id+'.png', id+'.png', (err) => {
      if (err) {
       console.error('Erro ao enviar arquivo:', err);
       res.status(500).send('Erro ao fazer download da imagem.');
  }
      fs.unlinkSync(id+'.png');
});
    }).catch((err) => {
      console.error(err);
    });
    */
    res.send(html); 
              
   
  });
 
  
});

});

app.get('/api/image', (req, res) => {
  const html = `
      <html>
        <head>
          <title>Bolão Mega Sena</title>
          <style>
            body{
              background-color: rgb(240, 245, 198);
            }
            .circle {
              display: inline-block;
              border-radius: 50%;
              border: 1px solid rgb(231, 231, 231);
              padding: 5px;
              margin: 5px;
              text-align: center;
              width: 15px;
              height: 15px;
              box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
              background-color: #fff;
            }

            .circle.correct {
              background-color: green;
              color: #fff;
              
            }
          </style>
        </head>
        <body>
          <h1>Bolão Mega Sena</h1>
         
          <p><strong>Apostador:</strong> ${results[0].apostador}</p>
          <p><strong>Cidade:</strong> ${results[0].cidade}</p>
          <p><strong>Vendedor:</strong> ${results[0].vendedor}</p>
          <p><strong>Data da Aposta:</strong> ${results[0].data_aposta}</p>
          <hr>
          <h2>Apostas:</h2>
          <ul>
            ${results.map((aposta) => `
              <div>
                ${aposta.dezenas.split(',').map((dezena) => {
                  const dezenaTrim = dezena.trim();
                  const acertou = dezenasSorteadas.some(dezenasSorteio => dezenasSorteio.includes(dezenaTrim));
                  return `<div class="circle${acertou ? ' correct' : ''}">${dezenaTrim}</div>`;
                }).join('')}
              </div>
            `).join('')}
          </ul>
          <hr>
          <h2>Informações adicionais:</h2>
          <p>...</p>
        </body>
      </html>
    `;
    
  htmlToImage.toPng(document.documentElement.outerHTML)
    .then(function (dataUrl) {
      res.writeHead(200, { 'Content-Type': 'image/png' });
      const img = Buffer.from(dataUrl.split(',')[1], 'base64');
      res.end(img);
    })
    .catch(function (error) {
      console.error('Erro ao gerar imagem:', error);
      res.status(500).send('Erro ao gerar imagem');
    });
});









// Inicie o servidor na porta desejada
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}...`));


