import { motion } from "framer-motion";
import React from "react";
import styled from "styled-components";


export const GraphicControl=()=>{
    return(
<Container
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.5 }}
>
Graphic
</Container>
    )
}

const Container=styled(motion.div)`
    width: max-content;
    height: max-content;
    padding: 20px 10px;
`