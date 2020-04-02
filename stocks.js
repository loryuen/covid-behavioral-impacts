d3.csv("dow_data.csv").then(function(dowData) {

    var dates = dowData.map((date) => {
        return date.Date;
    })
    var world = dowData.map((date) => {
        return date.World;
    })
    var close = dowData.map((date) => {
        return date.goog;
    })
    var usa = dowData.map((date) => {
        return date.USA;
    })
    
    var trace1 = {
        x: dates,
        y: world,
        name: 'COVID Cases',
        type: 'scatter'
      };
      
      var trace2 = {
        x: dates,
        y: close,
        name: 'Stock',
        yaxis: 'y2',
        type: 'scatter'
      };
      
      var data = [trace1, trace2];
      
      var layout = {
        title: 'Covid Cases & Stock - Correlation',
        yaxis: {title: 'Covid Cases'},
        showlegend: true,
            legend: {
            x: 100,
            xanchor: 'left',
            y: 100
                },
        yaxis2: {
          title: 'Stock Price',
          titlefont: {color: 'rgb(148, 103, 189)'},
          tickfont: {color: 'rgb(148, 103, 189)'},
          overlaying: 'y',
          side: 'right',
        }
      };
      
      Plotly.newPlot('plot', data, layout);
});

// creating dropdown
var drop = ['dji', 'goog', 'ccl', 'zm', 'ba']
function dropDown() {
      var sel = d3.select('#selDataset');
      drop.forEach((id) => {
      sel.append("option").text(id);
      });
  }

dropDown();
//getting value of dropdown choosen
function input() {
  d3.event.preventDefault();
  var id = d3.select('#selDataset').node().value;
  console.log(id);

  gplot(id);
}



//generate plots

function gplot(id) {
  var selectedid = id
  console.log(selectedid)
  d3.csv("dow_data.csv").then(function(dowData, id) {
    console.log(selectedid)
    var dates = dowData.map((date) => {
        return date.Date;
    })
    var world = dowData.map((date) => {
        return date.World;
    })
    var close = dowData.map((date, id) => {
      console.log(selectedid);
        return date[selectedid];
    })
    var usa = dowData.map((date) => {
        return date.USA;
    })
    
    var trace1 = {
        x: dates,
        y: world,
        name: 'COVID Cases',
        type: 'scatter'
      };
      
      var trace2 = {
        x: dates,
        y: close,
        name: 'Stock Price',
        yaxis: 'y2',
        type: 'scatter'
      };

      var config = {responsive: true}
      
      var data = [trace1, trace2];
      
      var layout = {
        title: 'Covid Cases & Stock - Correlation',
        yaxis: {title: 'Covid Cases'},
        showlegend: true,
            legend: {
            x: 100,
            xanchor: 'left',
            y: 100
                },
        yaxis2: {
          title: 'Stock Price',
          titlefont: {color: 'rgb(148, 103, 189)'},
          tickfont: {color: 'rgb(148, 103, 189)'},
          overlaying: 'y',
          side: 'right',
        }
      };
      
      Plotly.newPlot('plot', data, layout, config);
});
};


//updating on click dropdown value 
d3.select("#selDataset").on("change", input);