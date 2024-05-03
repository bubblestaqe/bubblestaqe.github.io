import React, { useEffect, useState } from "react";
import { useChainId, useChains } from "wagmi";

interface ModalProps {
  token: {
    symbol: string;
    name: string;
    tokenPrice: bigint;
    totalSupply: bigint;
    maxSupply: bigint;
    chainId: number;
    address: `0x${string}`;
    decimals: number;
    logoURI: string;
  } | null;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ token, onClose }) => {
  const chains = useChains();
  const chainId = useChainId();

  const [totalSupply, setTotalSupply] = useState<any>();
  const [maxSupply, setMaxSupply] = useState<any>();
  const [tokenPrice, setTokenPrice] = useState<any>();
  const [ethSymbol, setEthSymbol] = useState<any>();

  useEffect(() => {
    if (!token) return;

    if (token.decimals > 0) {
      setTotalSupply(
        parseFloat(
          (Number(token.totalSupply) / 10 ** token.decimals).toFixed(10)
        )
      );
      setMaxSupply(
        parseFloat((Number(token.maxSupply) / 10 ** token.decimals).toFixed(10))
      );
      setTokenPrice(
        parseFloat(
          (Number(token.tokenPrice) / 10 ** token.decimals).toFixed(10)
        )
      );
    } else {
      setTotalSupply(Number(token.totalSupply));
      setMaxSupply(Number(token.maxSupply));
      setTokenPrice(Number(token.tokenPrice / 10n ** 18n));
    }

    if (chains) {
      setEthSymbol(
        chains.filter((c) => c.id === chainId)?.[0]?.nativeCurrency?.symbol
      );
    }
  }, [token, chainId]);

  return (
    <>
      {token && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1000,
          }}
          onClick={onClose}
        >
          <div
            style={{
              padding: "20px",
              backgroundColor: "rgba(0,0,0,0.5)",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              display: "flex",
              flexDirection: "column",
              cursor: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p style={{ fontWeight: "bold", fontSize: "20px", marginTop: 0 }}>
              {token.name} ({token.symbol})
            </p>
            <div>
              Token Price: {tokenPrice} {ethSymbol}
            </div>
            <div>
              Supply: {totalSupply} / {maxSupply} {ethSymbol}
            </div>
            <button
              onClick={onClose}
              style={{
                marginTop: "10px",
                cursor: "pointer",
                backgroundColor: "rgba(0,0,0,1)",
                color: "white",
                border: 0,
                padding: "10px",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
