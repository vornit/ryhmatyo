import React from 'react'
import ReactDOM from 'react-dom'
import data from "./kuntienavainluvut"; 



const App = () => {
    
    
    const valuet = data.dataset.dimension["Alue 2019"].category.label

    var taulukko = [];
    var x;

    

    for (x in valuet) {
        taulukko.push(valuet[x]);
      }

    
    
    
  
    return (
      <div>
        
        
          <ul>
          {taulukko.map(s => (<li>{s}</li>))}
                
            </ul>
        
        <p>
        
              
            
            
        </p>
        
      </div>
    )
  }

ReactDOM.render(
  React.createElement(App, null),
  document.getElementById('root')
)