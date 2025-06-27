function getMatrixValues(prefix) {
  return [
    [parseFloat(document.getElementById(prefix + "11").value) || 0, parseFloat(document.getElementById(prefix + "12").value) || 0],
    [parseFloat(document.getElementById(prefix + "21").value) || 0, parseFloat(document.getElementById(prefix + "22").value) || 0]
  ];
}

function displayResult(matrix) {
  let html = "<table>";
  for (let i = 0; i < 2; i++) {
    html += "<tr>";
    for (let j = 0; j < 2; j++) {
      html += `<td>${matrix[i][j]}</td>`;
    }
    html += "</tr>";
  }
  html += "</table>";
  document.getElementById("resultMatrix").innerHTML = html;
}

function calculate(operation) {
  const A = getMatrixValues('a');
  const B = getMatrixValues('b');
  let result = [
    [0, 0],
    [0, 0]
  ];

  if (operation === 'add') {
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        result[i][j] = A[i][j] + B[i][j];
      }
    }
  } else if (operation === 'subtract') {
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        result[i][j] = A[i][j] - B[i][j];
      }
    }
  } else if (operation === 'multiply') {
    result[0][0] = A[0][0]*B[0][0] + A[0][1]*B[1][0];
    result[0][1] = A[0][0]*B[0][1] + A[0][1]*B[1][1];
    result[1][0] = A[1][0]*B[0][0] + A[1][1]*B[1][0];
    result[1][1] = A[1][0]*B[0][1] + A[1][1]*B[1][1];
  }

  displayResult(result);
}
