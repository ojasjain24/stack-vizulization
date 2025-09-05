const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const StackController = require("./controllers/StackController");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const stackController = new StackController();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/stack", (req, res) => {
  try {
    const stackState = stackController.getStackState();
    res.json({
      success: true,
      data: stackState,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving stack state",
      error: error.message,
    });
  }
});

app.post("/api/stack/push", (req, res) => {
  try {
    const { element } = req.body;
    const result = stackController.pushElement(element);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error pushing element",
      error: error.message,
    });
  }
});

app.post("/api/stack/pop", (req, res) => {
  try {
    const result = stackController.popElement();

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error popping element",
      error: error.message,
    });
  }
});

app.post("/api/stack/clear", (req, res) => {
  try {
    const result = stackController.clearStack();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error clearing stack",
      error: error.message,
    });
  }
});

app.put("/api/stack/size", (req, res) => {
  try {
    const { maxSize } = req.body;
    const result = stackController.setMaxSize(maxSize);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error setting stack size",
      error: error.message,
    });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: err.message,
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
