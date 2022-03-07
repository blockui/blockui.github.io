import React from 'react';
import BasePage from "components/core/BasePage";

async function example() {
  const start = Date.now()
  let i = 0

  function res(n) {
    const id = ++i
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
        console.log(`res #${id} called after ${n} milliseconds`, Date.now() - start)
      }, n)
    })
  }

  const data = await Promise.all([res(3000), res(2000), res(1000)])
  console.log(`Promise.all finished`, Date.now() - start)
}

async function example2() {
  const start = Date.now()
  let i = 0

  function res(n) {
    const id = ++i
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
        console.log(`res #${id} called after ${n} milliseconds`, Date.now() - start)
      }, n)
    })
  }

  function rej(n) {
    const id = ++i
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject()
        console.log(`rej #${id} called after ${n} milliseconds`, Date.now() - start)
      }, n)
    })
  }

  try {
    const data = await Promise.all([res(3000), res(2000), rej(1000)])
  } catch (error) {
    console.log(`Promise.all finished`, Date.now() - start)
  }
}

async function example3() {
  const start = Date.now()
  let i = 0

  function res(n) {
    const id = ++i
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
        console.log(`res #${id} called after ${n} milliseconds`, Date.now() - start)
      }, n)
    })
  }

  function rej(n) {
    const id = ++i
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject()
        console.log(`rej #${id} called after ${n} milliseconds`, Date.now() - start)
      }, n)
    })
  }

  try {
    const delay1 = res(3000)
    const delay2 = res(2000)
    const delay3 = rej(4000)

    const data1 = await delay1
    const data2 = await delay2
    const data3 = await delay3
  } catch (error) {
    console.log(`await finished`, Date.now() - start)
  }
}

class AwaitPage extends React.PureComponent {
  constructor(props) {
    super(props);

  }

  componentDidMount() {
    // example()
    // example2()
    example3()
  }

  render() {
    return (
      <BasePage title={"AwaitPage"} useHeader back>
        <div className="height_100p">

        </div>
      </BasePage>
    );
  }
}

export default AwaitPage
