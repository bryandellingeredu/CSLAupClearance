import { Outlet } from "react-router-dom"
import { Container} from "semantic-ui-react"



function App() {



  return (
    <>
    <Container fluid>
    <div className="container">
        <div className="red">
        <img src={`${import.meta.env.BASE_URL}/assets/armyLogo.png`} className="logo-image" />
        </div>
        <div className="white">
        <img src={`${import.meta.env.BASE_URL}/assets/banner.png`} className="banner-image" />
        </div>
        <div className="blue">
        <img src={`${import.meta.env.BASE_URL}/assets/awcLogo.png`} className="logo-image" />
        </div>
    </div>
      <Outlet />
    </Container>
    </>
  )
}

export default App
