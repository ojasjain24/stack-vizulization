class StackApp {
  constructor() {
    this.apiBaseUrl = "/api/stack";
    this.currentStack = null;
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadStackState();
  }

  bindEvents() {
    document.getElementById("pushBtn").addEventListener("click", () => {
      this.pushElement();
    });

    document.getElementById("popBtn").addEventListener("click", () => {
      this.popElement();
    });

    document.getElementById("clearBtn").addEventListener("click", () => {
      this.clearStack();
    });

    document.getElementById("updateSizeBtn").addEventListener("click", () => {
      this.updateStackSize();
    });

    document.getElementById("pushValue").addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.pushElement();
      }
    });

    document.getElementById("maxSize").addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.updateStackSize();
      }
    });

    document.getElementById("pushValue").addEventListener("input", (e) => {
      this.validatePushInput(e.target);
    });

    document.getElementById("maxSize").addEventListener("input", (e) => {
      this.validateSizeInput(e.target);
    });
  }

  async loadStackState() {
    try {
      const response = await fetch(this.apiBaseUrl);
      const result = await response.json();

      if (result.success) {
        this.currentStack = result.data;
        this.updateUI();
      } else {
        this.showMessage("Error loading stack state", "error");
      }
    } catch (error) {
      this.showMessage("Failed to connect to server", "error");
      console.error("Error loading stack state:", error);
    }
  }

  async pushElement() {
    const input = document.getElementById("pushValue");
    const value = parseInt(input.value);

    if (!this.validatePushInput(input)) {
      return;
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/push`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ element: value }),
      });

      const result = await response.json();

      if (result.success) {
        this.currentStack = result.stack;
        this.updateUI();
        this.showMessage(result.message, "success");
        input.value = "";
      } else {
        this.showMessage(result.message, "error");
      }
    } catch (error) {
      this.showMessage("Failed to push element", "error");
      console.error("Error pushing element:", error);
    }
  }

  async popElement() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/pop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        this.currentStack = result.stack;
        this.updateUI();
        this.showMessage(result.message, "success");
      } else {
        this.showMessage(result.message, "error");
      }
    } catch (error) {
      this.showMessage("Failed to pop element", "error");
      console.error("Error popping element:", error);
    }
  }

  async clearStack() {
    if (!this.currentStack || this.currentStack.isEmpty) {
      this.showMessage("Stack is already empty", "info");
      return;
    }

    if (!confirm("Are you sure you want to clear the stack?")) {
      return;
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/clear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        this.currentStack = result.stack;
        this.updateUI();
        this.showMessage(result.message, "success");
      } else {
        this.showMessage(result.message, "error");
      }
    } catch (error) {
      this.showMessage("Failed to clear stack", "error");
      console.error("Error clearing stack:", error);
    }
  }

  async updateStackSize() {
    const input = document.getElementById("maxSize");
    const newSize = parseInt(input.value);

    if (!this.validateSizeInput(input)) {
      return;
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/size`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ maxSize: newSize }),
      });

      const result = await response.json();

      if (result.success) {
        this.currentStack = result.stack;
        this.updateUI();
        this.showMessage(result.message, "success");
      } else {
        this.showMessage(result.message, "error");
      }
    } catch (error) {
      this.showMessage("Failed to update stack size", "error");
      console.error("Error updating stack size:", error);
    }
  }

  validatePushInput(input) {
    const value = parseInt(input.value);
    const isValid =
      !isNaN(value) &&
      Number.isInteger(value) &&
      value >= -1000 &&
      value <= 1000;

    if (input.value && !isValid) {
      input.setCustomValidity("Please enter an integer between -1000 and 1000");
      input.reportValidity();
      return false;
    } else {
      input.setCustomValidity("");
      return true;
    }
  }

  validateSizeInput(input) {
    const value = parseInt(input.value);
    const isValid =
      !isNaN(value) && Number.isInteger(value) && value >= 1 && value <= 100;

    if (!isValid) {
      input.setCustomValidity("Please enter an integer between 1 and 100");
      input.reportValidity();
      return false;
    } else {
      input.setCustomValidity("");
      return true;
    }
  }

  updateUI() {
    if (!this.currentStack) return;

    this.updateStackInfo();
    this.updateStackDisplay();
    this.updateButtons();
  }

  updateStackInfo() {
    document.getElementById(
      "currentSize"
    ).textContent = `Current: ${this.currentStack.size}/${this.currentStack.maxSize}`;

    let status = "Empty";
    if (this.currentStack.isFull) {
      status = "Full";
    } else if (!this.currentStack.isEmpty) {
      status = "Active";
    }

    document.getElementById("stackStatus").textContent = `Status: ${status}`;
  }

  updateStackDisplay() {
    const stackDisplay = document.getElementById("stackDisplay");
    stackDisplay.innerHTML = "";

    if (this.currentStack.isEmpty) {
      stackDisplay.innerHTML = '<div class="stack-empty">Stack is empty</div>';
      return;
    }

    this.currentStack.elements.forEach((element, index) => {
      const elementDiv = document.createElement("div");
      elementDiv.className = "stack-element";
      elementDiv.textContent = element;

      if (index === this.currentStack.elements.length - 1) {
        elementDiv.classList.add("top");
      }

      stackDisplay.appendChild(elementDiv);
    });
  }

  updateButtons() {
    const pushBtn = document.getElementById("pushBtn");
    const popBtn = document.getElementById("popBtn");
    const clearBtn = document.getElementById("clearBtn");

    pushBtn.disabled = this.currentStack.isFull;
    popBtn.disabled = this.currentStack.isEmpty;
    clearBtn.disabled = this.currentStack.isEmpty;
  }

  showMessage(message, type = "info") {
    const messageArea = document.getElementById("messageArea");

    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    messageArea.appendChild(messageDiv);

    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.style.animation = "slideOut 0.3s ease";
        setTimeout(() => {
          if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
          }
        }, 300);
      }
    }, 3000);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new StackApp();
});
