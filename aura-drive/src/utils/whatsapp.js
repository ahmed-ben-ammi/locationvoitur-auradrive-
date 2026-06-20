const WHATSAPP_NUMBER = '212777543264'; // Use the requested number without the + 

export const generateWhatsAppLink = (message) => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
};

export const generateBookingMessage = (car, details) => {
  return `*New Booking Request!* 🏎️

*Client Details:*
Name: ${details.name}
Phone: ${details.phone}
Address: ${details.address}

*Car Details:*
Car: ${car.brand} ${car.model}
Year: ${car.year}
Type: ${car.category}
Price: ${car.pricePerDay.toLocaleString('en-US')} MAD / day

*Booking Duration:*
Pick-up: ${details.pickup}
Drop-off: ${details.dropoff}

Please confirm availability.`;
};
