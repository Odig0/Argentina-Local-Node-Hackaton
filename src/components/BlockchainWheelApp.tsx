import React, { useState, useRef, useEffect } from 'react';
import { BrowserProvider, Contract, parseEther, randomBytes, toBeHex, keccak256 } from 'ethers';

// ABI importado o copiado (puedes importar desde abby.json si lo deseas)
import abbyAbi from '../abby.json';
import { Wallet, Trophy, Coins, Sparkles, ExternalLink } from 'lucide-react';


type BlockchainWheelAppProps = {
  address?: string;
  signer?: any;
};

const BlockchainWheelApp = ({ address, signer }: BlockchainWheelAppProps) => {
  const [points, setPoints] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const CONTRACT_ADDRESS = "0xb933c0360cdDeDa4d52845cc7C9d593b9E49A8cC";

  const prizes = [
    { name: 'EMPTY', value: 0, color: '#F59E0B', emoji: '😕' },
    { name: '500', value: 500, color: '#A855F7', emoji: '⭐' },
    { name: 'EMPTY', value: 0, color: '#EF4444', emoji: '😕' },
    { name: 'CR', value: 100, color: '#10B981', emoji: '💎' },
    { name: 'Llama', value: 300, color: '#F59E0B', emoji: '🔥' },
    { name: '6X', value: 600, color: '#10B981', emoji: '🚀' },
    { name: '50', value: 50, color: '#A855F7', emoji: '✨' },
    { name: 'EMPTY', value: 0, color: '#F59E0B', emoji: '😕' },
    { name: 'OFF', value: -100, color: '#EF4444', emoji: '❌' },
  ];

  const rewards = [
    { name: 'Premio 1', value: 150, icon: '🥉' },
    { name: 'Premio 2', value: 200, icon: '🥈' },
    { name: 'Premio 3', value: 500, icon: '🥇' },
    { name: 'Premio 4', value: 1000, icon: '👑' },
  ];

  useEffect(() => {
    drawWheel();
  }, []);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 180;
    const sliceAngle = (2 * Math.PI) / prizes.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    prizes.forEach((prize, i) => {
      const startAngle = i * sliceAngle - Math.PI / 2;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.lineTo(centerX, centerY);
      ctx.fillStyle = prize.color;
      ctx.fill();
      ctx.strokeStyle = '#1F2937';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px Arial';
      ctx.fillText(prize.emoji, radius / 1.5, 10);
      ctx.font = 'bold 16px Arial';
      ctx.fillText(prize.name, radius / 1.5, 30);
      ctx.restore();
    });

    // Centro
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#1F2937';
    ctx.fill();
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Indicador
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius - 20);
    ctx.lineTo(centerX - 15, centerY - radius);
    ctx.lineTo(centerX + 15, centerY - radius);
    ctx.closePath();
    ctx.fillStyle = '#EF4444';
    ctx.fill();
    ctx.strokeStyle = '#1F2937';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const spinWheel = () => {
    if (spinning) return;
    
    setSpinning(true);
    const spins = 5 + Math.random() * 5;
    const extraDegrees = Math.random() * 360;
    const totalRotation = rotation + (spins * 360) + extraDegrees;
    
    setRotation(totalRotation);

    setTimeout(() => {
      const normalizedRotation = totalRotation % 360;
      const sliceAngle = 360 / prizes.length;
      const winningIndex = Math.floor((360 - normalizedRotation + 90) / sliceAngle) % prizes.length;
      const prize = prizes[winningIndex];
      
      setPoints(prev => Math.max(0, prev + prize.value));
      setSpinning(false);
    }, 4000);
  };


const handleDeposit = async () => {
  try {
    if (!signer) {
    
      return;
    }
    const contract = new Contract(CONTRACT_ADDRESS, abbyAbi, signer);
    // Parámetros de ejemplo:
    const raffleId = 1;
    const ticketPrice = parseEther('0.01'); // 0.01 ETH
    // Commitment aleatorio (en real, debe ser hash de secreto)
    const randomValue = randomBytes(32);
    const commitment = keccak256(randomValue);
    console.log('Depositando ticket...');
    const tx = await contract.depositTicket(raffleId, commitment, { value: ticketPrice });
    console.log('Esperando confirmación...');
    await tx.wait();
    alert('✅ Depósito realizado exitosamente!');
  } catch (err: any) {
    console.error('Error al depositar:', err);
  }
};

// Función para verificar ganador (cierra la rifa y elige un ganador aleatorio)
const handleVerifyWinner = async () => {
  try {
    if (!signer) {
 
      return;
    }
    const contract = new Contract(CONTRACT_ADDRESS, abbyAbi, signer);
    const raffleId = 1;
    // Randomness de ejemplo (en producción usar VRF de Chainlink)
    const randomness = Math.floor(Math.random() * 1e18);
    console.log('Cerrando rifa y seleccionando ganador...');
    const tx = await contract.closeAndSetWinner(raffleId, randomness);
    console.log('Esperando confirmación...');
    await tx.wait();
    alert('✅ Ganador verificado exitosamente!');
  } catch (err: any) {
    console.error('Error al verificar ganador:', err);

  }
};
  // El disconnectWallet tampoco se maneja aquí

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-slate-900/50 backdrop-blur-lg border-b border-purple-500/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-xl shadow-lg">
                <Sparkles className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Blockchain Wheel</h1>
                <p className="text-purple-300 text-sm">Hackathon Prize Spinner</p>
              </div>
            </div>


          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Rewards Store */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Trophy className="text-yellow-400" size={24} />
                TIENDA
              </h2>
              <div className="space-y-3">
                {rewards.map((reward, idx) => (
                  <button
                    key={idx}
                    disabled={points < reward.value}
                    className={`w-full p-4 rounded-xl font-semibold text-left transition-all transform hover:scale-105 ${
                      points >= reward.value
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg hover:shadow-cyan-500/50'
                        : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{reward.icon}</span>
                      <div className="text-right">
                        <div className="text-sm">{reward.name}</div>
                        <div className="text-xs">$ {reward.value}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Wheel Section */}
          <div className="lg:col-span-6">
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30 shadow-2xl">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-4 rounded-full shadow-lg">
                  <Coins className="text-white" size={28} />
                  <span className="text-3xl font-bold text-white">PUNTOS: {points}</span>
                </div>
              </div>

              <div className="flex justify-center mb-6">
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    width="400"
                    height="400"
                    className="transform transition-transform duration-[4000ms] ease-out"
                    style={{ 
                      transform: `rotate(${rotation}deg)`,
                      filter: 'drop-shadow(0 10px 30px rgba(139, 92, 246, 0.3))'
                    }}
                  />
                </div>
              </div>

              <div className="text-center flex flex-col items-center gap-4">
                <button
                  onClick={spinWheel}
                  disabled={spinning}
                  className={`px-12 py-4 rounded-xl font-bold text-xl shadow-2xl transform transition-all ${
                    spinning
                      ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white hover:scale-110 animate-pulse'
                  }`}
                >
                  {spinning ? '🎡 GIRANDO...' : '🎯 GIRA LA RULETA'}
                </button>
                <div className="flex flex-row gap-4 mt-4">
                  <button
                    className="px-8 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all"
                    onClick={handleDeposit}
                    disabled={!address}
                  >
                    Depositar
                  </button>
                  <button
                    className="px-8 py-3 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 shadow-md transition-all"
                    onClick={handleVerifyWinner}
                  >
                    Verificar Ganador
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4">📊 Estadísticas</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-4 rounded-xl border border-purple-500/30">
                  <div className="text-purple-300 text-sm">Total Ganado</div>
                  <div className="text-2xl font-bold text-white">{points} pts</div>
                </div>
                <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 p-4 rounded-xl border border-blue-500/30">
                  <div className="text-blue-300 text-sm">Estado</div>
                  <div className="text-lg font-bold text-white">
                    {'Estado: Scroll'}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 p-4 rounded-xl border border-green-500/30">
                  <div className="text-green-300 text-sm">Network</div>
                  <div className="text-lg font-bold text-white">SCROLL </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-slate-900/50 rounded-xl border border-yellow-500/30">
                <h4 className="text-yellow-400 font-semibold mb-2">💡 Premios:</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>🌟 500 pts - Mega</li>
                  <li>🔥 300 pts - Llama</li>
                  <li>💎 100 pts - CR</li>
                  <li>✨ 50 pts - Mini</li>
                  <li>😕 EMPTY - Nada</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-slate-800/50 backdrop-blur-lg rounded-xl px-6 py-3 border border-purple-500/30">
            <p className="text-purple-300 text-sm">
              🚀 Powered by <span className="font-bold text-white">OnchainKit</span> & <span className="font-bold text-white">Scroll</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlockchainWheelApp;