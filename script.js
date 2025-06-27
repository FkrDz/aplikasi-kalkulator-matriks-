let currentOrder = 2;

document.addEventListener("DOMContentLoaded", () => {
  renderMatrixInputs();
});

function renderMatrixInputs() {
  currentOrder = parseInt(document.getElementById("order").value);
  const matrixA = document.getElementById("matrixA");
  const matrixB = document.getElementById("matrixB");

  matrixA.innerHTML = `<h2>Matriks A</h2>${generateMatrixGrid('a', currentOrder)}`;
  matrixB.innerHTML = `<h2>Matriks B</h2>${generateMatrixGrid('b', currentOrder)}`;
}

function generateMatrixGrid(prefix, order) {
  let grid = `<div class="matrix-grid" style="grid-template-columns: repeat(${order}, auto)">`;
  for (let i = 0; i < order; i++) {
    for (let j = 0; j < order; j++) {
      grid += `<input type="number" id="${prefix}_${i}_${j}" value="0">`;
    }
  }
  grid += "</div>";
  return grid;
}

function getMatrix(prefix) {
  let matrix = [];
  for (let i = 0; i < currentOrder; i++) {
    let row = [];
    for (let j = 0; j < currentOrder; j++) {
      const val = parseFloat(document.getElementById(`${prefix}_${i}_${j}`).value) || 0;
      row.push(val);
    }
    matrix.push(row);
  }
  return matrix;
}

function displayMatrix(matrix) {
  let html = "<table>";
  for (let row of matrix) {
    html += "<tr>";
    for (let val of row) {
      html += `<td>${Number.isFinite(val) ? val.toFixed(2) : val}</td>`;
    }
    html += "</tr>";
  }
  html += "</table>";
  document.getElementById("resultMatrix").innerHTML = html;
}

function displayScalar(value) {
  document.getElementById("resultMatrix").innerHTML = `<p><strong>${value.toFixed(2)}</strong></p>`;
}

function calculate(op) {
  const A = getMatrix('a');
  const B = getMatrix('b');
  let result;

  try {
    if (op === 'add') {
      result = addMatrices(A, B);
      displayMatrix(result);
    } else if (op === 'subtract') {
      result = subtractMatrices(A, B);
      displayMatrix(result);
    } else if (op === 'multiply') {
      result = multiplyMatrices(A, B);
      displayMatrix(result);
    } else if (op === 'transposeA') {
      result = transposeMatrix(A);
      displayMatrix(result);
    } else if (op === 'determinantA') {
      if (currentOrder > 4) {
        throw new Error("Ordo terlalu besar untuk determinan!");
      }
      const det = determinant(A);
      displayScalar(det);
    } else if (op === 'inverseA') {
      if (currentOrder > 4) {
        throw new Error("Ordo terlalu besar untuk invers!");
      }
      result = inverseMatrix(A);
      displayMatrix(result);
    }
  } catch (e) {
    document.getElementById("resultMatrix").innerHTML = `<p style="color:red;">${e.message}</p>`;
  }
}

// OPERASI DASAR

function addMatrices(A, B) {
  return A.map((row, i) => row.map((val, j) => val + B[i][j]));
}

function subtractMatrices(A, B) {
  return A.map((row, i) => row.map((val, j) => val - B[i][j]));
}

function multiplyMatrices(A, B) {
  const n = A.length;
  let result = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < n; k++) {
        result[i][j] += A[i][k] * B[k][j];
      }
    }
  }
  return result;
}

function transposeMatrix(A) {
  return A[0].map((_, i) => A.map(row => row[i]));
}

function determinant(M) {
  const n = M.length;
  if (n === 1) return M[0][0];
  if (n === 2) return M[0][0]*M[1][1] - M[0][1]*M[1][0];

  let det = 0;
  for (let j = 0; j < n; j++) {
    det += ((j%2===0 ? 1 : -1) * M[0][j] * determinant(minor(M, 0, j)));
  }
  return det;
}

function minor(M, row, col) {
  return M
    .filter((_, i) => i !== row)
    .map(r => r.filter((_, j) => j !== col));
}

function inverseMatrix(M) {
  const n = M.length;
  const det = determinant(M);
  if (Math.abs(det) < 1e-8) throw new Error("Determinan = 0. Tidak ada invers.");

  if (n === 1) return [[1 / det]];

  let cofactors = [];
  for (let i = 0; i < n; i++) {
    cofactors[i] = [];
    for (let j = 0; j < n; j++) {
      cofactors[i][j] = ((i + j) % 2 === 0 ? 1 : -1) * determinant(minor(M, i, j));
    }
  }

  let adjugate = transposeMatrix(cofactors);
  return adjugate.map(row => row.map(val => val / det));
}
