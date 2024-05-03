import React from "react";
import { animated, useSpring } from "react-spring";

interface Token {
  symbol: string;
  name: string;
  logoURI: string;
  tokenPrice: bigint;
  totalSupply: bigint;
}

interface BubbleProps {
  token: Token;
  size: number;
  onClick: any;
}

const Bubble: React.FC<BubbleProps> = ({ token, size, onClick }) => {
  const startX = Math.random() * (window.innerWidth - size);
  const startY = Math.random() * (window.innerHeight - size);

  const animProps = useSpring({
    from: {
      transform: `translate3d(${startX}px, ${startY - 20}px, 0)`,
      opacity: 0.6,
    },
    to: async (next) => {
      while (1) {
        await next({
          transform: `translate3d(${startX}px, ${startY + 20}px, 0)`,
          opacity: 0.7,
        });
        await next({
          transform: `translate3d(${startX}px, ${startY - 20}px, 0)`,
          opacity: 0.6,
        });
      }
    },
    config: { duration: 5000 },
  });

  const [hoverStyle, setHoverStyle] = React.useState({});
  const handleMouseEnter = () => setHoverStyle({ opacity: 1 });
  const handleMouseLeave = () => setHoverStyle({});

  return (
    <animated.div
      style={{
        position: "absolute",
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
        borderRadius: "50%",
        backgroundImage: `url(${token.logoURI.replace("ipfs://", "https://ipfs.io/ipfs/")})`,
        backgroundSize: "50%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        ...animProps,
        ...hoverStyle,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    />
  );
};

export default Bubble;
