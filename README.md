# Ingest.io Node SDK

The official Ingest.io Node SDK for interfacing with Ingest.

Table of contents
=================

  * [Requirements](#requirements)
  * [Getting Started](#getting-started)
  * [API Documentation](#api-documentation)
    * [Videos](#videos)
    * [Inputs](#inputs)
    * [Profiles](#profiles)
    * [Jobs](#jobs)
    * [Events](#events)
    * [Livestreams](#livestreams)
    * [Networks](#networks)
    * [Roles](#roles)
    * [Users](#users)
  * [Issues](#issues)
  * [Development](#development)
    * [Tests](#tests)
  * [License](#license)

Requirements
===========
* [node.js](https://www.nodejs.org) -- v6.11.4 or newer

Getting Started
=============

Getting started with the Ingest Node SDK is simple.

The Ingest Node SDK supports both callback and promise flows, and is easily integratable into your workflow. The below documentation will show usage with the callback functionality.

To use the SDK:

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

API Documentation
================

All resource methods have an optional callback parameter as the last parameter. This can be omitted and a promise flow adopted instead. The following examples contain the callback approach.

## Videos

### Retrieving all Videos

Parameter   | Description
---------  | -----------
headers    | Any headers you wish to send in object form
status     | The video status you wish to filter by. By default this will return all playable videos (encoded videos)
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Videos.getAll(headers, status, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

This will return a list of all the videos you can access.

Sometimes, the results will be paginated. In order to access the next page, pass the value that was provided to you on the *Next-Range* header as an argument:

### Search Videos

Parameter   | Description
---------  | -----------
input      | The search term
headers    | Any headers you wish to send in object form
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Videos.search(input, headers, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Retrieving a Video

Parameter   | Description
---------  | -----------
id        | The ID of the item to get
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Videos.getById(id, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Creating a Video

Title is the only mandatory property, please check the main API documentation for a full list:

Parameter   | Description
---------  | -----------
video      | The video object to create
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
let video = {
  title: 'My video title'
}

Ingest.Videos.add(video, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Counting Videos

Returns the count of all the videos. The count will be available as a header property in the response. Resource-Count

Parameter   | Description
---------  | -----------
status     | The video status you wish to filter by. By default this will return all playable videos (encoded videos)
private    | Whether or not you want private videos included in the count
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Videos.count(status, private, (error, data) => {
  if (error) {
    // handle error
  }

  let resourceCount = data.headers['resource-count']
  ...
})
```

### Get a Video's thumbnails

Parameter   | Description
---------  | -----------
id         | The id of the video you wish to get thumbnails for
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Videos.getThumbnails(id, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Get a Video's variants

Parameter   | Description
---------  | -----------
id         | The id of the video you wish to get variants for
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Videos.getVariants(id, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Adding external thumbnails to a Video

Parameter   | Description
---------  | -----------
id         | The id of the video you wish to add thumbnails for
images     | An array of strings, or just a string of the file image path
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Videos.addExternalThumbnails(id, images, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Uploading a thumbnail to a Video

Parameter   | Description
---------  | -----------
id         | The id of the video you wish to add thumbnails for
image      | Object containing all of the image information
image.data | The image buffer
image.filename | The name of the image file
image.contentType | The content type of the image being uploaded
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
  Ingest.Videos.uploadThumbnail(id, image, function(error, data) {
    if(error) {
      return res.send(error)
    }
    ...
  })
```

### Deleting a thumbnail from a Video

Parameter   | Description
---------  | -----------
id         | The id of the video you wish to delete a thumbnail for
thumbnailID | The thumbnail id you wish to delete
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Videos.deleteThumbnail(id, thumbnailID, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Updating a Video

Parameter   | Description
---------  | -----------
video      | The updated video object
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Videos.update(video, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Publishing videos

This makes videos publicly available to anyone who has the video playback url

Parameter   | Description
---------  | -----------
ids        | An array of video ids to publish
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Videos.update(ids, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Deleting a Video

Deleting a video just puts the video in Ingest's trash, making it publicly inaccessible and set for permanent deletion a short time from now:

Parameter   | Description
---------  | -----------
id         | The video id to delete
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Videos.delete(id, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

If you wish to permanently delete the video immediately:

Parameter   | Description
---------  | -----------
id         | The video id to delete
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Videos.permanentDelete(id, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

## Inputs

### Retrieving all Inputs

Parameter   | Description
---------  | -----------
headers    | Any headers you wish to send in object form
filters     | A comma delimited string containing filters to match inputs against
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Inputs.getAll(headers, filters, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

This will return a list of all the inputs you can access.

Sometimes, the results will be paginated. In order to access the next page, pass the value that was provided to you on the *Next-Range* header as an argument:

### Search Inputs

Parameter   | Description
---------  | -----------
input      | The search term
headers    | Any headers you wish to send in object form
filters     | A comma delimited string containing filters to match inputs against
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Inputs.search(input, headers, filters (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Retrieving an Input

Parameter   | Description
---------  | -----------
id        | The ID of the item to get
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Inputs.getById(id, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Creating an Input

Filename is the only mandatory property, please check the main API documentation for a full list:

Parameter   | Description
---------  | -----------
input      | The input object to create
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
let input = {
  filename: 'My input filename'
}

Ingest.Inputs.add(input, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Counting Inputs

Returns the count of all the inputs. The count will be available as a header property in the response. Resource-Count

Parameter   | Description
---------  | -----------
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Inputs.count((error, data) => {
  if (error) {
    // handle error
  }

  let resourceCount = data.headers['resource-count']
  ...
})
```

### Updating an Input

Parameter   | Description
---------  | -----------
input      | The updated input object
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Inputs.update(input, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Deleting an Input

Parameter   | Description
---------  | -----------
id         | The input id to delete
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Inputs.delete(id, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

## Profiles

### Retrieving all Profiles

Parameter   | Description
---------  | -----------
headers    | Any headers you wish to send in object form
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Profiles.getAll(headers, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

This will return a list of all the profiles you can access.

Sometimes, the results will be paginated. In order to access the next page, pass the value that was provided to you on the *Next-Range* header as an argument:

### Search Profiles

Parameter   | Description
---------  | -----------
input      | The search term
headers    | Any headers you wish to send in object form
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Profiles.search(input, headers, filters (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Retrieving a Profile

Parameter   | Description
---------  | -----------
id        | The ID of the item to get
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Profiles.getById(id, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Creating a Profile

The following fields are mandatory when creating a profile

Field  | Description
-------| ---------------------
name   | The name of the profile
type   | The type of profile, either 'MP4' or 'hls'
data   | Profile data. Depends on the type of profile. Please reference the [profile object documentation](https://docs.ingest.io/#profiles-object) for more depth:

Parameter   | Description
---------  | -----------
profile     | The profile object to create
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
let profile = {
  name: 'My Profile name',
  type: 'mp4',
  data: {}'
}

Ingest.Profiles.add(profile, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Counting Profiles

Returns the count of all the profiles. The count will be available as a header property in the response. Resource-Count

Parameter   | Description
---------  | -----------
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Profiles.count((error, data) => {
  if (error) {
    // handle error
  }

  let resourceCount = data.headers['resource-count']
  ...
})
```

### Updating a Profile

Parameter   | Description
---------  | -----------
profile      | The updated profile object
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Profiles.update(input, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Deleting a Profile

Please note, default profiles cannot be deleted and locked profiles can only be deleted by admins.

Parameter   | Description
---------  | -----------
id         | The profile id to delete
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Profiles.delete(id, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

## Jobs

### Retrieving all Jobs

Parameter   | Description
---------  | -----------
headers    | Any headers you wish to send in object form
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Jobs.getAll(headers, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

This will return a list of all the jobs you can access.

Sometimes, the results will be paginated. In order to access the next page, pass the value that was provided to you on the *Next-Range* header as an argument:

### Retrieving a Job

Parameter   | Description
---------  | -----------
id        | The ID of the item to get
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Jobs.getById(id, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Creating a Job

The following fields are mandatory when creating a profile

Field  | Description
-------| ---------------------
inputs  | An array of input UUID's
profile | The profile UUID to encode with
video   | The video UUID to encode to



Parameter   | Description
---------  | -----------
job     | The job object to create
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
let job = {
  inputs: [
    'someuuid'
  ],
  profile: 'someuuid',
  video: 'someuuid'
}

Ingest.Jobs.add(job, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Counting Jobs

Returns the count of all the Jobs. The count will be available as a header property in the response. Resource-Count

Parameter   | Description
---------  | -----------
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Jobs.count((error, data) => {
  if (error) {
    // handle error
  }

  let resourceCount = data.headers['resource-count']
  ...
})
```

### Deleting a Job

Parameter   | Description
---------  | -----------
id         | The job id to delete
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Jobs.delete(id, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

## Events

Everything you do in Ingest causes events to be made. These are just actions of things that have happened on your network.

### Retrieving all events

Parameter   | Description
---------  | -----------
headers    | Any headers you wish to send in object form
filterStatus | A comma delimited string that allows you to filter events by status
filterType | A comma delimited string that allows you to filter the results by type
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Events.getAll(headers, filterStatus, filterType (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

This will return a list of all the profiles you can access.

Sometimes, the results will be paginated. In order to access the next page, pass the value that was provided to you on the *Next-Range* header as an argument:

### Retrieving an Event

Parameter   | Description
---------  | -----------
id        | The ID of the item to get
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Events.getById(id, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Counting Events

Returns the count of all the events. The count will be available as a header property in the response. Resource-Count

Parameter   | Description
---------  | -----------
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Events.count((error, data) => {
  if (error) {
    // handle error
  }

  let resourceCount = data.headers['resource-count']
  ...
})
```

### Get Event Types

Parameter   | Description
---------  | -----------
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Events.getTypes((error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

## Livestreams

### Retrieving all Livestreams

Parameter   | Description
---------  | -----------
headers    | Any headers you wish to send in object form
status     | A comma delimited string containing livestream statuses to include
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Livestreams.getAll(headers, status, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

This will return a list of all the livestreams you can access.

Sometimes, the results will be paginated. In order to access the next page, pass the value that was provided to you on the *Next-Range* header as an argument:

### Retrieving a Livestream

Parameter   | Description
---------  | -----------
id        | The ID of the item to get
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Livestreams.getById(id, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Creating a Livestream

Title is the only mandatory property, please check the main API documentation for a full list:

Parameter   | Description
---------  | -----------
livestream      | The livestream object to create
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
let livestream = {
  title: 'My Livestream'
}

Ingest.Livestreams.add(livestream, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Updating a Livestream

Only the title is updatable.

Parameter   | Description
---------  | -----------
livestream  | The updated livestream object
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Livestreams.update(livestream, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Deleting a Livestream

Please note, you must end your livestream before deleting it. To do so, pass `true` in as the end value.

Parameter   | Description
---------  | -----------
id         | The input id to delete
end        | Whether you are ending it or deleting it
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Livestreams.delete(id, end, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

## Networks

### Retrieving all networks

Parameter   | Description
---------  | -----------
headers    | Any headers you wish to send in object form
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Networks.getAll(headers, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

This will return a list of all the networks you can access.

### Retrieving a Network

Parameter   | Description
---------  | -----------
id        | The ID of the item to get
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Networks.getById(id, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Updating a Network

Parameter   | Description
---------  | -----------
network      | The updated network object
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Networks.update(network, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Adding a Playback Key

Adds a Private Playback key to your network. The key must be in PKCS1 or PKCS8 format.

Parameter   | Description
---------  | -----------
id         | The id of the network
key        | The playback key to add. This is an object and contains the key and the key title
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
let key = {
  title: 'My Playback Key',
  key: 'MY KEY HERE'
}

Ingest.Networks.addSecureKey(id, key, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Deleting a Playback Key

Deletes a Private Playback key from your network.

Parameter   | Description
---------  | -----------
id         | The id of the network
keyID      | The ID of the playback key
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Networks.deleteSecureKey(id, keyID, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Updating a Playback Key

Updates a Private Playback key from your network. Only the title can be updated.

Parameter   | Description
---------  | -----------
id         | The id of the network
key       | The playback key to update
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Networks.updateSecureKey(id, key, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Get a Playback Key

Gets a Private Playback key from your network.

Parameter   | Description
---------  | -----------
id         | The id of the network
keyID      | The playback key id
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Networks.getSecureKeyById(id, keyID, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Getting all Invoices
Gets all invoices for your network.

Parameter   | Description
---------  | -----------
id         | The id of the network
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Networks.getInvoices(id, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Getting an Invoice
Gets a single invoice for your network.

Parameter   | Description
---------  | -----------
id         | The id of the network to add the key to
invoiceID   | The ID of the invoice to get
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Networks.getInvoiceById(id, invoiceID, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Getting your current monthly usage
Gets your current monthly usage

Parameter   | Description
---------  | -----------
id         | The id of the network
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Networks.getCurrentUsage(id, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Inviting a User to a network
Invites the user specified to your network

Parameter   | Description
---------  | -----------
id         | The id of the network
email      | The user being invited's email address with Ingest
name       | The user being invited's name
resend     | False if you haven't sent one yet, true to resend it
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Networks.inviteUser(id, email, name, resend (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Get all Pending User Invites
Gets all pending user invites for your network.

Parameter   | Description
---------  | -----------
id         | The id of the network
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Networks.getPendingUsers(id, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Delete a Pending User Invite
Gets all invoices for your network.

Parameter   | Description
---------  | -----------
id         | The id of the network
pendingUserID | The id of the pending user
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Networks.deletePendingUser(id, pendingUserID (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Linking a User to a Network

Links a specified user to the specified network

Parameter   | Description
---------  | -----------
id         | The id of the network to add the key to
userID     | The user id you want to link to the specified network
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Networks.linkUser(id, userID, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Unlinking a User from a Network

Unlinks a specified user to the specified network

Parameter   | Description
---------  | -----------
id         | The id of the network to add the key to
userID     | The user id you want to link to the specified network
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Networks.unlinkUser(id, userID, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```
## Roles

### Retrieving all Roles

Parameter   | Description
---------  | -----------
headers    | Any headers you wish to send in object form
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Roles.getAll(headers, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

This will return a list of all the roles you can access.

Sometimes, the results will be paginated. In order to access the next page, pass the value that was provided to you on the *Next-Range* header as an argument.

### Retrieving a Role

Parameter   | Description
---------  | -----------
id        | The ID of the item to get
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Roles.getById(id, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Creating a Role

A role requires a role name, and an array of permissions.

Parameter   | Description
---------  | -----------
role      | The role object to create
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
let role = {
  role_name: 'My Role name',
  permissions: []
}

Ingest.Roles.add(role, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Updating a Role

Parameter   | Description
---------  | -----------
role      | The updated role object
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Roles.update(role, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Deleting a Role

Parameter   | Description
---------  | -----------
id         | The role id to delete
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Roles.delete(id, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

## Users

### Retrieving all Users

Only returns users on your currently authorized network

Parameter   | Description
---------  | -----------
headers    | Any headers you wish to send in object form
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Users.getAll(headers, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

This will return a list of all the users in your authorized network.

Sometimes, the results will be paginated. In order to access the next page, pass the value that was provided to you on the *Next-Range* header as an argument:


### Retrieving an User

Parameter   | Description
---------  | -----------
id        | The ID of the item to get
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Users.getById(id, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Updating a User

This updates the given user, only if you have permission to do so.

Parameter   | Description
---------  | -----------
user      | The updated user object
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Users.update(user, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Getting current User Info

Parameter   | Description
---------  | -----------
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Users.getCurrentUserInfo((error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Revoking Current User

Revokes the current user's authorization token

Parameter   | Description
---------  | -----------
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Users.revokeCurrentUser((error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```

### Update Users Roles

You will only be able to update a user's roles if you have valid permissions.

Parameter   | Description
---------  | -----------
id         | The user's id to modify roles for
roleIDs    | An array of role ids to be given to the user
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Users.updateUserRoles(id, roleIDs, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```


### Transfer User Authorship
Transfers all of a user's content to another user.

Parameter   | Description
---------  | -----------
originalID  | Original User's ID
newID      | New User's ID
callback?  | This is optional if following the callback approach. Callback parameters are error and data (error, data) => {}

```
Ingest.Users.transferUserAuthorship(originalID, newID, (error, data) => {
  if (error) {
    // handle error
  }

  ...
})
```


Issues
=====

If you encounter any issues using the Ingest Node SDK, please search the existing [issues](https://github.com/ingest/ingest-node-sdk/issues) first before opening a new one.

Please include any information that may be of assistance with reproducing the issue.

Development
==========

To modify the source of the Ingest SDK, clone the repo.

```
npm install
```

Develop in a topic/feature branch, not master.

## Running Tests


To run the unit tests, use:

```sh
npm run test
```

To watch the unit tests, use:

```sh
npm run test:watch
```

License
======

This SDK is distributed under the MIT License, see [License](LICENSE) for more information.
