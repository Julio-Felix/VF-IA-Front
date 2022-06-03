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
import { Button, CloseButton } from "react-bootstrap";
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
  const [coeA, setCoeA] = useState("-");
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
  const [scaleMin, setScaleMin] = useState(-100);
  const [scaleMax, setScaleMax] = useState(100);
  const [errorscaleMin, setErrScaleMin] = useState(-1000);
  const [errorscaleMax, setErrScaleMax] = useState(1000);
  // const [indices, setIndices] = useState([])
  const [errosMedios, setErrosMedios] = useState([]);
  //['1980', '1990', '2000', '2005', '2010', '2015', '2020'];
  const labels = (dataBack.map(({ xinicial }) => xinicial)).filter((v, i, a) => a.indexOf(v) === i);

  const indices = errosMedios.map(({ indice }) => indice);
  console.log("labels || ", labels);
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  const options = {
    responsive: true,
    scales: {
      y: {
        min: scaleMin,
        max: scaleMax,
        ticks: {
          // forces step size to be 50 units
          stepSize: 10
        }
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        font: {
          size: 25,
        },
        text: "Gráfico Principal",
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
      x: {
        ticks: {
          precision: 20,
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        font: {
          size: 25,
        },
        text: "Gráfico dos Erros Médios",
      },
    },
  };
  const data = {
    labels,
    datasets: [
      {
        type: "line",
        fill: false,
        showLine: false, //<- set this
        pointBackgroundColor: "red",
        pointRadius: 5,
        label: "Predição",
        data: [xyPredict],
        borderColor: "rgb(0, 255, 0)",
        backgroundColor: "rgba(0, 0, 0, 1)",
      },
      {
        type: "line",
        fill: false,
        showLine: false, //<- set this
        pointBackgroundColor: "black",
        pointRadius: 5,
        label: "Dados",
        data: dataBack.map((item, index) => {
          return { x: dataBack[index].xinicial, y: dataBack[index].yinicial };
        }),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(0, 0, 0, 1)",
      },
      {
        label: "Linha do menor erro",
        data: labels.map((x) => coeA * x + coeB),
        borderColor: "rgb(255,0,0)",
        backgroundColor: "rgba(255, 0, 0, 0.7)",
      },

      ...lines,
    ],
  };

  const dataErrorGraph = {
    labels: indices,
    datasets: [
      {
        label: "Erro",
        data: indices.map((x, index) => errosMedios[index].erroMedio),
        borderColor: "rgb(0, 0, 0)",
        backgroundColor: "rgba(255, 0, 0, 0.5)",
      },
    ],
  };
  // console.log("dataErrorGraph || ", dataErrorGraph);
  console.log("Log || ", data);

  function resetData() {
    setDataBack([]);
    setCoefA(0.0);
    setCoefB(0.0);
    setIterate(0);
    setApprentice(0.0);

    setXpredict(0.0);
  }

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
      { xinicial: 1, yinicial: 2.5 },
      { xinicial: 2.0, yinicial: 2.7 },
      { xinicial: 3, yinicial: 4 },
    ]);
    setCoefA(2.0);
    setCoefB(3.0);
    setIterate(10);
    setApprentice(0.05);

    setXpredict(2);
  }
  function resetLines(){
    setLines([])

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
    axios
      .post("https://5a61-201-49-57-98.ngrok.io/v1/predizer/", data)
      .then((response) => {
        // setResponseReceive(response.data);
        setXYpredict({ x: xPredict, y: response.data.ypredicao });
        setScaleMax(response.data.escalaDoGraficoPrincipal.ymax);
        setScaleMin(response.data.escalaDoGraficoPrincipal.ymin);
        let newDatas = [...dataBack];
        newDatas.push({
          xinicial: xPredict,
          yinicial: response.data.ypredicao,
        });
        newDatas.sort(function (a, b) {
          return a.xinicial - b.xinicial;
        });
        setDataBack(newDatas);
        // setCoeA(response.data.coefA)
        // setCoeB(response.data.coefB)
      })
      .catch((err) => {
        alert(err.response.data.mensagem);
      });
  }

  function addNewData() {
    // if (
    //   newDataX == " " ||
    //   newDataY == " " ||
    //   newDataX == "" ||
    //   newDataY == "" ||
    //   newDataX == undefined ||
    //   newDataY == undefined
    // ) {
    //   alert("Valores inválidos");
    //   return;
    // }

    if (isNaN(parseFloat(newDataX))) {
      alert("Valor de X inválido");
      return;
    }

    if (isNaN(parseFloat(newDataY))) {
      alert("Valor de Y inválido");
      return;
    }

    let newDatas = [...dataBack];
    newDatas.push({ xinicial: parseFloat(newDataX), yinicial: parseFloat(newDataY) });
    newDatas.sort(function (a, b) {
      return a.xinicial - b.xinicial;
    });
    setNewDataX(0);
    setNewDataY(0);
    setDataBack(newDatas);
  }

  function deleteData(indexDeleted) {
    let newDatas = dataBack.filter((item, index) => {
      return index != indexDeleted;
    });
    newDatas.sort(function (a, b) {
      return a.xinicial - b.xinicial;
    });
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
    axios
      .post("https://5a61-201-49-57-98.ngrok.io/v1/criar/", data)
      .then((response) => {
        setCoeA();
        setCoeB();
        let data = response.data;
        let newLines = data.coefsLinhas.map((item) => {
          return {
            label: item.indice,
            data: labels.map((x) => item.coefA * x + item.coefB),
            borderColor: "rgb(0, 0, 0)",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          };
        });
        // setLines(newLines);
        recursiveLines(newLines, 0, [], data);
        setScaleMax(data.escalaDoGraficoPrincipal.ymax);
        setScaleMin(data.escalaDoGraficoPrincipal.ymin);
        setErrScaleMax(data.escalaDoGraficoErros.ymax);
        setErrScaleMin(data.escalaDoGraficoErros.ymin);
        setErrosMedios(data.erros);
      })
      .catch((err) => {
        alert(err.response.data.mensagem);
      });
  }

  function recursiveLines(coefsLinhas, i, oldLines, data) {
    let newLines = [...oldLines, coefsLinhas[i]];
    setTimeout(() => {
      if (data.estruturaCorreta && i + 1 == data.estruturaCorreta.indice) {
        // setResponseReceive(JSON.stringify(data.estruturaCorreta.erroMedio));
        setCoeA(data.estruturaCorreta.coefA);
        setCoeB(data.estruturaCorreta.coefB);
        setLines(newLines);
        recursiveLines(coefsLinhas, i + 1, newLines, data);
      } else if (coefsLinhas.length > i) {
        setLines(newLines);
        recursiveLines(coefsLinhas, i + 1, newLines, data);
      } else if (coefsLinhas.length == i) {
        setLines(newLines);
        let newLines = [...oldLines, coefsLinhas[i]];
      }
    }, 500);
  }

  function estiloCorItem(item) {
    if (item.subindo) {
      return { color: "blue" };
    } else if (item.menorErro) {
      return { color: "red" };
    } else {
      return { color: "black" };
    }
  }

  return (
    <div className="App">
      <div style={{ flex: 1, flexDirection: "row", display: "flex" }}>
        <div style={{ flex: 2, width: "70%" }}>
          <br />
          <h3
            style={{
              fontWeight: "bold",
              textAlign: "center",
              textDecoration: "underline",
            }}
          >
            Regressão Linear
          </h3>
          
          <Line options={options} data={data} />
          <Button variant="primary" onClick={() => setScaleMax(scaleMax+10)}>
            Aumentar Escala Maxima
          </Button>
          <Button
            variant="secondary"
            className="mx-2"
            onClick={() => setScaleMax(scaleMax-10)}
          >
            Diminuir Escala Maxima
          </Button>
          <br/>
          <br/>
          <Button variant="primary" onClick={() => setScaleMin(scaleMin+10)}>
            Aumentar Escala Minima
          </Button>
          <Button
            variant="secondary"
            className="mx-2"
            onClick={() => setScaleMin(scaleMin-10)}
          >
            Diminuir Escala Minima
          </Button>
          <h4 style={{ fontWeight: "bold" }}>
            <br />
            Coef A final: {coeA}
          </h4>
          
          <h4 style={{ fontWeight: "bold" }}>
            <div
              style={{
                flex: 1,
                width: "100%",
                height: "5px",
                margin: 1,
              }}
            ></div>{" "}
            Coef B final: {coeB}
          </h4>

          <h4 style={{ fontWeight: "bold" }}>
            <div
              style={{
                flex: 1,
                width: "100%",
                height: "5px",
                margin: 1,
              }}
            ></div>{" "}
            Y Predito: {xyPredict.y}
          </h4>
        </div>

        <div style={{ flex: 1, width: "100%" }}>
          <div
            style={{ flex: 1, width: "100%", height: "5px", margin: 1 }}
          ></div>
          <Button variant="primary" onClick={() => preData()}>
            Valores Padrão
          </Button>
          <Button
            variant="secondary"
            className="mx-2"
            onClick={() => preData2()}
          >
            Valores Padrão 2
          </Button>
          <Button
            variant="secondary"
            className="mx-2"
            onClick={() => resetLines()}
          >
            Resetar Linhas
          </Button>
          
          <div style={{ flex: 1, width: "100%", margin: 10 }}>
            <label>
              Dado X:
              <span> </span>
              <input
                type="text"
                value={newDataX}
                onChange={(e) => setNewDataX(e.target.value)}
              />
            </label>
          </div>
          <div style={{ flex: 1, width: "100%", margin: 10 }}>
            <label>
              Dado Y:
              <span> </span>
              <input
                type="text"
                value={newDataY}
                onChange={(e) => setNewDataY(e.target.value)}
              />
            </label>
          </div>
          <div style={{ flex: 1, width: "100%", margin: 10 }}>
            <button onClick={() => addNewData()}>Adicionar dado</button>
            <span> </span>
            <button onClick={() => resetData()}>Resetar dados</button>
          </div>
          <table>
            <tr>
              <th>Dados</th>
            </tr>
            <tr>
              <th>X</th>
              <th>Y</th>
            </tr>
            {dataBack.map((item, index) => {
              return (
                <tr>
                  <td>{item.xinicial}</td>
                  <td>{item.yinicial}</td>
                  <td></td>
                  <td>
                    <CloseButton onClick={() => deleteData(index)} />
                    {/* <button  type="button" class="close" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button> */}
                  </td>
                </tr>
              );
            })}
          </table>
          <br />
          <div
            style={{ flex: 1, width: "100%", height: "5px", margin: 1 }}
          ></div>
          <div style={{ flex: 1, width: "100%", margin: 10 }}>
            <label style={{}}>
              Coeficiente A:
              <span> </span>
              <input
                type="text"
                value={coefA}
                onChange={(e) => setCoefA(e.target.value)}
              />
            </label>
          </div>
          <div style={{ flex: 1, width: "100%", margin: 10 }}>
            <label>
              Coeficiente B:
              <span> </span>
              <input
                type="text"
                value={coefB}
                onChange={(e) => setCoefB(e.target.value)}
              />
            </label>
          </div>
          <div style={{ flex: 1, width: "100%", margin: 10 }}>
            <label>
              Taxa de
              <br />
              Aprendizagem:
              <span> </span>
              <input
                type="text"
                value={apprentice}
                onChange={(e) => setApprentice(e.target.value)}
              />
            </label>
          </div>
          <div style={{ flex: 1, width: "100%", margin: 10 }}>
            <label>
              Iteração Máxima:
              <span> </span>
              <input
                type="text"
                value={iterate}
                onChange={(e) => setIterate(e.target.value)}
              />
            </label>
          </div>
          <div style={{ flex: 1, width: "100%", margin: 10 }}>
            <button onClick={() => receber()}>Receber</button>
          </div>
          <div
            style={{ flex: 1, width: "100%", height: "5px", margin: 1 }}
          ></div>
          <div style={{ flex: 1, width: "100%", margin: 10 }}>
            <label>
              X Para Predição:
              <span> </span>
              <input
                type="text"
                value={xPredict}
                onChange={(e) => setXpredict(e.target.value)}
              />
            </label>
          </div>
          <div style={{ flex: 1, width: "100%", margin: 10 }}>
            <button onClick={() => predizer()}>Predizer</button>
          </div>
          <div
            style={{ flex: 1, width: "100%", height: "5px", margin: 1 }}
          ></div>{" "}
        </div>
      </div>
      <div
        style={{
          flex: 1,
          flexDirection: "row",
          display: "flex",
        }}
      >
        <div style={{ flex: 2, width: "50%", height: "1000px" }}>
          <Line options={optionsErrorGraph} data={dataErrorGraph} />
        </div>
        <div style={{ flex: 1, width: "100%" }}>
          <table>
            <tr>
              <th>
                {" "}
                <h4 style={{ fontWeight: "bold" }}> Erros Médios</h4>
              </th>
            </tr>
            {errosMedios.map((item) => {
              return (
                <tr style={estiloCorItem(item)}>
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
