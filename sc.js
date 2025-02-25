class Calculator {
    constructor() {
      this.previousOperandElement = document.getElementById('previous-operand');
      this.currentOperandElement = document.getElementById('current-operand');
      this.clear();
      this.setupEventListeners();
    }
  
    clear() {
      this.currentOperand = '0';
      this.previousOperand = '';
      this.operation = undefined;
      this.updateDisplay();
    }
  
    delete() {
      if (this.currentOperand === '0') return;
      if (this.currentOperand.length === 1) {
        this.currentOperand = '0';
      } else {
        this.currentOperand = this.currentOperand.slice(0, -1);
      }
      this.updateDisplay();
    }
  
    appendNumber(number) {
      if (number === '.' && this.currentOperand.includes('.')) return;
      if (this.currentOperand === '0' && number !== '.') {
        this.currentOperand = number;
      } else {
        this.currentOperand += number;
      }
      this.updateDisplay();
    }
  
    chooseOperation(operation) {
      if (this.currentOperand === '') return;
      if (this.previousOperand !== '') {
        this.compute();
      }
      this.operation = operation;
      this.previousOperand = this.currentOperand;
      this.currentOperand = '0';
      this.updateDisplay();
    }
  
    compute() {
      let computation;
      const prev = parseFloat(this.previousOperand);
      const current = parseFloat(this.currentOperand);
      if (isNaN(prev) || isNaN(current)) return;
  
      switch (this.operation) {
        case '+':
          computation = prev + current;
          break;
        case '-':
          computation = prev - current;
          break;
        case '×':
          computation = prev * current;
          break;
        case '÷':
          if (current === 0) {
            this.currentOperand = 'Error';
            this.previousOperand = '';
            this.operation = undefined;
            this.updateDisplay();
            return;
          }
          computation = prev / current;
          break;
        case '%':
          computation = (prev * current) / 100;
          break;
        default:
          return;
      }
  
      this.currentOperand = this.formatNumber(computation);
      this.operation = undefined;
      this.previousOperand = '';
      this.updateDisplay();
    }
  
    formatNumber(number) {
      if (isNaN(number)) return 'Error';
      const stringNumber = number.toString();
      const [integerDigits, decimalDigits] = stringNumber.split('.');
      let formattedInteger = integerDigits;
      
      // Add thousand separators
      if (integerDigits.length > 3) {
        formattedInteger = integerDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      
      if (decimalDigits != null) {
        return `${formattedInteger}.${decimalDigits}`;
      }
      return formattedInteger;
    }
  
    updateDisplay() {
      this.currentOperandElement.textContent = this.currentOperand;
      if (this.operation != null) {
        this.previousOperandElement.textContent = 
          `${this.formatNumber(this.previousOperand)} ${this.operation}`;
      } else {
        this.previousOperandElement.textContent = '';
      }
    }
  
    setupEventListeners() {
      // Number buttons
      document.querySelectorAll('[data-number]').forEach(button => {
        button.addEventListener('click', () => {
          this.appendNumber(button.dataset.number);
        });
      });
  
      // Operator buttons
      document.querySelectorAll('[data-operator]').forEach(button => {
        button.addEventListener('click', () => {
          this.chooseOperation(button.dataset.operator);
        });
      });
  
      // Action buttons
      document.querySelectorAll('[data-action]').forEach(button => {
        button.addEventListener('click', () => {
          switch (button.dataset.action) {
            case 'clear':
              this.clear();
              break;
            case 'backspace':
              this.delete();
              break;
            case 'equals':
              this.compute();
              break;
            case 'percent':
              this.chooseOperation('%');
              break;
          }
        });
      });
  
      // Keyboard support
      document.addEventListener('keydown', (e) => {
        if (e.key >= '0' && e.key <= '9' || e.key === '.') {
          this.appendNumber(e.key);
        }
        if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
          const operatorMap = { '*': '×', '/': '÷' };
          this.chooseOperation(operatorMap[e.key] || e.key);
        }
        if (e.key === 'Enter' || e.key === '=') {
          e.preventDefault();
          this.compute();
        }
        if (e.key === 'Backspace') {
          this.delete();
        }
        if (e.key === 'Escape') {
          this.clear();
        }
        if (e.key === '%') {
          this.chooseOperation('%');
        }
      });
    }
  }
  
  // Initialize calculator
  const calculator = new Calculator();