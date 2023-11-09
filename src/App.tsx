import { styled } from "styled-components";
import "./App.css";
import { Header } from "./components/Header";
import { Info } from "./components/Info";
import { ModelStand } from "./components/ModelStand";
import { ExtraLinks } from "./components/ExtraLinks";

function App() {
    return (
        <AppContainer>
            <Header />
            <Info />
            <ModelStand />
            <ExtraLinks />
        </AppContainer>
    );
}

const AppContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 100px;
`;
export default App;
