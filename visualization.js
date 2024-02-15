// Sample visualization using Chart.js (you may use other libraries)
// Include Chart.js in your HTML file if not already included

// Create a simple line chart with time series data
const ctx = document.getElementById("chartContainer").getContext("2d");

const data = {
  labels: [], // Timestamps
  datasets: [],
};

// Fetch data from the scraped results and update the chart
$(document).ready(async () => {
  const response = await fetch("scraped-data.json");
  const results = await response.json();
  // Assume 'results' is the array containing scraped data
  results.forEach((result) => {
    data.labels.push(result.timestamp);

    // Check if the dataset for the website already exists
    const websiteDataset = data.datasets.find(
      (dataset) => dataset.label === result.website
    );

    if (websiteDataset) {
      websiteDataset.data.push(result.price);
    } else {
      // Create a new dataset for the website
      data.datasets.push({
        label: result.website,
        data: [result.price],
        borderColor: getRandomColor(),
        fill: false,
      });
    }
  });

  // Create the line chart
  new Chart(ctx, {
    type: "line",
    data: data,
  });
});

// Function to generate random colors for each website
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
