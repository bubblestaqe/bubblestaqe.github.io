import { useEffect, useState } from "react";
import { useChainId, useReadContracts } from "wagmi";
import Bubble from "./Bubble";
import Modal from "./Modal";

import Chains from "./Chains";
import "./index.css";

const abi = [
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "maxSupply",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "tokenPrice",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
];

function App() {
  const chainId = useChainId();

  const [tokenList, setTokenList] = useState<any>([]);
  const [contracts, setContracts] = useState<any>();
  const [tokens, setTokens] = useState<any>([]);

  const { data } = useReadContracts({
    contracts,
    query: { enabled: !!contracts },
  });

  useEffect(() => {
    const fetchTokens = async () => {
      const tokensRequest = await fetch(
        `https://raw.githubusercontent.com/staqeprotocol/tokenlist/main/chains/${chainId}.tokenlist.json`
      );
      if (!tokensRequest.ok) return;
      const tokensJson = await tokensRequest.json();
      setTokenList(tokensJson.tokens);
    };

    fetchTokens();
  }, [chainId]);

  useEffect(() => {
    if (!tokenList || !tokenList.length) return;

    const contracts = tokenList.flatMap((token: any) => {
      return [
        {
          abi,
          address: token.address,
          functionName: "maxSupply",
          metadata: token,
        },
        {
          abi,
          address: token.address,
          functionName: "totalSupply",
          metadata: token,
        },
        {
          abi,
          address: token.address,
          functionName: "tokenPrice",
          metadata: token,
        },
      ];
    });

    setContracts(contracts);
  }, [tokenList]);

  useEffect(() => {
    if (!data) return;

    const tokens = data.reduce((acc, current, index) => {
      if (index % 3 === 0) {
        acc.push({
          maxSupply: current.result,
          ...contracts[index].metadata,
        });
      } else if (index % 3 === 1) {
        acc[acc.length - 1].totalSupply = current.result;
      } else {
        acc[acc.length - 1].tokenPrice = current.result;
      }
      return acc;
    }, [] as any);

    setTokens(tokens);
  }, [data]);

  const [selectedToken, setSelectedToken] = useState<any>(null);

  const handleBubbleClick = (token: any) => {
    setSelectedToken(token);
  };

  const closeModal = () => {
    setSelectedToken(null);
  };

  return (
    <>
      <Chains />
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {tokens.map((token: any) => (
          <Bubble
            key={token.address}
            token={token}
            size={Math.sqrt(
              Number(
                Number(token.tokenPrice) * (Number(token.totalSupply) || 10)
              ) / 1000000000
            )}
            onClick={() => handleBubbleClick(token)}
          />
        ))}
        <Modal token={selectedToken} onClose={closeModal} />
      </div>
    </>
  );
}

export default App;
