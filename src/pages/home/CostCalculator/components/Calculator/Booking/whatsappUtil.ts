 export const formatWhatsAppNumber = (rawNumber: string) => {
    const digitsOnly = rawNumber.replace(/\D/g, "");
    if (digitsOnly.startsWith("234")) {
      return digitsOnly;
    }
    if (digitsOnly.startsWith("0")) {
      return `234${digitsOnly.slice(1)}`;
    }
    return `234${digitsOnly}`;
  };

export  const handleBackToWhatsapp = (userWhatsappNumber: string) => {
    if (!userWhatsappNumber) return;
    const formattedNumber = formatWhatsAppNumber(userWhatsappNumber);
    window.location.href = `https://wa.me/${formattedNumber}`;
  };