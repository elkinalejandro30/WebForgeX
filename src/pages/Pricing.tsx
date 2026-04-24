import { useState } from 'react';
import { Check, X, Star } from 'lucide-react';
import { PLANS } from '../config/plans';

export default function Pricing() {
  const [selectedProPlan, setSelectedProPlan] = useState(PLANS[1].pricingOptions![0]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Planes Simples y Transparentes
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Empieza gratis hoy y mejora tu plan a medida que tu negocio crezca. Cancela en cualquier momento.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {PLANS.map((plan) => (
            <div 
              key={plan.id} 
              className={`relative bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 border-2 ${
                plan.id === 'pro' ? 'border-primary transform md:-translate-y-4' : 'border-transparent'
              }`}
            >
              {plan.badge && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-primary text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full flex items-center shadow-lg">
                    <Star className="w-3 h-3 mr-1" /> {plan.badge}
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{plan.description}</p>
                
                {plan.id === 'pro' && plan.pricingOptions ? (
                  <div className="mb-6">
                    <div className="flex justify-center items-end text-5xl font-extrabold text-gray-900 dark:text-white mb-2 transition-all">
                      {selectedProPlan.price}
                      <span className="text-lg font-normal text-gray-500 dark:text-gray-400 ml-1">{selectedProPlan.billingPeriod}</span>
                    </div>
                    <span className="text-sm font-medium text-green-500 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                      {selectedProPlan.note}
                    </span>
                    
                    <div className="flex justify-center mt-6 bg-gray-100 dark:bg-slate-700 p-1 rounded-xl">
                      {plan.pricingOptions.map((opt) => (
                        <button
                          key={opt.label}
                          onClick={() => setSelectedProPlan(opt)}
                          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                            selectedProPlan.label === opt.label 
                              ? 'bg-white dark:bg-slate-800 shadow text-primary' 
                              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-end text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
                    {plan.price}
                    <span className="text-lg font-normal text-gray-500 dark:text-gray-400 ml-1">{plan.period}</span>
                  </div>
                )}
                
                <button className={`w-full py-4 rounded-xl font-bold transition-all duration-300 ${
                  plan.id === 'pro' 
                    ? 'bg-primary text-white hover:bg-indigo-700 shadow-lg hover:shadow-primary/30' 
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}>
                  {plan.cta}
                </button>
              </div>

              <div className="space-y-4">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-red-400 mr-3 flex-shrink-0 mt-0.5 opacity-50" />
                    )}
                    <span className={`text-sm ${feature.included ? 'text-gray-700 dark:text-gray-300 font-medium' : 'text-gray-400 dark:text-gray-500 line-through'}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}