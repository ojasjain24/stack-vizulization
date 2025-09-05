const Stack = require("../models/Stack");

class StackController {
  constructor() {
    this.stack = new Stack(10);
  }

  pushElement(element) {
    if (typeof element !== "number" || !Number.isInteger(element)) {
      return {
        success: false,
        message: "Please enter a valid integer",
      };
    }

    if (element < -1000 || element > 1000) {
      return {
        success: false,
        message: "Number must be between -1000 and 1000",
      };
    }

    const success = this.stack.push(element);

    if (success) {
      return {
        success: true,
        message: `Element ${element} pushed successfully`,
        stack: this.getStackState(),
      };
    } else {
      return {
        success: false,
        message: "Stack is full. Cannot push more elements.",
      };
    }
  }

  popElement() {
    const element = this.stack.pop();

    if (element !== null) {
      return {
        success: true,
        message: `Element ${element} popped successfully`,
        poppedElement: element,
        stack: this.getStackState(),
      };
    } else {
      return {
        success: false,
        message: "Stack is empty. Cannot pop elements.",
      };
    }
  }

  getStackState() {
    return {
      elements: this.stack.getAllElements(),
      size: this.stack.size(),
      maxSize: this.stack.getMaxSize(),
      isEmpty: this.stack.isEmpty(),
      isFull: this.stack.isFull(),
      topElement: this.stack.peek(),
    };
  }

  clearStack() {
    this.stack.clear();
    return {
      success: true,
      message: "Stack cleared successfully",
      stack: this.getStackState(),
    };
  }

  setMaxSize(newMaxSize) {
    if (
      typeof newMaxSize !== "number" ||
      !Number.isInteger(newMaxSize) ||
      newMaxSize < 1
    ) {
      return {
        success: false,
        message: "Please enter a valid positive integer for stack size",
      };
    }

    if (newMaxSize > 100) {
      return {
        success: false,
        message: "Maximum stack size cannot exceed 100",
      };
    }

    const success = this.stack.setMaxSize(newMaxSize);

    if (success) {
      return {
        success: true,
        message: `Stack size updated to ${newMaxSize}`,
        stack: this.getStackState(),
      };
    } else {
      return {
        success: false,
        message: `Cannot set size to ${newMaxSize}. Current stack has ${this.stack.size()} elements.`,
      };
    }
  }

  getStack() {
    return this.stack;
  }
}

module.exports = StackController;
