import { useChainId, useSwitchChain } from "wagmi";

function Chains() {
  const { chains, switchChain }: any = useSwitchChain();
  const chainId = useChainId();

  return (
    <div className="chains">
      {chains.map((chain: any) => {
        return (
          <a
            href={`/?chainId=${chainId}`}
            key={chain.id}
            onClick={() => switchChain({ chainId: chain.id })}
            className={chain.id === chainId ? `active` : ``}
          >
            <div>{chain.name}</div>
          </a>
        );
      })}
    </div>
  );
}

export default Chains;
