import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import orderBy from 'lodash/orderBy';
import './ProductList.css';
import ProductCharts from './ProductCharts';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  // добавление
  const [searchProduct, setSearchProduct] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  // фильтры
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [ratingMin, setRatingMin] = useState('');
  const [feedbacksMin, setFeedbacksMin] = useState('');

  // Загрузка с фильтрами
  const fetchProducts = () => {
    const params = {};
    if (priceMin) params.price_min = priceMin;
    if (priceMax) params.price_max = priceMax;
    if (ratingMin) params.rating_min = ratingMin;
    if (feedbacksMin) params.feedbacks_min = feedbacksMin;

    axios.get('api/products/', { params })
      .then(res => setProducts(res.data))
      .catch(err => console.error('Ошибка загрузки:', err));
  };

  useEffect(() => {
    fetchProducts();
  }, [priceMin, priceMax, ratingMin, feedbacksMin]);

  const handleSort = (clickedField) => {
    const isSameField = sortField === clickedField;
    const newDirection = isSameField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(clickedField);
    setSortDirection(newDirection);
  };

  const sortedProducts = useMemo(() => {
    if (!sortField) return products;
    return orderBy(products, [sortField], [sortDirection]);
  }, [products, sortField, sortDirection]);

  const renderSortArrow = (field) => {
    if (sortField !== field) return '';
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  // Добавление товаров
  const handleSubmit = () => {
    if (!isParsing) {
      setIsParsing(true);
      axios.post('http://127.0.0.1:8000/api/parse/', { query: searchProduct })
      .then(res => {
        fetchProducts();
        setIsParsing(false);
      })
      .catch(err => {
        console.error('Ошибка:', err);
        setIsParsing(false);
      });
    }
  };

  return (
    <div className="product-page-div">
      <h1 className="page-title">Список товаров</h1>
      <div className="products-info-div">

        <div className="products-data">
          <div className="add-products">
              <input value={searchProduct} onChange={e => setSearchProduct(e.target.value)} placeholder="Введите запрос для парсера"/>
              <button onClick={handleSubmit}>Отправить</button>
              {isParsing && (
                <p style={{ color: 'green', margin: '0' }}>
                  Парсинг в процессе, ожидайте...
                </p>
              )}
          </div>
          <div className="filters">
              <label>
                Цена от:
                <input type="number" value={priceMin} onChange={e => setPriceMin(e.target.value)} />
              </label>
              <label>
                до:
                <input type="number" value={priceMax} onChange={e => setPriceMax(e.target.value)} />
              </label>
              <label>
                Рейтинг от:
                <input type="number" value={ratingMin} onChange={e => setRatingMin(e.target.value)} />
              </label>
              <label>
                Отзывов от:
                <input type="number" value={feedbacksMin} onChange={e => setFeedbacksMin(e.target.value)} />
              </label>
            </div>
            <table className="product-table">
              <thead>
                <tr>
                  <th>Изображение</th>
                  <th onClick={() => handleSort('name')}>Название{renderSortArrow('name')}</th>
                  <th onClick={() => handleSort('price_basic')}>Цена{renderSortArrow('price_basic')}</th>
                  <th onClick={() => handleSort('price_sale')}>Цена со скидкой{renderSortArrow('price_sale')}</th>
                  <th onClick={() => handleSort('rating')}>Рейтинг{renderSortArrow('rating')}</th>
                  <th onClick={() => handleSort('feedbacks')}>Отзывы{renderSortArrow('feedbacks')}</th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map(product => (
                  <tr key={product.id}>
                    <td>
                      <img src={product.image} alt={product.name} className="product-image" />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.price_basic}</td>
                    <td>{product.price_sale}</td>
                    <td>{product.rating}</td>
                    <td>{product.feedbacks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="products-graphs">
            <ProductCharts products={sortedProducts} />
          </div>

      </div>
    </div>
  );
}

export default ProductList;
