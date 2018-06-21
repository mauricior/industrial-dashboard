(function() {
  //Colocar o ip do 'localhost'
  //Se colocar localhost, irá funcionar somente no LocalHost
  //Se acessar de outro ip, o socket io não irá funcionar
  var socket = io('http://177.16.15.158:3000');
  socket.on('hello', function(msg){
    console.log(msg);

  });


var dataValue = 0;
var value = 0;
var status = 0;




var historianValues = []
var historianStatus = []
var historianDates = []

var myChart = '';

//Aguardo o servidor do back-end me mandar a 'tag' com todos os valores salvos
//No banco de dados para popular nosso gráfico assim que o user entrar
socket.on('allValuesT', function(msg) {

//Carrego as variaveis locais com os dados provenientes do banco
  for (var i = 0; i < msg.data.length; i++) {
    historianTemp.push(msg.data[i].temperatura);
    historianUmid.push(msg.data[i].umidade);
    //Converte a data
    var dataTimezoneZero = moment(msg.data[i].data);
    var dataTimezoneBrasil = dataTimezoneZero.tz('America/Sao_Paulo').format('DD/MM/YYYY HH:mm:ss');
    //console.log();
    historianDates.push(dataTimezoneBrasil);
  }


  //Carrego o gráfico com os dados armazenados no banco assim que o usuário conectar
  myChart.setOption({
    xAxis: {
        type: 'category',
        splitLine: {
          show: false
        },
        data: historianDates
    },
      series: [{
          // find series by name
          name: 'Temperatura (Celsius)',
          data: historianTemp
        },
        {
            // find series by name
            name: 'Umidade (%)',
            data: historianUmid
        }]
  });


});

//Aguardo o servidor do back-end me mandar a 'tag' de temperatura e a mensagem com o valor
//lido pelo sensor e a data
  socket.on('valores', function(msg) {
    console.log(msg);

    //Atualizo o html com o valor lido em tempo real
    //Separo as variaveis de temperatura e data
    document.getElementById('value').innerHTML = msg.Value;
    document.getElementById('status').innerHTML = msg.Status;
    value = msg.Value;
    status = msg.Status;
    dataValue = msg.Data;

    if(status == 'Good')
    {
      status = 1;
      historianStatus.push(status);
    }

    if(status == 'Bad')
    {
      status = 0;
      historianStatus.push(status);
    }

    //Salvo leitura a leitura a data em um array para posteriormente atualizar nosso gráfico
    historianDates.push(dataValue);
    //console.log("Historico Datas: " + historianTempDates);

    //Salvo leitura a leitura o valor lido em um array para posteriormente atualizar nosso gráfico
    historianValues.push(value);
    //console.log("Historico Temp: " + historianTemp)


    //A cada leitura realizada pelo sensor atualizo o gráfico com os dados atuais
    myChart.setOption({
      xAxis: {
          type: 'category',
          splitLine: {
            show: false
          },
          data: historianDates
      },
        series: [{
            // find series by name
            name: 'Value',
            data: historianValues
          },
        {
          name: 'Status',
          data: historianStatus
        }]
    });


});



//Cria o gráfico com os valores assim que o front é carregado
  window.onload = function () {
// Atualiza nosso front com o gráfico
myChart = echarts.init(document.getElementById('main'));
// Desenha o gráfico
myChart.setOption({
  title: {
        text: ''
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data:['Value', 'Status'],
        position: 'bottom'
    },
    dataZoom: [
       {
           show: false,
           realtime: true,
           start: 30,
           end: 70,
           xAxisIndex: [0]
       },
       {
           type: 'inside',
           realtime: true,
           start: 30,
           end: 70,
           xAxisIndex: [0]
       }
   ],
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data:''
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name:'Value',
            type:'line',
            data:''
        },
        {
        name: 'Status',
        type: 'line',
        data: ''
      }]
  });
}




})()
