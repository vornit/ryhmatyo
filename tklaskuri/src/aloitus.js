import React  from 'react';
import FadeIn from 'react-fade-in';





//Pääkomponentti Aloitukselle
const Aloitus = () => {

  
  
  

 
 
 return (
  // Bootstrapin pääcontainer

  <FadeIn>

  
  <div className="otsikko">   
      <a1 className="otsikko">Toimialaselvitys</a1>
      <br></br>
      </div>
      <div className="leipa"> 
      <br></br>
      
      <p> Sovellus on tarkoitettu eri toimialojen päästöjen, verojen ja näistä lasketun hyötysuhteen
      tarkasteluun. Hyötysuhteet on laskettu kaavalla: <br /><em>(toimialan verotulot koko Suomessa) / (toimialan päästöt koko Suomessa)</em></p>
      <br></br>
      Tekijät: Aleksi, Joose, Pertti, Tuomo
      </div>

      
      

    
    </FadeIn>

        );
  }


export default Aloitus;