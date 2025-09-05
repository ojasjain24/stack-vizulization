const StackController = require("../controllers/StackController");

describe("StackController", () => {
  let controller;

  beforeEach(() => {
    controller = new StackController();
  });

  describe("Constructor", () => {
    test("should initialize with default stack size", () => {
      const state = controller.getStackState();
      expect(state.maxSize).toBe(10);
      expect(state.size).toBe(0);
      expect(state.isEmpty).toBe(true);
    });
  });

  describe("Push Element", () => {
    test("should push valid integer", () => {
      const result = controller.pushElement(42);
      expect(result.success).toBe(true);
      expect(result.message).toContain("42");
      expect(result.stack.size).toBe(1);
      expect(result.stack.elements).toEqual([42]);
    });

    test("should reject non-integer values", () => {
      const result = controller.pushElement("not a number");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Please enter a valid integer");
    });

    test("should reject decimal numbers", () => {
      const result = controller.pushElement(3.14);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Please enter a valid integer");
    });

    test("should reject numbers outside range", () => {
      const result1 = controller.pushElement(1001);
      const result2 = controller.pushElement(-1001);

      expect(result1.success).toBe(false);
      expect(result1.message).toBe("Number must be between -1000 and 1000");

      expect(result2.success).toBe(false);
      expect(result2.message).toBe("Number must be between -1000 and 1000");
    });

    test("should accept boundary values", () => {
      const result1 = controller.pushElement(1000);
      const result2 = controller.pushElement(-1000);

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
    });

    test("should handle stack overflow", () => {
      // Fill the stack
      for (let i = 1; i <= 10; i++) {
        controller.pushElement(i);
      }

      const result = controller.pushElement(11);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Stack is full. Cannot push more elements.");
    });
  });

  describe("Pop Element", () => {
    test("should pop from non-empty stack", () => {
      controller.pushElement(42);
      controller.pushElement(24);

      const result = controller.popElement();

      expect(result.success).toBe(true);
      expect(result.poppedElement).toBe(24);
      expect(result.message).toContain("24");
      expect(result.stack.size).toBe(1);
      expect(result.stack.elements).toEqual([42]);
    });

    test("should handle empty stack", () => {
      const result = controller.popElement();

      expect(result.success).toBe(false);
      expect(result.message).toBe("Stack is empty. Cannot pop elements.");
    });

    test("should pop in LIFO order", () => {
      controller.pushElement(1);
      controller.pushElement(2);
      controller.pushElement(3);

      const result1 = controller.popElement();
      const result2 = controller.popElement();
      const result3 = controller.popElement();

      expect(result1.poppedElement).toBe(3);
      expect(result2.poppedElement).toBe(2);
      expect(result3.poppedElement).toBe(1);
    });
  });

  describe("Get Stack State", () => {
    test("should return correct state for empty stack", () => {
      const state = controller.getStackState();

      expect(state.elements).toEqual([]);
      expect(state.size).toBe(0);
      expect(state.maxSize).toBe(10);
      expect(state.isEmpty).toBe(true);
      expect(state.isFull).toBe(false);
      expect(state.topElement).toBe(null);
    });

    test("should return correct state for filled stack", () => {
      controller.pushElement(1);
      controller.pushElement(2);

      const state = controller.getStackState();

      expect(state.elements).toEqual([1, 2]);
      expect(state.size).toBe(2);
      expect(state.maxSize).toBe(10);
      expect(state.isEmpty).toBe(false);
      expect(state.isFull).toBe(false);
      expect(state.topElement).toBe(2);
    });
  });

  describe("Clear Stack", () => {
    test("should clear empty stack", () => {
      const result = controller.clearStack();

      expect(result.success).toBe(true);
      expect(result.message).toBe("Stack cleared successfully");
      expect(result.stack.size).toBe(0);
    });

    test("should clear filled stack", () => {
      controller.pushElement(1);
      controller.pushElement(2);
      controller.pushElement(3);

      const result = controller.clearStack();

      expect(result.success).toBe(true);
      expect(result.stack.size).toBe(0);
      expect(result.stack.elements).toEqual([]);
    });
  });

  describe("Set Max Size", () => {
    test("should set valid max size", () => {
      const result = controller.setMaxSize(20);

      expect(result.success).toBe(true);
      expect(result.message).toContain("20");
      expect(result.stack.maxSize).toBe(20);
    });

    test("should reject invalid max size", () => {
      const result1 = controller.setMaxSize("invalid");
      const result2 = controller.setMaxSize(3.14);
      const result3 = controller.setMaxSize(0);
      const result4 = controller.setMaxSize(-5);

      expect(result1.success).toBe(false);
      expect(result1.message).toBe(
        "Please enter a valid positive integer for stack size"
      );

      expect(result2.success).toBe(false);
      expect(result2.message).toBe(
        "Please enter a valid positive integer for stack size"
      );

      expect(result3.success).toBe(false);
      expect(result3.message).toBe(
        "Please enter a valid positive integer for stack size"
      );

      expect(result4.success).toBe(false);
      expect(result4.message).toBe(
        "Please enter a valid positive integer for stack size"
      );
    });

    test("should reject max size exceeding limit", () => {
      const result = controller.setMaxSize(101);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Maximum stack size cannot exceed 100");
    });

    test("should reject max size smaller than current elements", () => {
      controller.pushElement(1);
      controller.pushElement(2);
      controller.pushElement(3);

      const result = controller.setMaxSize(2);

      expect(result.success).toBe(false);
      expect(result.message).toContain("Cannot set size to 2");
    });

    test("should accept max size equal to current elements", () => {
      controller.pushElement(1);
      controller.pushElement(2);

      const result = controller.setMaxSize(2);

      expect(result.success).toBe(true);
      expect(result.stack.maxSize).toBe(2);
    });
  });

  describe("Get Stack Instance", () => {
    test("should return the underlying stack instance", () => {
      const stack = controller.getStack();

      expect(stack).toBeDefined();
      expect(typeof stack.push).toBe("function");
      expect(typeof stack.pop).toBe("function");
    });
  });

  describe("Integration Tests", () => {
    test("should handle complex operations sequence", () => {
      // Push some elements
      controller.pushElement(1);
      controller.pushElement(2);
      controller.pushElement(3);

      // Pop one
      const popResult = controller.popElement();
      expect(popResult.success).toBe(true);
      expect(popResult.poppedElement).toBe(3);

      // Change max size
      const sizeResult = controller.setMaxSize(5);
      expect(sizeResult.success).toBe(true);

      // Push more elements
      controller.pushElement(4);
      controller.pushElement(5);

      // Check final state
      const state = controller.getStackState();
      expect(state.elements).toEqual([1, 2, 4, 5]);
      expect(state.size).toBe(4);
      expect(state.maxSize).toBe(5);
      expect(state.topElement).toBe(5);
    });

    test("should maintain data integrity across operations", () => {
      const initialElements = [1, 2, 3, 4, 5];

      // Push elements
      initialElements.forEach((element) => {
        const result = controller.pushElement(element);
        expect(result.success).toBe(true);
      });

      // Verify state
      let state = controller.getStackState();
      expect(state.elements).toEqual(initialElements);
      expect(state.size).toBe(5);

      // Pop some elements
      controller.popElement();
      controller.popElement();

      // Verify updated state
      state = controller.getStackState();
      expect(state.elements).toEqual([1, 2, 3]);
      expect(state.size).toBe(3);
      expect(state.topElement).toBe(3);
    });
  });
});
