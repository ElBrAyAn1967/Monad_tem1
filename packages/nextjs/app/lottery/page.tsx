"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { Address, AddressInput, EtherInput } from "~~/components/scaffold-eth";
import {
  useDeployedContractInfo,
  useScaffoldReadContract,
  useScaffoldWriteContract,
  useTransactor,
} from "~~/hooks/scaffold-eth";

const LotteryPage: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [newWinner, setNewWinner] = useState("");
  const [fundAmount, setFundAmount] = useState("");
  const [newServer, setNewServer] = useState("");

  // Lecturas del contrato
  const { data: owner } = useScaffoldReadContract({
    contractName: "ServerLottery",
    functionName: "owner",
  });

  const { data: server } = useScaffoldReadContract({
    contractName: "ServerLottery",
    functionName: "server",
  });

  const { data: winner } = useScaffoldReadContract({
    contractName: "ServerLottery",
    functionName: "winner",
  });

  const { data: prizeClaimed } = useScaffoldReadContract({
    contractName: "ServerLottery",
    functionName: "prizeClaimed",
  });

  const { data: balance } = useScaffoldReadContract({
    contractName: "ServerLottery",
    functionName: "getBalance",
  });

  // Escrituras del contrato
  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "ServerLottery",
  });

  // Info del contrato y transactor para enviar ETH directamente
  const { data: deployedContract } = useDeployedContractInfo({ contractName: "ServerLottery" });
  const transactor = useTransactor();

  // Roles
  const isOwner = connectedAddress?.toLowerCase() === owner?.toLowerCase();
  const isServer = connectedAddress?.toLowerCase() === server?.toLowerCase();
  const isWinner = connectedAddress?.toLowerCase() === winner?.toLowerCase();

  // Funciones de interacción
  const handleSetWinner = async () => {
    if (!newWinner) return;
    try {
      await writeContractAsync({
        functionName: "setWinner",
        args: [newWinner],
      });
      setNewWinner("");
    } catch (error) {
      console.error("Error al designar ganador:", error);
    }
  };

  const handleSendPrize = async () => {
    try {
      await writeContractAsync({
        functionName: "sendPrize",
      });
    } catch (error) {
      console.error("Error al enviar premio:", error);
    }
  };

  const handleSetServer = async () => {
    if (!newServer) return;
    try {
      await writeContractAsync({
        functionName: "setServer",
        args: [newServer],
      });
      setNewServer("");
    } catch (error) {
      console.error("Error al cambiar servidor:", error);
    }
  };

  const handleSendFunds = async () => {
    if (!fundAmount) return;
    try {
      if (!deployedContract?.address) return;
      await transactor({ to: deployedContract.address, value: parseEther(fundAmount) });
      setFundAmount("");
    } catch (error) {
      console.error("Error al enviar fondos:", error);
    }
  };

  return (
    <div className="flex items-center flex-col grow pt-10">
      <div className="px-5 w-full max-w-4xl">
        <h1 className="text-center">
          <span className="block text-4xl font-bold">🎰 Server Lottery</span>
          <span className="block text-lg mt-2">Gestiona tu lotería descentralizada</span>
        </h1>

        {/* Información del contrato */}
        <div className="bg-base-100 border border-base-300 shadow-md shadow-secondary rounded-3xl px-6 lg:px-8 py-6 mt-8">
          <h2 className="text-2xl font-bold mb-4">📊 Información del Contrato</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-bold">👑 Owner:</span>
              <Address address={owner} />
            </div>
            <div>
              <span className="font-bold">🖥️ Server:</span>
              <Address address={server} />
            </div>
            <div>
              <span className="font-bold">🏆 Winner:</span>
              {winner && winner !== "0x0000000000000000000000000000000000000000" ? (
                <Address address={winner} />
              ) : (
                <span className="text-gray-500">No hay ganador</span>
              )}
            </div>
            <div>
              <span className="font-bold">💰 Balance:</span>
              <span className="ml-2">{balance ? `${Number(balance) / 1e18} ETH` : "0 ETH"}</span>
            </div>
            <div>
              <span className="font-bold">🎁 Premio Reclamado:</span>
              <span className={`ml-2 ${prizeClaimed ? "text-red-500" : "text-green-500"}`}>
                {prizeClaimed ? "Sí" : "No"}
              </span>
            </div>
          </div>
        </div>

        {/* Rol del usuario */}
        <div className="bg-base-200 rounded-xl p-4 mt-6">
          <h3 className="font-bold mb-2">🔑 Tu Rol:</h3>
          <div className="flex gap-2">
            {isOwner && <span className="badge badge-primary">Owner</span>}
            {isServer && <span className="badge badge-secondary">Server</span>}
            {isWinner && <span className="badge badge-accent">Winner</span>}
            {!isOwner && !isServer && !isWinner && <span className="badge badge-ghost">Usuario Regular</span>}
          </div>
        </div>

        {/* Acciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Enviar fondos */}
          <div className="bg-base-100 border border-base-300 shadow-md shadow-secondary rounded-3xl px-6 py-6">
            <h3 className="text-xl font-bold mb-4">💸 Enviar Fondos</h3>
            <div className="space-y-4">
              <EtherInput placeholder="Cantidad en ETH" value={fundAmount} onChange={setFundAmount} />
              <button className="btn btn-primary w-full" onClick={handleSendFunds} disabled={!fundAmount}>
                Enviar Fondos
              </button>
            </div>
          </div>

          {/* Designar ganador */}
          {isServer && (
            <div className="bg-base-100 border border-base-300 shadow-md shadow-secondary rounded-3xl px-6 py-6">
              <h3 className="text-xl font-bold mb-4">🏆 Designar Ganador</h3>
              <div className="space-y-4">
                <AddressInput placeholder="Dirección del ganador" value={newWinner} onChange={setNewWinner} />
                <button
                  className="btn btn-secondary w-full"
                  onClick={handleSetWinner}
                  disabled={!newWinner || prizeClaimed}
                >
                  Designar Ganador
                </button>
              </div>
            </div>
          )}

          {/* Reclamar premio */}
          {isWinner && !prizeClaimed && winner !== "0x0000000000000000000000000000000000000000" && (
            <div className="bg-base-100 border border-base-300 shadow-md shadow-secondary rounded-3xl px-6 py-6">
              <h3 className="text-xl font-bold mb-4">🎁 Reclamar Premio</h3>
              <p className="mb-4">¡Felicidades! Puedes reclamar tu premio.</p>
              <button className="btn btn-accent w-full" onClick={handleSendPrize}>
                Reclamar Premio
              </button>
            </div>
          )}

          {/* Cambiar servidor */}
          {isOwner && (
            <div className="bg-base-100 border border-base-300 shadow-md shadow-secondary rounded-3xl px-6 py-6">
              <h3 className="text-xl font-bold mb-4">🖥️ Cambiar Servidor</h3>
              <div className="space-y-4">
                <AddressInput placeholder="Nueva dirección del servidor" value={newServer} onChange={setNewServer} />
                <button className="btn btn-warning w-full" onClick={handleSetServer} disabled={!newServer}>
                  Cambiar Servidor
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Instrucciones */}
        <div className="bg-base-200 rounded-xl p-6 mt-8">
          <h3 className="text-xl font-bold mb-4">📝 Instrucciones</h3>
          <ul className="space-y-2">
            <li>
              • <strong>Cualquiera</strong> puede enviar fondos al contrato
            </li>
            <li>
              • Solo el <strong>Server</strong> puede designar un ganador
            </li>
            <li>
              • Solo el <strong>Ganador</strong> puede reclamar el premio
            </li>
            <li>
              • Solo el <strong>Owner</strong> puede cambiar el servidor
            </li>
            <li>• Una vez reclamado el premio, no se puede reclamar de nuevo</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LotteryPage;
