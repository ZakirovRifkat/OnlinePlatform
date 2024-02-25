import { styled } from "styled-components";
import { useState } from "react";
import "./App.css";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import { Main } from "./page/Main";
import { Wiki } from "./page/Wiki";

function App() {
    const [isModelLoaded, setModelLoaded] = useState(false);
    const name = (type: any) => `/Rubber/Rubber004_1K-JPG_${type}.jpg`;

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
            <BrowserRouter>
                <Routes>
                    <Route path="/">
                        <Route
                            index
                            element={<Navigate to="/main" replace />}
                        />
                        <Route
                            path={"/main/*"}
                            element={
                                <Main
                                    colorMap={colorMap}
                                    displacementMap={displacementMap}
                                    normalMap={normalMap}
                                    roughnessMap={roughnessMap}
                                    isModelLoaded={isModelLoaded}
                                    setModelLoaded={setModelLoaded}
                                />
                            }
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AppContainer>
    );
}

const AppContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 100px;
`;
export default App;
