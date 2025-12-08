const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/ai/uniqueness', (req, res) => {
  const { text } = req.body;
  // Call Python script
  exec(`python src/utils/ai.py "${text}"`, (error, stdout, stderr) => {
    if (error) {
      res.status(500).send(stderr);
    } else {
      res.json({ unique: stdout.trim() === 'true' });
    }
  });
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
