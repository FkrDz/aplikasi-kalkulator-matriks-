// Global variables
let matrixA = [];
let matrixB = [];

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    generateMatrices();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    document.getElementById('rowsA').addEventListener('change', generateMatrices);
    document.getElementById('colsA').addEventListener('change', generateMatrices);
    document.getElementById('rowsB').addEventListener('change', generateMatrices);
    document.getElementById('colsB').addEventListener('change', generateMatrices);
}

// Generate matrices based on input sizes
function generateMatrices() {
    const rowsA = parseInt(document.getElementById('rowsA').value);
    const colsA = parseInt(document.getElementById('colsA').value);
    const rowsB = parseInt(document.getElementById('rowsB').value);
    const colsB = parseInt(document.getElementById('colsB').value);

    // Validate input sizes
    if (rowsA < 1 || colsA < 1 || rowsB < 1 || colsB < 1) {
        showError('Ukuran matriks harus minimal 1x1');
        return;
    }

    if (rowsA > 5 || colsA > 5 || rowsB > 5 || colsB > 5) {
        showError('Ukuran matriks maksimal 5x5');
        return;
    }

    createMatrix('matrixA', rowsA, colsA);
    createMatrix('matrixB', rowsB, colsB);
    
    showSuccess('Matriks berhasil dibuat! Masukkan nilai dan pilih operasi.');
}

// Create matrix input fields
function createMatrix(containerId, rows, cols) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.value = '0';
            input.step = '0.1';
            input.id = `${containerId}_${i}_${j}`;
            input.placeholder = `${i+1},${j+1}`;
            
            // Add input animation
            input.addEventListener('input', function() {
                this.style.transform = 'scale(1.05)';
                this.style.borderColor = '#4CAF50';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                    this.style.borderColor = '#e0e0e0';
                }, 200);
            });
            
            // Add keyboard navigation
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    const nextInput = getNextInput(containerId, i, j, rows, cols);
                    if (nextInput) nextInput.focus();
                }
            });
            
            container.appendChild(input);
        }
    }
}

// Get next input for keyboard navigation
function getNextInput(containerId, currentRow, currentCol, totalRows, totalCols) {
    let nextRow = currentRow;
    let nextCol = currentCol + 1;
    
    if (nextCol >= totalCols) {
        nextCol = 0;
        nextRow++;
    }
    
    if (nextRow >= totalRows) {
        return null;
    }
    
    return document.getElementById(`${containerId}_${nextRow}_${nextCol}`);
}

// Get matrix values from inputs
function getMatrixValues(containerId, rows, cols) {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            const element = document.getElementById(`${containerId}_${i}_${j}`);
            const value = parseFloat(element.value) || 0;
            row.push(value);
        }
        matrix.push(row);
    }
    return matrix;
}

// Fill matrix with random values
function randomFillMatrix(containerId) {
    const container = document.getElementById(containerId);
    const inputs = container.querySelectorAll('input');
    
    inputs.forEach(input => {
        const randomValue = Math.floor(Math.random() * 20) - 10; // Random between -10 and 10
        input.value = randomValue;
        
        // Add animation effect
        input.style.backgroundColor = '#e8f5e8';
        setTimeout(() => {
            input.style.backgroundColor = '';
        }, 300);
    });
    
    showSuccess(`Matriks ${containerId === 'matrixA' ? 'A' : 'B'} berhasil diisi dengan nilai random!`);
}

// Display result
function displayResult(result, operation = '') {
    const resultDiv = document.getElementById('result');
    
    if (typeof result === 'string') {
        showError(result);
        return;
    }
    
    if (typeof result === 'number') {
        resultDiv.innerHTML = `
            <div style="text-align: center; font-size: 1.5em; font-weight: bold; color: #2c3e50;">
                <div class="success">
                    ${operation} = ${parseFloat(result.toFixed(6))}
                </div>
            </div>
        `;
        return;
    }

    // Display matrix result
    const resultMatrix = document.createElement('div');
    resultMatrix.className = 'result-matrix';
    resultMatrix.style.gridTemplateColumns = `repeat(${result[0].length}, 1fr)`;
    
    for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < result[i].length; j++) {
            const cell = document.createElement('div');
            cell.className = 'result-cell';
            cell.textContent = parseFloat(result[i][j].toFixed(3));
            cell.style.animationDelay = `${(i * result[0].length + j) * 0.1}s`;
            resultMatrix.appendChild(cell);
        }
    }
    
    resultDiv.innerHTML = '';
    if (operation) {
        const title = document.createElement('h4');
        title.textContent = `Hasil ${operation}:`;
        title.style.textAlign = 'center';
        title.style.marginBottom = '15px';
        title.style.color = '#2c3e50';
        resultDiv.appendChild(title);
    }
    resultDiv.appendChild(resultMatrix);
}

// Matrix Operations

// Matrix Addition
function addMatrices(a, b) {
    if (a.length !== b.length || a[0].length !== b[0].length) {
        return 'Error: Matriks harus memiliki ukuran yang sama untuk penjumlahan!';
    }
    
    const result = [];
    for (let i = 0; i < a.length; i++) {
        const row = [];
        for (let j = 0; j < a[i].length; j++) {
            row.push(a[i][j] + b[i][j]);
        }
        result.push(row);
    }
    return result;
}

// Matrix Subtraction
function subtractMatrices(a, b) {
    if (a.length !== b.length || a[0].length !== b[0].length) {
        return 'Error: Matriks harus memiliki ukuran yang sama untuk pengurangan!';
    }
    
    const result = [];
    for (let i = 0; i < a.length; i++) {
        const row = [];
        for (let j = 0; j < a[i].length; j++) {
            row.push(a[i][j] - b[i][j]);
        }
        result.push(row);
    }
    return result;
}

// Matrix Multiplication
function multiplyMatrices(a, b) {
    if (a[0].length !== b.length) {
        return 'Error: Jumlah kolom matriks A harus sama dengan jumlah baris matriks B untuk perkalian!';
    }
    
    const result = [];
    for (let i = 0; i < a.length; i++) {
        const row = [];
        for (let j = 0; j < b[0].length; j++) {
            let sum = 0;
            for (let k = 0; k < b.length; k++) {
                sum += a[i][k] * b[k][j];
            }
            row.push(sum);
        }
        result.push(row);
    }
    return result;
}

// Calculate Determinant (recursive method)
function calculateDeterminant(matrix) {
    if (matrix.length !== matrix[0].length) {
        return 'Error: Determinan hanya dapat dihitung untuk matriks persegi!';
    }
    
    const n = matrix.length;
    
    if (n === 1) {
        return matrix[0][0];
    }
    
    if (n === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }
    
    if (n === 3) {
        // Rule of Sarrus for 3x3 matrix
        return matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1])
             - matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0])
             + matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]);
    }
    
    // General case using cofactor expansion
    let det = 0;
    for (let i = 0; i < n; i++) {
        const minor = getMinor(matrix, 0, i);
        det += Math.pow(-1, i) * matrix[0][i] * calculateDeterminant(minor);
    }
    return det;
}

// Get minor matrix (used in determinant calculation)
function getMinor(matrix, row, col) {
    const minor = [];
    for (let i = 0; i < matrix.length; i++) {
        if (i !== row) {
            const newRow = [];
            for (let j = 0; j < matrix[i].length; j++) {
                if (j !== col) {
                    newRow.push(matrix[i][j]);
                }
            }
            minor.push(newRow);
        }
    }
    return minor;
}

// Matrix Transpose
function transposeMatrix(matrix) {
    const result = [];
    for (let j = 0; j < matrix[0].length; j++) {
        const row = [];
        for (let i = 0; i < matrix.length; i++) {
            row.push(matrix[i][j]);
        }
        result.push(row);
    }
    return result;
}

// Main calculation function
function calculateMatrix(operation) {
    // Show loading animation
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<div style="text-align: center;"><span class="loading"></span>Menghitung...</div>';
    
    setTimeout(() => {
        const rowsA = parseInt(document.getElementById('rowsA').value);
        const colsA = parseInt(document.getElementById('colsA').value);
        const rowsB = parseInt(document.getElementById('rowsB').value);
        const colsB = parseInt(document.getElementById('colsB').value);

        matrixA = getMatrixValues('matrixA', rowsA, colsA);
        matrixB = getMatrixValues('matrixB', rowsB, colsB);

        let result;
        let operationName = '';

        try {
            switch (operation) {
                case 'add':
                    result = addMatrices(matrixA, matrixB);
                    operationName = 'Penjumlahan (A + B)';
                    break;
                case 'subtract':
                    result = subtractMatrices(matrixA, matrixB);
                    operationName = 'Pengurangan (A - B)';
                    break;
                case 'multiply':
                    result = multiplyMatrices(matrixA, matrixB);
                    operationName = 'Perkalian (A × B)';
                    break;
                case 'determinant':
                    const detA = calculateDeterminant(matrixA);
                    const detB = calculateDeterminant(matrixB);
                    
                    if (typeof detA === 'string' && typeof detB === 'string') {
                        displayResult(detA);
                        return;
                    }
                    
                    let detResult = '';
                    if (typeof detA !== 'string') {
                        detResult += `<div class="success">Determinan A = ${parseFloat(detA.toFixed(6))}</div><br>`;
                    } else {
                        detResult += `<div class="error">Matriks A: ${detA}</div><br>`;
                    }
                    if (typeof detB !== 'string') {
                        detResult += `<div class="success">Determinan B = ${parseFloat(detB.toFixed(6))}</div>`;
                    } else {
                        detResult += `<div class="error">Matriks B: ${detB}</div>`;
                    }
                    
                    resultDiv.innerHTML = `
                        <div style="text-align: center; font-size: 1.2em;">
                            ${detResult}
                        </div>
                    `;
                    return;
                case 'transpose':
                    const transposeA = transposeMatrix(matrixA);
                    const transposeB = transposeMatrix(matrixB);
                    
                    resultDiv.innerHTML = `
                        <div style="text-align: center;">
                            <h4 style="color: #2c3e50; margin-bottom: 15px;">Hasil Transpose:</h4>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                                <div>
                                    <h5 style="margin-bottom: 10px;">Transpose A:</h5>
                                    <div id="transposeA"></div>
                                </div>
                                <div>
                                    <h5 style="margin-bottom: 10px;">Transpose B:</h5>
                                    <div id="transposeB"></div>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    displayMatrixInDiv('transposeA', transposeA);
                    displayMatrixInDiv('transposeB', transposeB);
                    return;
            }

            displayResult(result, operationName);
            
        } catch (error) {
            showError('Terjadi kesalahan dalam perhitungan: ' + error.message);
        }
    }, 500); // Delay for loading effect
}

// Display matrix in specific div (for transpose operation)
function displayMatrixInDiv(divId, matrix) {
    const div = document.getElementById(divId);
    const matrixDiv = document.createElement('div');
    matrixDiv.className = 'result-matrix';
    matrixDiv.style.gridTemplateColumns = `repeat(${matrix[0].length}, 1fr)`;
    
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            const cell = document.createElement('div');
            cell.className = 'result-cell';
            cell.textContent = parseFloat(matrix[i][j].toFixed(3));
            cell.style.animationDelay = `${(i * matrix[0].length + j) * 0.05}s`;
            matrixDiv.appendChild(cell);
        }
    }
    
    div.appendChild(matrixDiv);
}

// Utility Functions

// Show error message
function showError(message) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<div class="error">${message}</div>`;
}

// Show success message
function showSuccess(message) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<div class="success">${message}</div>`;
}

// Clear all matrices
function clearMatrices() {
    const inputsA = document.querySelectorAll('#matrixA input');
    const inputsB = document.querySelectorAll('#matrixB input');
    
    inputsA.forEach(input => {
        input.value = '0';
        input.style.backgroundColor = '#ffebee';
        setTimeout(() => {
            input.style.backgroundColor = '';
        }, 300);
    });
    
    inputsB.forEach(input => {
        input.value = '0';
        input.style.backgroundColor = '#ffebee';
        setTimeout(() => {
            input.style.backgroundColor = '';
        }, 300);
    });
    
    showSuccess('Semua matriks telah dikosongkan!');
}

// Copy matrix A to matrix B (if same size)
function copyMatrixAtoB() {
    const rowsA = parseInt(document.getElementById('rowsA').value);
    const colsA = parseInt(document.getElementById('colsA').value);
    const rowsB = parseInt(document.getElementById('rowsB').value);
    const colsB = parseInt(document.getElementById('colsB').value);
    
    if (rowsA !== rowsB || colsA !== colsB) {
        showError('Matriks A dan B harus memiliki ukuran yang sama untuk menyalin!');
        return;
    }
    
    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsA; j++) {
            const valueA = document.getElementById(`matrixA_${i}_${j}`).value;
            const inputB = document.getElementById(`matrixB_${i}_${j}`);
            inputB.value = valueA;
            
            // Add animation effect
            inputB.style.backgroundColor = '#e8f5e8';
            setTimeout(() => {
                inputB.style.backgroundColor = '';
            }, 300);
        }
    }
    
    showSuccess('Matriks A berhasil disalin ke Matriks B!');
}

// Validate matrix input
function validateMatrixInput(matrix, matrixName) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (isNaN(matrix[i][j])) {
                return `Error: Nilai pada ${matrixName}[${i+1}][${j+1}] bukan angka yang valid!`;
            }
            if (!isFinite(matrix[i][j])) {
                return `Error: Nilai pada ${matrixName}[${i+1}][${j+1}] tidak terbatas!`;
            }
        }
    }
    return null;
}

// Format number for display
function formatNumber(num) {
    if (Math.abs(num) < 0.001 && num !== 0) {
        return num.toExponential(3);
    }
    return parseFloat(num.toFixed(6));
}

// Export result to text
function exportResult() {
    const resultDiv = document.getElementById('result');
    const resultText = resultDiv.textContent || resultDiv.innerText;
    
    if (!resultText || resultText.includes('Belum ada operasi')) {
        showError('Tidak ada hasil untuk diekspor!');
        return;
    }
    
    const blob = new Blob([resultText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hasil_kalkulator_matriks.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showSuccess('Hasil berhasil diekspor!');
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey) {
        switch(e.key) {
            case 'Enter':
                e.preventDefault();
                generateMatrices();
                break;
            case '1':
                e.preventDefault();
                calculateMatrix('add');
                break;
            case '2':
                e.preventDefault();
                calculateMatrix('subtract');
                break;
            case '3':
                e.preventDefault();
                calculateMatrix('multiply');
                break;
            case '4':
                e.preventDefault();
                calculateMatrix('determinant');
                break;
            case '5':
                e.preventDefault();
                calculateMatrix('transpose');
                break;
        }
    }
});

// Add keyboard shortcut info to page
function addKeyboardShortcuts() {
    const shortcuts = `
        <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; font-size: 0.9em;">
            <h4 style="margin-bottom: 10px; color: #495057;">Keyboard Shortcuts:</h4>
            <ul style="margin: 0; padding-left: 20px; color: #6c757d;">
                <li>Ctrl + Enter: Buat Matriks</li>
                <li>Ctrl + 1: Penjumlahan</li>
                <li>Ctrl + 2: Pengurangan</li>
                <li>Ctrl + 3: Perkalian</li>
                <li>Ctrl + 4: Determinan</li>
                <li>Ctrl + 5: Transpose</li>
                <li>Enter: Pindah ke input berikutnya</li>
            </ul>
        </div>
    `;
    
    document.querySelector('.container').insertAdjacentHTML('beforeend', shortcuts);
}

// Initialize keyboard shortcuts info
document.addEventListener('DOMContentLoaded', function() {
    addKeyboardShortcuts();
});

// Matrix operations helper functions

// Check if matrix is square
function isSquareMatrix(matrix) {
    return matrix.length === matrix[0].length;
}

// Check if matrix is identity matrix
function isIdentityMatrix(matrix) {
    if (!isSquareMatrix(matrix)) return false;
    
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (i === j && matrix[i][j] !== 1) return false;
            if (i !== j && matrix[i][j] !== 0) return false;
        }
    }
    return true;
}

// Get matrix rank (simplified)
function getMatrixRank(matrix) {
    // This is a simplified rank calculation
    // For educational purposes only
    const m = matrix.length;
    const n = matrix[0].length;
    let rank = Math.min(m, n);
    
    // Copy matrix to avoid modifying original
    const mat = matrix.map(row => [...row]);
    
    for (let row = 0; row < rank; row++) {
        // Find pivot
        if (mat[row][row] !== 0) {
            for (let col = 0; col < m; col++) {
                if (col !== row) {
                    let mult = mat[col][row] / mat[row][row];
                    for (let i = 0; i < rank; i++) {
                        mat[col][i] -= mult * mat[row][i];
                    }
                }
            }
        } else {
            let reduce = true;
            for (let i = row + 1; i < m; i++) {
                if (mat[i][row] !== 0) {
                    // Swap rows
                    [mat[row], mat[i]] = [mat[i], mat[row]];
                    reduce = false;
                    break;
                }
            }
            
            if (reduce) {
                rank--;
                for (let i = 0; i < m; i++) {
                    mat[i][row] = mat[i][rank];
                }
            }
            row--;
        }
    }
    
    return rank;
}

// Console log for debugging (can be removed in production)
console.log('Kalkulator Matriks - Fikri Dzakwan (411241032) - Loaded Successfully!');
