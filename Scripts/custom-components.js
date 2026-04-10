class ShiftGauge extends HTMLElement {
  connectedCallback() {
    const id = this.getAttribute('id');

    const title = this.getAttribute('title');
    const worker = this.getAttribute('worker');
    const remainCount = this.getAttribute('remain-count');
    const declineIconPath = this.getAttribute('decline-icon-path');

    const totalAmount = +this.getAttribute('total-amount');
    const actualAmount = +this.getAttribute('actual-amount');
    const declineAmount = +this.getAttribute('decline-amount');

    const actualDeclineAmount = actualAmount + declineAmount;
    const remainAmount = totalAmount - actualDeclineAmount;

    this.innerHTML = `
      <div id="${id}" class="shift-gauge">
        <div>
          <p class="shift-gauge__title">${title}</p>
          <p class="shift-gauge__worker">${worker}</p>
          <p class="shift-gauge__remain">
            <span>Остаток смен:</span>
            <span>${remainCount}</span>
          </p>
          <p class="shift-gauge__budget">
            <span class="shift-gauge__budget__label">Бюджет на текущую дату:</span>
            <span class="shift-gauge__budget__value" data-shift-actual-decline>${actualDeclineAmount}</span>
            <span class="shift-gauge__budget__value">тн.</span>
          </p>
        </div>

        <div class="gauge" style="--green-deg: 80deg; --red-deg: 30deg; --needle-deg: 80deg;">
          <div class="gauge__arc"></div>
          
          <div class="gauge__label static left">
            <p>Фактический выпуск</p>
            <p>отработанных смен</p>
            <p>
              <span class="gauge__label__value" data-shift-actual>${actualAmount}</span>
              <span class="gauge__label__value">тн.</span>
            </p>
          </div>

          <div class="gauge__label static right">
            <p>Остаток бюджета</p>
            <p>на текущую дату</p>
            <p class="gauge__label__value">${remainAmount} тн.</p>
          </div>

          <div class="floating-container" style="--center-angle: calc(var(--green-deg) + (var(--red-deg) / 2));">
            <div class="gauge__label floating">
              <p>Отклонение от бюджета</p>
              <p>на текущую дату</p>
              <p>
                <span class="gauge__label__icon">
                  <img src="${declineIconPath}" alt="arrow"></img>
                </span>
                <span class="gauge__label__value" data-shift-decline>${declineAmount}</span>
                <span class="gauge__label__value">тн.</span>
              </p>
            </div>
          </div>

          <div class="needle"></div>
          <div class="hay">
            <p class="hay__label">Бюджет</p>
            <p class="hay__label">на месяц</p>
            <p class="hay__value" data-shift-total>${totalAmount}</p>
            <p class="hay__unit">тонны</p>
          </div>
        </div>
      </div>
    `;
  }
}

class ShiftCard extends HTMLElement {
  connectedCallback() {
    const id = this.getAttribute('id');
    const title = this.getAttribute('title');

    const active = this.hasAttribute('active');
    const best = this.hasAttribute('best');
    const progressIconPath = this.getAttribute('progress-icon-path');

    const planAmount = this.getAttribute('plan-amount');
    const lastAmount = this.getAttribute('last-amount');
    const greenCount = this.getAttribute('green-count');
    
    const wasteRate = this.getAttribute('waste-rate');
    const wasteNorm = this.getAttribute('waste-norm');

    function renderWasteIcon() {
      if (+wasteRate?.replace(',', '.') <= +wasteNorm?.replace(',', '.')) {
        return `<img src="./Assets/SVG/black_arrow_green.svg" alt="arrow green"></img>`;
      } else {
        return `<img src="./Assets/SVG/black_arrow_red.svg" alt="arrow red"></img>`;
      }
    }

    function renderBestIcon() {
      if (best) {
        return `<img class="shift-card__best-icon" src="./Assets/PNG/best_badge.png" alt="best badge"></img>`;
      } else {
        return '';
      }
    }

    this.innerHTML = `
      <div id="${id}" class="shift-card ${active ? 'active' : ''}">
        ${renderBestIcon()}
        <p class="shift-card__title">${title}</p>

        <div class="shift-card__content">
          <p class="shift-card__content__item">
            <span class="shift-card__content__item__label">План на смену:</span>
            <span class="shift-card__content__item__value">${planAmount} тн.</span>
          </p>

          <hr class="divider"></hr>

          <p class="shift-card__content__item">
            <p class="shift-card__content__item__label">Фактический выпуск последней смены</p>
            <div class="shift-card__content__item__progress">
              <div class="shift-card__content__item__progress__value">
                <span class="shift-card__content__item__progress__value_icon">
                  <img src="${progressIconPath}" alt="arrow"></img>
                </span>
                <span>${lastAmount} тн.</span>
              </div>
              <div 
                class="shift-card__content__item__progress__bar" 
                style="--progress: ${+lastAmount?.replace(',', '.') / +planAmount?.replace(',', '.')};"
              ></div>
            </div>
          </p>

          <hr class="divider"></hr>

          <p class="shift-card__content__item">
            <span class="shift-card__content__item__label">Зеленые смены:</span>
            <span class="shift-card__content__item__value">${greenCount}</span>
            <span class="shift-card__content__item__leafs" style="--leaf-count: ${greenCount};"></span>
          </p>

          <hr class="divider"></hr>

          <p class="shift-card__content__item">
            <span class="shift-card__content__item__label">Процент отходов:</span>
            <span class="shift-card__content__item__value">${wasteRate}%</span>
            <span class="shift-card__content__item__icon">${renderWasteIcon()}</span>
            <span class="shift-card__content__item__norm">(норма ${wasteNorm}%)</span>
          </p>
        </div>
      </div>
    `;
  }
}

class ShiftWasteTable extends HTMLElement {
  connectedCallback() {
    const id = this.getAttribute('id');
    const title = this.getAttribute('title');

    const th = JSON
      .parse(this.getAttribute('th') || '[]')
      .map(item => `<th>${item}</th>`).join('');

    const trTd = JSON
      .parse(this.getAttribute('tr-td') || '[]')
      .map(row => {
        const td = row.map(cell => 
          `<td class="${cell.color}">
            <p>
              ${cell.value}%
              <img 
                src="./Assets/SVG/black_arrow_${cell.color}.svg" 
                alt="arrow"></img>
            </p>
           </td>`
        ).join('');
        return `<tr>${td}</tr>`;
      })
      .join('');

    const bin = JSON
      .parse(this.getAttribute('bin') || '[]')
      .map(item => 
        `<p>
          ${item.value}%
          <img 
            src="./Assets/SVG/white_arrow_${item.color}.svg" 
            alt="arrow"></img>
         </p>`
      ).join('');


    this.innerHTML = `
       <div id="${id}" class="shift-waste__table">
        <p class="shift-waste__table__title">${title}</p>

        <table>
          <thead>
            <tr>
              ${th}
            </tr>
          </thead>

          <tbody>
            ${trTd}
          </tbody>
        </table>

        <p class="shift-waste__table__bin__label">Итого за смену</p>
        <div class="shift-waste__table__bin__data">
          ${bin}
        </div>
        <img class="shift-waste__table__bin" src="./Assets/PNG/bin.png" alt="bin"></img>
      </div>
    `
  }
}

customElements.define('shift-gauge', ShiftGauge);
customElements.define('shift-card', ShiftCard);
customElements.define('shift-waste-table', ShiftWasteTable);
