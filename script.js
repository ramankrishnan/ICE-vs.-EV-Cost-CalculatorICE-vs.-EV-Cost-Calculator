function calculateCost() {
    // Get user inputs
    const icePrice = parseFloat(document.getElementById('icePrice').value) || 1500000;
    const iceMileage = parseFloat(document.getElementById('iceMileage').value) || 10;
    const fuelCost = parseFloat(document.getElementById('fuelCost').value) || 100;

    const evPrice = parseFloat(document.getElementById('evPrice').value) || 2000000;
    const evRange = parseFloat(document.getElementById('evRange').value) || 200;
    const batteryCapacity = parseFloat(document.getElementById('batteryCapacity').value) || 30;
    const chargingCost = parseFloat(document.getElementById('chargingCost').value) || 8;
    const batteryReplaceCost = parseFloat(document.getElementById('batteryReplaceCost').value) || 700000;
    const batteryLife = parseFloat(document.getElementById('batteryLife').value) || 6;

    const monthlyKM = parseFloat(document.getElementById('monthlyKM').value) || 3000;
    const calculationYears = Math.min(parseFloat(document.getElementById('calculationYears').value) || 10, 15);

    const considerBattery = document.getElementById('considerBattery').checked;

    // Monthly usage calculation
    const annualKM = monthlyKM * 12;

    // Cost arrays for chart
    let years = [];
    let iceTCO = [];
    let evTCO = [];

    // Calculate TCO year by year
    for (let year = 1; year <= calculationYears; year++) {
        years.push(year);

        // ICE Yearly Cost
        const annualFuelCost = (annualKM / iceMileage) * fuelCost;
        const iceTotal = icePrice + (annualFuelCost * year);
        iceTCO.push(iceTotal);

        // EV Yearly Cost
        const annualChargingCost = (annualKM / evRange) * batteryCapacity * chargingCost;
        let evTotal = evPrice + (annualChargingCost * year);

        // Consider battery replacement
        if (considerBattery && year > batteryLife) {
            const batteryReplacements = Math.floor(year / batteryLife);
            evTotal += batteryReplacements * batteryReplaceCost;
        }

        evTCO.push(evTotal);
    }

    // Render the chart
    renderChart(years, iceTCO, evTCO);
}

function renderChart(years, iceTCO, evTCO) {
    const ctx = document.getElementById('costChart').getContext('2d');

    // Destroy previous chart if exists
    if (window.myChart) {
        window.myChart.destroy();
    }

    // Create the new chart
    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: 'ICE Total Cost (₹)',
                    data: iceTCO,
                    borderColor: '#ff4d4d',
                    backgroundColor: 'rgba(255, 77, 77, 0.4)',
                    fill: true,
                    tension: 0.3,
                },
                {
                    label: 'EV Total Cost (₹)',
                    data: evTCO,
                    borderColor: '#00eaff',
                    backgroundColor: 'rgba(0, 234, 255, 0.4)',
                    fill: true,
                    tension: 0.3,
                }
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: {
                    display: true,
                    text: 'ICE vs EV Cost Comparison Over Time (TCO)',
                    color: '#fff'
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Years',
                        color: '#00eaff'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Total Cost of Ownership (₹)',
                        color: '#ff4d4d'
                    },
                    ticks: {
                        callback: (value) => `₹${value.toLocaleString()}`,
                    }
                }
            }
        }
    });
}
