import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Package,
  Plus,
  Edit,
  CheckCircle,
  XCircle,
  Sparkles,
  Tag,
  CreditCard,
  Percent,
  Clock,
  Layers,
} from "lucide-react";
import { Product, BillingType, ProgramCategory } from "../../types";

export const AdminProductCatalogue: React.FC = () => {
  const { products, addProduct, updateProduct } = useApp();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ProgramCategory>("Mind Mastery");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(499);
  const [partnerCommissionPercentage, setPartnerCommissionPercentage] = useState<number>(50);
  const [partnerActivationReward, setPartnerActivationReward] = useState<number>(0);
  const [duration, setDuration] = useState("3 Months");
  const [billingType, setBillingType] = useState<BillingType>("one_time");

  const resetForm = () => {
    setName("");
    setCategory("Mind Mastery");
    setDescription("");
    setPrice(499);
    setPartnerCommissionPercentage(50);
    setPartnerActivationReward(0);
    setDuration("3 Months");
    setBillingType("one_time");
    setEditingProduct(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategory(p.category);
    setDescription(p.description);
    setPrice(p.price);
    setPartnerCommissionPercentage(p.partnerCommissionPercentage);
    setPartnerActivationReward(p.partnerActivationReward || 0);
    setDuration(p.duration);
    setBillingType(p.billingType);
    setIsAddOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name,
        category,
        description,
        price,
        partnerCommissionPercentage,
        partnerActivationReward: partnerActivationReward > 0 ? partnerActivationReward : undefined,
        duration,
        billingType,
      });
    } else {
      addProduct({
        id: `prod-${Date.now()}`,
        name,
        tagline: name,
        category,
        description,
        price,
        partnerCommissionPercentage,
        partnerActivationReward: partnerActivationReward > 0 ? partnerActivationReward : undefined,
        duration,
        billingType,
        isActive: true,
      });
    }

    setIsAddOpen(false);
    resetForm();
  };

  const toggleActive = (p: Product) => {
    updateProduct({
      ...p,
      isActive: !p.isActive,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in" id="admin-product-catalogue-view">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-[#0F5132]" />
            Path to Inner Peace Product Catalogue & Revenue Engine
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure mental wellness challenges, coaching memberships, and partner revenue share margins
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#0F5132] hover:bg-[#146c43] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New Program
        </button>
      </div>

      {/* Program Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((prod) => {
          const estimatedPartnerShare =
            prod.price > 0
              ? (prod.price * (prod.partnerCommissionPercentage / 100)).toFixed(2)
              : prod.partnerActivationReward?.toFixed(2) || "49.00";

          return (
            <div
              key={prod.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition hover:shadow-md ${
                prod.isActive ? "border-gray-200" : "border-gray-300 opacity-60 bg-gray-50"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#0F5132] border border-[#0F5132]/20">
                    {prod.category.replace("_", " ")}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        prod.isActive ? "bg-emerald-500" : "bg-gray-400"
                      }`}
                    />
                    <span className="text-[11px] font-medium text-gray-500">
                      {prod.isActive ? "Active" : "Archived"}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-gray-900">{prod.name}</h3>
                  <div className="text-xs text-gray-400 font-mono mt-0.5">{prod.id}</div>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed line-clamp-2">
                    {prod.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-2xl font-black text-gray-900">
                    {prod.price === 0 ? "FREE" : `₹${prod.price.toLocaleString("en-IN")}`}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">/ {prod.duration}</span>
                </div>

                {/* Partner Commercial Terms Box */}
                <div className="p-3 bg-[#FDF8EB] border border-[#D4AF37]/40 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-[#8B6508]">
                    <span>Partner Yield:</span>
                    <span>₹{estimatedPartnerShare}</span>
                  </div>
                  <div className="text-[11px] text-[#8B6508]/80">
                    {prod.price > 0
                      ? `${prod.partnerCommissionPercentage}% of collected revenue`
                      : `₹${prod.partnerActivationReward} fixed reward per verified challenge attendance`}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => toggleActive(prod)}
                  className="text-gray-500 hover:text-gray-900 font-semibold cursor-pointer"
                >
                  {prod.isActive ? "Archive Program" : "Activate"}
                </button>

                <button
                  onClick={() => handleOpenEdit(prod)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5 text-gray-600" />
                  Edit Terms
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: ADD / EDIT PRODUCT */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#0F5132]/30 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-[#0F5132]" />
                {editingProduct ? "Edit Program Specifications" : "Add New Program to Catalogue"}
              </h3>
              <button
                onClick={() => {
                  setIsAddOpen(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Program Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 6-Month Life Elevation Protocol"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Program Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Comprehensive transformation curriculum..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Customer Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 Days, 3 Months, 1 Year"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Partner Commission Share (%)
                  </label>
                  <input
                    type="number"
                    required
                    value={partnerCommissionPercentage}
                    onChange={(e) => setPartnerCommissionPercentage(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Free Challenge Reward (₹)
                  </label>
                  <input
                    type="number"
                    value={partnerActivationReward}
                    onChange={(e) => setPartnerActivationReward(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-xl"
                  />
                  <span className="text-[10px] text-gray-400">
                    Paid upon verified attendance (e.g. ₹49).
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0F5132] text-white font-bold rounded-xl hover:bg-[#146c43] transition cursor-pointer"
                >
                  {editingProduct ? "Save Program Updates" : "Publish Program to Catalogue"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddOpen(false);
                    resetForm();
                  }}
                  className="py-2.5 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
