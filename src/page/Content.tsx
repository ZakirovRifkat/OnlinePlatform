import { useState } from "react";
import { GovernorModel } from "../components/GovernorModel";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import logo from "./assets/logo.svg";
import { UnorderedListOutlined } from "@ant-design/icons";
import { FloatButton, Modal } from "antd";

export const Content = ({ ...props }: any) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <AnimatePresence>
            <Container
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
            >
                <GovernorModel
                    colorMap={props.colorMap}
                    displacementMap={props.displacementMap}
                    normalMap={props.normalMap}
                    roughnessMap={props.roughnessMap}
                    isModelLoaded={props.isModelLoaded}
                    setModelLoaded={props.setModelLoaded}
                />
                <Icon animate={props.isModelLoaded} alt={"logo"} src={logo} />
                <TitleMainBanner animate={props.isModelLoaded}>
                    Интерактивная онлайн лаборатория
                </TitleMainBanner>
                <FloatButtonCustom setIsModalOpen={setIsModalOpen} />
                <Modal
                    title="Информация"
                    open={isModalOpen}
                    
                    onOk={()=>{setIsModalOpen(false)}}
                    onCancel={()=>{setIsModalOpen(false)}}
                >
                    <p>Окно ахуеное</p>
                </Modal>
            </Container>
        </AnimatePresence>
    );
};

const info = () => {
    Modal.info({
      title: 'This is a notification message',
      content: (
        <div>
          <p>some messages...some messages...</p>
          <p>some messages...some messages...</p>
        </div>
      ),
      onOk() {},
    });
  };

const FloatButtonCustom = ({...props}:any) => {
    return (
        <FloatButton.Group
            trigger="click"
            style={{ right: 24 }}
            icon={<UnorderedListOutlined />}
        >
            <FloatButton onClick={info} />
        </FloatButton.Group>
    );
};

const Container = styled(motion.div)`
    width: 100%;
    height: 100vh;
    position: relative;
`;
const TitleMainBanner = styled.p<{ animate: boolean }>`
    width: max-content;
    height: max-content;
    font-size: 70px;
    z-index: 2;
    user-select: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 1s;

    color: #52380a;
    text-transform: uppercase;
    font-weight: 700;
    font-family: var(--font);

    animation-name: ${(props) => (props.animate ? "anime" : "")};
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
    animation-timing-function: linear;
    animation-delay: 1.5s;

    @keyframes anime {
        from {
            top: 50%;
            font-size: 70px;
        }
        to {
            top: 60px;
            font-size: 45px;
        }
    }
`;
const Icon = styled.img<{ animate: boolean }>`
    width: 80px;
    height: 80px;
    opacity: 0;
    position: absolute;
    top: 60px;
    left: 10%;
    transform: translate(-50%, -50%);
    animation-name: ${(props) => (props.animate ? "animeIcon" : "")};
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
    animation-timing-function: linear;
    animation-delay: 2s;

    @keyframes animeIcon {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
