import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

export const deliveryOptions = [{
  id: '1',
  deliveryDays: 7,
  priceCents: 0
}, {
  id: '2',
  deliveryDays: 3,
  priceCents: 499
}, {
  id: '3',
  deliveryDays: 1,
  priceCents: 999
}];

export function getDeliveryOption(deliveryOptionId) {
  let matchingOption;
  deliveryOptions.forEach((option) => {
    if (option.id === deliveryOptionId) {
      matchingOption = option;
    }
  });

  return matchingOption || deliveryOptions[0];
}

export function claculateDeliveryDate(deliveryOption) {
  const today = dayjs();
  let daysToAdd = deliveryOption.deliveryDays;
  let shippingDay = today;

  while (0 < daysToAdd) {
    let currentDay = shippingDay.format('dddd');

    if ((currentDay === 'Saturday') || (currentDay === 'Sunday')) {
      shippingDay = shippingDay.add(1, 'days');
    } else {
      daysToAdd -= 1;
      shippingDay = shippingDay.add(1, 'days');
    }
  }

  const dateString = shippingDay.format(
    'dddd, MMMM D'
  );

  return dateString;
}