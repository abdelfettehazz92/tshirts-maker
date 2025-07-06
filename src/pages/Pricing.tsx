import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, Star, ArrowRight } from 'lucide-react';
import { PricingPlan } from '../types';

const Pricing: React.FC = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<'EUR' | 'USD' | 'TND'>('EUR');
  const [isLoading, setIsLoading] = useState(false);

  const currencySymbols = {
    EUR: '€',
    USD: '$',
    TND: 'د.ت'
  };

  const exchangeRates = {
    EUR: { EUR: 1, USD: 1.1, TND: 3.4 },
    USD: { EUR: 0.91, USD: 1, TND: 3.1 },
    TND: { EUR: 0.29, USD: 0.32, TND: 1 }
  };

  const pricingPlans: PricingPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: 9.99,
      currency: 'EUR',
      description: 'Perfect for getting started with t-shirt design',
      features: [
        '5 Designs per month',
        'Basic templates',
        'Standard support',
        '1GB storage',
        'Basic customization'
      ],
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 19.99,
      currency: 'EUR',
      description: 'Most popular choice for serious designers',
      features: [
        'Unlimited designs',
        'Premium templates',
        'Priority support',
        '10GB storage',
        'Advanced customization',
        'Export to multiple formats'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 49.99,
      currency: 'EUR',
      description: 'Complete solution for teams and businesses',
      features: [
        'Unlimited everything',
        'Custom templates',
        '24/7 support',
        '100GB storage',
        'Full customization',
        'API access',
        'Team collaboration'
      ],
      popular: false
    }
  ];

  const getConvertedPrice = (price: number, fromCurrency: string, toCurrency: string) => {
    const rate = exchangeRates[fromCurrency as keyof typeof exchangeRates][toCurrency];
    return Math.round(price * rate * 100) / 100;
  };

  const handlePlanSelection = async (plan: PricingPlan) => {
    setIsLoading(true);
    try {
      const convertedPrice = getConvertedPrice(plan.price, plan.currency, selectedCurrency);
      const paymentUrl = `/payment?service=${encodeURIComponent(plan.name)}&price=${convertedPrice}&currency=${selectedCurrency}`;
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Error selecting plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-16">
      {/* Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Select the ideal package for your design needs. Start creating amazing t-shirts today.
          </p>
          
          {/* Currency Selector */}
          <div className="inline-flex bg-white/20 backdrop-blur-sm rounded-full p-2">
            {(['EUR', 'USD', 'TND'] as const).map((currency) => (
              <button
                key={currency}
                onClick={() => setSelectedCurrency(currency)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  selectedCurrency === currency
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {currency} ({currencySymbols[currency]})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => {
              const convertedPrice = getConvertedPrice(plan.price, plan.currency, selectedCurrency);
              
              return (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                    plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center">
                        <Star size={16} className="mr-1" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900">
                        {currencySymbols[selectedCurrency]}
                      </span>
                      <span className="text-6xl font-bold text-gray-900">
                        {convertedPrice}
                      </span>
                      <span className="text-gray-600">/month</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handlePlanSelection(plan)}
                    disabled={isLoading}
                    className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : (
                      <ArrowRight size={20} className="mr-2" />
                    )}
                    Get Started
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Compare Features
            </h2>
            <p className="text-xl text-gray-600">
              Find the perfect plan for your needs
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <th className="px-6 py-4 text-left font-semibold">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold">Basic</th>
                  <th className="px-6 py-4 text-center font-semibold">Pro</th>
                  <th className="px-6 py-4 text-center font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 font-medium">Designs per month</td>
                  <td className="px-6 py-4 text-center">5</td>
                  <td className="px-6 py-4 text-center">Unlimited</td>
                  <td className="px-6 py-4 text-center">Unlimited</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Template access</td>
                  <td className="px-6 py-4 text-center">Basic</td>
                  <td className="px-6 py-4 text-center">Premium</td>
                  <td className="px-6 py-4 text-center">Custom</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Storage</td>
                  <td className="px-6 py-4 text-center">1GB</td>
                  <td className="px-6 py-4 text-center">10GB</td>
                  <td className="px-6 py-4 text-center">100GB</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Support</td>
                  <td className="px-6 py-4 text-center">Standard</td>
                  <td className="px-6 py-4 text-center">Priority</td>
                  <td className="px-6 py-4 text-center">24/7</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Customization</td>
                  <td className="px-6 py-4 text-center">Basic</td>
                  <td className="px-6 py-4 text-center">Advanced</td>
                  <td className="px-6 py-4 text-center">Full</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">API Access</td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-red-500">✗</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-red-500">✗</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-green-500">✓</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Creating?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of designers who trust our platform for their t-shirt design needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing; 