// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
contract ServerLottery {
    address public owner;
    address public server;
    address public winner;
    bool public prizeClaimed;
    event FundsReceived(address from, uint256 amount);
    event WinnerSet(address indexed winner);
    event PrizeSent(address indexed winner, uint256 amount);
    modifier onlyOwner() {
        require(msg.sender == owner, "Solo el owner");
        _;
    }
    modifier onlyServer() {
        require(msg.sender == server, "Solo el servidor autorizado");
        _;
    }
    constructor(address _server) {
        owner = msg.sender;
        server = _server;
        prizeClaimed = false;
    }
    // Recibir fondos (por ejemplo, 0.06 ETH para premios)
    receive() external payable {
        emit FundsReceived(msg.sender, msg.value);
    }
    // El servidor designa al ganador
    function setWinner(address _winner) external onlyServer {
        require(_winner != address(0), "Direccion invalida");
        require(!prizeClaimed, "Premio ya fue reclamado");
        winner = _winner;
        emit WinnerSet(_winner);
    }
    // Enviar todo el premio al ganador
    function sendPrize() external {
        require(msg.sender == winner, "Solo el ganador puede reclamar");
        require(!prizeClaimed, "Premio ya enviado");
        uint256 amount = address(this).balance;
        require(amount > 0, "Sin fondos");
        prizeClaimed = true;
        (bool success, ) = winner.call{value: amount}("");
        require(success, "Transferencia fallida");
        emit PrizeSent(winner, amount);
    }
    // Cambiar servidor si es necesario
    function setServer(address _newServer) external onlyOwner {
        require(_newServer != address(0), "Direccion invalida");
        server = _newServer;
    }
    // Consultar balance
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}