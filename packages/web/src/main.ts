import h from 'hyperscript'
import XRegExp from 'xregexp'

const inputTextarea = document.getElementById('input-textarea') as HTMLTextAreaElement
const outputDiv = document.getElementById('output-div') as HTMLDivElement
const outputTextarea = document.getElementById('output-textarea') as HTMLTextAreaElement
const convertButton = document.getElementById('convert') as HTMLButtonElement

const vocabData = new Map<string, any>()

convertButton.addEventListener('click', () => {
  (async () => {
    const segs: string[] = (await fetchJSON('/api/lib/jieba', {
      entry: inputTextarea.value
    })).result

    outputDiv.innerHTML = h('pre', segs.map((s) => {
      return s === '\n' ? h('br') : h(`.segment${XRegExp('\\p{Han}').test(s) ? `.${s}` : ''}`, s)
    })).outerHTML

    await Promise.all(Array.from(new Set(segs.filter((s) => XRegExp('\\p{Han}').test(s)))).map(async (s) => {
      try {
        const r = vocabData.get(s) || (await fetchJSON('/api/vocab/match', { entry: s })).result

        vocabData.set(s, r)

        Array.from(document.getElementsByClassName(s)).map((el) => {
          el.innerHTML = h('.d-flex-vertical', [
            h('.simplified', r.simplified),
            h('.pinyin', r.pinyin),
            h('.english', r.english)
          ]).outerHTML
        })
      } catch (e) {
        console.error(e)
      }
    }))
  })().catch(console.error);

  (async () => {
    const pinyin: string = (await fetchJSON('/api/lib/pinyin', {
      entry: inputTextarea.value
    })).result

    outputTextarea.value = pinyin
  })().catch(console.error)
})

async function fetchJSON (url: string, data: any, method: string = 'POST') {
  try {
    return await (await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: data ? JSON.stringify(data) : undefined
    })).json()
  } catch (e) {}

  return {}
}
