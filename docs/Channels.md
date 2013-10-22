---
file: 'src/channel.js'
description: 'A method of communicating data throughout an application.'
---
Channel
=======

Working with data in a JavaScript application is complicated.  Especially
applications that have been modularized and componentized to be sandboxed and
independent.  How do you communicate and synchronize data to many different
modules.  This has traditionally been a very manual process prone to error.
Channels formalize and provide a source of truth; they are consistent and
predictable by their synchronous nature and simplistic implementation.

### Basics: ###

A Channel is a top level construct within WebApp/Library.  This means other
constructs, such as Components and Models, have awareness on how to integrate
with them.  This allows for transparent handling of data between components and
application code.

<bocoup-training>View this example on our documentation site.</bocoup-training>

Initially no channels exist.  To create a new channel, simply import the
constructor and initialize with a given name.  Names are any string value
excluding spaces.  A good naming convention could be namespace:channel to
reduce potential global naming conflicts.  Once a channel is initialized with a
name it becomes the singleton to which all future Channels that share the same
name are based from.  How this works is simple, the first initialization stores
the instance into a cache and subsequent initializations with the same name
have their immediate prototype set to the previously cached instance.  This is
immensely powerful as your model is now available to all constructors through a
consistent interface.

### Read & Write to a channel: ###

The channel implementation model has been based off of the popularized Pub/Sub
pattern.  Therefore to write information to the channel, simply call the
publish method.  To subscribe to all changes, simply register a callback to the
subscribe method.  If you wish to only subscribe to a specific key you can
specify that as the first argument (String) and the callback as the second
argument.

### Local model: ###

Ideally all data sources could be consumed with ease and have sane key/value
combinations that are easily processed in your templates.  Unfortunately this
is rarely the case, so before you publish to a channel it may be important to
properly parse out data first.  Since all channels share the same global model
to represent the truth of the data, you should not make assumptions about what
kind of parsing may be required globally.  Instead create a local model and set
it’s channel to the channel you wish to publish to.  This will allow you to
specify parse rules and modify an internal structure before synchronizing to
the main channel.

### Experimental API: ###

``` javascript
import Channel from "webapp/channel";
 
// Use the `hello` Channel throughout the application to get the right data.
var first = new Channel("hello");
var second = new Channel("hello");
 
var isEqual = first.model === second.model;
console.log(isEqual); // => true
 
// Wait for data to change on the channel, specifically monitor the hello key.
second.subscribe("hello", function(val) {
 console.log(val); // => world
});
 
// Write to the channel.
basic.publish("hello", "world");
 
// Read from the channel manually.
var firstValue = basic.model.get("hello");
var secondValue = second.model.get("hello");
console.log(firstValue, secondValue); // => world, world
```
