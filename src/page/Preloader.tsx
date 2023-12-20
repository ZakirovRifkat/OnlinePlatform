import styled from "styled-components";
import icon from "./assets/Subtract.svg";
import { AnimatePresence, motion } from "framer-motion";

export const Preloader = ({ ...props }) => {
    console.log("loader", props.isModelLoaded);
    return (
        <AnimatePresence>
            {props.isModelLoaded? null : <Container
                initial={{ opacity: 1, scale:1 }}
                exit={{ opacity: 0, scale:10 }}
                transition={{ duration: 0.5 }}
            >
                <ContainerIcon>
                    <Zaslon>
                        <Icon $image={icon} />
                    </Zaslon>
                </ContainerIcon>
            </Container>}
            
        </AnimatePresence>
    );
};

const Container = styled(motion.div)`
    display: flex;
    width: 100vw;
    height: 100vh;
    background-color: #838e9e;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    z-index: 999;
`;
const Icon = styled.div<{ $image: string }>`
    width: 130px;
    height: 155px;
    background-image: url(${(props) => props.$image});
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    flex-shrink: 0;
`;
const ContainerIcon = styled.div`
    width: 130px;
    height: 153px;
    background-color: #ffffff;
    position: relative;
`;
const Zaslon = styled.div`
    width: 130px;
    height: 100%;
    position: absolute;
    background-color: #42526b;
    top: 0;
    transition: all 1s;
    transform-origin: center;
    animation: identifier 1.5s linear infinite alternate;
    @keyframes identifier {
        from {
            height: 100%;
        }
        to {
            height: 0%;
        }
    }
`;
