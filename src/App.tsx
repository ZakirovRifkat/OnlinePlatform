import { styled } from "styled-components";
import { useState } from "react";
import "./App.css";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

import { Main } from "./page/Main";
import { ConfigProvider } from "antd";

function App() {
    const [isModelLoaded, setModelLoaded] = useState(false);
    const name = (type: any) => `/Rubber/Rubber004_1K-JPG_${type}.jpg`;
    console.log("ну ?", isModelLoaded);

    const [colorMap, displacementMap, normalMap, roughnessMap] = useLoader(
        TextureLoader,
        [
            name("Color"),
            name("Displacement"),
            name("NormalGL"),
            name("Roughness"),
        ]
    );

    return (
        <AppContainer>
            <Main
                colorMap={colorMap}
                displacementMap={displacementMap}
                normalMap={normalMap}
                roughnessMap={roughnessMap}
                isModelLoaded={isModelLoaded}
                setModelLoaded={setModelLoaded}
            />
        </AppContainer>
    );
}

const AppContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 100px;
`;
export default App;
