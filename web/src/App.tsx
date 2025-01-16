import { useEffect } from "react"
import { postLogin } from "./petstore"

function App() {

  useEffect(() => {
    postLogin({
      username: 'leandro123',
      password: '123456'
    }).then(({data, status}) => {
      if(status === 200){
        console.log(data)
      }
    })
  }, [])

  return (
    <div>
      Hello, World!
    </div>
  )
}

export default App
