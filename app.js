const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Read the directory and create endpoints for each .txt file
fs.readdir('/usr/local/books/', (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  // Generate the list of links
  const links = files
    .filter((file) => file.endsWith('.pdf'))
    .map((file) => {
      const fileName = file.replace('.pdf', '');
      return `<li><a href="/${fileName}">${fileName}</a></li>`;
    })
    .join('');

    // Root endpoint handler
    app.get('/', (req, res) => {
      res.send(`
        <body style="background-color: #000000; color: #FFFFFF;">
          <h1>List of Books:</h1>
          <ul>${links}</ul>
        </body>
      `);
    });

  // Create endpoints for each .pdf file
  files.forEach((file) => {
    const fileName = file.replace('.pdf', '');
    app.get(`/${fileName}`, (req, res) => {
      // Read the contents of the .pdf file
      fs.readFile(`/usr/local/books/${file}`, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error reading file');
        }
        res.send(`
          <body style="background-color: #000000; color: #FFFFFF;">
            <h1>${fileName}</h1>
            <pre>${data}</pre>
          </body>
        `);
      });
    });
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
