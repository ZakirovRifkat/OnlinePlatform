import { styled } from "styled-components";
import "./App.css";
import { Header } from "./components/Header";
import { Info } from "./components/Info";
import { ModelStand } from "./components/ModelStand";

function App() {
    return (
        <AppContainer>
            <Header />
            <Info />
            <ModelStand />
        </AppContainer>
    );
}

const AppContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 60px;
`;
export default App;
