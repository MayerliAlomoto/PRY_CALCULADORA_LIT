import { LitElement, html, css } from "lit";

export class BasicCalculator extends LitElement {
  static properties = {
    display: { type: String },
    operation: { type: String },
    firstValue: { type: Number },
    operator: { type: String },
    waitingForSecondValue: { type: Boolean }
  };

  // Usamos connectedCallback para la inicialización única
  connectedCallback() {
    super.connectedCallback();
    // Inicialización de estado
    if (this.display === undefined) {
      this.display = "0";
      this.operation = "";
      this.firstValue = null;
      this.operator = null;
      this.waitingForSecondValue = false;
    }
  }

  static styles = css`
    /* Definición de la paleta de colores pastel */
    :host {
        --pastel-blue: #a7c5eb; /* Base para botones secundarios (Números) */
        --pastel-green: #90f5d5; /* Base para el botón de Igual (=) */
        --pastel-red: #ffadad; /* Base para el botón de Limpiar (AC) */
        --pastel-yellow: #fff3b0; /* Base para botones de Operadores (+, -, x, /) */
        --dark-bg: #495057; /* Texto e interiores oscuros */
        --light-bg: #f3f5f9; /* Fondo de la calculadora */
        --screen-bg: #ffffff; /* Fondo de la pantalla de visualización */
        --screen-text: #2c3e50; /* Color del texto principal de la pantalla */
        
        display: block;
        padding: 10px;
    }
    .calculator {
      max-width: 320px; 
      margin: 20px auto;
      padding: 15px;
      border-radius: 15px;
      background: var(--light-bg);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1); /* Sombra más suave */
    }
    .display-box {
      background: var(--screen-bg);
      color: var(--screen-text);
      font-size: 2.2rem;
      padding: 15px;
      border-radius: 10px;
      text-align: right;
      margin-bottom: 10px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      min-height: 50px;
      font-weight: 600;
      box-shadow: inset 0 2px 5px rgba(0,0,0,0.05); /* Sombra interna sutil */
    }
    .operation-box {
      background: var(--screen-bg);
      color: var(--dark-bg);
      padding: 8px 15px;
      font-size: 0.9rem;
      text-align: right;
      margin-bottom: 5px;
      border-radius: 8px;
      font-family: monospace;
      opacity: 0.7;
    }
    /* Estilo de los botones para un look más moderno */
    button {
      font-size: 1.3rem;
      padding: 15px 5px; 
      border-radius: 10px !important;
      font-weight: bold;
      border: none !important; /* Quitar bordes de Bootstrap */
      transition: background-color 0.15s ease;
    }
    
    /* Clases de Bootstrap personalizadas para botones (Pastel) */

    /* Botones de números (secundarios) */
    .btn-secondary { 
        background-color: var(--pastel-blue) !important; 
        color: var(--dark-bg) !important;
        box-shadow: 0 4px 0 var(--dark-bg); /* Efecto 3D suave */
    }
    .btn-secondary:active, .btn-secondary:focus { 
        background-color: #8bb4e4 !important; 
        box-shadow: 0 1px 0 var(--dark-bg) !important;
        transform: translateY(3px); /* Presionar */
    }

    /* Botones de operadores (warning/amarillo) */
    .btn-warning { 
        background-color: var(--pastel-yellow) !important; 
        color: var(--dark-bg) !important;
        box-shadow: 0 4px 0 #e8d098;
    }
    .btn-warning:active, .btn-warning:focus { 
        background-color: #f7e09e !important; 
        box-shadow: 0 1px 0 #e8d098 !important;
        transform: translateY(3px);
    }

    /* Botón de limpiar (danger/rojo) */
    .btn-danger { 
        background-color: var(--pastel-red) !important; 
        color: var(--dark-bg) !important;
        box-shadow: 0 4px 0 #d99191;
    }
    .btn-danger:active, .btn-danger:focus { 
        background-color: #e49a9a !important; 
        box-shadow: 0 1px 0 #d99191 !important;
        transform: translateY(3px);
    }

    /* Botón de igual (success/verde) */
    .btn-success { 
        background-color: var(--pastel-green) !important; 
        color: var(--dark-bg) !important;
        box-shadow: 0 4px 0 #7ddbb6;
    }
    .btn-success:active, .btn-success:focus { 
        background-color: #82e4c2 !important; 
        box-shadow: 0 1px 0 #7ddbb6 !important;
        transform: translateY(3px);
    }
  `;

  handleNumber(n) {
    if (this.waitingForSecondValue) {
      this.display = n;
      // Reinicia operation si es el inicio del segundo valor, para evitar concatenación no deseada
      this.operation = `${this.firstValue} ${this.operator} ${n}`;
      this.waitingForSecondValue = false;
    } else {
      // Limita la longitud del display para evitar desbordamiento
      if (this.display.length < 15) {
        this.display = this.display === "0" ? n : this.display + n;
      }
      
      // Actualiza operation para reflejar el valor actual
      let currentOp = this.operation;
      if (this.operator && currentOp.includes(this.operator)) {
          // Reemplaza el segundo operando con el nuevo display
          let parts = currentOp.split(` ${this.operator} `);
          this.operation = `${parts[0]} ${this.operator} ${this.display}`;
      } else {
          // Si no hay operador, es el primer valor
          this.operation = this.display;
      }
    }
  }

  handleDecimal() {
    if (this.waitingForSecondValue) {
      this.display = "0.";
      this.waitingForSecondValue = false;
    } else if (!this.display.includes('.')) {
      this.display += ".";
    }
    
    // Actualiza operation para incluir el decimal
    let currentOp = this.operation;
    if (this.operator && currentOp.includes(this.operator)) {
        let parts = currentOp.split(` ${this.operator} `);
        this.operation = `${parts[0]} ${this.operator} ${this.display}`;
    } else {
        this.operation = this.display;
    }
  }

  handleOperator(op) {
    if (this.firstValue === null) {
      this.firstValue = Number(this.display);
    } else if (!this.waitingForSecondValue) {
      // Calcula si ya hay un valor y no se está esperando el segundo
      this.calculate();
    }

    this.operator = op;
    this.waitingForSecondValue = true;
    this.operation = `${this.firstValue} ${op} `;
  }

  calculate() {
    const value = Number(this.display);

    switch (this.operator) {
      case "+": this.firstValue += value; break;
      case "-": this.firstValue -= value; break;
      case "*": this.firstValue *= value; break;
      case "/": 
        if (value === 0) {
            // Manejo de división por cero
            this.display = "Error";
            this.handleClear(true); // Limpiar pero dejar el error en display brevemente
            return;
        }
        this.firstValue /= value; 
        break;
    }

    // Redondeo simple para evitar problemas de coma flotante si es necesario
    this.firstValue = parseFloat(this.firstValue.toFixed(10)); 
    this.display = String(this.firstValue);
    this.operation = this.display; // La operación ahora es el resultado
  }

  handleEquals() {
    if (this.operator !== null) {
      this.calculate();
      this.operator = null;
      // No reseteamos firstValue aquí para permitir más operaciones con el resultado
      this.waitingForSecondValue = true; // Para que el siguiente número reemplace el resultado
    }
  }

  // flag = true si se está llamando después de un error, para no borrar el display inmediatamente
  handleClear(isError = false) {
    if (!isError) {
        this.display = "0";
    }
    this.operation = "";
    this.firstValue = null;
    this.operator = null;
    this.waitingForSecondValue = false;
  }

  render() {
    return html`
      <!-- ENLACE  BOOSTRAP LOCAL -->
      <link 
        rel="stylesheet" 
        href="/vendor/bootstrap-5.0.2-dist/css/bootstrap.min.css" 
      >

      <div class="calculator">
        <div class="operation-box">${this.operation}</div>
        <div class="display-box">${this.display}</div>

        <div class="container-fluid p-0">
          <div class="row g-2">
            <!-- Fila 1: C, /, *, - -->
            <div class="col-3">
              <button class="btn btn-danger w-100" @click=${() => this.handleClear()}>AC</button>
            </div>
            <div class="col-3">
              <button class="btn btn-warning w-100" @click=${() => this.handleOperator("/")}>÷</button>
            </div>
            <div class="col-3">
              <button class="btn btn-warning w-100" @click=${() => this.handleOperator("*")}>×</button>
            </div>
            <div class="col-3">
              <button class="btn btn-warning w-100" @click=${() => this.handleOperator("-")}>−</button>
            </div>
          </div>
          
          <div class="row g-2 mt-2">
            <!-- Fila 2: 7, 8, 9, + -->
            ${["7","8","9"].map(n => html`
            <div class="col-3">
              <button class="btn btn-secondary w-100" @click=${() => this.handleNumber(n)}>${n}</button>
            </div>`)}
            <div class="col-3">
              <button class="btn btn-warning w-100" @click=${() => this.handleOperator("+")}>+</button>
            </div>
          </div>

          <div class="row g-2 mt-2">
            <!-- Fila 3: 4, 5, 6 -->
            ${["4","5","6"].map(n => html`
            <div class="col-3">
              <button class="btn btn-secondary w-100" @click=${() => this.handleNumber(n)}>${n}</button>
            </div>`)}
            <!-- Espacio para mantener la cuadrícula -->
            <div class="col-3"></div>
          </div>

          <div class="row g-2 mt-2">
            <!-- Fila 4: 1, 2, 3 -->
            ${["1","2","3"].map(n => html`
            <div class="col-3">
              <button class="btn btn-secondary w-100" @click=${() => this.handleNumber(n)}>${n}</button>
            </div>`)}
             <!-- Espacio para mantener la cuadrícula -->
             <div class="col-3"></div>
          </div>

          <div class="row g-2 mt-2">
            <!-- Fila 5: 0, ., = (Ajuste del layout) -->
            <div class="col-3"> <!-- Botón 0 -->
              <button class="btn btn-secondary w-100" @click=${() => this.handleNumber("0")}>0</button>
            </div>
            <div class="col-3"> <!-- Botón Punto Decimal -->
              <button class="btn btn-secondary w-100" @click=${this.handleDecimal}>.</button>
            </div>
            <div class="col-6"> <!-- Botón Igual ocupa 2 columnas -->
              <button class="btn btn-success w-100" @click=${this.handleEquals}>=</button>
            </div>
          </div>

        </div>
      </div>
    `;
  }
}

customElements.define("basic-calculator", BasicCalculator);