export const MESSAGES = {
  greeting:
    '¡Hola! 👋 Bienvenido a *ObraKit*. Somos la plataforma para subcontratistas de construcción.\n\n¿En qué te puedo ayudar?\n\n1️⃣ Quiero saber más sobre ObraKit\n2️⃣ Necesito soporte técnico\n3️⃣ Quiero hablar con un asesor',

  askName:
    '¡Perfecto! Para conocerte mejor, ¿cuál es tu nombre?',

  askTrade:
    '¡Mucho gusto, {{name}}! ¿Qué tipo de trabajo haces?\n\n1️⃣ Plomería\n2️⃣ Eléctrico\n3️⃣ Concreto\n4️⃣ Pintura\n5️⃣ Drywall\n6️⃣ Roofing\n7️⃣ HVAC\n8️⃣ Otro',

  askLocation:
    '¿En qué estado de EE.UU. trabajas? (Ejemplo: Texas, California, Florida)',

  askSize:
    '¿Cuántos empleados tiene tu empresa?\n\n1️⃣ 1-5\n2️⃣ 6-15\n3️⃣ 16-50\n4️⃣ 50+',

  qualified:
    '¡Gracias, {{name}}! Ya tenemos tu información. Un asesor de ObraKit te contactará pronto para ayudarte.\n\nMientras tanto, puedes conocer más en obrakit.ai 🏗️',

  salesHandoff:
    'Ya tienes un asesor asignado. Te contactará pronto. Si necesitas algo urgente, escribe "soporte".',

  support:
    'Para soporte técnico, describe tu problema y un agente te contactará pronto. También puedes escribir a soporte@obrakit.ai',

  fallback:
    'No entendí tu mensaje. Escribe *hola* para ver nuestras opciones.',

  nonText:
    'Por ahora solo puedo leer mensajes de texto. ¿Podrías escribir tu respuesta?',

  notInterested:
    'Entendido. Estamos aquí si necesitas algo. ¡Escribe *hola* cuando quieras!',
} as const

export const TRADE_OPTIONS: Record<string, string> = {
  '1': 'plomeria',
  '2': 'electrico',
  '3': 'concreto',
  '4': 'pintura',
  '5': 'drywall',
  '6': 'roofing',
  '7': 'hvac',
  '8': 'otro',
}

export const SIZE_OPTIONS: Record<string, string> = {
  '1': '1-5',
  '2': '6-15',
  '3': '16-50',
  '4': '50+',
}
