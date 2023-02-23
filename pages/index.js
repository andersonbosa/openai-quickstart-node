import Head from "next/head"
import { useState } from "react"
import styles from "./index.module.css"

const DEMO_CODE = 'write Python code to output hello world in a file at same directory'

export default function Home () {
  const [userInput, setUserInput] = useState(DEMO_CODE)
  const [result, setResult] = useState()

  async function onSubmit (event) {
    event.preventDefault()
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload: userInput }),
      })

      const data = await response.json()

      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`)
      }

      const prettyResult = data.result.replace(/^\n/g, '')

      setResult(prettyResult)
      setUserInput(`${userInput} ✅`)
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error)
      alert(error.message)
    }
  }

  async function copyToClipboard (event) {
    const response = window.document.querySelector('#openapi-response')

    await navigator.clipboard.writeText(
      response.textContent.replace(/^\n/g, '')
    )
    window.alert('Copied to your clipboard!')
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <main className={styles.main}>
        <img src="/favicon.svg" className={styles.icon} />
        <h3>OpenAI API Console </h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="payload"
            placeholder="Provide instructions..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <input type="submit" value="Submit" />
        </form>

        <br />

        <div className={styles.result}>
          <textarea id="openapi-response" disabled rows="14" cols="80" value={result}>
          </textarea>
          <div>
            <button className={styles.cameron} onClick={copyToClipboard}>Share</button>
            <button className={styles.cameron} onClick={() => setResult() && setUserInput()}>Reset</button>
          </div>
        </div>
      </main>
    </div>
  )
}
