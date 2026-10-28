import React from 'react';
import { InventoryItem } from '../types';
import { Layers, CheckCircle2, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';

interface MetricCardsProps {
  items: InventoryItem[];
}

export const MetricCards: React.FC<MetricCardsProps> = ({ items }) => {
  const totalSkus = items.length;
  
  // Calculation formula per item: Min - Balance - PO
  const calculatedItems = items.map(item => {
    const deficit = item.minRequiredStock - item.stockBalance - item.extraPoStock;
    return {
      ...item,
      deficit,
      isInsufficient: deficit > 0,
      orderQty: Math.max(0, deficit)
    };
  });

  const sufficientCount = calculatedItems.filter(i => !i.isInsufficient).length;
  const insufficientCount = calculatedItems.filter(i => i.isInsufficient).length;
  const totalOrderUnitsNeeded = calculatedItems.reduce((acc, i) => acc + i.orderQty, 0);
  const totalEstimatedCost = calculatedItems.reduce((acc, i) => acc + (i.orderQty * i.unitCost), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Card 1: Total SKUs */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Total Tracked SKUs</p>
            <h3 className="text-2xl font-bold text-white mt-1 font-mono tabular-nums">{totalSkus}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400 border border-slate-700">
            <Layers className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
          <span>Active Warehouse Database</span>
        </div>
      </div>

      {/* Card 2: Sufficient Stock */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Sufficient Stock</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1 font-mono tabular-nums">{sufficientCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-950/40 flex items-center justify-center text-emerald-400 border border-emerald-800/50">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400/80">
          <span>{((sufficientCount / (totalSkus || 1)) * 100).toFixed(0)}% of total inventory nominal</span>
        </div>
      </div>

      {/* Card 3: Deficit / Order Required */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Needs Supplier Order</p>
            <h3 className="text-2xl font-bold text-amber-400 mt-1 font-mono tabular-nums">{insufficientCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-950/40 flex items-center justify-center text-amber-400 border border-amber-800/50">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-amber-400/80">
          <span className="font-mono tabular-nums font-semibold">{totalOrderUnitsNeeded.toLocaleString()} units</span>
          <span>total deficit</span>
        </div>
      </div>

      {/* Card 4: Estimated Reorder Cost */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Estimated Reorder Cost</p>
            <h3 className="text-2xl font-bold text-cyan-400 mt-1 font-mono tabular-nums">
              ${totalEstimatedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-cyan-950/40 flex items-center justify-center text-cyan-400 border border-cyan-800/50">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
          <span>Calculated at current unit costs</span>
        </div>
      </div>
    </div>
  );
};
