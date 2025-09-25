import React from 'react'
import { Sprout, Users, TrendingUp } from 'lucide-react'

const WelcomeScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">കൃഷി സഖി</h1>
        <p className="text-green-100">Kerala Government - Department of Agriculture</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sprout className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">കൃഷി സഖി</h2>
            <p className="text-gray-600">നിങ്ങളുടെ വ്യക്തിഗത കൃഷി സഹായി</p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">വിദഗ്ധ ഉപദേശം</h3>
              <p className="text-sm text-gray-600">കൃഷി വിദഗ്ധരുടെ സഹായം</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">വിപണി വില</h3>
              <p className="text-sm text-gray-600">തത്സമയ വിപണി വിവരങ്ങൾ</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors">
              ആരംഭിക്കുക - സൈൻ അപ്പ്
            </button>
            <button className="w-full border-2 border-green-600 text-green-600 py-4 px-6 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors">
              ഇതിനകം അക്കൗണ്ട് ഉണ്ടോ? ലോഗിൻ
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 p-4 text-center">
        <p className="text-sm text-gray-600">
          © 2024 Kerala Government - Department of Agriculture
        </p>
      </div>
    </div>
  )
}

export default WelcomeScreen