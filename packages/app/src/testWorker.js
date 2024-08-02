// src/testWorker.js

//just a test worker, will put proof generation here 

self.onmessage = function (e) {
    setTimeout(() => {
      self.postMessage("just a test: Hello from the web worker after 1 minute!");
    }, 5000);
  };