const request = require("supertest");
const app = require("../server");

describe("Stack API Endpoints", () => {
  // Clear stack before each test to ensure isolation
  beforeEach(async () => {
    await request(app).post("/api/stack/clear");
  });
  describe("GET /api/stack", () => {
    test("should return current stack state", async () => {
      const response = await request(app).get("/api/stack").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("elements");
      expect(response.body.data).toHaveProperty("size");
      expect(response.body.data).toHaveProperty("maxSize");
      expect(response.body.data).toHaveProperty("isEmpty");
      expect(response.body.data).toHaveProperty("isFull");
      expect(response.body.data).toHaveProperty("topElement");
    });
  });

  describe("POST /api/stack/push", () => {
    test("should push valid integer", async () => {
      const response = await request(app)
        .post("/api/stack/push")
        .send({ element: 42 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("42");
      expect(response.body.stack.elements).toContain(42);
      expect(response.body.stack.size).toBe(1);
    });

    test("should reject invalid input", async () => {
      const response = await request(app)
        .post("/api/stack/push")
        .send({ element: "invalid" })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Please enter a valid integer");
    });

    test("should reject out of range numbers", async () => {
      const response = await request(app)
        .post("/api/stack/push")
        .send({ element: 1001 })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        "Number must be between -1000 and 1000"
      );
    });

    test("should handle stack overflow", async () => {
      // Fill the stack first
      for (let i = 1; i <= 10; i++) {
        await request(app).post("/api/stack/push").send({ element: i });
      }

      const response = await request(app)
        .post("/api/stack/push")
        .send({ element: 11 })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        "Stack is full. Cannot push more elements."
      );
    });

    test("should handle missing element in request body", async () => {
      const response = await request(app)
        .post("/api/stack/push")
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/stack/pop", () => {
    test("should pop element from non-empty stack", async () => {
      // First push an element
      await request(app).post("/api/stack/push").send({ element: 42 });

      const response = await request(app).post("/api/stack/pop").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.poppedElement).toBe(42);
      expect(response.body.message).toContain("42");
    });

    test("should handle empty stack", async () => {
      // Clear the stack first
      await request(app).post("/api/stack/clear");

      const response = await request(app).post("/api/stack/pop").expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        "Stack is empty. Cannot pop elements."
      );
    });

    test("should pop in LIFO order", async () => {
      // Push multiple elements
      await request(app).post("/api/stack/push").send({ element: 1 });
      await request(app).post("/api/stack/push").send({ element: 2 });
      await request(app).post("/api/stack/push").send({ element: 3 });

      // Pop and verify order
      const response1 = await request(app).post("/api/stack/pop").expect(200);
      expect(response1.body.poppedElement).toBe(3);

      const response2 = await request(app).post("/api/stack/pop").expect(200);
      expect(response2.body.poppedElement).toBe(2);

      const response3 = await request(app).post("/api/stack/pop").expect(200);
      expect(response3.body.poppedElement).toBe(1);
    });
  });

  describe("POST /api/stack/clear", () => {
    test("should clear empty stack", async () => {
      const response = await request(app).post("/api/stack/clear").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Stack cleared successfully");
      expect(response.body.stack.size).toBe(0);
    });

    test("should clear filled stack", async () => {
      // Fill the stack first
      await request(app).post("/api/stack/push").send({ element: 1 });
      await request(app).post("/api/stack/push").send({ element: 2 });
      await request(app).post("/api/stack/push").send({ element: 3 });

      const response = await request(app).post("/api/stack/clear").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.stack.size).toBe(0);
      expect(response.body.stack.elements).toEqual([]);
    });
  });

  describe("PUT /api/stack/size", () => {
    test("should update valid max size", async () => {
      const response = await request(app)
        .put("/api/stack/size")
        .send({ maxSize: 20 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("20");
      expect(response.body.stack.maxSize).toBe(20);
    });

    test("should reject invalid max size", async () => {
      const response = await request(app)
        .put("/api/stack/size")
        .send({ maxSize: "invalid" })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        "Please enter a valid positive integer for stack size"
      );
    });

    test("should reject max size exceeding limit", async () => {
      const response = await request(app)
        .put("/api/stack/size")
        .send({ maxSize: 101 })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        "Maximum stack size cannot exceed 100"
      );
    });

    test("should reject max size smaller than current elements", async () => {
      // Add some elements first
      await request(app).post("/api/stack/push").send({ element: 1 });
      await request(app).post("/api/stack/push").send({ element: 2 });
      await request(app).post("/api/stack/push").send({ element: 3 });

      const response = await request(app)
        .put("/api/stack/size")
        .send({ maxSize: 2 })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Cannot set size to 2");
    });

    test("should handle missing maxSize in request body", async () => {
      const response = await request(app)
        .put("/api/stack/size")
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("Integration Tests", () => {
    test("should handle complete workflow", async () => {
      // 1. Get initial state
      let response = await request(app).get("/api/stack").expect(200);
      expect(response.body.data.isEmpty).toBe(true);

      // 2. Set max size
      response = await request(app)
        .put("/api/stack/size")
        .send({ maxSize: 5 })
        .expect(200);
      expect(response.body.stack.maxSize).toBe(5);

      // 3. Push elements
      for (let i = 1; i <= 3; i++) {
        response = await request(app)
          .post("/api/stack/push")
          .send({ element: i })
          .expect(200);
        expect(response.body.stack.size).toBe(i);
      }

      // 4. Verify state
      response = await request(app).get("/api/stack").expect(200);
      expect(response.body.data.elements).toEqual([1, 2, 3]);
      expect(response.body.data.size).toBe(3);
      expect(response.body.data.topElement).toBe(3);

      // 5. Pop elements
      response = await request(app).post("/api/stack/pop").expect(200);
      expect(response.body.poppedElement).toBe(3);

      // 6. Clear stack
      response = await request(app).post("/api/stack/clear").expect(200);
      expect(response.body.stack.size).toBe(0);
    });

    test("should maintain state consistency across requests", async () => {
      // Push some elements
      await request(app).post("/api/stack/push").send({ element: 10 });
      await request(app).post("/api/stack/push").send({ element: 20 });

      // Get state
      const stateResponse = await request(app).get("/api/stack").expect(200);

      expect(stateResponse.body.data.elements).toEqual([10, 20]);
      expect(stateResponse.body.data.size).toBe(2);

      // Pop one element
      await request(app).post("/api/stack/pop").expect(200);

      // Verify updated state
      const updatedStateResponse = await request(app)
        .get("/api/stack")
        .expect(200);

      expect(updatedStateResponse.body.data.elements).toEqual([10]);
      expect(updatedStateResponse.body.data.size).toBe(1);
    });
  });

  describe("Error Handling", () => {
    test("should handle 404 for non-existent routes", async () => {
      const response = await request(app).get("/api/nonexistent").expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Route not found");
    });

    test("should handle malformed JSON", async () => {
      const response = await request(app)
        .post("/api/stack/push")
        .set("Content-Type", "application/json")
        .send("invalid json")
        .expect(500);

      expect(response.body.success).toBe(false);
    });
  });
});
