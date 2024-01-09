import React, { useState } from 'react';
import axios from 'axios';
import './PaymentForm.css';


const PaymentForm = () => {
  const [paymentStatus, setPaymentStatus] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const API_KEY = 'eyJ0eXAiOiJKV1..';

  const headers = {
    'API-KEY': API_KEY,
    'Content-Type': 'application/json',
  };

  const handleSubmit = async () => {
    try {
      const formData = {
        amount: 5000,
        currency: 'KZT',
        capture_method: 'AUTO',
        due_date: '2019-08-24T14:15:22',
        description: 'book #23',
        back_url: 'https://myshop.kz/back',
        cardNumber,
        expiry,
        cvv,
      };

      // Создание нового заказа
      const createOrderResponse = await axios.post('https://api.ioka.kz/v2/orders', formData, { headers });
      console.log('Response from ioka API (Create Order):', createOrderResponse.data);

      // Получение возвратов по заказу
      const orderId = createOrderResponse.data.order.id;
      const getOrderRefundsResponse = await axios.get(`https://api.ioka.kz/v2/orders/${orderId}/refunds`, { headers });
      console.log('Response from ioka API (Get Order Refunds):', getOrderRefundsResponse.data);

      // Создание нового возврата по заказу
      const refundData = {
        amount: 100,
        reason: 'Refund reason',
        rules: [{}],
        positions: [{}],
      };
      const refundOrderResponse = await axios.post(`https://api.ioka.kz/v2/orders/${orderId}/refunds`, refundData, { headers });
      console.log('Response from ioka API (Refund Order):', refundOrderResponse.data);

      // Получение данных о конкретном возврате по ID
      const refundId = refundOrderResponse.data.id;
      const getRefundByIdResponse = await axios.get(`https://api.ioka.kz/v2/orders/${orderId}/refunds/${refundId}`, { headers });
      console.log('Response from ioka API (Get Refund by ID):', getRefundByIdResponse.data);

      // Получение истории событий по заказу
      const getOrderEventsResponse = await axios.get(`https://api.ioka.kz/v2/orders/${orderId}/events`, { headers });
      console.log('Response from ioka API (Get Order Events):', getOrderEventsResponse.data);

      // Получение квитанции об оплате
      const getReceiptResponse = await axios.get(`https://api.ioka.kz/v2/orders/${orderId}/receipt`, { headers });
      console.log('Response from ioka API (Get Receipt):', getReceiptResponse.data);

      // Обработка ответа от API
      if (createOrderResponse.data.success) {
        setPaymentStatus('Payment successful!');
      } else {
        setPaymentStatus('Payment declined. Please try again.');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      // Обработка ошибок при обращении к API
      setPaymentStatus('Payment failed. Please try again later.');
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    handleSubmit();
  };
  

  return (
    <div className="container">
      <form className="form" onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          placeholder="Card Number"
        />
        <div className="small-inputs">
          <input
            type="text"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            placeholder="Expiry (MM/YY)"
          />
          <input
            type="text"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            placeholder="CVV"
          />
        </div>
        <button type="submit">Оплатить</button>
      </form>
      {paymentStatus && <div>{paymentStatus}</div>}
    </div>
  );
};

export default PaymentForm;
