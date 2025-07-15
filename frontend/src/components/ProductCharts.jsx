import './Graphs.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from 'recharts';

function ProductCharts({ products }) {
  const priceProducts = products?.filter(p => p.price_sale !== null) || [];
  const lineProducts = products?.filter(p => p.rating !== null && p.price_sale !== null && p.price_basic !== null) || [];

  // Гистограмма
  let bins = [];
  if (priceProducts.length > 0) {
    const prices = priceProducts.map(p => p.price_sale);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const range = maxPrice - minPrice || 1;
    const binSize = range / 10;

    bins = Array.from({ length: 10 }, (_, i) => {
      const start = minPrice + i * binSize;
      const end = start + binSize;
      const label = `${Math.round(start)}–${Math.round(end)}`;
      const count = priceProducts.filter(p => p.price_sale >= start && p.price_sale < end).length;
      return { range: label, count };
    });
  }

  // Линейный график
  const lineChartData = lineProducts.map(p => ({
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
        {bins.length === 0 && <p>Нет данных для отображения</p>}
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
        {lineChartData.length === 0 && <p>Нет данных для отображения</p>}
      </div>
    </div>
  );
}

export default ProductCharts;
