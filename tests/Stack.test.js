const Stack = require("../models/Stack");

describe("Stack Data Structure", () => {
  let stack;

  beforeEach(() => {
    stack = new Stack(5); // Create a stack with max size 5
  });

  describe("Constructor", () => {
    test("should create an empty stack with default size", () => {
      const defaultStack = new Stack();
      expect(defaultStack.size()).toBe(0);
      expect(defaultStack.getMaxSize()).toBe(10);
      expect(defaultStack.isEmpty()).toBe(true);
    });

    test("should create an empty stack with custom size", () => {
      expect(stack.size()).toBe(0);
      expect(stack.getMaxSize()).toBe(5);
      expect(stack.isEmpty()).toBe(true);
    });
  });

  describe("Push Operation", () => {
    test("should push element to empty stack", () => {
      const result = stack.push(42);
      expect(result).toBe(true);
      expect(stack.size()).toBe(1);
      expect(stack.peek()).toBe(42);
      expect(stack.isEmpty()).toBe(false);
    });

    test("should push multiple elements", () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);

      expect(stack.size()).toBe(3);
      expect(stack.peek()).toBe(3);
      expect(stack.getAllElements()).toEqual([1, 2, 3]);
    });

    test("should not push when stack is full", () => {
      // Fill the stack
      stack.push(1);
      stack.push(2);
      stack.push(3);
      stack.push(4);
      stack.push(5);

      expect(stack.isFull()).toBe(true);

      const result = stack.push(6);
      expect(result).toBe(false);
      expect(stack.size()).toBe(5);
      expect(stack.peek()).toBe(5);
    });

    test("should handle negative numbers", () => {
      stack.push(-10);
      stack.push(-5);

      expect(stack.size()).toBe(2);
      expect(stack.peek()).toBe(-5);
      expect(stack.getAllElements()).toEqual([-10, -5]);
    });

    test("should handle zero", () => {
      stack.push(0);
      expect(stack.size()).toBe(1);
      expect(stack.peek()).toBe(0);
    });
  });

  describe("Pop Operation", () => {
    test("should return null when popping from empty stack", () => {
      const result = stack.pop();
      expect(result).toBe(null);
      expect(stack.size()).toBe(0);
    });

    test("should pop element from stack with one element", () => {
      stack.push(42);
      const result = stack.pop();

      expect(result).toBe(42);
      expect(stack.size()).toBe(0);
      expect(stack.isEmpty()).toBe(true);
    });

    test("should pop elements in LIFO order", () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);

      expect(stack.pop()).toBe(3);
      expect(stack.pop()).toBe(2);
      expect(stack.pop()).toBe(1);
      expect(stack.isEmpty()).toBe(true);
    });

    test("should update top element after pop", () => {
      stack.push(10);
      stack.push(20);
      stack.push(30);

      expect(stack.peek()).toBe(30);
      stack.pop();
      expect(stack.peek()).toBe(20);
    });
  });

  describe("Peek Operation", () => {
    test("should return null when peeking empty stack", () => {
      expect(stack.peek()).toBe(null);
    });

    test("should return top element without removing it", () => {
      stack.push(100);
      expect(stack.peek()).toBe(100);
      expect(stack.size()).toBe(1);

      stack.push(200);
      expect(stack.peek()).toBe(200);
      expect(stack.size()).toBe(2);
    });
  });

  describe("Stack State Checks", () => {
    test("should correctly identify empty stack", () => {
      expect(stack.isEmpty()).toBe(true);
      expect(stack.isFull()).toBe(false);
    });

    test("should correctly identify full stack", () => {
      // Fill the stack
      for (let i = 1; i <= 5; i++) {
        stack.push(i);
      }

      expect(stack.isFull()).toBe(true);
      expect(stack.isEmpty()).toBe(false);
    });

    test("should correctly identify partially filled stack", () => {
      stack.push(1);
      stack.push(2);

      expect(stack.isEmpty()).toBe(false);
      expect(stack.isFull()).toBe(false);
    });
  });

  describe("Size Operations", () => {
    test("should return correct size", () => {
      expect(stack.size()).toBe(0);

      stack.push(1);
      expect(stack.size()).toBe(1);

      stack.push(2);
      expect(stack.size()).toBe(2);

      stack.pop();
      expect(stack.size()).toBe(1);
    });

    test("should return correct max size", () => {
      expect(stack.getMaxSize()).toBe(5);
    });
  });

  describe("Get All Elements", () => {
    test("should return empty array for empty stack", () => {
      expect(stack.getAllElements()).toEqual([]);
    });

    test("should return copy of elements", () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);

      const elements = stack.getAllElements();
      expect(elements).toEqual([1, 2, 3]);

      // Modifying returned array should not affect stack
      elements.push(4);
      expect(stack.getAllElements()).toEqual([1, 2, 3]);
    });
  });

  describe("Clear Operation", () => {
    test("should clear empty stack", () => {
      stack.clear();
      expect(stack.isEmpty()).toBe(true);
      expect(stack.size()).toBe(0);
    });

    test("should clear filled stack", () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);

      stack.clear();
      expect(stack.isEmpty()).toBe(true);
      expect(stack.size()).toBe(0);
      expect(stack.peek()).toBe(null);
    });
  });

  describe("Set Max Size", () => {
    test("should increase max size", () => {
      const result = stack.setMaxSize(10);
      expect(result).toBe(true);
      expect(stack.getMaxSize()).toBe(10);
    });

    test("should not decrease max size below current elements", () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);

      const result = stack.setMaxSize(2);
      expect(result).toBe(false);
      expect(stack.getMaxSize()).toBe(5);
    });

    test("should allow setting max size equal to current elements", () => {
      stack.push(1);
      stack.push(2);

      const result = stack.setMaxSize(2);
      expect(result).toBe(true);
      expect(stack.getMaxSize()).toBe(2);
    });

    test("should handle edge case of setting max size to 0", () => {
      const result = stack.setMaxSize(0);
      expect(result).toBe(false);
      expect(stack.getMaxSize()).toBe(5);
    });
  });

  describe("Edge Cases", () => {
    test("should handle stack with size 1", () => {
      const singleStack = new Stack(1);

      expect(singleStack.push(1)).toBe(true);
      expect(singleStack.isFull()).toBe(true);
      expect(singleStack.push(2)).toBe(false);

      expect(singleStack.pop()).toBe(1);
      expect(singleStack.isEmpty()).toBe(true);
    });

    test("should handle large numbers", () => {
      stack.push(999);
      stack.push(-999);

      expect(stack.getAllElements()).toEqual([999, -999]);
    });

    test("should maintain stack integrity after multiple operations", () => {
      // Push some elements
      stack.push(1);
      stack.push(2);
      stack.push(3);

      // Pop one
      expect(stack.pop()).toBe(3);

      // Push more
      stack.push(4);
      stack.push(5);

      // Pop all
      expect(stack.pop()).toBe(5);
      expect(stack.pop()).toBe(4);
      expect(stack.pop()).toBe(2);
      expect(stack.pop()).toBe(1);

      expect(stack.isEmpty()).toBe(true);
    });
  });
});
