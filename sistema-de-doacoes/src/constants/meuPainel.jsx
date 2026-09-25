import { useState } from 'react'
import '../styles/meuPainel.css'

function App() {

  return (
    <div id="app-root">

      <header>
        <h1>Meu painel</h1>
        <div class='homeDataUser'>
          <img></img>
          <p>User name</p>
          <p>Aluno de *****</p>
        </div>
      </header>
      <aside>
        <h1>COPER FMP</h1>
        <div class='container' id='asideInteract'>

        </div>
        <ul>
          <li><a href='/sistema-de-doacoes/src/meuPainel.jsx'>Meu painel</a></li>
        </ul>
        <a>Sair</a>
      </aside>
      <div className='container'>
        <section class='card' id='sectionHours' >
          <h1>Saldo de horas</h1>
          <p>12.5h</p>
        </section>
        <section class='card' id='sectionDonations' >
          <h1>Doações realizadas</h1>
          <p>6</p>
        </section>
      </div>
    </div>
  )
}

export default App
