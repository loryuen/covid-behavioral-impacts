Plotly.d3.csv('assets/data/unemployment.csv', function(err, rows){
    function unpack(rows, key) {
        return rows.map(function(row) { return row[key]; });
    }

var data = [{
            type: 'choropleth',
            locationmode: 'USA-states',
            locations: unpack(rows, 'code'),
            z: unpack(rows, 'claims'),
            text: unpack(rows, 'state'),
            zmin: 0,
            zmax: 400000,
            colorscale: [
              [0, 'rgb(204,255,255)'], [0.2, 'rgb(153,153,255)'],
              [0.4, 'rgb(102,102,255)'], [0.6, 'rgb(51,51,255)'],
              [0.8, 'rgb(0,0,255)'], [1, 'rgb(0,0,204)']
            ],
          colorbar: {
            title: 'Thousands',
            thickness: 5
          },
          marker: {
            line:{
              color: 'rgb(255,255,255)',
              width: 1
            }
          }
        }];

console.log(data.locations);
var layout = {
        title: 'Unemployment Claims by State',
        geo:{
          scope: 'usa',
          showlakes: true,
          lakecolor: 'rgb(255,255,255)'
        }
    };
    Plotly.plot('map', data, layout, {showLink: false});
});
