import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import faker from "faker";
import axios from "axios";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function App() {
  const [coefA, setCoefA] = useState(0);
  const [coefB, setCoefB] = useState(0);
  const [coeA, setCoeA] = useState("s");
  const [coeB, setCoeB] = useState(0);
  const [newDataX, setNewDataX] = useState(0);
  const [newDataY, setNewDataY] = useState(0);
  const [apprentice, setApprentice] = useState(0);
  const [iterate, setIterate] = useState(0);
  const [response_receive, setResponseReceive] = useState("");
  const [xPredict, setXpredict] = useState(0);
  const [xyPredict, setXYpredict] = useState({});

  const [dataBack, setDataBack] = useState([]);
  const [lines, setLines] = useState([]);
  const [scaleMin, setScaleMin] = useState(-1000)
  const [scaleMax, setScaleMax] = useState(1000)
  const [errorscaleMin, setErrScaleMin] = useState(-1000)
  const [errorscaleMax, setErrScaleMax] = useState(1000)
  // const [indices, setIndices] = useState([])
  const [errosMedios, setErrosMedios] = useState([])
  //['1980', '1990', '2000', '2005', '2010', '2015', '2020'];
  const labels = dataBack.map(({ xinicial }) => xinicial);
  const indices = errosMedios.map(({ indice }) => indice);
  console.log("Indicices || ", indices);
  const options = {
    responsive: true,
    scales: {
      y: {
        min: scaleMin,
        max: scaleMax,
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Grafico Principal",
      },
    },
  };
  const optionsErrorGraph = {
    responsive: true,
    scales: {
      y: {
        min: errorscaleMin,
        max: errorscaleMax,
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Grafico dos Erros Medios",
      },
    },
  };
  const data = {
    labels,
    datasets: [
      {
        label: "Linha",
        data: labels.map((x) => coeA * x + coeB),
        borderColor: "rgb(255,0,0)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        type: "line",
        fill: false,
        showLine: false, //<- set this
        pointBackgroundColor: "black",
        pointRadius: 5,
        label: "Dados",
        data: labels.map((item, index) => {
          return { x: dataBack[index].xinicial, y: dataBack[index].yinicial };
        }),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        type: "line",
        fill: false,
        showLine: false, //<- set this
        pointBackgroundColor: "red",
        pointRadius: 5,
        label: "Dado Predizer",
        data: [xyPredict],
        borderColor: "rgb(0, 255, 0)",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
      
      ...lines
    ],
  };

  const dataErrorGraph = {
    labels:indices,
    datasets: [
      {
        label: "Erros",
        data: indices.map((x, index) => errosMedios[index].erroMedio),
        borderColor: "rgb(0, 0, 0)",
        backgroundColor: "rgba(255, 0, 0, 0.5)",
      }
    ]

  }
  console.log("dataErrorGraph || ", dataErrorGraph);
  console.log("Log || ", data)

  function preData() {
    setDataBack([
      { xinicial: 1980, yinicial: 2.1 },
      { xinicial: 1985, yinicial: 2.9 },
      { xinicial: 1990, yinicial: 3.2 },
      { xinicial: 1995, yinicial: 4.1 },
      { xinicial: 2000, yinicial: 4.9 },
    ]);
    setCoefA(0.4);
    setCoefB(-388);
    setIterate(10);
    setApprentice(0.000155);

    setXpredict(2005);
  }

  function preData2() {
    setDataBack([
      { xinicial: 2.0, yinicial: 2.7 },
      { xinicial: 1, yinicial: 2.5 },
      { xinicial: 3, yinicial: 4 },
    ]);
    setCoefA(2.0);
    setCoefB(3.0);
    setIterate(10);
    setApprentice(0.05);

    setXpredict(2);
  }

  function predizer() {
    let data = {
      amostra: dataBack,
      coefAInicial: coefA,
      coefBInicial: coefB,
      taxaDeAprendizagem: apprentice,
      iteracaoMax: iterate,
      valorXParaPredizer: xPredict,
    };
    console.log("test || ", data);
    axios.post("https://e636-186-222-173-39.ngrok.io/v1/predizer/", data).then((response) => {
      // setResponseReceive(response.data);
      setXYpredict({ x: xPredict, y: response.data.ypredicao });
      // setCoeA(response.data.coefA)
      // setCoeB(response.data.coefB)
    }).catch((err) => {
      alert(err.response.data.mensagem)
    });
  }

  function addNewData() {
    if (
      !(
        newDataX != " " &&
        newDataY != " " &&
        newDataX != "" &&
        newDataY != "" &&
        newDataX != undefined &&
        newDataY != undefined
      )
    ) {
      alert("Coloque Numeros validos. obs: campo Y so Aceita Numero.");
      return;
    }
    let newDatas = [...dataBack];
    newDatas.push({ xinicial: newDataX, yinicial: newDataY });
    newDatas.sort(function (a, b) {
      return a.xinicial - b.xinicial;
    });
    setNewDataX(0);
    setNewDataY(0);
    setDataBack(newDatas);
  }

  function receber() {
    let data = {
      amostra: dataBack,
      coefAInicial: coefA,
      coefBInicial: coefB,
      taxaDeAprendizagem: apprentice,
      iteracaoMax: iterate,
    };
    console.log("test || ", data);
    axios.post("https://e636-186-222-173-39.ngrok.io/v1/criar/", data).then((response) => {
      let data = response.data;
      if(data.estruturaCorreta){
        setResponseReceive(
          JSON.stringify(data.estruturaCorreta.erroMedio)
        );
        setCoeA(data.estruturaCorreta.coefA);
        setCoeB(data.estruturaCorreta.coefB);
      }
      let newLines = data.coefsLinhas.map((item) => {
        return {
          label: "Linha-" + item.indice,
          data: labels.map((x) => item.coefA * x + item.coefB),
          borderColor: "rgb(0, 0, 0)",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }
      })
      // setLines(newLines);
      recursiveLines(newLines, 0, []);
      setScaleMax(data.escalaDoGraficoPrincipal.ymax);
      setScaleMin(data.escalaDoGraficoPrincipal.ymin / 10000);
      setErrScaleMax(data.escalaDoGraficoErros.ymax)
      setErrScaleMin(data.escalaDoGraficoErros.ymin)
      setErrosMedios(data.erros);
      
    }).catch((err) => {
      alert(err.response.data.mensagem)
    });
  }

  function recursiveLines(coefsLinhas, i, oldLines) {
    let newLines = [...oldLines,coefsLinhas[i]]
    setLines(newLines);
    setTimeout(() => {
      if(coefsLinhas.length > i+1){
        recursiveLines(coefsLinhas, i+1, newLines)
      }
      
    },5000)
  }

  return (
    <div className="App">
      <div
        style={{ flex: 1, flexDirection: "row", display: "flex" }}
      >
        <div style={{ flex: 1, width: "50%" }}>
          <Line options={options} data={data} />
        </div>

        <div style={{ flex: 1, width: "100%" }}>
          {/* <div> */}
          <div style={{ flex: 1, width: "100%", margin:10 }}>
            <label style={{}}>
              Coeficiente A:
              <input
                type="text"
                value={coefA}
                onChange={(e) => setCoefA(e.target.value)}
              />
            </label>
          </div>
          <div style={{ flex: 1, width: "100%", margin:10 }}>
            <label>
              Coeficiente B:
              <input
                type="text"
                value={coefB}
                onChange={(e) => setCoefB(e.target.value)}
              />
            </label>
          </div>
          <label>
            Taxa de Aprendizagem:
            <input
              type="text"
              value={apprentice}
              onChange={(e) => setApprentice(e.target.value)}
            />
          </label>
          <br />
          <br />
          <label>
            Novo Dado X:
            <input
              type="text"
              value={newDataX}
              onChange={(e) => setNewDataX(e.target.value)}
            />
          </label>

          <label>
            Novo Dado Y:
            <input
              type="text"
              value={newDataY}
              onChange={(e) => setNewDataY(e.target.value)}
            />
          </label>
          <button onClick={() => addNewData()}>Adicionar dado</button>
          <br />
          <br />
          <label>
            Iteracao:
            <input
              type="text"
              value={iterate}
              onChange={(e) => setIterate(e.target.value)}
            />
          </label>
          <button onClick={() => receber()}>Receber</button>
          <label>
            X Predicao:
            <input
              type="text"
              value={xPredict}
              onChange={(e) => setXpredict(e.target.value)}
            />
          </label>
          <button onClick={() => predizer()}>Predizerrr</button>
          <br />
          <br />
          <button onClick={() => preData()}>Valores Padrao</button>
          <button onClick={() => preData2()}>Valores Padrao 2</button>
          
          <table>
            <tr>
              <th>Dados</th>
            </tr>
            <tr>
              <th>X</th>
              <th>Y</th>
            </tr>
            {dataBack.map((item) => {
              return (
                <tr>
                  <td>{item.xinicial}</td>
                  <td>{item.yinicial}</td>
                </tr>
              );
            })}
          </table>
        </div>
      </div>
      <div
        style={{ flex: 1, flexDirection: "row", display: "flex" }}
      >
        <div style={{ flex: 1, width: "50%" }}>
          <Line options={optionsErrorGraph} data={dataErrorGraph} />
        </div>
        <div style={{ flex: 1, width: "100%" }}>
          <table>
            <tr>
              <th>Response Receber</th>
            </tr>
            {errosMedios.map((item) => {
              return (
                <tr style={!item.subindo ? {color:'black'}:{color:'red'}}>
                  <td>{item.indice}</td>
                  <td>{item.erroMedio}</td>
                </tr>
              );
            })}
          </table>
        </div>
      </div>
    </div>
    
  );
}
