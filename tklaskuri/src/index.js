import React, { useState } from 'react';
import ReactDOM from 'react-dom'
import data from "./kuntienavainluvut"; 



const App = () => {
    
    
  const [ counter, setCounter ] = useState(0)

  const setToValue = (value) => setCounter(value)

    const valuet = data.dataset.dimension["Alue 2019"].category.label
    const asukasmaara = data.dataset.value


    var taulukko = [];
    var x;
    var listaIndex;
    

    for (x in valuet) {
        taulukko.push(valuet[x]);
      }

    var indexLista = 0

    const tulosta = (listaValittu) => {
    	
      listaIndex = listaValittu.target.value
      console.log(listaIndex)
      setToValue(listaIndex)
      console.log(counter)
    }
    
   
    return (
      <div>
        
        
          <select id="listaKunnista" size="25" onChange={tulosta}>
          {taulukko.map(s => (<option value={indexLista++}>{s}</option>))}

                
            </select>
        
        
        
              
        <div>{asukasmaara[counter]}</div>
            
        
        
      </div>
    )

    
  }

ReactDOM.render(
  React.createElement(App, null),
  document.getElementById('root')
)