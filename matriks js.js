/**
 * Kalkulator Matriks
 * Nama: Fikri Dzakwan
 * NIM: 411241032
 */

class MatrixCalculator {
    constructor() {
        this.size = 3;
        this.operation = 'add';
        this.init();
    }

    /**
     * Inisialisasi aplikasi
     */
    init() {
        this.bindEvents();
        this.createMatrices();
        this.updateOperationVisibility();
        this.showWelcomeMessage();
    }

    /**
     * Mengikat event listeners
     */
    bindEvents() {
        // Event untuk perubahan ukuran matriks
        document.getElementById('matrixSize').addEventListener('change', (e) => {
            this.size = parseInt(e.target.value);
            this.createMatrices();
            this.clearResult();
        });

        // Event untuk perubahan operasi
        document.getElementById('operation').addEventListener('change', (e) => {
            this.operation = e.target.value;
            this.updateOperationVisibility();
            this.clearResult();
        });

        // Event untuk tombol hitung
        document.getElementById('calculateBtn').addEventListener('click', () => {
            this.calculate();
        });

        // Event untuk tombol bersihkan
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearMatrices();
        });

        // Event untuk tombol isi random
        document.getElementById('randomBtn').addEventListener('click', () => {
            this.fillRandom();
        });

        // Event untuk keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey) {
                switch(e.key) {
                    case 'Enter':
                        e.preventDefault();
                        this.calculate();
                        break;
                    case 'r':
                        e.preventDefault();
                        this.fillRandom();
                        break;
                    case 'Delete':
                        e.preventDefault();
                        this.clearMatrices();
                        break;
                }
            }
        });
    }

    /**
     * Membuat grid matriks untuk input
     */
    createMatrices() {
        this.createMatrix('matrixA');
        this.createMatrix('matrixB');
    }

    /**
     * Membuat grid matriks individual
     * @param {string} containerId - ID container matriks
     */
    createMatrix(containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        container.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;

        for (let i = 0; i < this.size * this.size; i++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.step = 'any';
            input.value = '0';
            input.className = 'matrix-input';
            input.placeholder = '0';
            
            // Event untuk auto-select saat focus
            input.addEventListener('focus', (e) => {
                e.target.select();
            });

            // Event untuk navigasi dengan arrow keys
            input.addEventListener('keydown', (e) => {
                this.handleMatrixNavigation(e, i, containerId);
            });

            container.appendChild(input);
        }
    }

    /**
     * Menangani navigasi dalam matriks dengan arrow keys
     * @param {Event} e - Event keyboard
     * @param {number} currentIndex - Index input saat ini
     * @param {string} containerId - ID container matriks
     */
    handleMatrixNavigation(e, currentIndex, containerId) {
        const container = document.getElementById(containerId);
        const inputs = container.querySelectorAll('input');
        let newIndex = currentIndex;

        switch(e.key) {
            case 'ArrowUp':
                e.preventDefault();
                newIndex = currentIndex - this.size;
                if (newIndex >= 0) inputs[newIndex].focus();
                break;
            case 'ArrowDown':
                e.preventDefault();
                newIndex = currentIndex + this.size;
                if (newIndex < inputs.length) inputs[newIndex].focus();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                newIndex = currentIndex - 1;
                if (newIndex >= 0 && Math.floor(newIndex / this.size) === Math.floor(currentIndex / this.size)) {
                    inputs[newIndex].focus();
                }
                break;
            case 'ArrowRight':
                e.preventDefault();
                newIndex = currentIndex + 1;
                if (newIndex < inputs.length && Math.floor(newIndex / this.size) === Math.floor(currentIndex / this.size)) {
                    inputs[newIndex].focus();
                }
                break;
            case 'Enter':
                e.preventDefault();
                newIndex = currentIndex + 1;
                if (newIndex < inputs.length) {
                    inputs[newIndex].focus();
                } else {
                    this.calculate();
                }
                break;
        }
    }

    /**
     * Mengatur visibilitas matriks B berdasarkan operasi
     */
    updateOperationVisibility() {
        const matrixBContainer = document.getElementById('matrixBContainer');
        const singleMatrixOps = ['determinant', 'transpose', 'inverse'];
        
        if (singleMatrixOps.includes(this.operation)) {
            matrixBContainer.classList.add('hidden');
        } else {
            matrixBContainer.classList.remove('hidden');
        }
    }

    /**
     * Mengambil nilai matriks dari input
     * @param {string} containerId - ID container matriks
     * @returns {Array} Matriks 2D
     */
    getMatrixValues(containerId) {
        const inputs = document.querySelectorAll(`#${containerId} input`);
        const matrix = [];
        
        for (let i = 0; i < this.size; i++) {
            matrix[i] = [];
            for (let j = 0; j < this.size; j++) {
                const value = parseFloat(inputs[i * this.size + j].value) || 0;
                matrix[i][j] = value;
            }
        }
        
        return matrix;
    }

    /**
     * Validasi matriks
     * @param {Array} matrix - Matriks untuk divalidasi
     * @returns {boolean} True jika valid
     */
    validateMatrix(matrix) {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (isNaN(matrix[i][j]) || !isFinite(matrix[i][j])) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Melakukan perhitungan berdasarkan operasi yang dipilih
     */
    calculate() {
        try {
            const matrixA = this.getMatrixValues('matrixA');
            
            if (!this.validateMatrix(matrixA)) {
                throw new Error('Matriks A mengandung nilai yang tidak valid');
            }

            let result;
            let operationName;

            switch (this.operation) {
                case 'add':
                    const matrixB_add = this.getMatrixValues('matrixB');
                    if (!this.validateMatrix(matrixB_add)) {
                        throw new Error('Matriks B mengandung nilai yang tidak valid');
                    }
                    result = this.addMatrices(matrixA, matrixB_add);
                    operationName = 'Penjumlahan';
                    break;
                    
                case 'subtract':
                    const matrixB_sub = this.getMatrixValues('matrixB');
                    if (!this.validateMatrix(matrixB_sub)) {
                        throw new Error('Matriks B mengandung nilai yang tidak valid');
                    }
                    result = this.subtractMatrices(matrixA, matrixB_sub);
                    operationName = 'Pengurangan';
                    break;
                    
                case 'multiply':
                    const matrixB_mul = this.getMatrixValues('matrixB');
                    if (!this.validateMatrix(matrixB_mul)) {
                        throw new Error('Matriks B mengandung nilai yang tidak valid');
                    }
                    result = this.multiplyMatrices(matrixA, matrixB_mul);
                    operationName = 'Perkalian';
                    break;
                    
                case 'determinant':
                    result = this.calculateDeterminant(matrixA);
                    operationName = 'Determinan';
                    break;
                    
                case 'transpose':
                    result = this.transposeMatrix(matrixA);
                    operationName = 'Transpose';
                    break;
                    
                case 'inverse':
                    result = this.inverseMatrix(matrixA);
                    operationName = 'Invers';
                    break;
                    
                default:
                    throw new Error('Operasi tidak dikenali');
            }

            this.displayResult(result, operationName);
            this.animateSuccess();
            
        } catch (error) {
            this.displayError(error.message);
            this.animateError();
        }
    }

    /**
     * Penjumlahan dua matriks
     * @param {Array} a - Matriks A
     * @param {Array} b - Matriks B
     * @returns {Array} Hasil penjumlahan
     */
    addMatrices(a, b) {
        const result = [];
        for (let i = 0; i < this.size; i++) {
            result[i] = [];
            for (let j = 0; j < this.size; j++) {
                result[i][j] = a[i][j] + b[i][j];
            }
        }
        return result;
    }

    /**
     * Pengurangan dua matriks
     * @param {Array} a - Matriks A
     * @param {Array} b - Matriks B
     * @returns {Array} Hasil pengurangan
     */
    subtractMatrices(a, b) {
        const result = [];
        for (let i = 0; i < this.size; i++) {
            result[i] = [];
            for (let j = 0; j < this.size; j++) {
                result[i][j] = a[i][j] - b[i][j];
            }
        }
        return result;
    }

    /**
     * Perkalian dua matriks
     * @param {Array} a - Matriks A
     * @param {Array} b - Matriks B
     * @returns {Array} Hasil perkalian
     */
    multiplyMatrices(a, b) {
        const result = [];
        for (let i = 0; i < this.size; i++) {
            result[i] = [];
            for (let j = 0; j < this.size; j++) {
                result[i][j] = 0;
                for (let k = 0; k < this.size; k++) {
                    result[i][j] += a[i][k] * b[k][j];
                }
            }
        }
        return result;
    }

    /**
     * Menghitung determinan matriks
     * @param {Array} matrix - Matriks input
     * @returns {number} Nilai determinan
     */
    calculateDeterminant(matrix) {
        if (this.size === 2) {
            return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        } else if (this.size === 3) {
            return matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
                   matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
                   matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]);
        } else if (this.size === 4) {
            // Untuk matriks 4x4, menggunakan ekspansi kofaktor
            let det = 0;
            for (let j = 0; j < this.size; j++) {
                det += matrix[0][j] * this.getCofactor(matrix, 0, j);
            }
            return det;
        }
        throw new Error('Ukuran matriks tidak didukung untuk perhitungan determinan');
    }

    /**
     * Menghitung kofaktor elemen matriks
     * @param {Array} matrix - Matriks input
     * @param {number} row - Baris yang dikecualikan
     * @param {number} col - Kolom yang dikecualikan
     * @returns {number} Nilai kofaktor
     */
    getCofactor(matrix, row, col) {
        const minor = this.getMinor(matrix, row, col);
        const sign = Math.pow(-1, row + col);
        return sign * this.calculateDeterminantRecursive(minor);
    }

    /**
     * Membuat matriks minor
     * @param {Array} matrix - Matriks input
     * @param {number} excludeRow - Baris yang dikecualikan
     * @param {number} excludeCol - Kolom yang dikecualikan
     * @returns {Array} Matriks minor
     */
    getMinor(matrix, excludeRow, excludeCol) {
        const minor = [];
        for (let i = 0; i < this.size; i++) {
            if (i === excludeRow) continue;
            const row = [];
            for (let j = 0; j < this.size; j++) {
                if (j === excludeCol) continue;
                row.push(matrix[i][j]);
            }
            minor.push(row);
        }
        return minor;
    }

    /**
     * Menghitung determinan secara rekursif untuk matriks berukuran variabel
     * @param {Array} matrix - Matriks input
     * @returns {number} Nilai determinan
     */
    calculateDeterminantRecursive(matrix) {
        const size = matrix.length;
        if (size === 1) return matrix[0][0];
        if (size === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        
        let det = 0;
        for (let j = 0; j < size; j++) {
            const minor = [];
            for (let i = 1; i < size; i++) {
                const row = [];
                for (let k = 0; k < size; k++) {
                    if (k !== j) row.push(matrix[i][k]);
                }
                minor.push(row);
            }
            det += matrix[0][j] * Math.pow(-1, j) * this.calculateDeterminantRecursive(minor);
        }
        return det;
    }

    /**
     * Transpose matriks
     * @param {Array} matrix - Matriks input
     * @returns {Array} Matriks transpose
     */
    transposeMatrix(matrix) {
        const result = [];
        for (let i = 0; i < this.size; i++) {
            result[i] = [];
            for (let j = 0; j < this.size; j++) {
                result[i][j] = matrix[j][i];
            }
        }
        return result;
    }

    /**
     * Menghitung invers matriks
     * @param {Array} matrix - Matriks input
     * @returns {Array} Matriks invers
     */
    inverseMatrix(matrix) {
        const det = this.calculateDeterminant(matrix);
        if (Math.abs(det) < 1e-10) {
            throw new Error('Matriks tidak memiliki invers (determinan = 0)');
        }

        if (this.size === 2) {
            return [
                [matrix[1][1] / det, -matrix[0][1] / det],
                [-matrix[1][0] / det, matrix[0][0] / det]
            ];
        } else {
            // Untuk matriks yang lebih besar, gunakan metode adjugate
            const adj = this.getAdjugate(matrix);
            const result = [];
            for (let i = 0; i < this.size; i++) {
                result[i] = [];
                for (let j = 0; j < this.size; j++) {
                    result[i][j] = adj[i][j] / det;
                }
            }
            return result;
        }
    }

    /**
     * Menghitung matriks adjugate
     * @param {Array} matrix - Matriks input
     * @returns {Array} Matriks adjugate
     */
    getAdjugate(matrix) {
        const adj = [];
        for (let i = 0; i < this.size; i++) {
            adj[i] = [];
            for (let j = 0; j < this.size; j++) {
                // Transpose dari kofaktor (adjugate = transpose dari cofactor matrix)
                adj[i][j] = this.getCofactor(matrix, j, i);
            }
        }
        return adj;
    }

    /**
     * Menampilkan hasil perhitungan
     * @param {Array|number} result - Hasil perhitungan
     * @param {string} operationName - Nama operasi
     */
    displayResult(result, operationName) {
        const resultDiv = document.getElementById('resultDisplay');
        
        if (typeof result === 'number') {
            // Hasil berupa scalar (determinan)
            resultDiv.innerHTML = `
                <div class="result-info">
                    <h4>${operationName} Matriks ${this.size}×${this.size}</h4>
                    <div class="result-scalar">${this.formatNumber(result)}</div>
                </div>
            `;
        } else {
            // Hasil berupa matriks
            let html = `
                <div class="result-info">
                    <h4>${operationName} Matriks ${this.size}×${this.size}</h4>
                    <div class="result-matrix" style="grid-template-columns: repeat(${this.size}, 1fr);">
            `;
            
            for (let i = 0; i < this.size; i++) {
                for (let j = 0; j < this.size; j++) {
                    html += `<span class="result-value">${this.formatNumber(result[i][j])}</span>`;
                }
            }
            
            html += '</div></div>';
            resultDiv.innerHTML = html;
        }
    }

    /**
     * Menampilkan pesan error
     * @param {string} message - Pesan error
     */
    displayError(message) {
        const resultDiv = document.getElementById('resultDisplay');
        resultDiv.innerHTML = `<div class="error">❌ Error: ${message}</div>`;
    }

    /**
     * Format angka untuk tampilan
     * @param {number} num - Angka yang akan diformat
     * @returns {string} Angka yang telah diformat
     */
    formatNumber(num) {
        if (Math.abs(num) < 1e-10) return '0';
        if (Number.isInteger(num)) return num.toString();
        return parseFloat(num.toFixed(6)).toString();
    }

    /**
     * Membersihkan semua input matriks
     */
    clearMatrices() {
        const inputs = document.querySelectorAll('.matrix-input');
        inputs.forEach(input => {
            input.value = '0';
        });
        
        document.getElementById('resultDisplay').innerHTML = `
            <div class="result-placeholder">
                Pilih operasi dan isi matriks untuk melihat hasil
            </div>
        `;
        
        this.showMessage('Matriks telah dibersihkan', 'success');
    }

    /**
     * Mengisi matriks dengan nilai random
     */
    fillRandom() {
        const inputs = document.querySelectorAll('.matrix-input');
        inputs.forEach(input => {
            // Random antara -10 sampai 10 dengan kemungkinan bilangan bulat lebih tinggi
            const isInteger = Math.random() > 0.3;
            if (isInteger) {
                input.value = Math.floor(Math.random() * 21) - 10;
            } else {
                input.value = (Math.random() * 20 - 10).toFixed(2);
            }
        });
        
        this.showMessage('Matriks telah diisi dengan nilai random', 'success');
    }

    /**
     * Membersihkan area hasil
     */
    clearResult() {
        document.getElementById('resultDisplay').innerHTML = `
            <div class="result-placeholder">
                Pilih operasi dan isi matriks untuk melihat hasil
            </div>
        `;
    }

    /**
     * Menampilkan pesan selamat datang
     */
    showWelcomeMessage() {
        const resultDiv = document.getElementById('resultDisplay');
        resultDiv.innerHTML = `
            <div class="result-placeholder">
                <div style="text-align: center;">
                    <h4>🧮 Selamat Datang di Kalkulator Matriks</h4>
                    <p>Pilih ukuran matriks, isi nilai, dan pilih operasi yang diinginkan</p>
                    <small>Tips: Gunakan Ctrl+Enter untuk menghitung, Ctrl+R untuk random, Ctrl+Del untuk bersihkan</small>
                </div>
            </div>
        `;
    }

    /**
     * Menampilkan pesan sementara
     * @param {string} message - Pesan yang akan ditampilkan
     * @param {string} type - Tipe pesan (success/error)
     */
    showMessage(message, type = 'success') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-toast ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 1000;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(messageDiv);
            }, 300);
        }, 2000);
    }

    /**
     * Animasi untuk operasi berhasil
     */
    animateSuccess() {
        const calculateBtn = document.getElementById('calculateBtn');
        calculateBtn.style.animation = 'pulse 0.6s ease-in-out';
        setTimeout(() => {
            calculateBtn.style.animation = '';
        }, 600);
    }

    /**
     * Animasi untuk error
     */
    animateError() {
        const calculateBtn = document.getElementById('calculateBtn');
        calculateBtn.style.animation = 'shake 0.6s ease-in-out';
        setTimeout(() => {
            calculateBtn.style.animation = '';
        }, 600);
    }

    /**
     * Mengekspor hasil ke clipboard
     * @param {Array|number} result - Hasil untuk diekspor
     */
    exportResult(result) {
        let exportText = `Hasil Perhitungan Matriks ${this.size}×${this.size}\n`;
        exportText += `Operasi: ${this.operation}\n`;
        exportText += `Tanggal: ${new Date().toLocaleString()}\n\n`;
        
        if (typeof result === 'number') {
            exportText += `Hasil: ${result}\n`;
        } else {
            exportText += 'Hasil Matriks:\n';
            for (let i = 0; i < this.size; i++) {
                exportText += result[i].map(val => this.formatNumber(val)).join('\t') + '\n';
            }
        }
        
        navigator.clipboard.writeText(exportText).then(() => {
            this.showMessage('Hasil berhasil disalin ke clipboard', 'success');
        }).catch(() => {
            this.showMessage('Gagal menyalin ke clipboard', 'error');
        });
    }
}

// CSS untuk animasi toast message
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Inisialisasi aplikasi ketika DOM sudah siap
document.addEventListener('DOMContentLoaded', () => {
    window.matrixCalculator = new MatrixCalculator();
    console.log('🧮 Kalkulator Matriks berhasil diinisialisasi');
    console.log('👨‍💻 Dibuat oleh: Fikri Dzakwan (411241032)');
});