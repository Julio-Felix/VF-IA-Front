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
import axios from 'axios'
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
  const [coeA, setCoeA] = useState(0.4)
  const [coeB, setCoeB] = useState(-388)
  const [newDataX, setNewDataX] = useState(0)
  const [newDataY, setNewDataY] = useState(0)
  const [apprentice, setApprentice] = useState(0)
  const [iterate, setIterate] = useState(0)
  const [response_receive, setResponseReceive] = useState("{'test':'tests'}")
  const [xPredict,setXpredict] = useState(0)
  const [xyPredict,setXYpredict] = useState({})


  const [dataBack, setDataBack] = useState([]);
  //['1980', '1990', '2000', '2005', '2010', '2015', '2020'];
  const labels = dataBack.map(({xinicial}) => xinicial)

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
        data: labels.map((item,index) => {return{x:dataBack[index].xinicial,y:dataBack[index].yinicial}}),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        type:'line',
        fill: false,
        showLine: false, //<- set this
        pointBackgroundColor: 'black',
        pointRadius: 5,
        label: 'Dado Predizer',
        data: [xyPredict],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(235, 0, 0, 0.5)',
      },
    ],
  };
  // console.log("Log || ", data)

  function predizer(){
    let data = {
      amostra:dataBack,
      coefAinicial:coefA,
      coefBinicial:coefB,
      taxaDeAprendizagem:apprentice,
      iteracaoMax:iterate,
      valorXParaPredizer:xPredict,
    }
    console.log('test || ', data)
    axios.post('http://localhost:8998/v1/predizer/', data).then((response) => {
      // setResponseReceive(response.data);
      setXYpredict({x:xPredict,y:response.data.ypredicao})
      // setCoeA(response.data.coefA)
      // setCoeB(response.data.coefB)
    })
  }

  function addNewData(){
    if(!(newDataX!=' ' && newDataY!=' ' &&newDataX != '' && newDataY != '' && newDataX != undefined && newDataY != undefined)){
      alert('Coloque Numeros validos. obs: campo Y so Aceita Numero.');
      return;
    }
    let newDatas = [...dataBack]
    newDatas.push({xinicial:newDataX,yinicial:newDataY});
    newDatas.sort(function(a, b) {
      return a.xinicial - b.xinicial;
    });
    setNewDataX(0);
    setNewDataY(0);
    setDataBack(newDatas)
  }


  function receber(){
    let data = {
      amostra:dataBack,
      coefAinicial:coefA,
      coefBinicial:coefB,
      taxaDeAprendizagem:apprentice,
      iteracaoMax:iterate,
    }
    console.log('test || ', data)
    axios.post('http://localhost:8998/v1/criar/', data).then((response) => {
      setResponseReceive(response.data);
      setCoeA(response.data.coefA)
      setCoeB(response.data.coefB)
    })
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
          <label>
             X Predicao:
          <input type="text" value={xPredict} onChange={e => setXpredict(e.target.value)} />
          </label>
          <button onClick={() => predizer()}>Predizer</button>
          
        <table>
          <tr><th>Dados</th></tr>
          <tr><th>X</th><th>Y</th></tr>
          {dataBack.map((item) => {
            return(
              <tr><td>{item.xinicial}</td><td>{item.yinicial}</td></tr>
            )
          })}

        </table>
      </div>
      <div>
        <table>
          <tr><th>Response Receber</th></tr>
          <tr><td>{response_receive}</td></tr>
        </table>
      </div>
    </div>
  );
}
