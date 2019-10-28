import React from 'react'
import ReactDOM from 'react-dom'
import data from "./kuntienavainluvut"; 



const App = () => {
    
    
    const valuet = data.dataset.dimension["Alue 2019"].category.label
    const asukasmaara = data.dataset.value


    var taulukko = [];
    var x;
    var listaIndex = 0;
    

    for (x in valuet) {
        taulukko.push(valuet[x]);
      }

    var indexLista = 0
    const tulosta = (listaValittu) => {
    	console.log(listaIndex)
    	listaIndex = listaValittu.target.value

    }
    
    console.log(listaIndex)
    return (
      <div>
        
        
          <select id="listaKunnista" size="25" onChange={tulosta}>
          {taulukko.map(s => (<option value={indexLista++}>{s}</option>))}

                
            </select>
        
        <p>
        
              
            
            
        </p>
        
      </div>
    )

    
  }

ReactDOM.render(
  React.createElement(App, null),
  document.getElementById('root')
)