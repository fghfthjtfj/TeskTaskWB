import './Graphs.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from 'recharts';

function ProductCharts({ products }) {
  if (!products || products.length === 0) return null;

  // 1. Определяем min и max цены
  const prices = products
    .filter(p => p.price_sale !== null)
    .map(p => p.price_sale);

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const range = maxPrice - minPrice;
  const binSize = range / 10;

  // 2. Создаём 10 корзин (диапазоны)
  const bins = Array.from({ length: 10 }, (_, i) => {
    const start = minPrice + i * binSize;
    const end = start + binSize;
    const label = `${Math.round(start)}–${Math.round(end)}`;
    const count = products.filter(p => p.price_sale >= start && p.price_sale < end).length;
    return { range: label, count };
  });

  // 3. Линейный график скидка vs рейтинг
  const lineChartData = products
    .filter(p => p.rating !== null && p.price_sale !== null && p.price_basic !== null)
    .map(p => ({
      rating: p.rating,
      discount: p.price_basic - p.price_sale,
    }));

  return (
    <div>
      <div className='graph-data'>
        <h3>Гистограмма цен</h3>
        <BarChart width={500} height={300} data={bins}>
          <XAxis dataKey="range" angle={-30} textAnchor="end" interval={0} height={60} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </div>
      <div className='graph-data'>
        <h3>Скидка vs Рейтинг</h3>
        <LineChart width={500} height={300} data={lineChartData}>
          <XAxis dataKey="rating" />
          <YAxis dataKey="discount" />
          <CartesianGrid stroke="#ccc" />
          <Tooltip />
          <Line type="monotone" dataKey="discount" stroke="#82ca9d" />
        </LineChart>
      </div>
    </div>
  );
}

export default ProductCharts;
