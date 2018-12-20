// swaghetty code
(function () {

  const formNode = document.querySelector('#my-example-form');
  const urlNode = document.querySelector('#url');
  urlNode.value = location.origin;
  const queryNode = document.querySelector('#query');
  queryNode.value = '#my-example-form';
  const perfectNode = document.querySelector('#perfect');
  const outputNode = document.querySelector('#output');
  const outputUrlNode = document.querySelector('#output-url');
  const outputCopyNode = document.querySelector('#output-copy');

  formNode.addEventListener('submit', event => {
    event.preventDefault();
    handleSubmit(event);
  });

  outputCopyNode.addEventListener('click', event => handleCopy(event));

  function handleSubmit() {
    const url = encodeURIComponent(urlNode.value);
    const query = encodeURIComponent(queryNode.value);
    const perfect = perfectNode.checked;

    const outputUrl = `${location.origin}/sh/?query=${query}&perfect=${perfect}&url=${url}`;

    outputNode.alt = 'loading…';
    outputNode.classList.add('loading');
    outputNode.addEventListener('load', e => {
      outputNode.classList.remove('loading')
      outputNode.alt = 'output';
    });

    outputUrlNode.innerHTML =
      outputUrlNode.href =
      outputNode.src =
      outputUrl;
  }

  function handleCopy() {
    var textarea = document.createElement("textarea");
    textarea.textContent = outputUrlNode.href;
    textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in MS Edge.
    document.body.appendChild(textarea);
    textarea.select();
    try {
      return document.execCommand("copy"); // Security exception may be thrown by some browsers.
    } catch (ex) {
      console.warn("Copy to clipboard failed.", ex);
      return false;
    } finally {
      document.body.removeChild(textarea);
      outputCopyNode.value += ' ✔';
    }
  }

})()
