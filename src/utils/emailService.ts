import { Repair } from '../types/repair';

export const sendRepairReadyEmail = async (repair: Repair) => {
  if (!repair.client.email) {
    console.warn('No email address provided for client');
    return;
  }

  // Aquí deberías integrar con tu servicio de email real (SendGrid, AWS SES, etc.)
  // Este es un ejemplo de la estructura del email
  const emailContent = {
    to: repair.client.email,
    subject: `Tu reparación #${repair.repairNumber} está lista - LumoraFix`,
    body: `
      Estimado/a ${repair.client.name} ${repair.client.surname},

      Nos complace informarte que tu dispositivo está listo para ser retirado:

      Detalles de la reparación:
      - Número de reparación: ${repair.repairNumber}
      - Dispositivo: ${repair.brand} ${repair.model}
      - Artículo: ${repair.article}
      
      Por favor, pasa por nuestro local para retirar tu dispositivo.

      Recuerda traer tu ticket de reparación #${repair.repairNumber}.

      Si tienes alguna pregunta, no dudes en contactarnos.

      Saludos cordiales,
      Equipo LumoraFix
    `.trim()
  };

  try {
    // Aquí iría la implementación real del envío de email
    console.log('Enviando email al cliente:', emailContent);
    
    // Ejemplo de integración con un servicio de email (comentado)
    /*
    await emailProvider.send({
      to: emailContent.to,
      subject: emailContent.subject,
      text: emailContent.body,
    });
    */
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}; 