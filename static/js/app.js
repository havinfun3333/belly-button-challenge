// Place url in a constant variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

function buildPlot(BellyButtonData) {

    // Fetch the JSON data and console log it
    d3.json(url).then(function (data) {
      console.log(data);
  
      var ethnicity = data.metadata.map(race => race.ethnicity);
      console.log(`Ethnicities: ${ethnicity}`);
  
      var bbtype = data.metadata.map(bb => bb.bbtype);
      console.log(`Belly Button Types: ${bbtype}`);
   
      // this will only returns the first value for every data 
      // var washingfreq = data.metadata.map(wf => wf.wfreq);
      // console.log(washingfreq);
  
      let filteredMetaSample = data.metadata.filter(sampleName => sampleName.id == BellyButtonData)[0];
      let new_washingfreq = parseInt(filteredMetaSample.wfreq);
      console.log(filteredMetaSample);
      console.log(new_washingfreq);
  
      var race = data.metadata.map(race => race.ethnicity);
      console.log(race);
  
      // Filter by ids and convert object to string using toString()
      // Take a look at the documentation about toString: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
      var sample = data.samples.filter(sampleid => sampleid.id.toString() === BellyButtonData);
      console.log(sample);
  
      // Select one of the samples from the arraysizemode: 'area'
      var oneSample = sample[0];
      console.log(oneSample);
  
      // get top 10 sample_values of an individual
      var top10values = oneSample.sample_values.slice(0, 10); // includes 0 and excluding 10 to get only top 10
      console.log(top10values);
  
      // reverse the data because we want the highest values on the top
      top10values.reverse();
  
      // get top 10 otu_ids of an individual 
      var top10otu_ids = oneSample.otu_ids.slice(0, 10);
      console.log(top10otu_ids);
  
      // reverse it here to match with the labels
      top10otu_ids.reverse();
  
      // get the labels for each OTU labels for bar chart 
      var otu_label = top10otu_ids.map(label => "OTU " + label);
      console.log(`OTU IDs: ${otu_label}`);
  
      // get top 10 labels for each values of OTUs
      var labels = oneSample.otu_labels.slice(0, 10);
      console.log(labels);
  
      // put in the bar chart
      var OTU_barChart = [{
        type: 'bar',
        x: top10values,
        y: otu_label,
        text: labels,
        orientation: 'h'
      }];
  
      Plotly.newPlot('bar', OTU_barChart);
  

      // The bubble chart
      var trace1 = {
        x: oneSample.otu_ids,
        y: oneSample.sample_values,
        mode: "markers",
        marker: {
            size: oneSample.sample_values,
            color: oneSample.otu_ids,
            colorscale: "Earth"
        },
        text: oneSample.otu_labels

      };

      var data = [trace1];

      // set the layout for the bubble plot
      var layout = {
        xaxis:{title: "OTU ID"},
        height: 600,
        width: 1000
      };
      Plotly.newPlot('bubble', data, layout);

      // create gauge chart for washing frequency of the individual 
      var gaugedata = [
        {
          value: parseInt(new_washingfreq),
          domain: {x: [0,1], y: [0,1]},
          title: {
            text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
            font: {color: "black", size: 16}
            },
          type: "indicator",
          mode: "gauge",
          gauge: {
            axis: {range: [0,10], tickmode: "linear", tick0: 1, dtick: 1},
            bar: {color: "black"},
            steps: [
                {range: [0, 1], color: "rgba(255, 255, 255, 0)"},
                {range: [1, 2], color: "rgba(232, 226, 202, .5)"},
                {range: [2, 3], color: "rgba(210, 206, 145, .5)"},
                {range: [3, 4], color:  "rgba(202, 209, 95, .5)"},
                {range: [4, 5], color:  "rgba(184, 205, 68, .5)"},
                {range: [5, 6], color: "rgba(170, 202, 42, .5)"},
                {range: [6, 7], color: "rgba(142, 178, 35 , .5)"},
                {range: [7, 8], color:  "rgba(110, 154, 22, .5)"},
                {range: [8, 9], color: "rgba(50, 143, 10, 0.5)"},
                {range: [9, 10], color: "rgba(14, 127, 0, .5)"},
                ]
            } 
         }   
      ]

      Plotly.newPlot('gauge', gaugedata);
  
    })
  
}
  
// Update all of the plots any time that new sample is selected
  
function updatePlotly(BellyButtonData) {
  
    // Fetch the JSON data and console log it
    d3.json(url).then(function (data) {
  
      console.log(data);
  
      // Display the sample metadata, for example, an individual's demographic info
      var metadata = data.metadata;
      console.log(metadata);
  
      // Filter by ids and convert object to string 
      // Take a look at the documentation about toString: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
      var demo_id = metadata.filter(meta => meta.id.toString() === BellyButtonData);
      console.log(demo_id);
  
      var demoIDvalue = demo_id[0];
      console.log(demoIDvalue);
  
      // Use D3 to select the demographic info
      var demoINFO = d3.select("#sample-metadata");
  
      // empty out demographic info each time selecting new data 
      demoINFO.html("");
  
      // grab demographic info by id and put values in the demographic table   
      Object.entries(demoIDvalue).forEach((value) => {
        demoINFO.append("h6")
                .text(value[0].toUpperCase() + ": " + value[1]);
      });
      
    });
  
}
  
// update all for the plots when a new sample is selected
function optionChanged(BellyButtonData){
    buildPlot(BellyButtonData);
    updatePlotly(BellyButtonData);
};
  
  // Call updatePlotly() when a change takes place to the DOM
  d3.selectAll("#selDataset").on("change", buildPlot, updatePlotly);
  
// This function is called when a dropdown menu item is selected
function init() {
  
    // read json data 
    d3.json(url).then(function (data) {
        console.log(data);
  
    // Use D3 to select the dropdown menu
    var dropdownMenu = d3.select("#selDataset");
  
    data.names.forEach(function(idName) {
      dropdownMenu.append("option")
                  .text(idName)
                  .property("value");
    })
  
    buildPlot(data.names[0]);
    updatePlotly(data.names[0]);
  
    })
}
  
init();