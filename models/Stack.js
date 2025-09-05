class Stack {
  constructor(maxSize = 10) {
    this.maxSize = maxSize;
    this.items = [];
  }

  push(element) {
    if (this.isFull()) {
      return false;
    }
    this.items.push(element);
    return true;
  }

  pop() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items.pop();
  }

  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  isFull() {
    return this.items.length >= this.maxSize;
  }

  size() {
    return this.items.length;
  }

  getAllElements() {
    return [...this.items];
  }

  clear() {
    this.items = [];
  }

  getMaxSize() {
    return this.maxSize;
  }

  setMaxSize(newMaxSize) {
    if (newMaxSize < 1 || newMaxSize < this.items.length) {
      return false;
    }
    this.maxSize = newMaxSize;
    return true;
  }
}

module.exports = Stack;
