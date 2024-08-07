import { Outlet, ScrollRestoration } from "react-router-dom"
import { Container} from "semantic-ui-react"
import ModalContainer from "../common/modals/ModalContainer"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

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
    <ScrollRestoration />
      <ModalContainer />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Outlet />
    </Container>
    </>
  )
}

export default App
