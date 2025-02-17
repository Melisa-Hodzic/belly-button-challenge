//Store the URL
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Call upon the JSON data using D3
d3.json(url).then(function(data) {
  console.log(data);
});

// Build the metadata panel
d3.json(url).then((data) => {
  
    // Get the metadata field
    let sampleNames = data.names;
    console.log(sampleNames);

    // To access the dropdown, use D3 to select the tag with the #selDataset
    let selector = d3.select("#selDataset");

    // Use the list of sample names to populate the dropdown
    sampleNames.forEach((sample) => {
      selector.append("option").text(sample).property("value", sample);
    });

    // Get the first sample from the list
    const firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    updateMetadata(firstSample);
});

// Function to update the metadata panel
function updateMetadata(sample) {
  d3.json(url).then((data) => {
    // Filter the metadata for the object with the desired sample number
    let metadata = data.metadata.filter(meta => meta.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");

    // Use `.html("")` to clear any existing metadata
    panel.html("");

    // Inside a loop, use d3 to append new tags for each key-value in the filtered metadata.
    Object.entries(metadata).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
  });
}

// Function to build both charts
function buildCharts(sample) {
  d3.json(url).then((data) => {

    // Get the samples field
    let sample_data = data.samples;

    // Filter the samples for the object with the desired sample number
    let results = sample_data.filter(sampleObj => sampleObj.id == sample)[0];
    console.log(results);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = results.otu_ids;
    console.log(otu_ids);
    let otu_labels = results.otu_labels;
    console.log(otu_labels);
    let sample_values = results.sample_values;
    console.log(sample_values);
 
    // Build a Bubble Chart
    let bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    };

    let bubbleData = [bubbleTrace];

    let bubbleLayout = {
      title: 'Bacteria Cultures per Sample',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Sample Values' },
      showlegend: false
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.map(id => `OTU ${id}`);
    
    // Build a Bar Chart
    let barTrace = {
      x: sample_values.slice(0, 10).reverse(), // Slicing and reversing for top 10
      y: otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(), // Mapping to strings for y-axis
      text: otu_labels.slice(0, 10).reverse(), // Labels for hover text
      type: 'bar',
      orientation: 'h'
    };

    let barData = [barTrace];

    let barLayout = {
      title: 'Top Bacteria Cultures',
      xaxis: { title: 'Sample Values' },
      yaxis: { title: 'OTU IDs' },
      showlegend: false
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', barData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json(url).then((data) => {

    // Get the names field
    let sampleNames = data.names;
    console.log(sampleNames);

    // Use d3 to select the dropdown with id of `#selDataset`
    let selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.

    sampleNames.forEach((sample) => {
      selector.append("option").text(sample).property("value", sample);
    });

    // Get the first sample from the list
    const firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    updateMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  updateMetadata(newSample);
}

// Set the image source
const imageUrl = "https://robdunnlab.com/wp-content/uploads/microbes-sem.jpg"; 
d3.select("#myImage").attr("src", imageUrl);

// Initialize the dashboard
init();
