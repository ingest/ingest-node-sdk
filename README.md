# Ingest.io Node SDK

The official Ingest.io Node SDK for interfacing with Ingest.

Getting Started
-------------

Getting started with the Ingest Node SDK is simple.

The Ingest Node SDK supports both callback and promise flows, and is easily integratable into your workflow. Ingest Node SDK supports the latest LTS version (6.11.3)

### Via NPM

1. Install the SDK via npm:

```sh
npm install @ingest/ingest-node-sdk
```

2. Require it in your project:
```javascript
  const IngestSDK = require('ingest-node-sdk')
```

3. Initialize the SDK:
```javascript
  const Ingest = new IngestSDK({
    token: 'Bearer ..',
  })
```

4. Start making calls:
```javascript
  Ingest.Videos.getAll()
    .then(function (response) {
      // Handle Response
    });

  ------------------------------

  Ingest.Videos.getAll(null, (error, data) => {
    if (error) {
      // handle error
    }

    ...
  })

```

Uploading a file
---------------

## TODO

API Documentation
---------------

For more information on the available functionality of the sdk, please see the [API Docs](https://docs.ingest.io/?node#).

Issues
-----

If you encounter any issues using the Ingest Node SDK, please search the existing [issues](https://github.com/ingest/ingest-node-sdk/issues) first before opening a new one.

Please include any information that may be of assistance with reproducing the issue.

Development
---------
To modify the source of the Ingest SDK, clone the repo.

```
npm install
```

Develop in a topic/feature branch, not master.

Running Tests
------------

To run the unit tests, use:

```sh
npm run test
```

To watch the unit tests, use:

```sh
npm run test:watch
```

License
------

This SDK is distributed under the MIT License, see [License](LICENSE) for more information.
