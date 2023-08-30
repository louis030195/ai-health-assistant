import { auth } from "google-auth-library";

const API_ENDPOINT = "us-central1-aiplatform.googleapis.com";
const URL = `https://${API_ENDPOINT}/v1/projects/mediar-394022/locations/us-central1/publishers/google/models/imagetext:predict`;

const getIdToken = async () => {
  const client = auth.fromJSON(JSON.parse(process.env.GOOGLE_SVC!));
  // @ts-ignore
  client.scopes = ["https://www.googleapis.com/auth/cloud-platform"];
  // @ts-ignore
  const idToken = await client.authorize();
  return idToken.access_token;
};

export const getCaption = async (prompt: string, base64Image: string) => {
  const headers = {
    Authorization: `Bearer ` + (await getIdToken()),
    "Content-Type": "application/json",
  };

  const data = {
    instances: [
      {
        prompt,
        image: {
          bytesBase64Encoded: base64Image,
        },
      },
    ],
    parameters: {
      sampleCount: 1
    }
  }

  const response = await fetch(URL, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    console.error(response.statusText);
    throw new Error("Request failed " + response.statusText);
  }

  const result = await response.json();
  return result.predictions[0]
};

export const opticalCharacterRecognition = async (base64Image: string) => {
  const headers = {
    Authorization: `Bearer ` + (await getIdToken()),
    "Content-Type": "application/json",
    "x-goog-user-project": "mediar-394022"
  };

  const data = {
    requests: [
      {
        image: {
          content: base64Image
        },
        features: [
          {
            type: "TEXT_DETECTION"
          }
        ]
      }
    ]
  }

  const response = await fetch('https://vision.googleapis.com/v1/images:annotate', {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  const result = await response.json();

  if (!response.ok) {
    console.error(response.statusText, result);
    throw new Error("Request failed " + response.statusText);
  }

  return result?.responses?.[0]?.fullTextAnnotation?.text || ''
}

// import fs from 'fs';

// Read the file into a Buffer
// const buffer = fs.readFileSync('/Users/louisbeaumont/Downloads/IMG_2189.jpg');
// const buffer = fs.readFileSync('/Users/louisbeaumont/Downloads/afcad06f-7ef8-456d-bca5-543a6cf070e4.jpeg');

// Convert the Buffer to a base64 string
// const base64Image = buffer.toString('base64');

// Now you can pass the base64 string to your opticalCharacterRecognition function
// opticalCharacterRecognition(base64Image);
