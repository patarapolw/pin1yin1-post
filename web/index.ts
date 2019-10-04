import h from "hyperscript";
import XRegExp from "xregexp";

const inputTextarea = document.getElementById("input-textarea") as HTMLTextAreaElement;
const outputDiv = document.getElementById("output-div") as HTMLDivElement;
const outputTextarea = document.getElementById("output-textarea") as HTMLTextAreaElement;
const convertButton = document.getElementById("convert") as HTMLButtonElement;

const vocabData: Record<string, any> = {};

convertButton.addEventListener("click", () => {
  (async () => {
    const segs: string[] = (await fetchJSON("/api/lib/jieba", {
      entry: inputTextarea.value
    })).result;

    outputDiv.innerHTML = h("pre", segs.map((s) => {
      return h(`.segment${XRegExp("\\p{Han}").test(s) ? `.${s}` : ""}`, s);
    })).outerHTML;

    Array.from(new Set(segs.filter((s) => XRegExp("\\p{Han}").test(s)))).mapAsync(async (s) => {
      try {
        let r = vocabData[s] || (await fetchJSON("/api/zh/vocab/match", {entry: s})).result[0] || {
          simplified: s,
          pinyin: (await fetchJSON("/api/lib/pinyin", {
            entry: s
          })).result
        };

        vocabData[s] = r;

        Array.from(document.getElementsByClassName(s)).map((el) => {
          el.innerHTML = h(".d-flex-vertical", [
            h(".simplified", r.simplified),
            h(".pinyin", r.pinyin),
            h(".english", r.english)
          ]).outerHTML;
        });
      } catch(e) {
        console.error(e);
      }
    })
  })().catch(console.error);

  (async () => {
    const pinyin: string = (await fetchJSON("/api/lib/pinyin", {
      entry: inputTextarea.value
    })).result;
  
    outputTextarea.value = pinyin;
  })().catch(console.error);
});

async function fetchJSON(url: string, data: any, method: string = "POST") {
  try {
    return await (await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: data ? JSON.stringify(data) : undefined
    })).json()
  } catch(e) {}

  return {};
}

declare global {
  interface Array<T> {
    mapAsync<U>(callbackfn: (value: T, index: number, array: T[]) => Promise<U>, thisArg?: any): Promise<U[]>
  }
}

Array.prototype.mapAsync = function (fn, thisArgs) {
  return Promise.all(this.map(fn, thisArgs));
}
