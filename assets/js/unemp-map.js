
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
              [0, 'rgb(255,204,204)'], [0.2, 'rgb(255,229,204)'],
              [0.4, 'rgb(255,102,102)'], [0.6, 'rgb(255,51,51)'],
              [0.8, 'rgb(255,0,0)'], [1, 'rgb(204,0,0)']
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