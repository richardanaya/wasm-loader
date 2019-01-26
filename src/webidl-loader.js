import webidl from "./webidl";

class WebIDLLoader extends HTMLElement {
  connectedCallback() {
    this.utf8dec = new TextDecoder("utf-8");
    let wasmSrc = this.getAttribute("src");
    let exec = this.getAttribute("execute");
    let memory = this.getAttribute("memory") || "memory";
    fetch(wasmSrc)
      .then(response => response.arrayBuffer())
      .then(bytes => {
        let env = {};
        let i;
        for (i in webidl) {
          env[i] = webidl[i].bind(this);
        }
        return WebAssembly.instantiate(bytes, { env });
      })
      .then(results => {
        this.memory = results.instance.exports[memory];
        results.instance.exports[exec]();
      });
  }
  readStringFromMemory(start, len) {
    const view = new Uint8Array(this.memory.buffer, start, len);
    return this.utf8dec.decode(view);
  }
}
window.customElements.define("webidl-loader", WebIDLLoader);