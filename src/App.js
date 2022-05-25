import React, {useState, useEffect} from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import faker from 'faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {

  responsive: true,
  scales: {
    y: {
      min: -1000,
      max: 1000,
    }
  },
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};


const coeA = 0.4
const coeB = -388

export default function App() {
  const [coefA, setCoefA] = useState(0)
  const [coefB, setCoefB] = useState(0)
  const [newDataX, setNewDataX] = useState(0)
  const [newDataY, setNewDataY] = useState(0)
  const [apprentice, setApprentice] = useState(0)
  const [iterate, setIterate] = useState(0)

  const [dataBack, setDataBack] = useState([]);
  //['1980', '1990', '2000', '2005', '2010', '2015', '2020'];
  const labels = dataBack.map(({x}) => x)

  const data = {
    labels,
    datasets: [
      {
        label: 'Linha',
        data: labels.map((x) => coeA*x + coeB),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        type:'line',
        fill: false,
        showLine: false, //<- set this
        pointBackgroundColor: 'black',
        pointRadius: 5,
        label: 'Dados',
        data: labels.map((item,index) => dataBack[index]),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };
  // console.log("Log || ", data)



  function addNewData(){
    if(!(newDataX!=' ' && newDataY!=' ' &&newDataX != '' && newDataY != '' && newDataX != undefined && newDataY != undefined)){
      alert('Coloque Numeros validos.');
      return;
    }
    let newDatas = [...dataBack]
    newDatas.push({x:newDataX,y:newDataY});
    
    setNewDataX(0);
    setNewDataY(0);
    setDataBack(newDatas)
  }


  function receber(){
    
  }

  return (
    <div className='App' style={{flex:1,flexDirection:'row',display:'flex'}}>
      <div style={{flex:1,width:'50%'}}>
        <Line options={options} data={data} />  
      </div>
      
      <div style={{flex:1,width:'100%'}}>
        {/* <div> */}

          <label>
            Coeficiente A:
          <input type="text" value={coefA} onChange={(e) => setCoefA(e.target.value)} />
          </label>
          <label>
             Coeficiente B:
          <input type="text" value={coefB} onChange={(e) => setCoefB(e.target.value)} />
          </label>
          <label>
             Taxa de Aprendizagem:
          <input type="text" value={apprentice} onChange={(e) => setApprentice(e.target.value)} />
          </label>
          <br/>
          <br/>
          <label>
             Novo Dado X:
          <input type="text" value={newDataX} onChange={(e) => setNewDataX(e.target.value)} />
          </label>
          
          <label>
             Novo Dado Y:
          <input type="text" value={newDataY} onChange={e => setNewDataY(e.target.value)} />
          </label>
          <button onClick={() => addNewData()}>Adicionar dado</button>
          <br/>
          <br/>
          <label>
             Iteracao:
          <input type="text" value={iterate} onChange={e => setIterate(e.target.value)} />
          </label>
          <button onClick={() => receber()}>Receber</button>
        <table>
          <tr><th>Dados</th></tr>
          <tr><th>X</th><th>Y</th></tr>
          {dataBack.map((item) => {
            return(
              <tr><td>{item.x}</td><td>{item.y}</td></tr>
            )
          })}

        </table>
      </div>
    </div>
  );
}
