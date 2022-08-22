// Function for change on dropdown menu
function optionChanged(selectedID){

    // Check if value is selected in dropdown
    console.log(selectedID);
 
    // Read the json file for the data
    d3.json("data/samples.json").then((data) => {
 
    // use html("") to clear any existing metadata
    d3.select("#selDataset").html("");   
    
    // Select the metadata array and for each item append the item ID and adds ID to dropdown
    data.metadata.forEach(item =>
         {
         d3.select("#selDataset")
            .append('option')
            .attr('value', item.id)
            .text(item.id);
         });
    // Selected value is passed
    d3.select("#selDataset").node().value = selectedID;
    
    // Filter Metadata for selected ID from dropdown
    const idMetadata = data.metadata.filter(item => 
        (item.id == selectedID));
    
    //select the panel with id of `#sample-metadata
    const panelDisplay = d3.select("#sample-metadata");
    panelDisplay.html("");
    
    //Use `Object.entries` to add each key and value pair to the panel
    Object.entries(idMetadata[0]).forEach(item => 
       {
          panelDisplay.append("p").text(`${item[0]}: ${item[1]}`)
       });
       

 
    //-------------------------------- BAR CHART------------------------------------
 
    // Filter sample array data for the selected ID
    const idSample = data.samples.filter(item => parseInt(item.id) == selectedID);
    
    
    // Slice top 10 sample values
    var sampleValue = idSample[0].sample_values.slice(0,10);
    sampleValue= sampleValue.reverse();
    var otuID = idSample[0].otu_ids.slice(0,10);
    otuID = otuID.reverse();
    var otuLabels = idSample[0].otu_labels
    otuLabels = otuLabels.reverse();
 
    
    const yAxis = otuID.map(item => 'OTU' + " " + item);
    
    // Define the layout and trace object, edit color and orientation
       const trace = {
       y: yAxis,
       x: sampleValue,
       type: 'bar',
       orientation: "h",
       text:  otuLabels,
       marker: {
          //color: 'rgb(154, 140, 152)',
          line: {
             width: 3
         }
        }
       },
       layout = {
        margin: { t: 30, l: 150 },
        title: 'Top 10 Operational Taxonomic Units (OTU)/Individual',
        xaxis: {title: 'Number of Samples Collected'},
        yaxis: {title: 'OTU ID'}
       };
 
       // Plot using Plotly
       Plotly.newPlot('bar', [trace], layout,  {responsive: true});    


       
 //------------------------------------------ BUBBLE CHART----------------------------------------
 
 // Remove Sample value and otuID from individual
 var sampleValue1 =idSample[0].sample_values;
 var otuID1= idSample[0].otu_ids;
 
 // Define the layout and trace object, edit color and orientation
 const trace1 = {
    x: otuID1,
    y: sampleValue1,
    mode: 'markers',
    marker: {
      color: otuID1,
      size: sampleValue1
    }
  },
 
  layout1 = {
    title: '<b>Bubble Chart For Each Sample</b>',
    xaxis: {title: 'OTU ID'},
    yaxis: {title: 'Number of Samples Collected'},
    hovermode: "closest",
    showlegend: false,
    height: 800,
    width: 1800
    };
    
 // Plot using Plotly
 Plotly.newPlot('bubble', [trace1], layout1);

 
 
 //--------------------------------GAUGE CHART----------------------------------

 // Gauge Chart to plot weekly washing frequency 
 const guageDisplay = d3.select("#gauge");
 guageDisplay.html(""); 
 const washFreq = idMetadata[0].wfreq;
 
 const guageData = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: washFreq,
      title: { text: "<b>Belly Button Washing Frequency </b><br> (Scrubs Per Week)" },
      type: "indicator",
      mode: "gauge+number",     
       gauge: {
       axis: { range: [0,9] },
       bar: { color: "#f2e9e4" },
       steps: [
          { range: [0, 1], color: "#5899DA" },
          { range: [1, 2], color: "#E8743B" },
          { range: [2, 3], color: "#19A979" },
          { range: [3, 4], color: "#ED4A7B" },
          { range: [4, 5], color: "#945ECF" },
          { range: [5, 6], color: "#13A4B4" },
          { range: [6, 7], color: "#525DF4" },
          { range: [7, 8], color: "#BF399E" },
          { range: [8, 9], color: "#6C8893" }
                
        ],
       threshold: {
          value: washFreq
        }
      }
    }
  ]; 
  const gaugeLayout = {  
                    width: 600, 
                   height: 400, 
                   margin: { t: 0, b: 0 }, 
                    };
 
 // Plot using Plotly
  Plotly.newPlot('gauge', guageData, gaugeLayout); 
 
 });
 }
 
 // Initial test starts at ID 940
 optionChanged(940);
 
 // Event on change takes the value and calls the function during dropdown selection
 d3.select("#selDataset").on('change',() => {
 optionChanged(d3.event.target.value);
 
 });