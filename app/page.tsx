'use client';

import { useState } from 'react';
import { parseAddresses } from '@/lib/addressParser';

interface Result {
  address: string;
  status: string;
  distance: { text: string; value: number } | null;
  duration: { text: string; value: number } | null;
}

interface ApiResponse {
  success: boolean;
  results: Result[];
  failed: Result[];
  startingAddress: string;
  error?: string;
}

export default function Home() {
  const [startingAddress, setStartingAddress] = useState('');
  const [addresses, setAddresses] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ApiResponse | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults(null);

    // Parse addresses using smart parser (handles both line-by-line and blocks of text)
    const addressList = parseAddresses(addresses);

    if (addressList.length === 0) {
      setError('Please enter at least one destination address.');
      setLoading(false);
      return;
    }

    if (addressList.length > 20) {
      setError('Maximum 20 addresses allowed.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/find-closest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startingAddress,
          addresses: addressList,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'An error occurred while processing your request.');
      } else {
        setResults(data);
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Address Proximity Finder
            </h1>
            <p className="text-gray-900">
              Find the closest location to your starting address based on driving distance.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Starting Address Input */}
            <div>
              <label htmlFor="starting-address" className="block text-sm font-medium text-gray-700 mb-2">
                Starting Address
              </label>
              <input
                type="text"
                id="starting-address"
                value={startingAddress}
                onChange={(e) => setStartingAddress(e.target.value)}
                placeholder="Enter your starting address..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                required
              />
            </div>

            {/* Destination Addresses */}
            <div>
              <label htmlFor="addresses" className="block text-sm font-medium text-gray-700 mb-2">
                Destination Addresses (max 20)
              </label>
              <textarea
                id="addresses"
                value={addresses}
                onChange={(e) => setAddresses(e.target.value)}
                placeholder="Paste addresses (one per line or from any text):&#10;&#10;123 Main St, City, State&#10;456 Oak Ave, City, State&#10;&#10;Or paste blocks of text - addresses will be auto-detected!"
                rows={10}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm text-gray-900"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {parseAddresses(addresses).length} / 20 addresses detected
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Finding Closest Location...' : 'Find Closest Location'}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Results */}
          {results && results.success && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Results (sorted by distance)
              </h2>
              <p className="text-gray-600 mb-4">
                From: <span className="font-medium">{results.startingAddress}</span>
              </p>

              {/* Valid Results */}
              {results.results.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                          Rank
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                          Address
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                          Distance
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                          Driving Time
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.results.map((result, index) => (
                        <tr
                          key={index}
                          className={`${
                            index === 0 ? 'bg-green-50' : 'hover:bg-gray-50'
                          } transition-colors`}
                        >
                          <td className="px-4 py-3 border-b text-sm">
                            {index === 0 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Closest
                              </span>
                            )}
                            {index > 0 && (
                              <span className="text-gray-500">#{index + 1}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 border-b text-sm text-gray-800">
                            {result.address}
                          </td>
                          <td className="px-4 py-3 border-b text-sm font-medium text-gray-900">
                            {result.distance?.text}
                          </td>
                          <td className="px-4 py-3 border-b text-sm text-gray-700">
                            {result.duration?.text}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Failed Results */}
              {results.failed.length > 0 && (
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-yellow-800 mb-2">
                    Unable to Process ({results.failed.length})
                  </h3>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {results.failed.map((result, index) => (
                      <li key={index}>• {result.address}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>Powered by Google Maps Distance Matrix API</p>
        </div>
      </div>
    </main>
  );
}
