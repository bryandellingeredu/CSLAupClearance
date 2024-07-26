import { Outlet } from "react-router-dom"
import { Container } from "semantic-ui-react"



function App() {


  return (
    <>
    <Container fluid>
      <Outlet />
    </Container>
    </>
  )
}

export default App
