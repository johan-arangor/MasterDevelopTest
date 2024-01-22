import { Container } from "react-bootstrap";
import { Home } from "./features/home/index";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  return (
    <div className="App">
      <Container className="mt-2">
        <Home />
      </Container>
    </div>
  );
}

export default App;
