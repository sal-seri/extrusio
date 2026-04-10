const shifts = ['shift-1', 'shift-2', 'shift-3', 'shift-4']

function updateDashboard(shift, actual, deviation, total) {
  const gauge = shift.querySelector('.gauge');

  const unitToDeg = 180 / total;

  const greenDeg = actual * unitToDeg;
  const redDeg = deviation * unitToDeg;
  
  gauge.style.setProperty('--green-deg', `${greenDeg}deg`);
  gauge.style.setProperty('--red-deg', `${redDeg}deg`);
  gauge.style.setProperty('--needle-deg', `${greenDeg}deg`);
}

shifts.forEach((shift) => {
  const element = document.getElementById(shift);
  let total = element.querySelector('[data-shift-total]')
  let actual = element.querySelector('[data-shift-actual]')
  let decline = element.querySelector('[data-shift-decline]')

  total = +total.innerHTML
  actual = +actual.innerHTML
  decline = +decline.innerHTML

  updateDashboard(element, actual, decline, total);
})
