// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const process = require('process'); // Required to mock environment variables

// [START gae_flex_storage_app]
const {format} = require('util');
const express = require('express');
const Multer = require('multer');
const bodyParser = require('body-parser');

// By default, the client will authenticate using the service account file
// specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// the project specified by the GOOGLE_CLOUD_PROJECT environment variable. See
// https://github.com/GoogleCloudPlatform/google-cloud-node/blob/master/docs/authentication.md
// These environment variables are set automatically on Google App Engine
const {Storage} = require('@google-cloud/storage');

// Instantiate a storage client
const storage = new Storage();

const app = express();
app.set('view engine', 'pug');
app.use(bodyParser.json());

// Multer is required to process file uploads and make them available via
// req.files.
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

// A bucket is a container for objects (files).
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

async function createPhotos(folder,delimiter) {
  /**
   * This can be used to list all blobs in a "folder", e.g. "public/".
   *
   * The delimiter argument can be used to restrict the results to only the
   * "files" in the given "folder". Without the delimiter, the entire tree under
   * the prefix is returned. For example, given these blobs:
   *
   *   /a/1.txt
   *   /a/b/2.txt
   *
   * If you just specify prefix = '/a', you'll get back:
   *
   *   /a/1.txt
   *   /a/b/2.txt
   *
   * However, if you specify prefix='/a' and delimiter='/', you'll get back:
   *
   *   /a/1.txt
   */
  
  const options = {
    prefix: `/AllMemes/${folder}`,
  };

  if (delimiter) {
    options.delimiter = delimiter;
  }

  // Lists files in the bucket, filtered by a prefix
  const [files] = await storage.bucket(process.env.GCLOUD_STORAGE_BUCKET).getFiles(options);

  let foundFiles = [];

  files.forEach(file => {
    foundFiles.push( 
    {
      id: `https://storage.googleapis.com/memeservices-storage/AllMemes/${file.name}`,
      owner: "Memeservices",
      secret: "00000",
      farm: 0,
      category: "Sadcat",
      ispublic: 1,
    });
  });
  
  return {
    photos: {
      page: 1,
      pages: 1,
      perpage: 24,
      total: 24,
      photo:[foundFiles]
    }
  };
}

// Display a form for uploading files.
app.get('/', (req, res) => {
  res.render('form.pug');
});

// Return SadCat
app.get('/sadcat', (req, res) => {
  let memeString = createPhotos(`Sadcat`,`/`).catch(console.error);
  res.setHeader('Access-Control-Allow-Origin', 'https://memeservices.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.status(200).json(memeString);
});

// Return Unforgivable.
app.get('/unforgivable', (req, res) => {
  let memeString = createPhotos(`Unforgivable`,`/`).catch(console.error);
  res.setHeader('Access-Control-Allow-Origin', 'https://memeservices.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.status(200).json(memeString);
});

// Return Bait.
app.get('/bait', (req, res) => {
  let memeString = createPhotos(`baitMemes`,`/`).catch(console.error);
    res.setHeader('Access-Control-Allow-Origin', 'https://memeservices.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.status(200).json(memeString);
});

// Return Random.
app.get('/random', (req, res) => {
  let memeString = createPhotos(`memes`,`/`).catch(console.error);
  res.setHeader('Access-Control-Allow-Origin', 'https://memeservices.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.status(200).json(memeString);
});

// Process the file upload and upload to Google Cloud Storage.
app.post('/upload', multer.single('file'), (req, res, next) => {
  if (!req.file) {
    res.setHeader('Access-Control-Allow-Origin', 'https://memeservices.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.status(400).send('No file uploaded.');
    return;
  }

  // Create a new blob in the bucket and upload the file data.
  const blob = bucket.file("AllMemes/memes/"+memesreq.file.originalname);
  const blobStream = blob.createWriteStream();

  blobStream.on('error', (err) => {
    next(err);
  });

  blobStream.on('finish', () => {
    // The public URL can be used to directly access the file via HTTP.
    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    );
    res.setHeader('Access-Control-Allow-Origin', 'https://memeservices.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.status(200).send(publicUrl);
  });

  blobStream.end(req.file.buffer);
});

const PORT = process.env.PORT || 443;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_flex_storage_app]

module.exports = app;