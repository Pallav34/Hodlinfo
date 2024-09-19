
async function fetchAndDisplayData() {
    const tbody = document.querySelector('#cryptoTable tbody');
    const loadingMessage = document.getElementById('loadingMessage');

    
    loadingMessage.style.display = 'block';

    
    try {
        const response = await fetch('http://localhost:3000/cryptos');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        
        tbody.innerHTML = '';

        
        data.forEach((crypto, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${crypto.name}</td>
                <td>${crypto.last}</td>
                <td>${crypto.buy}</td>
                <td>${crypto.sell}</td>
                <td>${crypto.volume}</td>
                <td>${crypto.base_unit}</td>
            `;
            tbody.appendChild(row);
        });

    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        
        loadingMessage.style.display = 'none';
    }
}


window.onload = fetchAndDisplayData;


document.getElementById('fetchData').addEventListener('click', fetchAndDisplayData);


const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('light-theme');
});
