import Layout from '@/components/Layout';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Head from 'next/head';

interface Option {
  value: string;
  label: string;
  balance: string;
}

interface Creator {
  id: number;
  name: string;
  balance: string;
}

const Creator = () => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [options, setOptions] = useState<Option[]>([]);
  const [error, setError] = useState<{ statusCode: number; message: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Creator[]>(`${process.env.NEXT_PUBLIC_API_URL}/creator`);
        const creators = response.data.map(creator => ({
          value: creator.id.toString(),
          label: creator.name,
          balance: creator.balance
        }));
        setOptions(creators);
      } catch (error: any) {
        setError({ statusCode: error.statusCode, message: error.message });
      }
    };

    fetchData();
  }, []);

  const handleOptionChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    try {


      const creator_id = parseInt(event.target.value);

      if (isNaN(creator_id)) {
        return setSelectedOption(null);
      };

      const response = await axios.get<Creator>(`${process.env.NEXT_PUBLIC_API_URL}/creator/${creator_id}/balance`);
      const selectedCreator = response.data
      if (selectedCreator) {
        const balanceInCents = +(parseFloat(selectedCreator.balance) / 100);
        const selectedOption = {
          value: selectedCreator.id.toString(),
          label: selectedCreator.name,
          balance: balanceInCents.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        };

        setSelectedOption(selectedOption);
      } else {
        setSelectedOption(null);
      }
    } catch (error: any) {
      setSelectedOption(null);
      setError({ statusCode: error.statusCode, message: error.message });
    }
  };

  if (error) {
    return (
      <Layout>
        <Head>
          <title>Error {error.statusCode}</title>
        </Head>
        <div style={{ background: 'white', color: 'black' }} className="mx-auto max-w-lg">
          <h1 className="text-2xl font-semibold mb-4">Error {error.statusCode}</h1>
          {error.message && (
            <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
              <p>{error.message}</p>
            </div>
          )}
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
            onClick={() => setError(null)}
          >
            Go back
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-lg p-8 rounded-lg shadow-md bg-white">
        <h1 className="text-2xl font-semibold mb-4">Creator Balance</h1>
        <select
          className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={selectedOption?.value ?? ''}
          onChange={handleOptionChange}
        >
          <option value="">Select a creator</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {selectedOption && (
          <div className="mt-4">
            <p className="text-lg font-semibold">{selectedOption.label}</p>
            <p>Balance: ${selectedOption.balance}</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Creator;
