import React, { useState, useMemo } from 'react';
import { 
  Utensils, 
  DollarSign, 
  ClipboardList, 
  Users, 
  Plus, 
  Trash2, 
  Save, 
  X, 
  CheckCircle, 
  CreditCard,
  ChefHat,
  TrendingUp,
  Edit2,
  Lock,
  Scale // Nuevo icono para peso
} from 'lucide-react';

// --- Componentes UI Básicos ---
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-md border border-slate-200 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = "", disabled = false }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 justify-center";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed",
    secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 disabled:bg-slate-50 disabled:text-slate-300",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed",
    outline: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50"
  };
  return (
    <button 
      onClick={onClick} 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// --- Datos Iniciales ---
const DATA_INICIAL = {
  mesas: Array.from({ length: 9 }, (_, i) => ({ id: i + 1, nombre: `Mesa ${i + 1}` })),
  carta: [
    { id: 1, nombre: 'Lomo Saltado', precio: 35.00, categoria: 'Fondos' },
    { id: 2, nombre: 'Ceviche Clásico', precio: 28.00, categoria: 'Entradas' },
    { id: 3, nombre: 'Ají de Gallina', precio: 25.00, categoria: 'Fondos' },
    { id: 4, nombre: 'Inca Kola 1L', precio: 12.00, categoria: 'Bebidas' },
    { id: 5, nombre: 'Pisco Sour', precio: 22.00, categoria: 'Bebidas' },
  ]
};

// --- Componente Principal ---
export default function App() {
  const [vistaActual, setVistaActual] = useState('mesas'); // mesas, carta, reportes
  const [carta, setCarta] = useState(DATA_INICIAL.carta);
  const [pedidos, setPedidos] = useState([]); // Historial de pedidos
  const [pedidoActivo, setPedidoActivo] = useState(null); // Pedido en modal
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);

  // --- Funciones de Lógica de Negocio ---

  // Obtener pedido pendiente de una mesa
  const obtenerPedidoMesa = (mesaId) => {
    return pedidos.find(p => p.mesaId === mesaId && p.estado === 'pendiente');
  };

  // Crear o abrir pedido
  const abrirMesa = (mesa) => {
    setMesaSeleccionada(mesa);
    const pedidoExistente = obtenerPedidoMesa(mesa.id);
    if (pedidoExistente) {
      setPedidoActivo({ ...pedidoExistente });
    } else {
      // Nuevo pedido temporal
      setPedidoActivo({
        id: Date.now(),
        mesaId: mesa.id,
        mesaNombre: mesa.nombre,
        items: [],
        pagos: [],
        estado: 'pendiente',
        fechaInicio: new Date().toISOString(),
      });
    }
  };

  // Guardar cambios del pedido activo en el estado global
  const guardarPedido = (pedidoActualizado) => {
    setPedidoActivo(pedidoActualizado);
    setPedidos(prev => {
      const existe = prev.find(p => p.id === pedidoActualizado.id);
      if (existe) {
        return prev.map(p => p.id === pedidoActualizado.id ? pedidoActualizado : p);
      } else {
        return [...prev, pedidoActualizado];
      }
    });
  };

  // Función para finalizar pedido manualmente
  const finalizarPedido = () => {
    if (!pedidoActivo) return;
    const pedidoFinalizado = { ...pedidoActivo, estado: 'completado' };
    guardarPedido(pedidoFinalizado);
    cerrarModal(); // Opcional: cerrar modal al finalizar
  };

  // Cerrar modal
  const cerrarModal = () => {
    setMesaSeleccionada(null);
    setPedidoActivo(null);
  };

  // Calcular totales (Item precio * cantidad)
  const calcularTotalPedido = (items) => items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  const calcularTotalPagado = (pagos) => pagos.reduce((acc, pago) => acc + parseFloat(pago.monto), 0);

  // --- Sub-Componentes de Vistas ---

  const VistaMesas = () => {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-600" />
          Salón Principal
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {DATA_INICIAL.mesas.map(mesa => {
            const pedido = obtenerPedidoMesa(mesa.id);
            const ocupada = !!pedido;
            
            return (
              <button
                key={mesa.id}
                onClick={() => abrirMesa(mesa)}
                className={`
                  relative h-40 rounded-2xl border-2 flex flex-col items-center justify-center transition-all hover:scale-105
                  ${ocupada 
                    ? 'bg-orange-50 border-orange-200 text-orange-800' 
                    : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'}
                `}
              >
                <div className={`p-4 rounded-full mb-3 ${ocupada ? 'bg-orange-100' : 'bg-slate-100'}`}>
                  <Utensils className="w-8 h-8" />
                </div>
                <span className="font-bold text-lg">{mesa.nombre}</span>
                {ocupada && (
                  <span className="absolute top-3 right-3 px-2 py-1 bg-orange-200 text-orange-800 text-xs font-bold rounded-full">
                    S/ {calcularTotalPedido(pedido.items).toFixed(2)}
                  </span>
                )}
                <span className={`text-sm mt-1 ${ocupada ? 'text-orange-600 font-medium' : 'text-slate-400'}`}>
                  {ocupada ? 'Ocupada' : 'Disponible'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const ModalPedido = () => {
    if (!pedidoActivo) return null;

    // Estado para el modo de ingreso: 'carta' o 'peso'
    const [modoInput, setModoInput] = useState('carta'); 
    
    // Estados para items de carta
    const [nuevoItem, setNuevoItem] = useState({ platoId: '', cantidad: 1, precio: 0, notaCliente: '' });
    
    // Estados para items de peso
    const [datosPeso, setDatosPeso] = useState({ gramos: '', precioKilo: 59.90, notaCliente: '' });
    
    // Estados para pagos
    const [nuevoPago, setNuevoPago] = useState({ metodo: 'Efectivo', monto: '', cliente: '' });
    
    // Estados derivados
    const total = useMemo(() => calcularTotalPedido(pedidoActivo.items), [pedidoActivo.items]);
    const pagado = useMemo(() => calcularTotalPagado(pedidoActivo.pagos), [pedidoActivo.pagos]);
    const restante = total - pagado;
    const esPedidoCompletado = pedidoActivo.estado === 'completado';

    // --- Handlers Carta ---
    const handleSelectPlato = (e) => {
      const platoId = parseInt(e.target.value);
      const plato = carta.find(p => p.id === platoId);
      if (plato) {
        setNuevoItem({ ...nuevoItem, platoId, precio: plato.precio });
      } else {
        setNuevoItem({ ...nuevoItem, platoId: '', precio: 0 });
      }
    };

    const agregarItemCarta = () => {
      if (!nuevoItem.platoId || nuevoItem.cantidad < 1) return;
      const platoInfo = carta.find(p => p.id === nuevoItem.platoId);
      
      const itemAgregado = {
        id: Date.now(),
        nombre: platoInfo.nombre,
        precio: parseFloat(nuevoItem.precio), 
        cantidad: parseInt(nuevoItem.cantidad), 
        notaCliente: nuevoItem.notaCliente,
        tipo: 'carta'
      };

      const nuevoPedido = {
        ...pedidoActivo,
        items: [...pedidoActivo.items, itemAgregado]
      };
      guardarPedido(nuevoPedido);
      setNuevoItem({ platoId: '', cantidad: 1, precio: 0, notaCliente: '' });
    };

    // --- Handlers Peso ---
    const agregarItemPeso = () => {
      if (!datosPeso.gramos || parseFloat(datosPeso.gramos) <= 0) return;
      
      const pesoKg = parseFloat(datosPeso.gramos) / 1000;
      const precioCalculado = pesoKg * parseFloat(datosPeso.precioKilo);

      const itemAgregado = {
        id: Date.now(),
        nombre: `Buffet (${datosPeso.gramos}g)`,
        precio: precioCalculado, // El precio total se guarda aquí
        cantidad: 1, // Siempre 1 unidad de "plato buffet"
        notaCliente: datosPeso.notaCliente,
        tipo: 'peso',
        detalles: { gramos: datosPeso.gramos, precioKilo: datosPeso.precioKilo }
      };

      const nuevoPedido = {
        ...pedidoActivo,
        items: [...pedidoActivo.items, itemAgregado]
      };
      guardarPedido(nuevoPedido);
      // Resetear campos de peso, manteniendo el precio/kilo
      setDatosPeso({ ...datosPeso, gramos: '', notaCliente: '' });
    };

    // --- Handlers Comunes ---
    const eliminarItem = (itemId) => {
      if (esPedidoCompletado) return; 
      const nuevosItems = pedidoActivo.items.filter(i => i.id !== itemId);
      guardarPedido({ ...pedidoActivo, items: nuevosItems });
    };

    const registrarPago = () => {
      if (!nuevoPago.monto || parseFloat(nuevoPago.monto) <= 0) return;
      if (!nuevoPago.cliente.trim()) {
        alert("Por favor ingresa el nombre del cliente que paga.");
        return;
      }

      const pago = {
        id: Date.now(),
        metodo: nuevoPago.metodo,
        monto: parseFloat(nuevoPago.monto),
        cliente: nuevoPago.cliente,
        fecha: new Date().toISOString()
      };

      const nuevoPedido = {
        ...pedidoActivo,
        pagos: [...pedidoActivo.pagos, pago]
      };
      
      guardarPedido(nuevoPedido);
      setNuevoPago({ metodo: 'Efectivo', monto: '', cliente: '' });
    };

    const eliminarPago = (pagoId) => {
      if (esPedidoCompletado) return;
      const nuevosPagos = pedidoActivo.pagos.filter(p => p.id !== pagoId);
      guardarPedido({ ...pedidoActivo, pagos: nuevosPagos });
    };

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
          {/* Header Modal */}
          <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                {pedidoActivo.mesaNombre}
                <span className={`text-xs px-2 py-1 rounded-full ${pedidoActivo.estado === 'pendiente' ? 'bg-yellow-500 text-slate-900' : 'bg-green-500 text-white'}`}>
                  {pedidoActivo.estado.toUpperCase()}
                </span>
              </h3>
              <p className="text-slate-400 text-sm">Orden #{pedidoActivo.id}</p>
            </div>
            <button onClick={cerrarModal} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            
            {/* Columna Izquierda: Detalle de Consumo */}
            <div className="flex-2 flex flex-col border-r border-slate-200 bg-slate-50 overflow-hidden">
              
              {/* Sección de Agregar Item */}
              {!esPedidoCompletado && (
                <div className="p-4 bg-white border-b border-slate-200 shadow-sm">
                  
                  {/* Tabs Selector de Modo */}
                  <div className="flex gap-2 mb-4">
                    <button 
                      onClick={() => setModoInput('carta')}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${modoInput === 'carta' ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500 ring-offset-1' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                      <Utensils className="w-4 h-4" /> A la Carta
                    </button>
                    <button 
                      onClick={() => setModoInput('peso')}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors ${modoInput === 'peso' ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500 ring-offset-1' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                      <Scale className="w-4 h-4" /> Buffet / Peso
                    </button>
                  </div>

                  {/* Formulario Dinámico */}
                  {modoInput === 'carta' ? (
                    // MODO CARTA
                    <div className="grid grid-cols-12 gap-2 items-end animate-in fade-in duration-300">
                      <div className="col-span-4">
                        <label className="text-xs font-semibold text-slate-500 ml-1">Plato</label>
                        <select 
                          className="w-full p-2 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                          value={nuevoItem.platoId}
                          onChange={handleSelectPlato}
                        >
                          <option value="">Seleccionar...</option>
                          {carta.map(p => (
                            <option key={p.id} value={p.id}>{p.nombre}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs font-semibold text-slate-500 ml-1">Cant.</label>
                        <input 
                          type="number" 
                          min="1"
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                          value={nuevoItem.cantidad}
                          onChange={(e) => setNuevoItem({...nuevoItem, cantidad: e.target.value})}
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs font-semibold text-slate-500 ml-1">P. Unit (S/)</label>
                        <input 
                          type="number" 
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                          value={nuevoItem.precio}
                          onChange={(e) => setNuevoItem({...nuevoItem, precio: e.target.value})}
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="text-xs font-semibold text-slate-500 ml-1">Cliente (Opc.)</label>
                        <input 
                          type="text" 
                          placeholder="Nombre..."
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                          value={nuevoItem.notaCliente}
                          onChange={(e) => setNuevoItem({...nuevoItem, notaCliente: e.target.value})}
                        />
                      </div>
                      <div className="col-span-1">
                        <Button 
                          onClick={agregarItemCarta} 
                          disabled={!nuevoItem.platoId}
                          className="w-full h-[38px] px-0! bg-indigo-600 hover:bg-indigo-700"
                        >
                          <Plus className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // MODO PESO
                    <div className="grid grid-cols-12 gap-2 items-end animate-in fade-in duration-300">
                      <div className="col-span-3">
                        <label className="text-xs font-semibold text-slate-500 ml-1">Peso (gramos)</label>
                        <div className="relative">
                          <input 
                            type="number" 
                            placeholder="0"
                            className="w-full p-2 pr-8 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-indigo-700"
                            value={datosPeso.gramos}
                            onChange={(e) => setDatosPeso({...datosPeso, gramos: e.target.value})}
                            autoFocus
                          />
                          <span className="absolute right-2 top-2 text-xs text-slate-400 font-bold">g</span>
                        </div>
                      </div>
                      <div className="col-span-3">
                        <label className="text-xs font-semibold text-slate-500 ml-1">Precio x Kilo</label>
                        <input 
                          type="number" 
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                          value={datosPeso.precioKilo}
                          onChange={(e) => setDatosPeso({...datosPeso, precioKilo: e.target.value})}
                        />
                      </div>
                       <div className="col-span-2">
                        <label className="text-xs font-semibold text-slate-500 ml-1">Valor Calc.</label>
                        <div className="w-full p-2 bg-slate-100 border rounded-lg text-sm text-slate-600 font-mono">
                          {datosPeso.gramos ? `S/ ${((parseFloat(datosPeso.gramos)/1000) * parseFloat(datosPeso.precioKilo)).toFixed(2)}` : 'S/ 0.00'}
                        </div>
                      </div>
                      <div className="col-span-3">
                        <label className="text-xs font-semibold text-slate-500 ml-1">Cliente (Opc.)</label>
                        <input 
                          type="text" 
                          placeholder="Nombre..."
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                          value={datosPeso.notaCliente}
                          onChange={(e) => setDatosPeso({...datosPeso, notaCliente: e.target.value})}
                        />
                      </div>
                      <div className="col-span-1">
                        <Button 
                          onClick={agregarItemPeso} 
                          disabled={!datosPeso.gramos}
                          className="w-full h-[38px] px-0! bg-indigo-600 hover:bg-indigo-700"
                        >
                          <Plus className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-0">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-100 sticky top-0 shadow-sm z-10">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Plato</th>
                      <th className="px-4 py-3 font-semibold">Cliente</th>
                      <th className="px-4 py-3 text-center font-semibold">Cant.</th>
                      <th className="px-4 py-3 text-right font-semibold">P. Unit</th>
                      <th className="px-4 py-3 text-right font-semibold">Total</th>
                      {!esPedidoCompletado && <th className="px-4 py-3 text-center font-semibold"></th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {pedidoActivo.items.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-10 text-center text-slate-400 italic">
                          No hay items registrados
                        </td>
                      </tr>
                    ) : (
                      pedidoActivo.items.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-medium text-slate-800">
                            <div className="flex items-center gap-2">
                              {item.tipo === 'peso' && <Scale className="w-3 h-3 text-indigo-500" />}
                              {item.nombre}
                            </div>
                            {item.tipo === 'peso' && item.detalles && (
                              <div className="text-[10px] text-slate-400 font-mono">
                                {item.detalles.gramos}g a S/ {item.detalles.precioKilo}/kg
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-500 text-xs italic">
                            {item.notaCliente || '-'}
                          </td>
                          <td className="px-4 py-3 text-center text-slate-600">
                            {item.cantidad}
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-slate-600">
                            {item.precio.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right font-mono font-bold text-slate-800">
                            {(item.precio * item.cantidad).toFixed(2)}
                          </td>
                          {!esPedidoCompletado && (
                            <td className="px-4 py-3 text-center">
                              <button 
                                onClick={() => eliminarItem(item.id)}
                                className="text-slate-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors"
                                title="Eliminar item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 bg-white border-t border-slate-200 flex justify-between items-center shadow-lg z-20">
                <span className="text-slate-500 font-medium">Total Pedido</span>
                <span className="text-2xl font-bold text-slate-800">S/ {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Columna Derecha: Pagos y Caja */}
            <div className="lg:w-[400px] bg-white flex flex-col shadow-lg z-30">
              
              {/* Formulario Pagos */}
              {!esPedidoCompletado && (
                <div className="p-5 bg-slate-50 border-b border-slate-200">
                  <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    Registrar Pago
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-500 ml-1 mb-1 block">Método</label>
                        <select 
                          className="w-full p-2 border rounded-lg bg-white text-sm"
                          value={nuevoPago.metodo}
                          onChange={(e) => setNuevoPago({...nuevoPago, metodo: e.target.value})}
                        >
                          <option value="Efectivo">Efectivo</option>
                          <option value="Yape">Yape</option>
                          <option value="Plin">Plin</option>
                          <option value="Tarjeta">Tarjeta</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 ml-1 mb-1 block">Monto (S/)</label>
                        <input 
                          type="number" 
                          placeholder={restante > 0 ? restante.toFixed(2) : "0.00"}
                          className="w-full p-2 border rounded-lg text-sm"
                          value={nuevoPago.monto}
                          onChange={(e) => setNuevoPago({...nuevoPago, monto: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 ml-1 mb-1 block">Pagado por:</label>
                      <input 
                        type="text" 
                        placeholder="Nombre del cliente"
                        className="w-full p-2 border rounded-lg text-sm"
                        value={nuevoPago.cliente}
                        onChange={(e) => setNuevoPago({...nuevoPago, cliente: e.target.value})}
                      />
                    </div>
                    <Button 
                      variant="success" 
                      className="w-full justify-center shadow-sm"
                      onClick={registrarPago}
                      disabled={restante <= 0}
                    >
                      Registrar Pago
                    </Button>
                  </div>
                </div>
              )}

              {/* Lista Pagos */}
              <div className="flex-1 overflow-y-auto p-5 bg-slate-50/30">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Historial de Pagos</h5>
                {pedidoActivo.pagos.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
                    <p className="text-sm text-slate-400 italic">No hay pagos registrados.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {pedidoActivo.pagos.map((pago) => (
                      <div key={pago.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex justify-between items-center group">
                        <div>
                          <p className="text-sm font-bold text-slate-700">{pago.cliente}</p>
                          <p className="text-xs text-slate-500">{pago.metodo} - {new Date(pago.fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-medium text-emerald-600">
                            S/ {pago.monto.toFixed(2)}
                          </span>
                          {!esPedidoCompletado && (
                            <button 
                              onClick={() => eliminarPago(pago.id)}
                              className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                              title="Eliminar pago"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer Resumen */}
              <div className="p-6 bg-slate-800 text-white mt-auto shadow-[0_-5px_15px_rgba(0,0,0,0.1)] relative z-40">
                <div className="flex justify-between mb-2 text-slate-300 text-sm">
                  <span>Total Orden:</span>
                  <span>S/ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4 text-emerald-400 text-sm">
                  <span>Total Pagado:</span>
                  <span>- S/ {pagado.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-600 pt-3 flex justify-between items-end mb-4">
                  <span className="text-sm font-medium">Pendiente:</span>
                  <span className={`text-3xl font-bold ${restante > 0.01 ? 'text-red-400' : 'text-emerald-400'}`}>
                    S/ {Math.max(0, restante).toFixed(2)}
                  </span>
                </div>

                {/* Botón Acción Principal */}
                {esPedidoCompletado ? (
                  <div className="bg-emerald-500/20 text-emerald-300 text-center py-3 rounded-lg border border-emerald-500/50 text-sm font-bold flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    ¡Pedido Cerrado!
                  </div>
                ) : (
                  <Button 
                    variant="success"
                    className="w-full py-3 text-lg shadow-lg shadow-emerald-900/20"
                    onClick={finalizarPedido}
                    disabled={restante > 0.01} // Margen de error pequeño por decimales
                  >
                    {restante > 0.01 ? (
                      <span className="flex items-center gap-2 text-sm opacity-80"><Lock className="w-4 h-4"/> Saldo Pendiente</span>
                    ) : (
                      <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5"/> Finalizar Pedido</span>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const VistaCarta = () => {
    const [editando, setEditando] = useState(null);
    const [formPlato, setFormPlato] = useState({ nombre: '', precio: '', categoria: 'Fondos' });

    const guardarPlato = () => {
      if (!formPlato.nombre || !formPlato.precio) return;
      
      const nuevoPlato = {
        id: editando ? editando.id : Date.now(),
        nombre: formPlato.nombre,
        precio: parseFloat(formPlato.precio),
        categoria: formPlato.categoria
      };

      if (editando) {
        setCarta(carta.map(p => p.id === editando.id ? nuevoPlato : p));
        setEditando(null);
      } else {
        setCarta([...carta, nuevoPlato]);
      }
      setFormPlato({ nombre: '', precio: '', categoria: 'Fondos' });
    };

    const iniciarEdicion = (plato) => {
      setEditando(plato);
      setFormPlato({ nombre: plato.nombre, precio: plato.precio, categoria: plato.categoria });
    };

    const eliminarPlato = (id) => {
      if (confirm('¿Eliminar este plato?')) setCarta(carta.filter(p => p.id !== id));
    };

    return (
      <div className="p-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <ChefHat className="w-6 h-6 text-indigo-600" />
          Gestión de Carta
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Formulario */}
          <Card className="p-6 h-fit sticky top-6">
            <h3 className="font-bold text-lg mb-4 text-slate-700">
              {editando ? 'Editar Plato' : 'Nuevo Plato'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Nombre</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-lg"
                  value={formPlato.nombre}
                  onChange={e => setFormPlato({...formPlato, nombre: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Precio Base (S/)</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded-lg"
                  value={formPlato.precio}
                  onChange={e => setFormPlato({...formPlato, precio: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Categoría</label>
                <select 
                  className="w-full p-2 border rounded-lg bg-white"
                  value={formPlato.categoria}
                  onChange={e => setFormPlato({...formPlato, categoria: e.target.value})}
                >
                  <option value="Entradas">Entradas</option>
                  <option value="Fondos">Fondos</option>
                  <option value="Bebidas">Bebidas</option>
                  <option value="Postres">Postres</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={guardarPlato} className="flex-1 justify-center">
                  <Save className="w-4 h-4" /> Guardar
                </Button>
                {editando && (
                  <Button 
                    variant="secondary" 
                    onClick={() => { setEditando(null); setFormPlato({ nombre: '', precio: '', categoria: 'Fondos' }); }}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Lista */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-500 text-sm uppercase">
                  <tr>
                    <th className="p-4">Plato</th>
                    <th className="p-4">Categoría</th>
                    <th className="p-4 text-right">Precio</th>
                    <th className="p-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {carta.map(plato => (
                    <tr key={plato.id} className="hover:bg-slate-50 group">
                      <td className="p-4 font-medium text-slate-800">{plato.nombre}</td>
                      <td className="p-4 text-sm text-slate-500">
                        <span className="px-2 py-1 bg-slate-100 rounded-full text-xs font-bold border border-slate-200">
                          {plato.categoria}
                        </span>
                      </td>
                      <td className="p-4 text-right font-mono">S/ {plato.precio.toFixed(2)}</td>
                      <td className="p-4 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => iniciarEdicion(plato)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => eliminarPlato(plato.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const VistaReportes = () => {
    // Aplanar todos los pagos de todos los pedidos
    const todosPagos = pedidos.flatMap(p => p.pagos);

    const resumenPorMetodo = todosPagos.reduce((acc, pago) => {
      acc[pago.metodo] = (acc[pago.metodo] || 0) + pago.monto;
      return acc;
    }, {});

    const totalIngresos = Object.values(resumenPorMetodo).reduce((a, b) => a + b, 0);

    return (
      <div className="p-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-indigo-600" />
          Reporte Financiero Diario
        </h2>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-linear-to-br from-indigo-500 to-indigo-700 text-white border-none">
            <p className="text-indigo-100 text-sm font-medium mb-1">Total Ingresos</p>
            <h3 className="text-3xl font-bold">S/ {totalIngresos.toFixed(2)}</h3>
          </Card>
          
          {['Yape', 'Plin', 'Efectivo'].map(metodo => (
            <Card key={metodo} className="p-6">
              <p className="text-slate-500 text-sm font-medium mb-1">{metodo}</p>
              <h3 className="text-2xl font-bold text-slate-800">
                S/ {(resumenPorMetodo[metodo] || 0).toFixed(2)}
              </h3>
            </Card>
          ))}
        </div>

        {/* Tabla Detallada */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-bold text-slate-700">Detalle de Transacciones</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Hora</th>
                  <th className="px-6 py-3">Mesa / Pedido</th>
                  <th className="px-6 py-3">Pagado por</th>
                  <th className="px-6 py-3">Método</th>
                  <th className="px-6 py-3 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {todosPagos.sort((a,b) => new Date(b.fecha) - new Date(a.fecha)).map(pago => {
                  const pedidoPadre = pedidos.find(p => p.pagos.some(subP => subP.id === pago.id));
                  return (
                    <tr key={pago.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(pago.fecha).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {pedidoPadre ? pedidoPadre.mesaNombre : 'N/A'} <span className="text-slate-400 font-normal">#{pedidoPadre?.id}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{pago.cliente}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold 
                          ${pago.metodo === 'Efectivo' ? 'bg-green-100 text-green-700' : 
                            pago.metodo === 'Yape' ? 'bg-purple-100 text-purple-700' : 
                            'bg-sky-100 text-sky-700'}`}>
                          {pago.metodo}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-medium">
                        S/ {pago.monto.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {todosPagos.length === 0 && (
              <div className="p-8 text-center text-slate-400">
                No hay transacciones registradas hoy.
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  };

  // --- Layout Principal ---
  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900">
      
      {/* Sidebar Navegación */}
      <aside className="w-20 lg:w-64 bg-slate-900 text-white flex flex-col transition-all duration-300">
        <div className="p-4 lg:p-6 flex items-center gap-3 border-b border-slate-800 mb-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shrink-0">
            <Utensils className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl hidden lg:block tracking-tight">GastroApp</span>
        </div>
        
        <nav className="flex-1 p-2 space-y-1">
          <button 
            onClick={() => setVistaActual('mesas')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${vistaActual === 'mesas' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <ClipboardList className="w-5 h-5" />
            <span className="hidden lg:block font-medium">Mesas & Pedidos</span>
          </button>
          <button 
            onClick={() => setVistaActual('carta')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${vistaActual === 'carta' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <ChefHat className="w-5 h-5" />
            <span className="hidden lg:block font-medium">Gestionar Carta</span>
          </button>
          <button 
            onClick={() => setVistaActual('reportes')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${vistaActual === 'reportes' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="hidden lg:block font-medium">Reportes</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">AD</div>
            <div className="hidden lg:block">
              <p className="text-sm font-medium">Administrador</p>
              <p className="text-xs text-slate-500">Restaurante Demo</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Área de Contenido */}
      <main className="flex-1 overflow-auto">
        {vistaActual === 'mesas' && <VistaMesas />}
        {vistaActual === 'carta' && <VistaCarta />}
        {vistaActual === 'reportes' && <VistaReportes />}
      </main>

      {/* Modales Globales */}
      <ModalPedido />

    </div>
  );
}