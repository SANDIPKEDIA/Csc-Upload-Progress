import React, { useState } from 'react';
import { Container, Row, Col, ProgressBar, Alert, Card, Button } from 'react-bootstrap';
import Papa from 'papaparse';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [progress, setProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [parser, setParser] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploaded(false);
      setProgress(0);
      setIsUploading(true);

      const newParser = Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        worker: true,
        step: (results, parser) => {
          const progress = (results.meta.cursor / file.size) * 100;
          setProgress(progress);
        },
        complete: () => {
          setIsUploaded(true);
          setIsUploading(false);
        },
      });
      setParser(newParser);
    }
  };

  const cancelUpload = () => {
    if (parser) {
      parser.abort();
      setParser(null); // Reset parser
      setIsUploading(false);
      setProgress(0);
      setIsUploaded(false); // Reset the uploaded state
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md="6">
          <Card className="text-center shadow-sm p-3 mb-5 bg-white rounded">
            <Card.Body>
              <Card.Title>Upload Your CSV File</Card.Title>
              <Card.Text>
                Please select a CSV file to upload and track the progress below.
              </Card.Text>
              <input type="file" accept=".csv" onChange={handleFileUpload} className="form-control mb-3" />
              <ProgressBar 
                animated 
                now={progress} 
                label={`${Math.round(progress)}%`} 
                className="mb-3" 
                striped
                variant="success"
              />
              {isUploaded && <Alert variant="success">File uploaded successfully!</Alert>}
              {!isUploaded && progress === 0 && <Alert variant="info">Select a CSV file to upload</Alert>}
              {isUploading && (
                <Button variant="danger" onClick={cancelUpload} className="mt-3">Cancel Upload</Button>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
