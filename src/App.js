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

const labels = ['1980', '1990', '2000', '2005', '2010', '2015', '2020'];
const coeA = 0.4
const coeB = -388
export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
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
      label: 'Dataset 2',
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

export default function App() {
  const [coefA, setCoefA] = useState(0)
  const [coefB, setCoefB] = useState(0)
  const [newDataX, setNewDataX] = useState(0)
  const [newDataY, setNewDataY] = useState(0)

  const [dataBack, setDataBack] = useState([]);

  function addNewData(){
    let newDatas = [...dataBack]
    newDatas.push({x:newDataX,y:newDataY});
    setNewDataX(0);
    setNewDataY(0);
    setDataBack(newDatas)
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
          <input type="text" value={coefA} onChange={setCoefA} />
          </label>
          <label>
             Coeficiente B:
          <input type="text" value={coefB} onChange={setCoefB} />
          </label>
          <br/>
          <label>
             Novo Dado X:
          <input type="text" value={newDataX} onChange={setNewDataX} />
          </label>
          <label>
             Novo Dado Y:
          <input type="text" value={newDataY} onChange={setNewDataY} />
          </label>
          <button  value="Adicionar Dado" onClick={() => addNewData()}>adicionar dado</button>

        <table>
          <tr><th>Dados</th></tr>
          <tr><th>X</th><th>Y</th></tr>
          {dataBack.map((item) => {
            return(
              <tr><td>{item.x}</td><td>{item.y}</td></tr>
            )
          })}
          <tr><td>10</td><td>9</td></tr>

        </table>
      </div>
    </div>
  );
}
