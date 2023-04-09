import React from 'react';
import './Login.css'

function Login() {
  return  <div className='form-login'>
    <form >
    <img class="mb-4" src="../Imagens/LogoDcontrol.png" alt="" width="100" height="57"/>
    <h1 class="h3 mb-3 fw-normal">login</h1>

    <div class="form-floating">
      <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com"/>
      <label for="floatingInput">Email</label>
    </div>
    <div class="form-floating">
      <input type="password" class="form-control" id="floatingPassword" placeholder="Password"/>
      <label for="floatingPassword">Senha</label>
    </div>
   
    <button class="w-100 btn btn-lg btn-primary" type="submit">entrar</button>
    
  </form>
  </div>
  ;
}

export default Login;
