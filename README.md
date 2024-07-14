Live at *https://mhmdmsvi24.github.io/CountriesInfo/*
This is project supposed to be a practice for step into API's world just **take it easy**

# Whats' AJAX?

AJAX stands for Asynchronous JavaScript and XML that uses the XMLHttpRequest Object to send a HTTP request to
the respected server for fetching it's data using the provided URI.

The most important part of the AJAX is the A part of it (Asynch), AJAX fetches the data we wish for without
blocking the main thread, then using certaind code developers can inject the data to the source code in a way
the want.

The Only big difference between AJAX and the new ways like using fetch is that the developer must specificaly
do the steps one by one instead of usign modern automated methods.

## States of the AJAX Request

1. Initialization --> constructing XMLHttpRequest, state: 0
2. Dispatching --> Open(method, URI), state: 1
3. Sending --> Send(), state: 2
4. Loading --> state: 3
5. Recieving --> req.onload = fn, state: 4

Also note that Retrieval of data before this point (5) is meaningless since the request is still on its way
to completion and hence still receving the data of the response.

However, take special note of the fact that this state doesn't always mean that everything went good on the
backend. It simply means that we have a response ready for our request - the response itself can even be an
error message!

### Tracking state of the **request**(Not state of HTTP)

using the `readyState` property we can track the current state of the request we're sending to the server,
wether it's initialized, dispatched, sent or recieved

```
function FetchCountries(url) {
  const req = new XMLHttpRequest();
  console.log(req.readyState); // 0
  req.open("GET", url);
  console.log(req.readyState); // 1
  req.send();
  console.log(req.readyState); // 1 ???
  return req;
}
```

But you may notice (Try it) when we try to log the state it only prints 1 even when the request is loaded(3)
and recieved(4) completely there is an answer behind this weird behavior

1. Asynchronous Nature of the JavaScript
2. Network Roundtrip: Don't panic! it's quiet a big word but it simply means _The dalay of recieving the data from the server_

The biggest question in your mind can be solved using a single statement: _Only the first two part of the AJAX
request happend to be Synchronous_ it means we can trach the states until this point then it's handed over to
the _Event Loop_ where it's taking care of it in the shadows, so if we try to access the readyState during the loading
time or when it's fully loaded we get _1_ that's because:

1. It's not Processed completely yet
2. It's Asynch means it will be processed after the main threads is done

But there's a way of finding out what's the current state using _onreadystatechange_ Event:

```
function FetchCountries(url) {
  const req = new XMLHttpRequest();

  req.onreadystatechange = () => {
    console.log(req.readyState);
    // 1
    // 2
    // 3
    // 4 😊
  };

  req.open("GET", url);
  req.send();

  return req;
}
```

You may ask how this happens using Events? or How the heck events can do it?
The answer is IDK let's ask AI:

AI created information:
Events in JavaScript don't directly access the event loop or data from other threads. Instead, the event system in
JavaScript works through a mechanism that integrates with the event loop. Here's how it functions:

1. Event Registration: When you register an event listener (e.g., using addEventListener), you're essentially telling
   the JavaScript runtime to associate a callback function with a specific event.

2. Event Queue:
   When an event occurs (e.g., a click, a network response), the browser or JavaScript runtime creates an event object
   and places it in the event queue (also called the callback queue).

3. Event Loop: The event loop constantly checks if the call stack is empty and if there are any events in the queue.
   If the call stack is empty, it takes the first event from the queue and pushes its associated callback function onto
   the call stack for execution.

4. Callback Execution: The callback function is then executed, handling the event data. This callback runs in the
   main JavaScript thread, not in a separate thread.

5. Asynchronous Operations: For asynchronous operations (like network requests), the JavaScript runtime delegates
   the work to Web APIs
   provided by the browser. When these operations complete, they add their callbacks to the event queue.

6. Microtask Queue: There's also a microtask queue (for Promises) that has higher priority than the regular event
   queue. The event
   loop processes all microtasks before moving on to the next regular event.

Quiet Information right there xD

## What is a HTTP status?

Suppose you sent a request to a URL of a server now you may wonder that that server may also respond in many ways
to your request it may not undderstand your request (404 Not Found) or it may understand (200 OK)

In short, for each request we make, for a given file, we get a response status, or simply status, along with the
actual response.

AJAX is just another way of sending requests from a _browser_, However unlike normal requests intiated by the browser,
the ones for AJAX aren't directly dealt by the browser once received. Instead this work has to be done by the developer
himself. He has to manually write all the code to retrieve the status of the response and perform actions accordingly.

This is where the strength and weakness of AJAX meets. The strength comes from the fact that we have full control over
dealing with the response, whereas the weakness comes from the same origin i.e now we have to do everything ourself! A
compromise for asynchronous capability.
