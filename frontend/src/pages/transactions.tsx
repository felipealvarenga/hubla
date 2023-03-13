import axios from 'axios';
import { GetServerSideProps } from 'next';
import Layout from '@/components/Layout';

type Affiliate = {
  id: number;
  name: string;
};

type Creator = {
  id: number;
  name: string;
};

type Sale = {
  id: number;
  date: string;
  amount: number;
  product: {
    id: number;
    name: string;
  };
  creator: Creator;
  affiliate: Affiliate | null;
};

type Commission = {
  id: number;
  amount: number;
  date: string;
  product: {
    id: number;
    name: string;
  };
  creator: Creator;
  affiliate: Affiliate | null;
};

type Product = {
  id: number;
  name: string;
  sales: Sale[];
  commissions: Commission[];
};

type Props = {
  products: Product[];
};

export default function ProductTransactions ({ products }: Props) {
  return (
    <Layout>
      <div className="flex flex-col w-full">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Creator
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Affiliate
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product: Product) => (
                    <>
                      {product.sales.map((sale: Sale) => (
                        <tr key={sale.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(sale.date).toLocaleDateString()} {new Date(sale.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(sale.amount / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.creator.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.affiliate ? sale.affiliate.name : '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.affiliate ? 'Affiliate sale' : 'Creator sale'}</td>
                        </tr>
                      ))}
                      {product.commissions.map((commission:Commission) => (
                        <tr key={commission.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(commission.date).toLocaleDateString()} {new Date(commission.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(commission.amount / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{commission.creator.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{commission.affiliate ? commission.affiliate.name : '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{commission.amount < 0 ? 'Creator paid commission': 'Affiliate received commission'} </td>
                        </tr>))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}



export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const { data } = await axios.get<Product[]>(`${process.env.NEXT_PUBLIC_API_URL}/product/transactions`);
  return {
    props: {
      products: data,
    },
  };
};
